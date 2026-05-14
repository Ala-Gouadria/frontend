export const analyticsReportingCardData = {
  title: 'Analytics & Reporting',
  subtitle: 'Performance tracking and insights',
  status: 'Active',
  api: {
    overview: '/api/metrics/overview',
    revenueTimeseries: '/api/metrics/revenue-timeseries?period=this_week',
    alerts: '/api/alerts/active',
    insights: '/api/insights/generated',
  },
  metrics: [
    {
      label: 'Total Revenue',
      value: '$68k',
      detail: '',
      type: 'bars',
      bars: [22, 66, 34, 80, 26, 54, 72, 38, 58, 46, 24, 28, 64, 18],
    },
    {
      label: 'CRT',
      value: '3.2%',
      detail: '',
      type: 'bars',
      bars: [42, 58, 22, 78, 30, 64, 48, 36, 70, 24, 54, 82, 32, 66],
    },
    {
      label: 'Growth',
      value: '+28%',
      detail: '',
      type: 'line',
      points: '0,34 16,42 30,40 42,22 58,28 72,26 86,31 100,30 112,33 124,30 138,32 152,32 166,18 180,12 194,36',
      fillPoints: '0,58 0,34 16,42 30,40 42,22 58,28 72,26 86,31 100,30 112,33 124,30 138,32 152,32 166,18 180,12 194,36 194,58',
    },
  ],
  chartTitle: 'Revenue This Week',
  revenueChart: {
    activeIndex: 2,
    upperSeries: [
      { x: 0, y: 76, tooltip: '+19%' },
      { x: 70, y: 56, tooltip: '+31%' },
      { x: 140, y: 24, tooltip: '+48%' },
      { x: 210, y: 63, tooltip: '+22%' },
      { x: 280, y: 43, tooltip: '+36%' },
      { x: 350, y: 67, tooltip: '+17%' },
      { x: 420, y: 24, tooltip: '+52%' },
    ],
    lowerSeries: [
      { x: 0, y: 112 },
      { x: 70, y: 112 },
      { x: 140, y: 92 },
      { x: 210, y: 127 },
      { x: 280, y: 119 },
      { x: 350, y: 122 },
      { x: 420, y: 78 },
    ],
  },
  risk: {
    label: 'Risk',
    message: 'Conversion dropped by 7% in last 24 hours',
  },
  progress: {
    label: 'Solution in Progress',
    value: '56%',
    segments: 21,
  },
  insight: 'Paid ads are driving 60% of total conversions',
  ctaLabel: 'Ask or assign Anything',
}

export const performanceSummaryCardData = {
  title: 'Performance Summary',
  subtitle: 'Overall outcome snapshot',
  status: 'Active',
  api: {
    summary: '/api/performance/summary',
    latestResults: '/api/campaigns/latest-results',
    funnelAnalysis: '/api/insights/funnel-analysis',
  },
  snapshotLabel: 'Overall outcome snapshot',
  snapshotState: 'Performance improving',
  snapshotTone: 'positive',
  snapshotChart: {
    points: '0,36 18,40 30,38 42,22 56,20 70,28 86,27 100,29 116,28 132,31 148,28 164,18 180,16 194,30',
    fillPoints: '0,52 0,36 18,40 30,38 42,22 56,20 70,28 86,27 100,29 116,28 132,31 148,28 164,18 180,16 194,30 194,52',
  },
  panelTitle: 'Campaign Results',
  isPriority: true,
  results: [
    {
      label: 'Reach',
      value: '240k',
      columns: [
        { label: 'Mon', value: '188k', count: 3 },
        { label: 'Tue', value: '201k', count: 6 },
        { label: 'Wed', value: '224k', count: 4 },
        { label: 'Thu', value: '196k', count: 3 },
        { label: 'Fri', value: '235k', count: 5 },
        { label: 'Sat', value: '240k', count: 4 },
      ],
    },
    {
      label: 'Engagement',
      value: '36%',
      columns: [
        { label: 'Mon', value: '28%', count: 4 },
        { label: 'Tue', value: '31%', count: 6 },
        { label: 'Wed', value: '36%', count: 3 },
        { label: 'Thu', value: '30%', count: 2 },
        { label: 'Fri', value: '34%', count: 5 },
        { label: 'Sat', value: '36%', count: 4 },
      ],
    },
    {
      label: 'Leads',
      value: '125432',
      columns: [
        { label: 'Mon', value: '92k', count: 4 },
        { label: 'Tue', value: '101k', count: 6 },
        { label: 'Wed', value: '118k', count: 3 },
        { label: 'Thu', value: '113k', count: 2 },
        { label: 'Fri', value: '121k', count: 5 },
        { label: 'Sat', value: '125432', count: 4 },
      ],
    },
  ],
  insight:
    'Most users drop between click and lead, indicating weak landing page conversion. Optimize landing page to improve lead capture rate',
  ctaLabel: 'Ask or assign Anything',
}

export const campaignPerformanceCardData = {
  title: 'Campaign Performance',
  subtitle: 'Campaign effectiveness and results',
  status: 'Active',
  api: {
    activeStatus: '/api/campaigns/active-status',
    compare: '/api/campaigns/compare?ids=instagram,retargeting',
    spendTimeseries: '/api/finance/spend-timeseries?period=this_week',
    budgetRecommendation: '/api/insights/budget-recommendation',
  },
  activeLabel: 'Active campaigns',
  activeValue: '5 running',
  campaignRings: [
    { id: 'campaign-1', progress: 0.88 },
    { id: 'campaign-2', progress: 0.76 },
    { id: 'campaign-3', progress: 0.64 },
    { id: 'campaign-4', progress: 0.58 },
    { id: 'campaign-5', progress: 0.72 },
  ],
  panelTitle: 'Campaign Results',
  campaigns: [
    {
      label: 'Instagram Growth Push',
      value: '+42%',
      tone: 'positive',
      points: '0,44 12,54 24,52 36,28 48,24 60,36 72,34 84,38 96,36 108,40 120,38 132,40 146,24 160,16 172,40',
      fillPoints: '0,64 0,44 12,54 24,52 36,28 48,24 60,36 72,34 84,38 96,36 108,40 120,38 132,40 146,24 160,16 172,40 172,64',
    },
    {
      label: 'Retargeting Sequence',
      value: '+36%',
      tone: 'positive',
      points: '0,44 12,56 24,52 36,40 48,24 60,20 72,32 84,30 96,34 108,34 120,38 132,36 146,18 160,12 172,32',
      fillPoints: '0,64 0,44 12,56 24,52 36,40 48,24 60,20 72,32 84,30 96,34 108,34 120,38 132,36 146,18 160,12 172,32 172,64',
    },
  ],
  spendTitle: 'Spend This week',
  spendChart: {
    activeIndex: 2,
    upperSeries: [
      { x: 0, y: 78, tooltip: '+$8k' },
      { x: 62, y: 56, tooltip: '+$10k' },
      { x: 122, y: 28, tooltip: '+$14k' },
      { x: 186, y: 62, tooltip: '+$9k' },
      { x: 244, y: 40, tooltip: '+$12k' },
      { x: 312, y: 66, tooltip: '+$11k' },
      { x: 372, y: 28, tooltip: '+$15k' },
    ],
    lowerSeries: [
      { x: 0, y: 114 },
      { x: 62, y: 114 },
      { x: 122, y: 98 },
      { x: 186, y: 128 },
      { x: 244, y: 120 },
      { x: 312, y: 124 },
      { x: 372, y: 76 },
    ],
  },
  insight:
    'Growth-focused campaigns are outperforming retargeting, with stronger conversion efficiency. Shift more budget into top-performing growth campaigns',
  ctaLabel: 'Ask or assign Anything',
}

export const portfolioAnalyticsCardData = {
  title: 'Portfolio Analytics',
  subtitle: 'Overall performance',
  status: 'Active',
  api: {
    growth: '/api/portfolio/growth',
    productionSummary: '/api/portfolio/production-summary',
    leadTargets: '/api/portfolio/lead-targets',
    strategy: '/api/insights/portfolio-strategy',
  },
  growthLabel: 'Growth',
  growthValue: '+24%',
  growthChart: {
    points: '0,36 18,40 30,38 42,22 56,20 70,28 86,27 100,29 116,28 132,31 148,28 164,18 180,16 194,30',
    fillPoints: '0,52 0,36 18,40 30,38 42,22 56,20 70,28 86,27 100,29 116,28 132,31 148,28 164,18 180,16 194,30 194,52',
  },
  panelTitle: 'Production Summary',
  summaryItems: [
    {
      label: 'Total Posts',
      value: '1234',
      type: 'bars',
      columns: [
        { label: 'Mon', value: '162', count: 3 },
        { label: 'Tue', value: '204', count: 6 },
        { label: 'Wed', value: '248', count: 5 },
        { label: 'Thu', value: '181', count: 3 },
        { label: 'Fri', value: '165', count: 2 },
        { label: 'Sat', value: '274', count: 6 },
        { label: 'Sun', value: '1234', count: 4 },
      ],
    },
    {
      label: 'Total Campaigns',
      value: '14',
      type: 'bars',
      columns: [
        { label: 'Mon', value: '4', count: 2 },
        { label: 'Tue', value: '7', count: 3 },
        { label: 'Wed', value: '5', count: 2 },
        { label: 'Thu', value: '10', count: 5 },
        { label: 'Fri', value: '6', count: 3 },
        { label: 'Sat', value: '14', count: 6 },
        { label: 'Sun', value: '8', count: 3 },
      ],
    },
    {
      label: 'Assets Generated',
      value: '847',
      type: 'line',
      points: '0,46 12,48 24,28 36,18 48,32 60,30 72,34 84,32 96,36 108,34 120,36 132,36 144,18 158,10 172,34',
      fillPoints: '0,62 0,46 12,48 24,28 36,18 48,32 60,30 72,34 84,32 96,36 108,34 120,36 132,36 144,18 158,10 172,34 172,62',
    },
  ],
  gaugeTitle: 'Lead Generation Target vs Achievement',
  gauge: {
    current: 578,
    target: 700,
    progress: 0.825,
  },
  insight: 'Value-driven posts are driving most of the growth. Scale educational content across campaigns',
  ctaLabel: 'Ask or assign Anything',
}

export const salesReportCardData = {
  title: 'Sales Report',
  subtitle: 'Revenue and conversion',
  status: 'Active',
  api: {
    growthSummary: '/api/sales/growth-summary',
    campaignConversions: '/api/sales/campaign-conversions',
    revenueSources: '/api/sales/revenue-sources',
    salesFunnel: '/api/insights/sales-funnel',
  },
  growthLabel: 'Growth',
  growthValue: '+$68K',
  growthChart: {
    points: '0,36 18,40 30,38 42,22 56,20 70,28 86,27 100,29 116,28 132,31 148,28 164,18 180,16 194,30',
    fillPoints: '0,52 0,36 18,40 30,38 42,22 56,20 70,28 86,27 100,29 116,28 132,31 148,28 164,18 180,16 194,30 194,52',
  },
  panelTitle: 'Campaign Results',
  results: [
    {
      label: 'Oders',
      value: '+420',
      tone: 'positive',
      points: '0,44 12,54 24,52 36,28 48,24 60,36 72,34 84,38 96,36 108,40 120,38 132,40 146,24 160,16 172,40',
      fillPoints: '0,64 0,44 12,54 24,52 36,28 48,24 60,36 72,34 84,38 96,36 108,40 120,38 132,40 146,24 160,16 172,40 172,64',
      tooltips: ['Mon +58', 'Tue +92', 'Wed +123', 'Thu +184', 'Fri +241', 'Sat +318', 'Sun +420'],
    },
    {
      label: 'Conversion Rate',
      value: '+36%',
      tone: 'positive',
      points: '0,44 12,56 24,52 36,40 48,24 60,20 72,32 84,30 96,34 108,34 120,38 132,36 146,18 160,12 172,32',
      fillPoints: '0,64 0,44 12,56 24,52 36,40 48,24 60,20 72,32 84,30 96,34 108,34 120,38 132,36 146,18 160,12 172,32 172,64',
      tooltips: ['Mon 12%', 'Tue 18%', 'Wed 21%', 'Thu 24%', 'Fri 28%', 'Sat 31%', 'Sun 36%'],
    },
  ],
  sourceTitle: 'Revenue Source',
  sourceLegend: [
    { label: 'High', value: '55%', tone: 'blue' },
    { label: 'Mid', value: '35%', tone: 'green' },
    { label: 'Low', value: '10%', tone: 'orange' },
  ],
  sourceBlocks: [
    { tone: 'blue', count: 9 },
    { tone: 'green', count: 6 },
    { tone: 'orange', count: 2 },
  ],
  insight: 'Facebook is driving most revenue, but conversions drop at checkout. Optimize checkout flow to recover lost conversions',
  ctaLabel: 'Ask or assign Anything',
}
export const conversionFunnelCardData = {
  title: 'Conversion Funnel',
  subtitle: 'Campaign effectiveness and results',
  status: 'Active',
  visitsLabel: 'Total Visit this week',
  visitsValue: '126750',
  visitsChart: {
    points:
      '0,36 18,40 30,38 42,22 56,20 70,28 86,27 100,29 116,28 132,31 148,28 164,18 180,16 194,30',
    fillPoints:
      '0,52 0,36 18,40 30,38 42,22 56,20 70,28 86,27 100,29 116,28 132,31 148,28 164,18 180,16 194,30 194,52',
  },
  funnelTitle: 'Outcome From Visit',
  stages: [
    {
      label: 'Click',
      percent: '65%',
      width: '82%',
      // Raw count shown in tooltip on bar hover
      tooltip: '82,388 clicks',
    },
    {
      label: 'Lead',
      percent: '35%',
      width: '57%',
      tooltip: '44,363 leads',
    },
    {
      label: 'Purchase',
      percent: '25%',
      width: '46%',
      tooltip: '31,688 purchases',
    },
  ],
  totalConversionLabel: 'Total Conversion',
  totalConversionValue: '+36%',
  bottomChart: {
    points:
      '0,24 18,44 36,40 54,38 72,20 90,18 108,28 126,30 144,28 162,34 180,32 198,34 216,42 234,30 252,32 270,28 288,30 306,26 324,14 342,6 360,2 384,22',
    fillPoints:
      '0,68 0,24 18,44 36,40 54,38 72,20 90,18 108,28 126,30 144,28 162,34 180,32 198,34 216,42 234,30 252,32 270,28 288,30 306,26 324,14 342,6 360,2 384,22 384,68',
  },
  insight:
    'Most users drop between click and lead, indicating weak landing page conversion. Optimize landing page to improve lead capture rate',
  ctaLabel: 'Ask or assign Anything',
}
export const trafficSourceBreakdownCardData = {
  title: 'Traffic Source Breakdown',
  subtitle: 'Where traffic is coming from',
  status: 'Active',
  topSourceLabel: 'Top Source',
  topSourceValue: 'Organic  72%',
  topSourceChart: {
    points:
      '0,36 18,40 30,38 42,22 56,20 70,28 86,27 100,29 116,28 132,31 148,28 164,18 180,16 194,30',
    fillPoints:
      '0,52 0,36 18,40 30,38 42,22 56,20 70,28 86,27 100,29 116,28 132,31 148,28 164,18 180,16 194,30 194,52',
  },
  mixTitle: 'Source mix',
  sources: [
    {
      label: 'Organic',
      percent: '72%',
      delta: '+15%',
      width: '84%',
      tone: 'positive',
      // Raw visitor count shown in tooltip on bar hover
      tooltip: '34,200 unique visitors',
    },
    {
      label: 'Paid Ads',
      percent: '62%',
      delta: '-15%',
      width: '72%',
      tone: 'negative',
      tooltip: '29,450 unique visitors',
    },
    {
      label: 'Social',
      percent: '32%',
      delta: '+5%',
      width: '56%',
      tone: 'positive',
      tooltip: '14,500 unique visitors',
    },
    {
      label: 'Direct',
      percent: '10%',
      delta: '+0%',
      width: '30%',
      tone: 'positive',
      tooltip: '4,750 unique visitors',
    },
  ],
  insight:
    'Most users drop between click and lead, indicating weak landing page conversion. Optimize landing page to improve lead capture rate',
  ctaLabel: 'Ask or assign Anything',
}
