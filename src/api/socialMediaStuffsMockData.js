const sharedUpcomingBatch = [
  { label: 'Instagram Live Hack posts', value: '12 Images' },
  { label: 'Facebook Video Tutorials', value: '8 Images' },
  { label: 'Twitter Engagement Tips', value: '10 Images' },
]

export const socialMediaPublishingCardData = {
  title: 'Social Media Publishing',
  subtitle: 'Post delivery and scheduling',
  status: 'Active',
  currentBatchLabel: 'Current Batch',
  currentBatch: {
    name: 'Instagram Live Hack posts',
    completed: 7,
    total: 12,
  },
  channels: [
    { label: 'f', tone: 'blue', checked: true },
    { label: 'in', tone: 'blue', checked: true },
    { label: 'ig', tone: 'pink', loading: true },
  ],
  post: {
    brandInitial: 'X',
    brandName: 'XWorldLTD',
    brandMeta: 'Manchester, United Kingdom',
    caption: [
      "Most people don't fail because they lack talent.",
      'They fail because they lack consistency...',
    ],
    actions: ['heart', 'comment', 'share', 'bookmark'],
  },
  upcomingBatchTitle: 'Upcoming Batch',
  upcomingBatch: sharedUpcomingBatch,
  insightTitle: 'AI Insight',
  insightText: 'Users are saving educational posts more than other content',
  ctaLabel: 'Ask or assign Anything',
}

export const captionGenerationCardData = {
  title: 'Caption Generation',
  subtitle: 'Batch caption production',
  status: 'Active',
  currentBatchLabel: 'Current Batch',
  currentBatch: {
    name: 'Instagram Live Hack posts',
    completed: 7,
    total: 12,
  },
  captionLabel: 'Caption 7',
  captionStatus: 'Generating...',
  paragraphs: [
    "Most people don't fail because they lack talent. They fail because they lack consistency.",
    "You don't need a perfect plan. You need to show up even on the days you don't feel like it.",
    "The ones who win are the ones who keep going when it's boring, slow, and unnoticed.",
    'Start small. Stay consistent. Watch what happens.',
    `If you're serious about changing your life, type "START" below.`,
  ],
  pager: {
    current: 7,
    total: 12,
  },
  upcomingBatchTitle: 'Upcoming Batch',
  upcomingBatch: sharedUpcomingBatch,
  insightTitle: 'AI Insight',
  insightText: 'Users are saving educational posts more than other content',
  ctaLabel: 'Ask or assign Anything',
}

export const imageGenerationCardData = {
  title: 'Image Generation',
  subtitle: 'Live batch image production',
  status: 'Active',
  currentBatchLabel: 'Current Batch',
  currentBatch: {
    name: 'Instagram Live Hack posts',
    completed: 7,
    total: 12,
  },
  heroVariant: 'default',
  thumbnails: [
    { id: 'singer', variant: 'singer' },
    { id: 'guitar', variant: 'guitar' },
    { id: 'studio', variant: 'studio' },
    { id: 'speaker', variant: 'speaker' },
  ],
  upcomingBatchTitle: 'Upcoming Batch',
  upcomingBatch: sharedUpcomingBatch,
  insightTitle: 'AI Insight',
  insightText: 'Users are saving educational posts more than other content',
  ctaLabel: 'Ask or assign Anything',
}

export const socialMediaManagerCardData = {
  title: 'Social Media Manager',
  subtitle: 'Content publishing, and engagement',
  status: 'Active',
  activityLabel: 'Current Activity',
  currentActivity: {
    name: 'Running Instagram Campaign',
    progress: '75%',
  },
  breakdownLabel: 'Engagement Breakdown',
  engagementCards: [
    { id: 'facebook',  iconKey: 'facebook',  value: '+ 32%', tone: 'facebook',  points: '0,36 12,40 24,34 36,44 48,30 60,38 72,22 84,40 96,18 108,36 120,28 132,42 144,24 158,36 172,30' },
    { id: 'linkedin',  iconKey: 'linkedin',  value: '+ 32%', tone: 'linkedin',  points: '0,40 14,38 26,44 38,32 52,36 64,26 76,34 88,18 100,40 112,22 124,36 136,30 148,42 160,26 172,34' },
    { id: 'instagram', iconKey: 'instagram', value: '+ 24%', tone: 'instagram', points: '0,22 12,42 26,32 38,38 50,28 64,40 76,24 90,36 102,16 116,38 128,26 142,40 154,22 166,36 172,28' },
    { id: 'tiktok',    iconKey: 'tiktok',    value: '+ 24%', tone: 'tiktok',    points: '0,30 14,38 28,24 40,42 54,28 66,36 80,20 92,40 106,24 118,38 132,26 144,42 156,22 168,34 172,28' },
  ],
  metrics: {
    primary: {
      label: 'CTR',
      value: '3.2%',
      bars: [22, 54, 28, 22, 66, 40, 28, 74, 36, 18, 62, 30],
    },
    secondary: {
      label: 'Share',
      value: '+9%',
      points: '0,18 16,29 32,26 48,30 64,25 80,6 94,18 112,15 132,12 152,16 170,24 186,2 190,17',
      fillPoints: '0,42 0,18 16,29 32,26 48,30 64,25 80,6 94,18 112,15 132,12 152,16 170,24 186,2 190,17 190,42',
      gradientId: 'manager-growth-fill',
    },
  },
  insightTitle: 'AI Insight',
  insightText: 'Instagram is driving the strongest growth today, while LinkedIn needs attention.',
  ctaLabel: 'Ask or assign Anything',
}

export const socialMediaStrategyCardData = {
  title: 'Social Media Strategy',
  subtitle: 'Post planning and execution',
  status: 'Active',
  executionLabel: 'Current execution',
  currentExecution: {
    name: 'Building weekly post plan for Instagram',
    progress: '55%',
  },
  stats: ['12 Posts', '7 Drafts', '5 Queued'],
  reasonsTitle: 'Reasons',
  reasonColumns: [
    {
      title: 'Educational Posts',
      delta: '+34%',
      tone: 'green',
      bars: [18, 46, 22, 18, 38, 26, 16, 14, 28, 16, 34, 22],
    },
    {
      title: 'Promotional Posts',
      delta: '-12%',
      tone: 'red',
      bars: [18, 46, 22, 18, 38, 26, 16, 14, 28, 16, 34, 22],
    },
    {
      title: 'Life Hack Posts',
      delta: '+20%',
      tone: 'green',
      bars: [18, 46, 22, 18, 38, 26, 16, 14, 28, 16, 34, 22],
    },
  ],
  planTitle: 'Upcoming Plans',
  planItems: [
    'Create 5 educational posts explaining key concepts for the target audience',
    'Update captions and hooks on upcoming posts to improve reach and retention',
    'Prepare 2 engagement-driven posts with questions or prompts to increase comments',
  ],
  insightTitle: 'AI Insight',
  insightText: 'Users are saving educational posts more than other content',
  ctaLabel: 'Ask or assign Anything',
}

export const performanceTrackingCardData = {
  title: 'Performance Tracking',
  subtitle: 'Live post performance summary',
  status: 'Active',
  trendLabel: 'Overall trend',
  trend: {
    direction: 'up',
    label: 'Sales Boosting',
    points: '0,18 16,29 32,26 48,30 64,25 80,6 94,18 112,15 132,12 152,16 170,24 186,2 190,17',
    fillPoints: '0,42 0,18 16,29 32,26 48,30 64,25 80,6 94,18 112,15 132,12 152,16 170,24 186,2 190,17 190,42',
    gradientId: 'tracking-fill',
  },
  reasonsTitle: 'Reasons',
  reasons: [
    {
      title: 'Reach',
      value: '+34k',
      tone: 'green',
      bars: [18, 46, 22, 18, 38, 26, 16, 14, 28, 16, 34, 22],
    },
    {
      title: 'Saves',
      value: '-122',
      tone: 'red',
      bars: [18, 46, 22, 18, 38, 26, 16, 14, 28, 16, 34, 22],
    },
    {
      title: 'CTR',
      value: '2.8%',
      tone: 'green',
      bars: [18, 46, 22, 18, 38, 26, 16, 14, 28, 16, 34, 22],
    },
  ],
  performersTitle: 'Top performers',
  performerRows: [
    { label: 'Educational Posts', value: '65%', width: '82%' },
    { label: 'Proof-based posts', value: '35%', width: '58%' },
    { label: 'Promotional posts', value: '25%', width: '30%' },
  ],
  platformPerformanceTitle: 'Platform Performance',
  platforms: [
    { label: 'f', value: '+34%', tone: 'blue' },
    { label: 'in', value: '+44%', tone: 'blue' },
    { label: 'ig', value: '-12%', tone: 'pink' },
  ],
  insightTitle: 'AI Insight',
  insightText:
    'Educational and proof-based posts are driving the strongest engagement, while promotional content is underperforming.',
  ctaLabel: 'Ask or assign Anything',
}
