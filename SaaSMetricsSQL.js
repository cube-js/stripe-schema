const paidInvoicesSubquery = `SELECT
            *,
            (
              CASE
              WHEN plan_interval = 'month' THEN
                (invoice_amount - discount_amount)
              WHEN plan_interval = 'year' THEN
                (invoice_amount - discount_amount) / 12
              END
            ) / 100.0 AS mrr
          FROM
            (
              SELECT
                invoices.id as invoice_id,
                invoices.date as created,
                invoices.currency,
                subscriptions.ended_at,
                LAST_VALUE(invoices.id) OVER(
                  PARTITION BY invoices.subscription
                  ORDER BY
                    invoices.date ROWS BETWEEN UNBOUNDED PRECEDING
                  AND UNBOUNDED FOLLOWING
                ) AS moment_last_invoice_id,
                invoices.customer as customer_id,
                invoices.subscription as subscription_id,
                invoices_items.plan->>'id' as plan_id,
                invoices_items.plan->>'interval' as plan_interval,
                invoices_items.plan->>'name' as plan_name,
                (invoices.subtotal - (invoices.total - coalesce(invoices.tax, 0))) as discount_amount,
                invoices_items.amount as invoice_amount
              FROM
                ${SCHEMA}.invoices
                CROSS JOIN jsonb_to_recordset(invoices.lines) as invoices_items(plan_id varchar, plan jsonb, amount bigint, type varchar)
                LEFT JOIN ${SCHEMA}.charges ON (charges.id = invoices.charge)
                INNER JOIN ${SCHEMA}.subscriptions ON (subscriptions.id = invoices.subscription)
              WHERE
                invoices.paid = TRUE AND
                (charges.refunded = FALSE OR charges.refunded IS NULL) AND
                invoices_items.type = 'subscription'
              ORDER BY
                invoices.subscription
            ) as paid_invoices_subquery
            WHERE (invoice_amount - discount_amount) > 0`;

const normalizedPaidInvoicesSubquery = `SELECT
            *,
            mrr - LAG(mrr) OVER(
              PARTITION BY
                subscription_id
              ORDER BY
                created
            ) AS expansion_mrr,

            (CASE WHEN LAG(mrr) OVER(
              PARTITION BY
                subscription_id
              ORDER BY
                created
            ) IS NULL THEN 1 ELSE NULL END) as is_first_charge,
            (CASE WHEN moment_last_invoice_id = invoice_id AND ended_at IS NOT NULL THEN 1 ELSE NULL END) as is_last_charge
          FROM (${paidInvoicesSubquery}) as paid_invoices`;

const subscriptionStatus = `CASE WHEN is_first_charge = 1 THEN 1 WHEN is_last_charge = 1 THEN -1 ELSE 0 END`;

const allInvoicesSubquery = `SELECT
            cc.*,
            customers.description as customer_description,
            customers.id as stripe_customer_id
          FROM
            (${normalizedPaidInvoicesSubquery}) AS cc,
            ${SCHEMA}.subscriptions,
            ${SCHEMA}.customers
          WHERE
            subscriptions.id = cc.subscription_id AND
            customers.id = subscriptions.customer AND
            (
              subscriptions.ended_at > INTERVAL '28 day' +
              COALESCE(subscriptions.trial_end, subscriptions.start)
            OR
              subscriptions.ended_at IS NULL
            )`;

const mrrMovementSubquery = `WITH all_invoices AS (${allInvoicesSubquery})

          SELECT
            created AS dd,
            mrr,
            currency,
            plan_name,
            customer_description,
            stripe_customer_id,
            'new' AS mrr_type,
            1 subscription_status
          FROM
            all_invoices
          WHERE
            is_first_charge = 1

          UNION ALL
          SELECT
            ended_at AS dd,
            mrr * (-1) AS mrr,
            currency,
            plan_name,
            customer_description,
            stripe_customer_id,
            'cancelled' AS mrr_type,
            -1 subscription_status
          FROM
            all_invoices
          WHERE
            is_last_charge = 1

          UNION ALL
          SELECT
            created AS dd,
            expansion_mrr AS mrr,
            currency,
            plan_name,
            customer_description,
            stripe_customer_id,
            (CASE WHEN expansion_mrr > 0 THEN 'expansion'
                  WHEN expansion_mrr < 0 THEN 'contraction'
            END) AS mrr_type,
            0 subscription_status
          FROM
            all_invoices
          WHERE
            expansion_mrr IS NOT NULL AND
            expansion_mrr <> 0`;

const customerMovementSubquery = `SELECT 
  *, 
  SUM(subscription_status) OVER (PARTITION BY customer_description ORDER BY dd) as moment_active_subscriptions FROM 
(
  ${mrrMovementSubquery}
) mrr_movement`

addExport({customerMovementSubquery: customerMovementSubquery});
