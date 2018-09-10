const yesNoCase = ({ sql }) => {
  return {
    type: `string`,
    case: {
      when: [ { sql: sql , label: `Yes` } ],
      else: { label: `No` }
    }
  }
}

cube(`StripeInvoices`, {
  sql: `select * from ${SCHEMA}.invoices`,
  title: `Invoices`,

  joins: {
    StripeCustomers: {
      relationship: `belongsTo`,
      sql: `${CUBE}.customer = ${StripeCustomers}.id`
    }
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [id, amountDue, date, StripeCustomers.id, StripeCustomers.email]
    },

    totalAmountDue: {
      type: `sum`,
      sql: `${amountDue}`,
      format: `currency`
    }
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true,
      shown: true
    },

    date: {
      sql: `date`,
      type: `time`
    },

    amountDue: {
      sql: `amount_due`,
      type: `number`,
      format: `currency`
    },

    paid: yesNoCase({ sql: `paid` })
  }
});
