export const systemMonitoringCardData = {
  title: 'System Monitoring',
  subtitle: 'Infrastructure health, load, and service reliability',
  status: 'Active',
  api: {
    pulse: '/api/infrastructure/pulse',
    globalMetrics: '/api/infrastructure/global-metrics',
    services: '/api/infrastructure/services',
    insight: '/api/insights/infrastructure',
  },
  pulseLabel: 'System pulse',
  pulseValue: 'Core services are healthy with one queue slowdown',
  panelTitle: 'Reasons',
  summaryMetrics: [
    {
      label: 'Uptime',
      value: '99.2%',
      columns: [
        { label: '14:00', value: '99.0%', count: 3 },
        { label: '14:10', value: '99.1%', count: 6 },
        { label: '14:20', value: '99.2%', count: 5 },
        { label: '14:30', value: '99.2%', count: 3 },
        { label: '14:40', value: '99.2%', count: 2 },
        { label: '14:50', value: '99.2%', count: 6 },
        { label: '15:00', value: '99.2%', count: 4 },
      ],
    },
    {
      label: 'Incidents',
      value: '1',
      columns: [
        { label: '14:00', value: '0', count: 4 },
        { label: '14:10', value: '1', count: 6 },
        { label: '14:20', value: '1', count: 3 },
        { label: '14:30', value: '1', count: 2 },
        { label: '14:40', value: '1', count: 5 },
        { label: '14:50', value: '1', count: 4 },
        { label: '15:00', value: '1', count: 3 },
      ],
    },
    {
      label: 'Avg. latency',
      value: '346ms',
      columns: [
        { label: '14:00', value: '282ms', count: 5 },
        { label: '14:10', value: '310ms', count: 7 },
        { label: '14:20', value: '346ms', count: 4 },
        { label: '14:30', value: '328ms', count: 3 },
        { label: '14:40', value: '362ms', count: 6 },
        { label: '14:50', value: '344ms', count: 5 },
        { label: '15:00', value: '346ms', count: 4 },
      ],
    },
  ],
  healthTitle: 'Service health',
  healthMeta: 'Uptime + latency',
  services: [
    { label: 'Content Engine', note: 'Healthy', noteTone: 'healthy', uptime: '99.8%', latency: '180ms', healthScore: 4 },
    { label: 'Publishing API', note: 'Stable', noteTone: 'stable', uptime: '98.9%', latency: '320ms', healthScore: 4 },
    { label: 'Automation Queue', note: 'Slow', noteTone: 'slow', uptime: '97.6%', latency: '540ms', healthScore: 4 },
  ],
  insight: 'Automation Queue latency is peaking under heavier payload batches. Split large jobs and stagger retries to keep queue processing stable.',
  ctaLabel: 'Ask or assign Anything',
}

export const taskExecutionCardData = {
  title: 'Task Execution',
  subtitle: 'Live task activity, progress, and outcomes',
  status: 'Active',
  api: {
    activity: '/api/tasks/activity',
    queueSummary: '/api/tasks/summary',
    activeTasks: '/api/tasks/active',
    insight: '/api/insights/task-execution',
  },
  stats: [
    { label: 'Running', value: '2', tone: 'green' },
    { label: 'Queued', value: '2', tone: 'green' },
    { label: 'Completed', value: '18', tone: 'green' },
    { label: 'Stuck', value: '11', tone: 'red' },
    { label: 'Closed', value: '10', tone: 'green' },
  ],
  tasksTitle: 'Active tasks',
  tasksMeta: 'Progress',
  tasks: [
    { label: 'Generating post visuals', progress: '72%', activeBlocks: 4, totalBlocks: 5 },
    { label: 'Publishing Instagram batch', progress: '48%', activeBlocks: 4, totalBlocks: 5 },
  ],
  insight: 'Visual generation is completing on schedule, but publishing jobs are waiting on downstream queue availability. Release queue pressure before expanding batch size.',
  ctaLabel: 'Ask or assign Anything',
}

export const workflowAutomationCardData = {
  title: 'Workflow Automation',
  subtitle: 'Automated flows, triggers, and execution chains',
  status: 'Active',
  api: {
    pulse: '/api/workflows/pulse',
    chains: '/api/workflows/chains',
    insight: '/api/insights/workflow-automation',
  },
  pulseLabel: 'Automation pulse',
  pulseValue: 'Workflows are executing normally',
  chainsTitle: 'Workflow chains',
  chainsMeta: 'Trigger + progress',
  workflows: [
    { label: 'Social post pipeline', note: 'Trigger', state: 'Running', result: 'Caption approved', blocks: [1, 1, 1, 1, 0.36], tone: 'running' },
    { label: 'Lead follow-up sequence', note: 'Trigger', state: 'Queued', result: 'Form submitted', blocks: [1, 1, 0.28, 0.28, 0.28], tone: 'queued' },
    { label: 'Organic Search', note: 'Trigger', state: 'Scheduled', result: 'Every Monday', blocks: [1, 1, 1, 0.28, 0.28], tone: 'scheduled' },
  ],
  insight: 'The publishing chain is healthy, but queued follow-up sequences are waiting on form events. Keep trigger validation tight to avoid idle workflow slots.',
  ctaLabel: 'Ask or assign Anything',
}

export const automationExecutionCardData = {
  title: 'Automation & Execution',
  subtitle: 'Workflows and execution',
  status: 'Active',
  api: {
    state: '/api/automation/state',
    lanes: '/api/automation/lanes',
    progress: '/api/automation/progress',
    insight: '/api/insights/automation-execution',
  },
  stateLabel: 'System State',
  stateValue: '3 Workflow Running',
  gauge: {
    progress: 0.7,
    label: '70% In Progress',
    sublabel: 'Workflow status',
  },
  laneTitle: 'Execution lane',
  lanes: [
    { label: 'High Intent', value: '65%', tone: 'green', active: 13, total: 20 },
    { label: 'Campaign Launch', value: '80%', tone: 'blue', active: 16, total: 20 },
    { label: 'Audience Sync', value: '35%', tone: 'orange', active: 7, total: 20 },
  ],
  insight: 'Core automations are progressing well, but audience-sync work is trailing behind launch and intent lanes. Rebalance queue priority before the next batch window.',
  ctaLabel: 'Ask or assign Anything',
}
