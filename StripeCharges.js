cube(`StripeCharges`, {
  title: `Charges`,
  sql: `select * from ${SCHEMA}.charges`,

  joins: {
    StripeCustomers: {
      relationship: `belongsTo`,
      sql: `${StripeCharges}.customer_id = ${StripeCustomers}.id`
    }
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [id, amount, paid, refunded, created, StripeCustomers.email]
    },

    refundedCount: {
      type: `count`,
      filters: [
        { sql: `${CUBE}.refunded = 'true'` }
      ],
      drillMembers: [id, amount, paid, refunded, created, StripeCustomers.email]
    },

    averageChargeAmount: {
      sql: `${amount}`,
      type: `avg`,
      format: `currency`
    },

    totalGrossAmount: {
      sql: `${amount}`,
      type: `sum`,
      format: `currency`,
      drillMembers: [id, amount, paid, refunded, created, StripeCustomers.email]
    },

    totalFailedAmount: {
      sql: `${amount}`,
      type: `sum`,
      format: `currency`,
      filters: [{
        sql: `${CUBE}.status = 'failed'`,
      }],
      drillMembers: [id, amount, paid, failureCode, created, StripeCustomers.email]
    },

    totalRefundedAmount: {
      sql: `${amountRefunded}`,
      type: `sum`,
      format: `currency`,
      drillMembers: [id, amount, amountRefunded, paid, created, StripeCustomers.email]
    },

    totalNetRevenue: {
      description: `Gross amount - failed charges amount - refunded amount`,
      sql: `${totalGrossAmount} - ${totalFailedAmount} - ${totalRefundedAmount}`,
      type: `number`,
      format: `currency`
    },

    // TODO
    // cumulativeNetRevenue: {
    //   sql: `${totalNetRevenue}`,
    //   type: `runningTotal`,
    //   format: `currency`
    // }
  },

  dimensions: {
    id: {
      title: `ID`,
      sql: `id`,
      type: `string`,
      primaryKey: true,
      shown: true
    },

    amount: {
      sql: `1.0 * ${CUBE}.amount / 100`,
      type: `number`,
      format: `currency`
    },

    amountRefunded: {
      sql: `1.0 * ${CUBE}.amount_refunded / 100`,
      type: `number`,
      format: `currency`
    },

    captured: {
      sql: `captured`,
      type: `boolean`
    },

    created: {
      sql: `created`,
      type: `time`
    },

    currency: {
      sql: `currency`,
      type: `string`
    },

    // TODO: yesNo
    paid: {
      sql: `paid`,
      type: `boolean`
    },

    // TODO: yesNo
    refunded: {
      sql: `refunded`,
      type: `boolean`
    },

    failureCode: {
      sql: `failure_code`,
      type: `string`
    },

    status: {
      sql: `status`,
      type: `string`
    }
  }
});
