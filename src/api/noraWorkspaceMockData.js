const now = Date.now()

export const NORA_SERVICES = [
  {
    id: 'general',
    label: 'General',
    shortLabel: 'General',
    description: 'Ask Nora anything about your business and get a focused action plan.',
    accent: 'blue',
    suggestions: [
      'Give me a 7 day growth plan for this brand.',
      'What should I prioritize this week to increase conversions?',
      'Turn my business goals into daily tasks.',
    ],
  },
  {
    id: 'social',
    label: 'Social Media',
    shortLabel: 'Social',
    description: 'Plan posts, campaigns, hooks, and platform-specific content.',
    accent: 'pink',
    suggestions: [
      'Create an Instagram content plan for this week.',
      'Give me 5 short-form hooks for my audience.',
      'Turn my latest offer into a social campaign.',
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    shortLabel: 'Analytics',
    description: 'Break down performance, trends, and conversion opportunities.',
    accent: 'green',
    suggestions: [
      'Summarize the most important business metrics to watch.',
      'What does this traffic trend say about intent?',
      'Find the highest-impact performance opportunity.',
    ],
  },
  {
    id: 'strategy',
    label: 'Strategy',
    shortLabel: 'Strategy',
    description: 'Build positioning, offers, and competitive responses.',
    accent: 'orange',
    suggestions: [
      'Map a positioning strategy for the next 30 days.',
      'How should I respond to competitor messaging?',
      'Find three growth opportunities for this business.',
    ],
  },
  {
    id: 'sales',
    label: 'Sales',
    shortLabel: 'Sales',
    description: 'Generate lead nurture ideas, outreach angles, and offer improvements.',
    accent: 'ink',
    suggestions: [
      'Write a follow-up sequence for warm leads.',
      'How can I improve lead-to-sale conversion?',
      'Turn this offer into a sales-ready pitch.',
    ],
  },
  {
    id: 'website',
    label: 'Website',
    shortLabel: 'Website',
    description: 'Improve landing pages, user journeys, and conversion copy.',
    accent: 'blue',
    suggestions: [
      'Review my landing page CTA strategy.',
      'What should change on the homepage first?',
      'Give me a conversion-focused hero section rewrite.',
    ],
  },
  {
    id: 'automation',
    label: 'Automation',
    shortLabel: 'Automation',
    description: 'Create workflows, task systems, and automated follow-up sequences.',
    accent: 'green',
    suggestions: [
      'Design an automation flow for new leads.',
      'What should I automate first in this business?',
      'Turn repeated tasks into a workflow checklist.',
    ],
  },
]

export const NORA_SEED_CONVERSATIONS = [
  {
    id: 'conv-social-1',
    title: 'Instagram Growth Plan',
    serviceId: 'social',
    updatedAt: new Date(now - 1000 * 60 * 12).toISOString(),
    messages: [
      {
        id: 'msg-social-1',
        role: 'user',
        text: 'Share an Instagram growth strategy for this week.',
        createdAt: new Date(now - 1000 * 60 * 18).toISOString(),
        attachments: [],
      },
      {
        id: 'msg-social-2',
        role: 'assistant',
        text: [
          'Here is a focused weekly Instagram plan.',
          '1. Publish 3 authority posts around your highest-value pain point.',
          '2. Add 1 proof-based post that shows a real result or customer win.',
          '3. Finish with 1 soft promotion post that moves people into DMs or a landing page.',
          '4. Reuse the strongest hook in Stories with a poll or question box.',
        ].join('\n'),
        createdAt: new Date(now - 1000 * 60 * 17).toISOString(),
        attachments: [],
      },
      {
        id: 'msg-social-3',
        role: 'user',
        text: 'What topics should I post about first?',
        createdAt: new Date(now - 1000 * 60 * 14).toISOString(),
        attachments: [],
      },
      {
        id: 'msg-social-4',
        role: 'assistant',
        text: [
          'Start with angles that help your audience make a fast decision.',
          '- The biggest mistake people make before they buy.',
          '- What actually changes results in your niche.',
          '- One client transformation broken into simple steps.',
        ].join('\n'),
        createdAt: new Date(now - 1000 * 60 * 12).toISOString(),
        attachments: [],
      },
    ],
  },
  {
    id: 'conv-analytics-1',
    title: 'Weekly Performance Review',
    serviceId: 'analytics',
    updatedAt: new Date(now - 1000 * 60 * 55).toISOString(),
    messages: [
      {
        id: 'msg-analytics-1',
        role: 'user',
        text: 'Which metrics matter most for this week?',
        createdAt: new Date(now - 1000 * 60 * 58).toISOString(),
        attachments: [],
      },
      {
        id: 'msg-analytics-2',
        role: 'assistant',
        text: [
          'Focus on three signals this week.',
          '1. Qualified traffic trend.',
          '2. Landing page conversion rate.',
          '3. Lead response speed.',
          'Those three numbers usually explain whether the funnel is improving or leaking.',
        ].join('\n'),
        createdAt: new Date(now - 1000 * 60 * 55).toISOString(),
        attachments: [],
      },
    ],
  },
  {
    id: 'conv-strategy-1',
    title: 'Competitor Positioning Notes',
    serviceId: 'strategy',
    updatedAt: new Date(now - 1000 * 60 * 130).toISOString(),
    messages: [
      {
        id: 'msg-strategy-1',
        role: 'user',
        text: 'How should we stand out from similar competitors?',
        createdAt: new Date(now - 1000 * 60 * 140).toISOString(),
        attachments: [],
      },
      {
        id: 'msg-strategy-2',
        role: 'assistant',
        text: [
          'Stand out by making the buying outcome clearer and faster to trust.',
          'Lead with one specific promise, show proof immediately, and explain your process in a simpler way than the market does today.',
        ].join('\n'),
        createdAt: new Date(now - 1000 * 60 * 130).toISOString(),
        attachments: [],
      },
    ],
  },
  {
    id: 'conv-automation-1',
    title: 'Lead Follow-up Workflow',
    serviceId: 'automation',
    updatedAt: new Date(now - 1000 * 60 * 240).toISOString(),
    messages: [
      {
        id: 'msg-automation-1',
        role: 'user',
        text: 'Design an automation for warm inbound leads.',
        createdAt: new Date(now - 1000 * 60 * 245).toISOString(),
        attachments: [],
      },
      {
        id: 'msg-automation-2',
        role: 'assistant',
        text: [
          'Use a simple three-step workflow.',
          '1. Tag the lead source immediately.',
          '2. Send a value-first follow-up within 10 minutes.',
          '3. Trigger a reminder task if the lead has not replied after 24 hours.',
        ].join('\n'),
        createdAt: new Date(now - 1000 * 60 * 240).toISOString(),
        attachments: [],
      },
    ],
  },
]
