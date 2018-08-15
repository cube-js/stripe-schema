cube(`StripeCustomers`, {
  title: `Customers`,
  sql: `select * from ${SCHEMA}.customers`,

  measures: {
    count: {
      type: `count`
    }
  },

  dimensions: {
    id: {
      title: `ID`,
      sql: `id`,
      type: `string`,
      primaryKey: true,
      shown: true
    },

    created: {
      sql: `created`,
      type: `time`
    },

    currency: {
      sql: `currency`,
      type: `string`
    },

    email: {
      sql: `email`,
      type: `string`
    },

    description: {
      sql: `description`,
      type: `string`
    }
  }
});
