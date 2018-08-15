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
                ${SCHEMA}.invoices.id as invoice_id,
                ${SCHEMA}.invoices.date as created,
                ${SCHEMA}.invoices.currency,
                ${SCHEMA}.subscriptions.ended_at,
                LAST_VALUE(${SCHEMA}.invoices.id) OVER(
                  PARTITION BY ${SCHEMA}.invoices.subscription_id
                  ORDER BY
                    ${SCHEMA}.invoices.date ROWS BETWEEN UNBOUNDED PRECEDING
                  AND UNBOUNDED FOLLOWING
                ) AS moment_last_invoice_id,
                ${SCHEMA}.invoices.customer_id,
                ${SCHEMA}.invoices.subscription_id,
                ${SCHEMA}.invoices_items.plan_id,
                ${SCHEMA}.invoices_items.plan->>'interval' as plan_interval,
                ${SCHEMA}.invoices_items.plan->>'name' as plan_name,
                (${SCHEMA}.invoices.subtotal - (${SCHEMA}.invoices.total - coalesce(${SCHEMA}.invoices.tax, 0))) as discount_amount,
                ${SCHEMA}.invoices_items.amount as invoice_amount
              FROM
                ${SCHEMA}.invoices_items
                INNER JOIN ${SCHEMA}.invoices ON (${SCHEMA}.invoices.id = ${SCHEMA}.invoices_items.invoice_id)
                LEFT JOIN ${SCHEMA}.charges ON (${SCHEMA}.charges.id = ${SCHEMA}.invoices.charge_id)
                INNER JOIN ${SCHEMA}.subscriptions ON (${SCHEMA}.subscriptions.id = ${SCHEMA}.invoices.subscription_id)
              WHERE
                ${SCHEMA}.invoices.paid = TRUE AND
                (${SCHEMA}.charges.refunded = FALSE OR ${SCHEMA}.charges.refunded IS NULL) AND
                ${SCHEMA}.invoices_items.type = 'subscription'
              ORDER BY
                ${SCHEMA}.invoices.subscription_id
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
            ${SCHEMA}.customers.description as customer_description,
            ${SCHEMA}.customers.id as stripe_customer_id
          FROM
            (${normalizedPaidInvoicesSubquery}) AS cc,
            ${SCHEMA}.subscriptions,
            ${SCHEMA}.customers
          WHERE
            ${SCHEMA}.subscriptions.id = cc.subscription_id AND
            ${SCHEMA}.customers.id = ${SCHEMA}.subscriptions.customer_id AND
            (
              ${SCHEMA}.subscriptions.ended_at > INTERVAL '28 day' +
              COALESCE(${SCHEMA}.subscriptions.trial_end, ${SCHEMA}.subscriptions.start)
            OR
              ${SCHEMA}.subscriptions.ended_at IS NULL
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
