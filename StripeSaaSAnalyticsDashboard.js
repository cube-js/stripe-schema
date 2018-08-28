dashboardTemplate(`StripeSaaSAnalytics`, {
  title: `Stripe Saas Analytics`,
  items: [
    {
      title: 'MRR',
      description: 'Monthly Recurring Revenue (MRR) is the monthly-normalized amounts of all active subscriptions. ',
      measures: [
        'StripeSaaSMetrics.mrr'
      ],
      pivot: {
        x: [
          'StripeSaaSMetrics.mrr'
        ],
        y: []
      },
      visualization: {
        type: 'singleValue',
        showLegend: true,
        showTrendline: false,
        axisRotated: false,
        y2Axis: false
      },
      layout: {
        x: 0,
        y: 0,
        w: 6,
        h: 4
      }
    },
    {
      title: 'ARR',
      description: 'Annual Run Rate (ARR) is the current value of your business projected out over the next year.',
      measures: [
        'StripeSaaSMetrics.arr'
      ],
      pivot: {
        x: [
          'StripeSaaSMetrics.arr'
        ],
        y: []
      },
      visualization: {
        type: 'singleValue',
        showLegend: true,
        showTrendline: false,
        axisRotated: false,
        y2Axis: false
      },
      layout: {
        x: 6,
        y: 0,
        w: 6,
        h: 4
      }
    },
    {
      title: 'LTV to the Date',
      description: 'Customer Lifetime Value (LTV) represents the average revenue that a customer generates before they churn.  It is equal to ARPA divided by churn rate.',
      measures: [
        'StripeSaaSMetrics.ltv'
      ],
      timeDimension: {
        dimension: 'StripeSaaSMetrics.time',
        dateRange: 'Today',
        granularity: null
      },
      pivot: {
        x: [
          'StripeSaaSMetrics.ltv'
        ],
        y: []
      },
      visualization: {
        type: 'singleValue',
        showLegend: true,
        showTrendline: false,
        axisRotated: false,
        y2Axis: false
      },
      layout: {
        x: 18,
        y: 0,
        w: 6,
        h: 4
      }
    },
    {
      title: 'ARPA to the Date',
      description: 'Average Revenue Per Account (ARPA) is total MRR divided by the number of active customers.',
      measures: [
        'StripeSaaSMetrics.arpa'
      ],
      timeDimension: {
        dimension: 'StripeSaaSMetrics.time',
        dateRange: 'Today',
        granularity: null
      },
      pivot: {
        x: [
          'StripeSaaSMetrics.arpa'
        ],
        y: []
      },
      visualization: {
        type: 'singleValue',
        showLegend: true,
        showTrendline: false,
        axisRotated: false,
        y2Axis: false
      },
      layout: {
        x: 12,
        y: 0,
        w: 6,
        h: 4
      }
    },
    {
      title: 'MRR over Time',
      measures: [
        'StripeSaaSMetrics.mrr'
      ],
      timeDimension: {
        dimension: 'StripeSaaSMetrics.time',
        dateRange: 'Last 6 months',
        granularity: 'week'
      },
      pivot: {
        x: [
          'StripeSaaSMetrics.time'
        ],
        y: [
          'StripeSaaSMetrics.mrr'
        ]
      },
      visualization: {
        type: 'area',
        showLegend: true,
        showTrendline: false,
        axisRotated: false,
        y2Axis: false
      },
      layout: {
        x: 0,
        y: 4,
        w: 13,
        h: 7
      }
    },
    {
      title: 'MRR Growth over Time',
      measures: [
        'StripeSaaSMetrics.mrrChange'
      ],
      dimensions: [
        'StripeSaaSMetrics.MRRChangeType'
      ],
      timeDimension: {
        dimension: 'StripeSaaSMetrics.time',
        dateRange: 'Last 6 months',
        granularity: 'month'
      },
      order: [
        {
          member: 'StripeSaaSMetrics.time',
          direction: 'asc'
        },
        {
          member: 'StripeSaaSMetrics.mrrChange',
          direction: 'desc'
        }
      ],
      pivot: {
        x: [
          'StripeSaaSMetrics.time'
        ],
        y: [
          'StripeSaaSMetrics.MRRChangeType',
          'StripeSaaSMetrics.mrrChange'
        ]
      },
      visualization: {
        type: 'bar',
        showLegend: true,
        showTrendline: false,
        axisRotated: false,
        y2Axis: false
      },
      layout: {
        x: 13,
        y: 4,
        w: 11,
        h: 7
      }
    },
    {
      title: 'MRR by Plans Breakout',
      measures: [
        'StripeSaaSMetrics.mrr'
      ],
      dimensions: [
        'StripeSaaSMetrics.plan'
      ],
      pivot: {
        x: [],
        y: [
          'StripeSaaSMetrics.plan',
          'StripeSaaSMetrics.mrr'
        ]
      },
      visualization: {
        type: 'pie',
        showLegend: true,
        showTrendline: false,
        axisRotated: false,
        y2Axis: false
      },
      layout: {
        x: 13,
        y: 24,
        w: 11,
        h: 9
      }
    },
    {
      title: 'MRR Churn Rate over Time',
      measures: [
        'StripeSaaSMetrics.mrrChurnRate'
      ],
      timeDimension: {
        dimension: 'StripeSaaSMetrics.time',
        dateRange: 'Last 6 months',
        granularity: 'week'
      },
      pivot: {
        x: [
          'StripeSaaSMetrics.time'
        ],
        y: [
          'StripeSaaSMetrics.mrrChurnRate'
        ]
      },
      visualization: {
        type: 'line',
        showLegend: true,
        showTrendline: false,
        axisRotated: false,
        y2Axis: false
      },
      layout: {
        x: 0,
        y: 11,
        w: 8,
        h: 7
      }
    },
    {
      title: 'Active Customers over Time',
      measures: [
        'StripeSaaSMetrics.activeCustomers'
      ],
      timeDimension: {
        dimension: 'StripeSaaSMetrics.time',
        dateRange: 'Last 6 months',
        granularity: 'week'
      },
      pivot: {
        x: [
          'StripeSaaSMetrics.time'
        ],
        y: [
          'StripeSaaSMetrics.activeCustomers'
        ]
      },
      visualization: {
        type: 'bar',
        showLegend: true,
        showTrendline: true,
        axisRotated: false,
        y2Axis: false,
        trendlineType: 'rolling',
        trendlinePeriod: 7
      },
      layout: {
        x: 0,
        y: 18,
        w: 24,
        h: 6
      }
    },
    {
      title: 'Average Revenue Per Account (ARPA) over Time',
      measures: [
        'StripeSaaSMetrics.arpa'
      ],
      timeDimension: {
        dimension: 'StripeSaaSMetrics.time',
        dateRange: 'Last 6 month',
        granularity: 'week'
      },
      pivot: {
        x: [
          'StripeSaaSMetrics.time'
        ],
        y: [
          'StripeSaaSMetrics.arpa'
        ]
      },
      visualization: {
        type: 'line',
        showLegend: true,
        showTrendline: false,
        axisRotated: false,
        y2Axis: false
      },
      layout: {
        x: 8,
        y: 11,
        w: 8,
        h: 7
      }
    },
    {
      title: 'Customer Lifetime Value (LTV) over Time',
      measures: [
        'StripeSaaSMetrics.ltv'
      ],
      timeDimension: {
        dimension: 'StripeSaaSMetrics.time',
        dateRange: 'Last 6 months',
        granularity: 'week'
      },
      pivot: {
        x: [
          'StripeSaaSMetrics.time'
        ],
        y: [
          'StripeSaaSMetrics.ltv'
        ]
      },
      visualization: {
        type: 'line',
        showLegend: true,
        showTrendline: false,
        axisRotated: false,
        y2Axis: false
      },
      layout: {
        x: 16,
        y: 11,
        w: 8,
        h: 7
      }
    },
    {
      title: 'Plans',
      measures: [
        'StripeSaaSMetrics.activeCustomers',
        'StripeSaaSMetrics.mrr'
      ],
      dimensions: [
        'StripeSaaSMetrics.plan'
      ],
      order: [
        {
          member: 'StripeSaaSMetrics.mrr',
          direction: 'desc'
        },
        {
          member: 'StripeSaaSMetrics.activeCustomers',
          direction: 'desc'
        }
      ],
      pivot: {
        x: [
          'StripeSaaSMetrics.plan'
        ],
        y: [
          'StripeSaaSMetrics.activeCustomers',
          'StripeSaaSMetrics.mrr'
        ]
      },
      visualization: {
        type: 'table',
        showLegend: true,
        showTrendline: false,
        axisRotated: false,
        y2Axis: false
      },
      layout: {
        x: 0,
        y: 24,
        w: 13,
        h: 9
      }
    }
  ]
});
