dashboardTemplate(`StripeSummaryDashboard`, {
  title: `Stripe Summary`,
  items: [
  {
    title: 'Total Gross Charges',
    measures: [
      'StripeCharges.totalGrossAmount'
    ],
    pivot: {
      x: [
        'StripeCharges.totalGrossAmount'
      ],
      y: []
    },
    visualization: {
      type: 'singleValue',
      autoScale: false,
      showTotal: false,
      showLegend: true,
      showTrendline: false,
      axisRotated: false,
      y2Axis: false,
      showYLabel: false,
      showY2Label: false,
      showComparison: false,
      showRowNumbers: true,
      showBarChartSteps: false,
      seriesPositioning: 'stacked'
    },
    layout: {
      x: 0,
      y: 0,
      w: 6,
      h: 4
    }
  },
  {
    title: 'Total Failed Charges',
    measures: [
      'StripeCharges.totalFailedAmount'
    ],
    pivot: {
      x: [
        'StripeCharges.totalFailedAmount'
      ],
      y: []
    },
    visualization: {
      type: 'singleValue',
      autoScale: false,
      showTotal: false,
      showLegend: true,
      showTrendline: false,
      axisRotated: false,
      y2Axis: false,
      showYLabel: false,
      showY2Label: false,
      showComparison: false,
      showRowNumbers: true,
      showBarChartSteps: false,
      seriesPositioning: 'stacked'
    },
    layout: {
      x: 6,
      y: 0,
      w: 6,
      h: 4
    }
  },
  {
    title: 'Total Refunded Charges',
    measures: [
      'StripeCharges.totalRefundedAmount'
    ],
    pivot: {
      x: [
        'StripeCharges.totalRefundedAmount'
      ],
      y: []
    },
    visualization: {
      type: 'singleValue',
      autoScale: false,
      showTotal: false,
      showLegend: true,
      showTrendline: false,
      axisRotated: false,
      y2Axis: false,
      showYLabel: false,
      showY2Label: false,
      showComparison: false,
      showRowNumbers: true,
      showBarChartSteps: false,
      seriesPositioning: 'stacked'
    },
    layout: {
      x: 12,
      y: 0,
      w: 6,
      h: 4
    }
  },
  {
    title: 'Total Net Charges',
    measures: [
      'StripeCharges.totalNetRevenue'
    ],
    pivot: {
      x: [
        'StripeCharges.totalNetRevenue'
      ],
      y: []
    },
    visualization: {
      type: 'singleValue',
      autoScale: false,
      showTotal: false,
      showLegend: true,
      showTrendline: false,
      axisRotated: false,
      y2Axis: false,
      showYLabel: false,
      showY2Label: false,
      showComparison: false,
      showRowNumbers: true,
      showBarChartSteps: false,
      seriesPositioning: 'stacked'
    },
    layout: {
      x: 18,
      y: 0,
      w: 6,
      h: 4
    }
  },
  {
    title: 'Total Charges',
    measures: [
      'StripeCharges.count'
    ],
    pivot: {
      x: [
        'StripeCharges.count'
      ],
      y: []
    },
    visualization: {
      type: 'singleValue',
      autoScale: false,
      showTotal: false,
      showLegend: true,
      showTrendline: false,
      axisRotated: false,
      y2Axis: false,
      showYLabel: false,
      showY2Label: false,
      showComparison: false,
      showRowNumbers: true,
      showBarChartSteps: false,
      seriesPositioning: 'stacked'
    },
    layout: {
      x: 0,
      y: 4,
      w: 6,
      h: 4
    }
  },
  {
    title: 'Total Failed Charges Count',
    measures: [
      'StripeCharges.count'
    ],
    filters: [
      {
        member: 'StripeCharges.status',
        operator: 'equals',
        params: [
          'failed'
        ]
      }
    ],
    pivot: {
      x: [
        'StripeCharges.count'
      ],
      y: []
    },
    visualization: {
      type: 'singleValue',
      autoScale: false,
      showTotal: false,
      showLegend: true,
      showTrendline: false,
      axisRotated: false,
      y2Axis: false,
      showYLabel: false,
      showY2Label: false,
      showComparison: false,
      showRowNumbers: true,
      showBarChartSteps: false,
      seriesPositioning: 'stacked'
    },
    layout: {
      x: 6,
      y: 4,
      w: 6,
      h: 4
    }
  },
  {
    title: 'Total Unpaid Invoices Count',
    measures: [
      'StripeInvoices.count'
    ],
    filters: [
      {
        member: 'StripeInvoices.paid',
        operator: 'equals',
        params: [
          'No'
        ]
      }
    ],
    pivot: {
      x: [
        'StripeInvoices.count'
      ],
      y: []
    },
    visualization: {
      type: 'singleValue',
      autoScale: false,
      showTotal: false,
      showLegend: true,
      showTrendline: false,
      axisRotated: false,
      y2Axis: false,
      showYLabel: false,
      showY2Label: false,
      showComparison: false,
      showRowNumbers: true,
      showBarChartSteps: false,
      seriesPositioning: 'stacked'
    },
    layout: {
      x: 12,
      y: 4,
      w: 6,
      h: 4
    }
  },
  {
    title: 'Total Unpaid Invoices Amount',
    measures: [
      'StripeInvoices.totalAmountDue'
    ],
    filters: [
      {
        member: 'StripeInvoices.paid',
        operator: 'equals',
        params: [
          'No'
        ]
      }
    ],
    pivot: {
      x: [
        'StripeInvoices.totalAmountDue'
      ],
      y: []
    },
    visualization: {
      type: 'singleValue',
      autoScale: false,
      showTotal: false,
      showLegend: true,
      showTrendline: false,
      axisRotated: false,
      y2Axis: false,
      showYLabel: false,
      showY2Label: false,
      showComparison: false,
      showRowNumbers: true,
      showBarChartSteps: false,
      seriesPositioning: 'stacked'
    },
    layout: {
      x: 18,
      y: 4,
      w: 6,
      h: 4
    }
  },
  {
    title: 'Charges by Status',
    measures: [
      'StripeCharges.count'
    ],
    dimensions: [
      'StripeCharges.status'
    ],
    pivot: {
      x: [],
      y: [
        'StripeCharges.status',
        'StripeCharges.count'
      ]
    },
    visualization: {
      type: 'pie',
      autoScale: false,
      showTotal: false,
      showLegend: true,
      showTrendline: false,
      axisRotated: false,
      y2Axis: false,
      showYLabel: false,
      showY2Label: false,
      showComparison: false,
      showRowNumbers: true,
      showBarChartSteps: false,
      seriesPositioning: 'stacked'
    },
    layout: {
      x: 0,
      y: 8,
      w: 10,
      h: 8
    }
  },
  {
    title: 'Net Revenue Over Time',
    description: 'Last 6 Month',
    measures: [
      'StripeCharges.totalNetRevenue'
    ],
    timeDimension: {
      dimension: 'StripeCharges.created',
      dateRange: 'Last 6 month',
      granularity: 'month'
    },
    pivot: {
      x: [
        'StripeCharges.created'
      ],
      y: [
        'StripeCharges.totalNetRevenue'
      ]
    },
    visualization: {
      type: 'bar',
      autoScale: false,
      showTotal: false,
      showLegend: true,
      showTrendline: true,
      axisRotated: false,
      y2Axis: false,
      showYLabel: false,
      showY2Label: false,
      showComparison: false,
      showRowNumbers: true,
      showBarChartSteps: false,
      trendlineType: 'rolling',
      trendlinePeriod: 7,
      seriesPositioning: 'stacked'
    },
    layout: {
      x: 0,
      y: 16,
      w: 24,
      h: 8
    }
  },
  {
    title: 'Charges Over Time',
    measures: [
      'StripeCharges.totalNetRevenue',
      'StripeCharges.count'
    ],
    timeDimension: {
      dimension: 'StripeCharges.created',
      dateRange: 'Last 360 days',
      granularity: 'month'
    },
    pivot: {
      x: [
        'StripeCharges.created'
      ],
      y: [
        'StripeCharges.totalNetRevenue',
        'StripeCharges.count'
      ]
    },
    visualization: {
      type: 'bar',
      autoScale: false,
      showTotal: false,
      showLegend: true,
      showTrendline: false,
      axisRotated: false,
      y2Axis: true,
      showYLabel: true,
      showY2Label: true,
      showComparison: false,
      showRowNumbers: true,
      showBarChartSteps: false,
      seriesPositioning: 'stacked'
    },
    layout: {
      x: 10,
      y: 8,
      w: 14,
      h: 8
    }
  }
]
});
