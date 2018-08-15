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
      sql: `mrr`,
      type: `sum`,
      rollingWindow: {
        trailing: `unbounded`,
        offset: `end`
      },
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

    mrrMovement: {
      title: `MRR Movement`,
      sql: `mrr`,
      type: `sum`,
      format: `currency`
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
      }
    },

    arpa: {
      title: `ARPA`,
      sql: `${mrr} / NULLIF(${activeCustomers}, 0)`,
      type: `number`,
      format: `currency`,
    },

    ltv: {
      title: `LTV`,
      sql: `${arpa} / NULLIF(${mrrChurnRate} / 100.0, 0)`,
      type: `number`,
      format: `currency`
    }
  },

  dimensions: {
    plan: {
      sql: `plan_name`,
      type: `string`
    },

    // customer: {
    //   sql: `customer_description`,
    //   type: `string`
    // },

    movementType: {
      sql: `mrr_type`,
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
