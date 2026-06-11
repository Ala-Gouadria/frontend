export const seoInsightsCardData = {
  title: 'SEO Insights',
  subtitle: 'Search visibility, ranking, and page-level gaps',
  status: 'Active',
  trendLabel: 'Visibility trend',
  trendValue: 'Organic traffic is leading growth',
  trendDelta: '+12% this week',
  topChart: {
    points: '0,26 18,28 36,16 54,20 72,18 90,22 108,20 126,22 144,20 162,22 180,16 198,10 216,8 234,22',
    fillPoints: '0,40 0,26 18,28 36,16 54,20 72,18 90,22 108,20 126,22 144,20 162,22 180,16 198,10 216,8 234,22 234,40',
  },
  gauge: {
    current: '9.7K',
    label: 'Organic clicks',
    progress: 0.82,
  },
  keywordsTitle: 'Keyword opportunities',
  keywordsMeta: 'Rank + intent + volume',
  keywords: [
    { label: 'online fitness coaching', note: 'Vol 12.4K · High intent', rank: '#8', delta: '+3', width: '86%' },
    { label: 'discipline coaching for men', note: 'Vol 2.1K · Mid intent', rank: '#14', delta: '+1', width: '76%' },
    { label: 'Application', note: 'Form bundle too large', rank: '#27', delta: '-4', width: '56%' },
  ],
  insight: 'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.',
  ctaLabel: 'Ask or assign Anything',
}

export const websiteTrafficStatusCardData = {
  title: 'Website & Traffic',
  subtitle: 'Traffic, behavior, and conversion',
  status: 'Active',
  revenueLabel: 'Revenue Status',
  revenueValue: 'Sales Slowing',
  topChart: {
    points: '0,30 13,38 26,36 39,18 52,14 65,24 78,22 91,26 104,24 117,28 130,26 143,28 156,36 169,12 182,8 194,28',
    fillPoints: '0,44 0,30 13,38 26,36 39,18 52,14 65,24 78,22 91,26 104,24 117,28 130,26 143,28 156,36 169,12 182,8 194,28 194,44',
  },
  problemTitle: 'Main Drop Point',
  problemText: 'Users leaving early because of weak engagement',
  stages: ['Visit', 'Engage', 'Convert'],
  qualityTitle: 'Traffic Quality',
  legend: [
    { label: 'High Intent', value: '55%', tone: 'green' },
    { label: 'Low intent', value: '15%', tone: 'red' },
  ],
  blocks: [
    { tone: 'green', count: 10 },
    { tone: 'red', count: 5 },
  ],
  insight: 'Strong signals from Traffic, Returning Users combined with drop suggest retargeting will recover lost conversions.',
  ctaLabel: 'Ask or assign Anything',
}

export const trafficQualityCardData = {
  title: 'Traffic Quality',
  subtitle: 'Source quality, and conversion readiness',
  status: 'Active',
  trendLabel: 'Quality trend',
  trendValue: 'Qualified traffic is improving',
  trendDelta: '+12% this week',
  topChart: {
    points: '0,26 18,28 36,16 54,20 72,18 90,22 108,20 126,22 144,20 162,22 180,16 198,10 216,8 234,22',
    fillPoints: '0,40 0,26 18,28 36,16 54,20 72,18 90,22 108,20 126,22 144,20 162,22 180,16 198,10 216,8 234,22 234,40',
  },
  gauge: {
    current: '71',
    label: 'Quality Score',
    progress: 0.79,
  },
  panelTitle: 'Conversion health',
  panelMetrics: [
    { label: 'High intent', value: '44%', bars: [22, 58, 32, 18, 42, 26, 18, 14, 24, 18, 34, 20] },
    { label: 'Bounce risk', value: '22%', bars: [18, 30, 40, 38, 20, 18, 26, 24, 28, 26, 28, 26] },
  ],
  intentMixTitle: 'Intent mix',
  intentMixMeta: 'Share of visitors',
  intentMix: [
    { label: 'High intent', value: '44%', width: '72%' },
    { label: 'Medium intent', value: '36%', width: '48%' },
    { label: 'Low intent', value: '20%', width: '30%' },
  ],
  sourceQualityTitle: 'Source quality',
  sourceQualityMeta: 'Score + intent',
  sources: [
    { label: 'Organic Search', note: 'High quality', score: 'Score 82', tag: 'Strong intent', tone: 'green', width: '84%' },
    { label: 'Direct', note: 'Medium quality', score: 'Score 61', tag: 'Moderate intent', tone: 'orange', width: '66%' },
    { label: 'Social', note: 'Low quality', score: 'Score 38', tag: 'Weak intent', tone: 'red', width: '42%' },
  ],
  insight: 'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.',
  ctaLabel: 'Ask or assign Anything',
}

export const websiteTrafficCardData = {
  title: 'Website Traffic',
  subtitle: 'Traffic overview and source mix',
  status: 'Active',
  trendLabel: 'Traffic trend',
  trendValue: 'Organic traffic is leading growth',
  trendDelta: '+12% this week',
  topChart: {
    points: '0,26 18,28 36,16 54,20 72,18 90,22 108,20 126,22 144,20 162,22 180,16 198,10 216,8 234,22',
    fillPoints: '0,40 0,26 18,28 36,16 54,20 72,18 90,22 108,20 126,22 144,20 162,22 180,16 198,10 216,8 234,22 234,40',
  },
  panelTitle: 'Reasons',
  reasonMetrics: [
    { label: 'Visitors', value: '92.4k', bars: [24, 52, 74, 28, 20, 46, 32, 22, 18, 24, 30, 42] },
    { label: 'Growth', value: '+14.2%', bars: [36, 54, 22, 70, 40, 30, 20, 56, 18, 12, 38, 24], tone: 'red' },
    { label: 'Pages / Visit', value: '3.8', bars: [44, 60, 26, 72, 30, 24, 18, 52, 28, 18, 40, 34] },
  ],
  sourceMixTitle: 'Source mix',
  sourceMix: [
    { label: 'Organic Search', value: '45%', width: '60%' },
    { label: 'Direct', value: '30%', width: '52%' },
    { label: 'Social Media', value: '15%', width: '28%' },
    { label: 'Paid Ads', value: '10%', width: '18%' },
  ],
  deviceTitle: 'Traffic Source Device',
  deviceLegend: [
    { label: 'Desktop', value: '35%', tone: 'green' },
    { label: 'Mobile', value: '65%', tone: 'blue' },
  ],
  deviceBlocks: [
    { tone: 'green', count: 7 },
    { tone: 'blue', count: 11 },
  ],
  countriesTitle: 'Top countries',
  countries: [
    { label: 'United States', value: '28.4K' },
    { label: 'United Kingdom', value: '11.2K' },
    { label: 'Canada', value: '6.8K' },
  ],
  insight: 'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.',
  ctaLabel: 'Ask or assign Anything',
}

export const userBehaviorCardData = {
  title: 'User Behavior',
  subtitle: 'How users move, engage, and drop',
  status: 'Active',
  trendLabel: 'Traffic trend',
  trendValue: 'Organic traffic is leading growth',
  trendDelta: '+12% this week',
  topChart: {
    points: '0,26 18,28 36,16 54,20 72,18 90,22 108,20 126,22 144,20 162,22 180,16 198,10 216,8 234,22',
    fillPoints: '0,40 0,26 18,28 36,16 54,20 72,18 90,22 108,20 126,22 144,20 162,22 180,16 198,10 216,8 234,22 234,40',
  },
  panelTitle: 'Reasons',
  metrics: [
    { label: 'Avg. session', value: '2m 48s', bars: [24, 52, 74, 28, 20, 46, 32, 22, 18, 24, 30, 42] },
    { label: 'Pages / visit', value: '3.2', bars: [36, 54, 22, 70, 40, 30, 20, 56, 18, 12, 38, 24], tone: 'red' },
    { label: 'Bounce', value: '38%', bars: [44, 60, 26, 72, 30, 24, 18, 52, 28, 18, 40, 34] },
    { label: 'CTA clicks', value: '1.8K', bars: [24, 52, 74, 28, 20, 46, 32, 22, 18, 24, 30, 42] },
    { label: 'Scroll depth', value: '68%', bars: [36, 54, 22, 70, 40, 30, 20, 56, 18, 12, 38, 24], tone: 'red' },
    { label: 'Form starts', value: '412', bars: [44, 60, 26, 72, 30, 24, 18, 52, 28, 18, 40, 34] },
  ],
  userflowTitle: 'Userflow',
  userflow: [
    { label: 'Homepage', value: '45%', width: '62%' },
    { label: 'Pricing', value: '30%', width: '54%' },
    { label: 'Application', value: '31%', width: '18%' },
  ],
  insight: 'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.',
  ctaLabel: 'Ask or assign Anything',
}

export const pagePerformanceCardData = {
  title: 'Page Performance',
  subtitle: 'Speed, load health, and page-level issues',
  status: 'Active',
  gauges: [
    { value: '2.9s', label: 'Avg. load', progress: 0.38 },
    { value: '93', label: 'Perf. score', progress: 0.84 },
  ],
  leftTitle: 'Revenue by source',
  rightTitle: 'Speed + score',
  pages: [
    { label: 'Homepage', note: 'Heavy hero media', value: '2.1s', tag: 'Score 91', width: '96%' },
    { label: 'Pricing', note: 'Script load delay', value: '2.8s', tag: 'Score 91', width: '74%' },
    { label: 'Application', note: 'Form bundle too large', value: '4.3s', tag: 'Score 54', width: '88%' },
  ],
  insight: 'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.',
  ctaLabel: 'Ask or assign Anything',
}

export const conversionSignalsCardData = {
  title: 'Conversion Signals',
  subtitle: 'Intent, actions, and conversion health',
  status: 'Active',
  panelTitle: 'Conversion health',
  metrics: [
    { label: 'CTA clicks', value: '1.9K', delta: '+18%', bars: [24, 52, 74, 28, 20, 46, 32, 22, 18, 24, 30, 42] },
    { label: 'Form starts', value: '412', delta: '+9%', bars: [36, 54, 22, 70, 40, 30, 20, 56, 18, 12, 38, 24] },
    { label: 'Checkouts', value: '126', delta: '-6%', bars: [44, 60, 26, 72, 30, 24, 18, 52, 28, 18, 40, 34] },
  ],
  ladderTitle: 'Intent ladder',
  ladderMeta: 'How users move toward conversio',
  ladder: [
    { label: 'Visit', value: '100%', width: '86%' },
    { label: 'Engage', value: '62%', width: '68%' },
    { label: 'Intent', value: '31%', width: '48%' },
    { label: 'Convert', value: '12%', width: '82%' },
  ],
  insight: 'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.',
  ctaLabel: 'Ask or assign Anything',
}
