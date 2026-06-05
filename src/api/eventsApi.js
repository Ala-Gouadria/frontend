// TODO(backend): no upstream endpoint — this module stays mock until an events service is built
const EVENT_TYPES = [
  'Website and Traffic',
  'Automation and Execution',
  'Social Media',
  'Analytics',
  'Sales and Leads',
  'Strategy and Intelligence',
]

const EVENT_SEVERITIES = ['Low', 'Medium', 'High', 'Critical']
const EVENT_STATUSES = ['Received', 'Processing', 'Processed', 'Blocked']
const EVENT_AGENTS = [
  'Automation Agent',
  'Traffic Agent',
  'Analytics Agent',
  'Social Agent',
  'Sales Agent',
  'Strategy Agent',
]

const EVENTS = [
  {
    id: 'evt-1001',
    title: 'Traffic spike detected from LinkedIn campaign',
    description: 'Nora detected website sessions increased by 42% in 30 minutes.',
    type: 'Website and Traffic',
    severity: 'Medium',
    status: 'Processed',
    agent: 'Automation Agent',
    time: '15 min ago',
    detected: 'Nora detected website sessions increased by 42% in 30 minutes.',
    reasoning: 'The spike is high quality because traffic is concentrated on the pricing and demo pages.',
    impact: 'Demo interest increased while checkout intent stayed stable.',
    trail: [
      { label: 'Received', detail: 'Event received by Nora', state: 'done' },
      { label: 'Validated', detail: 'LinkedIn source and landing page quality checked', state: 'done' },
      { label: 'Processed', detail: 'Current event state', state: 'current' },
    ],
  },
  {
    id: 'evt-1002',
    title: 'Automation workflow waiting for CRM access',
    description: 'Lead sync cannot complete until the CRM integration is reauthorized.',
    type: 'Automation and Execution',
    severity: 'Critical',
    status: 'Processing',
    agent: 'Automation Agent',
    time: '22 min ago',
    detected: 'Nora found that the CRM token expired during lead routing.',
    reasoning: 'Continuing without valid access could create incomplete or duplicated actions.',
    impact: 'New leads may remain unassigned until the connection is restored.',
    trail: [
      { label: 'Received', detail: 'Event received by Nora', state: 'done' },
      { label: 'Access check', detail: 'CRM token validation failed', state: 'done' },
      { label: 'Processing', detail: 'Current event state', state: 'current' },
    ],
  },
  {
    id: 'evt-1003',
    title: 'Checkout drop-off above expected range',
    description: 'Mobile checkout completion fell below the weekly benchmark.',
    type: 'Website and Traffic',
    severity: 'High',
    status: 'Blocked',
    agent: 'Traffic Agent',
    time: '31 min ago',
    detected: 'Mobile checkout completion dropped 18% below the weekly baseline.',
    reasoning: 'The payment step has increased rage-clicks and repeated form submissions.',
    impact: 'Revenue conversion may soften until the payment step is reviewed.',
    trail: [
      { label: 'Received', detail: 'Event received by Nora', state: 'done' },
      { label: 'Investigated', detail: 'Payment step behavior analyzed', state: 'done' },
      { label: 'Blocked', detail: 'Current event state', state: 'current' },
    ],
  },
  {
    id: 'evt-1004',
    title: 'Instagram post outperforming baseline',
    description: 'Audience saves and shares are above the previous 14 day average.',
    type: 'Social Media',
    severity: 'Low',
    status: 'Processed',
    agent: 'Social Agent',
    time: '44 min ago',
    detected: 'Nora detected 2.6x more saves than the normal post baseline.',
    reasoning: 'The hook and proof section are drawing stronger audience intent.',
    impact: 'This topic can be reused as a carousel, short video, and email angle.',
    trail: [
      { label: 'Received', detail: 'Event received by Nora', state: 'done' },
      { label: 'Pattern found', detail: 'Engagement type and audience segment matched', state: 'done' },
      { label: 'Processed', detail: 'Current event state', state: 'current' },
    ],
  },
  {
    id: 'evt-1005',
    title: 'Paid search cost per lead increased',
    description: 'Google Ads CPL rose while conversion volume stayed flat.',
    type: 'Analytics',
    severity: 'High',
    status: 'Processed',
    agent: 'Analytics Agent',
    time: '1 hr ago',
    detected: 'Nora detected a 24% CPL increase across paid search campaigns.',
    reasoning: 'Spend shifted toward lower intent terms without a matching conversion lift.',
    impact: 'Budget efficiency is at risk if the keyword mix remains unchanged.',
    trail: [
      { label: 'Received', detail: 'Event received by Nora', state: 'done' },
      { label: 'Benchmarked', detail: 'Campaign spend and lead quality compared', state: 'done' },
      { label: 'Processed', detail: 'Current event state', state: 'current' },
    ],
  },
  {
    id: 'evt-1006',
    title: 'High intent lead opened proposal twice',
    description: 'A qualified prospect re-engaged with the pricing proposal.',
    type: 'Sales and Leads',
    severity: 'Medium',
    status: 'Processing',
    agent: 'Sales Agent',
    time: '1 hr ago',
    detected: 'Nora detected repeat proposal views from a high score lead.',
    reasoning: 'Repeated pricing review often indicates decision stage intent.',
    impact: 'A fast follow-up could improve close probability.',
    trail: [
      { label: 'Received', detail: 'Event received by Nora', state: 'done' },
      { label: 'Scored', detail: 'Lead intent increased from 72 to 86', state: 'done' },
      { label: 'Processing', detail: 'Current event state', state: 'current' },
    ],
  },
  {
    id: 'evt-1007',
    title: 'Competitor launched a discount campaign',
    description: 'Nora found new competitor messaging across social and landing pages.',
    type: 'Strategy and Intelligence',
    severity: 'Medium',
    status: 'Received',
    agent: 'Strategy Agent',
    time: '2 hrs ago',
    detected: 'A competitor is promoting a temporary discount to your target segment.',
    reasoning: 'The offer overlaps with your acquisition audience and could affect paid response.',
    impact: 'Messaging should reinforce proof and value instead of matching the discount.',
    trail: [
      { label: 'Received', detail: 'Current event state', state: 'current' },
    ],
  },
  {
    id: 'evt-1008',
    title: 'Newsletter clicks shifted toward case studies',
    description: 'Case study links captured most of the engagement in the latest send.',
    type: 'Analytics',
    severity: 'Low',
    status: 'Processed',
    agent: 'Analytics Agent',
    time: '2 hrs ago',
    detected: 'Nora detected 61% of email clicks went to proof and case study content.',
    reasoning: 'The audience is engaging more with validation than educational content.',
    impact: 'Next campaigns should bring customer proof higher in the message.',
    trail: [
      { label: 'Received', detail: 'Event received by Nora', state: 'done' },
      { label: 'Processed', detail: 'Current event state', state: 'current' },
    ],
  },
  {
    id: 'evt-1009',
    title: 'Scheduled campaign publish failed',
    description: 'The LinkedIn post queue could not publish because media upload timed out.',
    type: 'Social Media',
    severity: 'Critical',
    status: 'Blocked',
    agent: 'Social Agent',
    time: '3 hrs ago',
    detected: 'Nora detected that a scheduled LinkedIn asset failed during upload.',
    reasoning: 'The campaign cannot continue until the asset is reattached or regenerated.',
    impact: 'Publishing consistency may be affected for the current campaign day.',
    trail: [
      { label: 'Received', detail: 'Event received by Nora', state: 'done' },
      { label: 'Upload failed', detail: 'Media host returned a timeout', state: 'done' },
      { label: 'Blocked', detail: 'Current event state', state: 'current' },
    ],
  },
  {
    id: 'evt-1010',
    title: 'Landing page speed recovered',
    description: 'The product page returned to the expected load-time range.',
    type: 'Website and Traffic',
    severity: 'Low',
    status: 'Processed',
    agent: 'Traffic Agent',
    time: '4 hrs ago',
    detected: 'Nora detected product page load time improved from 4.8s to 2.1s.',
    reasoning: 'The recovery followed image compression and cache refresh events.',
    impact: 'Traffic quality and conversion signals can be interpreted normally again.',
    trail: [
      { label: 'Received', detail: 'Event received by Nora', state: 'done' },
      { label: 'Recovered', detail: 'Speed returned to baseline', state: 'done' },
      { label: 'Processed', detail: 'Current event state', state: 'current' },
    ],
  },
  {
    id: 'evt-1011',
    title: 'Audience segment ready for retargeting',
    description: 'Nora found enough high-intent visitors to start a retargeting sequence.',
    type: 'Automation and Execution',
    severity: 'Medium',
    status: 'Processing',
    agent: 'Automation Agent',
    time: '5 hrs ago',
    detected: 'A retargeting audience crossed the minimum activation threshold.',
    reasoning: 'Visitors viewed pricing or demo content but did not convert.',
    impact: 'Launching a proof-led sequence could recover lost intent.',
    trail: [
      { label: 'Received', detail: 'Event received by Nora', state: 'done' },
      { label: 'Segment built', detail: 'Audience reached activation threshold', state: 'done' },
      { label: 'Processing', detail: 'Current event state', state: 'current' },
    ],
  },
  {
    id: 'evt-1012',
    title: 'Pipeline response time slipped',
    description: 'Average first response time moved outside the service target.',
    type: 'Sales and Leads',
    severity: 'High',
    status: 'Received',
    agent: 'Sales Agent',
    time: '6 hrs ago',
    detected: 'Nora detected first response time increased to 3 hours 18 minutes.',
    reasoning: 'Lead intent decays quickly when the first follow-up is delayed.',
    impact: 'The sales team should review assignment load and handoff timing.',
    trail: [
      { label: 'Received', detail: 'Current event state', state: 'current' },
    ],
  },
]

function delay(ms) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms))
}

function cloneEvent(event) {
  return {
    ...event,
    trail: event.trail.map((item) => ({ ...item })),
  }
}

export const eventsApi = {
  async listEvents() {
    await delay(160)
    return EVENTS.map(cloneEvent)
  },

  async getEventFilters() {
    await delay(80)
    return {
      types: [...EVENT_TYPES],
      severities: [...EVENT_SEVERITIES],
      statuses: [...EVENT_STATUSES],
      agents: [...EVENT_AGENTS],
    }
  },
}
