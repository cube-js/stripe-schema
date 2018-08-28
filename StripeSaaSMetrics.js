const customerMovementSubquery = require('./SaaSMetricsSQL').customerMovementSubquery;

cube(`StripeSaaSMetrics`, {
  title: `SaaS Metrics`,
  sql: customerMovementSubquery,

  joins: {
    StripeCustomers: {
      relationship: `belongsTo`,
      sql: `${StripeSaaSMetrics}.stripe_customer_id = ${StripeCustomers}.id`
    }
  },

  measures: {
    mrr: {
      title: `MRR`,
      description: `Monthly Recurring Revenue (MRR) is the monthly-normalized amounts of all active subscriptions.`,
      sql: `mrr`,
      type: `sum`,
      rollingWindow: {
        trailing: `unbounded`,
        offset: `end`
      },
      format: `currency`
    },

    arr: {
      title: `ARR`,
      description: `Annual Run Rate (ARR) is the current value of your business projected out over the next year.`,
      sql: `${mrr} * 12`,
      type: `number`,
      format: `currency`
    },

    churnedMrr: {
      title: `Churned MRR`,
      sql: `mrr`,
      type: `sum`,
      filters: [{
        sql: `mrr_type = 'cancelled'`,
      }]
    },

    newMrr: {
      title: `New MRR`,
      sql: `mrr`,
      type: `sum`,
      filters: [{
        sql: `mrr_type = 'new'`,
      }]
    },

    expansionMrr: {
      title: `Expansion MRR`,
      sql: `mrr`,
      type: `sum`,
      filters: [{
        sql: `mrr_type = 'expansion'`,
      }]
    },

    contractionMrr: {
      title: `Contraction MRR`,
      sql: `mrr`,
      type: `sum`,
      filters: [{
        sql: `mrr_type = 'contraction'`,
      }]
    },

    mrrChange: {
      title: `MRR Change`,
      description: `The MRR change for a given period. Commonly used with MRR Change Type dimension.`,
      sql: `mrr`,
      type: `sum`,
      format: `currency`,
      drillMembers: [StripeCustomers.description, StripeCustomers.email, StripeCustomers.mrr, plan]
    },

    newSubscriptions: {
      shown: false,
      sql: `mrr`,
      type: `count`,
      filters: [{
        sql: `mrr_type = 'new'`,
      }]
    },

    averageSellingPrice: {
      sql: `${newMrr} / NULLIF(${newSubscriptions}, 0)`,
      type: `number`
    },

    churnedMovement30Days: {
      shown: false,
      sql: `mrr`,
      filters: [{
        sql: `mrr_type in ('cancelled', 'contraction')`,
      }],
      type: `sum`,
      rollingWindow: {
        trailing: `1 month`,
        offset: `end`
      },
    },

    mrr30daysAgo: {
      shown: false,
      sql: `mrr`,
      type: `sum`,
      rollingWindow: {
        trailing: `unbounded`,
        leading: `-1 month`,
        offset: `end`
      }
    },

    mrrChurnRate: {
      title: `MRR Churn Rate`,
      description: `The churned revenue for a given period is a sum of lost MRR from churned customers. `,
      sql: `-100 * (${churnedMovement30Days}) / NULLIF(${mrr30daysAgo}, 0)`,
      type: `number`,
      format: `percent`,
    },

    activeCustomers: {
      sql: `CASE
                WHEN ${TABLE}.subscription_status = 1 AND ${TABLE}.moment_active_subscriptions = 1 THEN 1
                WHEN ${TABLE}.subscription_status = -1 AND ${TABLE}.moment_active_subscriptions = 0 THEN -1
                ELSE 0
              END`,
      type: `sum`,
      rollingWindow: {
        trailing: `unbounded`,
        offset: `end`
      },
      drillMembers: [StripeCustomers.description, StripeCustomers.email, StripeCustomers.mrr, plan]
    },

    arpa: {
      title: `ARPA`,
      description: `Average Revenue Per Account (ARPA) is total MRR divided by the number of active customers.`,
      sql: `${mrr} / NULLIF(${activeCustomers}, 0)`,
      type: `number`,
      format: `currency`,
    },

    ltv: {
      title: `LTV`,
      description:
        `Customer Lifetime Value (LTV) represents the average revenue that a customer generates before they churn.
         It is equal to ARPA divided by the churn rate.`,
      sql: `${arpa} / NULLIF(${mrrChurnRate} / 100.0, 0)`,
      type: `number`,
      format: `currency`
    }
  },

  dimensions: {
    plan: {
      description: `Subscription plan name`,
      sql: `plan_name`,
      type: `string`
    },

    MRRChangeType: {
      title: `MRR Change Type`,
      description: `The four major ways to change MRR are through new subscriptions, expansions, contractions, and churn.`,
      sql: `initcap(mrr_type)`,
      type: `string`
    },

    time: {
      sql: `dd`,
      type: `time`
    },

    id: {
      sql: `${CUBE}.dd || '-' || ${CUBE}.mrr_type || '-' || ${CUBE}.stripe_customer_id`,
      type: `string`,
      primaryKey: true
    }
  }
});
