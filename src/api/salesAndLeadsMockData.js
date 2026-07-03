export const leadScoringCardData = {
  title: 'Lead Scoring',
  subtitle: 'Lead value and intent ranking',
  status: 'Active',
  scoredLabel: 'Scored leads',
  scoredValue: '126 active leads',
  scoredDelta: '+12% this week',
  topChart: {
    points: '0,28 18,34 36,32 54,18 72,16 90,24 108,24 126,26 144,24 162,26 180,24 198,24 216,30 234,14 252,10 270,26',
    fillPoints: '0,46 0,28 18,34 36,32 54,18 72,16 90,24 108,24 126,26 144,24 162,26 180,24 198,24 216,30 234,14 252,10 270,26 270,46',
  },
  leads: [
    { name: 'John Smith', note: 'Booked a call + visited pricing page', intent: 'High intent', score: '91%' },
    { name: 'Emma Carter', note: 'Downloaded guide + opened emails', intent: 'High intent', score: '83%' },
    { name: 'Alex Ray', note: 'Visited once, no follow-up action', intent: 'Mid Intent', score: '51%' },
  ],
  sourceLabel: 'Top Source',
  sourceValue: 'Website',
  sourceMetric: '23% Conversion',
  trackLabel: 'Lead',
  trackValue: '35%',
  trackWidth: '62%',
  insight:
    'High-scoring leads are showing strong buying intent through pricing page visits and booking actions. Prioritize outreach to high-score leads within the next 24 hours',
  ctaLabel: 'Ask or assign Anything',
}

export const leadGenerationCardData = {
  title: 'Lead Generation',
  subtitle: 'Lead flow and acquisition sources',
  status: 'Active',
  flowLabel: 'Lead flow',
  flowValue: '+21%',
  topChart: {
    points: '0,28 18,34 36,32 54,18 72,16 90,24 108,24 126,26 144,24 162,26 180,24 198,24 216,30 234,14 252,10 270,26',
    fillPoints: '0,46 0,28 18,34 36,32 54,18 72,16 90,24 108,24 126,26 144,24 162,26 180,24 198,24 216,30 234,14 252,10 270,26 270,46',
  },
  panelTitle: 'Reasons',
  sources: [
    { label: 'Instagram', value: '4322', bars: [24, 52, 74, 28, 20, 46, 32, 22, 18, 24, 30, 42] },
    { label: 'Website', value: '3652', bars: [36, 54, 22, 70, 40, 30, 20, 56, 18, 12, 38, 24] },
    { label: 'Ads', value: '2354', bars: [44, 60, 26, 72, 30, 24, 18, 52, 28, 18, 40, 34] },
  ],
  sourceLabel: 'Top Source',
  sourceValue: 'Website',
  sourceMetric: '23% Conversion',
  trackLabel: 'Lead',
  trackValue: '35%',
  trackWidth: '62%',
  insight:
    'Strong signals from Traffic, Returning Users combined with drop suggest retargeting will recover lost conversions.',
  ctaLabel: 'Ask or assign Anything',
}

export const pipelineTrackingCardData = {
  title: 'Pipeline Tracking',
  subtitle: 'Deal flow across sales stages',
  status: 'Active',
  pipelineLabel: 'Open pipeline',
  pipelineValue: '94 active deals',
  pipelineDelta: '+12% this week',
  topChart: {
    points: '0,28 18,34 36,32 54,18 72,16 90,24 108,24 126,26 144,24 162,26 180,24 198,24 216,30 234,14 252,10 270,26',
    fillPoints: '0,46 0,28 18,34 36,32 54,18 72,16 90,24 108,24 126,26 144,24 162,26 180,24 198,24 216,30 234,14 252,10 270,26 270,46',
  },
  stages: [
    { label: 'New Deals', value: '45', tone: 'green' },
    { label: 'Qualified', value: '28', tone: 'green' },
    { label: 'Proposal', value: '21', tone: 'green' },
    { label: 'Stuck', value: '11', tone: 'red' },
    { label: 'Closed', value: '10', tone: 'green' },
  ],
  winRateLabel: 'Win Rate',
  winRateValue: '37%',
  bottomChart: {
    points: '0,24 18,34 36,32 54,30 72,18 90,16 108,24 126,24 144,26 162,24 180,26 198,24 216,24 234,30 252,14 270,10 298,26',
    fillPoints: '0,48 0,24 18,34 36,32 54,30 72,18 90,16 108,24 126,24 144,26 162,24 180,26 198,24 216,24 234,30 252,14 270,10 298,26 298,48',
  },
  insight:
    'High-scoring leads are showing strong buying intent through pricing page visits and booking actions. Prioritize outreach to high-score leads within the next 24 hours',
  ctaLabel: 'Ask or assign Anything',
}

export const salesAndLeadsCardData = {
  title: 'Sales and Leads',
  subtitle: 'Lead flow and revenue conversion',
  status: 'Active',
  revenueLabel: 'Revenue Status',
  revenueValue: 'Sales Boosting',
  revenueChart: {
    points: '0,28 18,34 36,32 54,18 72,16 90,24 108,24 126,26 144,24 162,26 180,24 198,24 216,30 234,14 252,10 270,26',
    fillPoints: '0,46 0,28 18,34 36,32 54,18 72,16 90,24 108,24 126,26 144,24 162,26 180,24 198,24 216,30 234,14 252,10 270,26 270,46',
  },
  problemTitle: 'Main Problem',
  problemText: 'Following up with high-value proposal-stage deals',
  stages: ['Leads', 'Qualified', 'Proposal', 'Closed'],
  leadQualityTitle: 'Lead Quality',
  leadQualityLabel: 'Lead Quality',
  legend: [
    { label: 'High', value: '55%', tone: 'blue' },
    { label: 'Mid', value: '30%', tone: 'purple' },
    { label: 'Low', value: '15%', tone: 'red' },
  ],
  blocks: [
    { tone: 'blue', count: 10 },
    { tone: 'purple', count: 6 },
    { tone: 'red', count: 4 },
  ],
  insight:
    'Strong signals from Traffic, Returning Users combined with drop suggest retargeting will recover lost conversions.',
  ctaLabel: 'Ask or assign Anything',
}

export const revenueFeedbackCardData = {
  title: 'Revenue Feedback',
  subtitle: 'Revenue response across channels and offers',
  status: 'Active',
  responseLabel: 'Revenue response',
  responseValue: '+16% this week',
  topChart: {
    points: '0,28 18,34 36,32 54,18 72,16 90,24 108,24 126,26 144,24 162,26 180,24 198,24 216,30 234,14 252,10 270,26',
    fillPoints: '0,46 0,28 18,34 36,32 54,18 72,16 90,24 108,24 126,26 144,24 162,26 180,24 198,24 216,30 234,14 252,10 270,26 270,46',
  },
  sourcesTitle: 'Revenue by source',
  sources: [
  { label: 'Instagram', value: '55%', width: '100%' },
  { label: 'Website',   value: '35%', width: '100%' },
  { label: 'Email',     value: '25%', width: '100%' },
],
  insight:
    'High-scoring leads are showing strong buying intent through pricing page visits and booking actions. Prioritize outreach to high-score leads within the next 24 hours',
  ctaLabel: 'Ask or assign Anything',
}
