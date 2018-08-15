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
                stripe.invoices.id as invoice_id,
                stripe.invoices.date as created,
                stripe.invoices.currency,
                stripe.subscriptions.ended_at,
                LAST_VALUE(stripe.invoices.id) OVER(
                  PARTITION BY stripe.invoices.subscription_id
                  ORDER BY
                    stripe.invoices.date ROWS BETWEEN UNBOUNDED PRECEDING
                  AND UNBOUNDED FOLLOWING
                ) AS moment_last_invoice_id,
                stripe.invoices.customer_id,
                stripe.invoices.subscription_id,
                stripe.invoices_items.plan_id,
                stripe.invoices_items.plan->>'interval' as plan_interval,
                stripe.invoices_items.plan->>'name' as plan_name,
                (stripe.invoices.subtotal - (stripe.invoices.total - coalesce(stripe.invoices.tax, 0))) as discount_amount,
                stripe.invoices_items.amount as invoice_amount
              FROM
                stripe.invoices_items
                INNER JOIN stripe.invoices ON (stripe.invoices.id = stripe.invoices_items.invoice_id)
                LEFT JOIN stripe.charges ON (stripe.charges.id = stripe.invoices.charge_id)
                INNER JOIN stripe.subscriptions ON (stripe.subscriptions.id = stripe.invoices.subscription_id)
              WHERE
                stripe.invoices.paid = TRUE AND
                (stripe.charges.refunded = FALSE OR stripe.charges.refunded IS NULL) AND
                stripe.invoices_items.type = 'subscription'
              ORDER BY
                stripe.invoices.subscription_id
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
            stripe.customers.description as customer_description,
            stripe.customers.id as stripe_customer_id
          FROM
            (${normalizedPaidInvoicesSubquery}) AS cc,
            stripe.subscriptions,
            stripe.customers
          WHERE
            stripe.subscriptions.id = cc.subscription_id AND
            stripe.customers.id = stripe.subscriptions.customer_id AND
            (
              stripe.subscriptions.ended_at > INTERVAL '28 day' +
              COALESCE(stripe.subscriptions.trial_end, stripe.subscriptions.start)
            OR
              stripe.subscriptions.ended_at IS NULL
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
