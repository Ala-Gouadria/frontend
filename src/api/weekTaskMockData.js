export const WEEK_TASK_THRESHOLDS = {
  low: 35,
  high: 50,
}

export const WEEK_TASK_STATS = {
  completed: 32,
  total: 56,
}

export const WEEK_TASK_CHART_DATASETS = {
  completed: {
    today: [26, 21, 22, 23, 34, 27, 26, 28, 24, 26, 25, 27, 26, 28, 22, 29, 31, 35, 37, 24],
    week: [24, 26, 29, 27, 35, 31, 30, 33, 29, 31, 33, 35, 34, 37, 32, 39, 42, 46, 48, 36],
    month: [38, 35, 37, 40, 49, 43, 42, 46, 44, 48, 47, 50, 49, 53, 46, 56, 60, 64, 66, 52],
  },
  created: {
    today: [18, 16, 17, 18, 24, 20, 19, 21, 18, 19, 20, 21, 20, 22, 18, 23, 25, 28, 29, 21],
    week: [20, 22, 24, 23, 28, 25, 24, 27, 24, 26, 28, 29, 28, 31, 26, 33, 35, 38, 40, 30],
    month: [30, 31, 34, 33, 40, 36, 35, 39, 36, 40, 42, 43, 41, 45, 38, 48, 51, 55, 58, 44],
  },
}

export const WEEK_TASK_HISTORY = [
  { id: 1, title: 'Draft a 24-hour flash sale email for existing users.', status: 'completed', time: '20s ago', score: 82 },
  { id: 2, title: 'Turn your most popular social post into a blog draft.', status: 'completed', time: '45m ago', score: 74 },
  { id: 3, title: 'Update your primary landing page "Sign Up" button text.', status: 'completed', time: '1h ago', score: 61 },
  { id: 4, title: 'Create a social media campaign for product launch.', status: 'created', time: '30s ago', score: 28 },
  { id: 5, title: 'Create a social media campaign for product launch.', status: 'created', time: '30s ago', score: 33 },
  { id: 6, title: 'Analyze customer feedback and adjust marketing strategy.', status: 'created', time: '50s ago', score: 49 },
]

export const WEEK_TASK_CREATED = [
  { id: 1, title: 'Draft a 24-hour flash sale email for existing users.', accepted: true, score: 88 },
  { id: 2, title: 'Turn your most popular social post into a blog draft.', accepted: true, score: 81 },
  { id: 3, title: 'Update your primary landing page "Sign Up" button text.', accepted: true, score: 72 },
  { id: 4, title: 'Plan a referral push for your highest-value customers.', accepted: true, score: 76 },
  { id: 5, title: 'Create a retargeting campaign for warm website visitors.', accepted: true, score: 78 },
  { id: 6, title: 'Write a carousel post around your best client result.', accepted: true, score: 83 },
  { id: 7, title: 'Build a short-form content calendar for the next 7 days.', accepted: true, score: 86 },
  { id: 8, title: 'Turn your testimonial bank into social proof snippets.', accepted: true, score: 69 },
  { id: 9, title: 'Refresh your call-to-action copy across primary pages.', accepted: true, score: 67 },
  { id: 10, title: 'Create a limited-time bonus offer for new leads.', accepted: true, score: 79 },
  { id: 11, title: 'Map your next onboarding email sequence.', accepted: true, score: 71 },
  { id: 12, title: 'Generate three hooks for your highest-performing niche.', accepted: true, score: 84 },
  { id: 13, title: 'Outline a landing page update for higher conversions.', accepted: true, score: 73 },
  { id: 14, title: 'Draft follow-up messages for qualified inbound leads.', accepted: true, score: 75 },
  { id: 15, title: 'Create a content upgrade for your most-read article.', accepted: true, score: 80 },
  { id: 16, title: 'Package your best FAQ answers into a conversion post.', accepted: true, score: 77 },
  { id: 17, title: 'Plan a nurture sequence for inactive trial users.', accepted: true, score: 68 },
  { id: 18, title: 'Analyze customer feedback and adjust marketing strategy.', accepted: false, score: 24 },
  { id: 19, title: 'Create a social media campaign for product launch.', accepted: false, score: 31 },
  { id: 20, title: 'Build a cold outreach experiment for a new segment.', accepted: false, score: 27 },
]
