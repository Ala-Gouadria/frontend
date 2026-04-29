import {
  WEEK_TASK_CHART_DATASETS,
  WEEK_TASK_CREATED,
  WEEK_TASK_HISTORY,
  WEEK_TASK_STATS,
  WEEK_TASK_THRESHOLDS,
} from './weekTaskMockData'

function delay(ms) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms))
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getTone(score) {
  if (score <= WEEK_TASK_THRESHOLDS.low) {
    return 'red'
  }

  if (score >= WEEK_TASK_THRESHOLDS.high) {
    return 'green'
  }

  return 'blue'
}

function withTone(item) {
  return {
    ...item,
    tone: getTone(item.score ?? 0),
  }
}

function buildChartPayload(points = []) {
  const latest = points.at(-1) ?? 0
  const average = points.length
    ? Math.round(points.reduce((sum, point) => sum + point, 0) / points.length)
    : 0

  return {
    points,
    latest,
    average,
    tone: getTone(latest),
  }
}

function buildStatsPayload() {
  const completionRate = WEEK_TASK_STATS.total
    ? Math.round((WEEK_TASK_STATS.completed / WEEK_TASK_STATS.total) * 100)
    : 0

  return {
    ...WEEK_TASK_STATS,
    completionRate,
    score: clamp(completionRate, 0, 100),
    tone: getTone(completionRate),
  }
}

function buildCreatedSummary(tasks) {
  const accepted = tasks.filter((task) => task.accepted)
  const declined = tasks.filter((task) => !task.accepted)
  const total = tasks.length || 1
  const acceptedPct = Math.round((accepted.length / total) * 100)
  const declinedPct = 100 - acceptedPct

  return {
    acceptedCount: accepted.length,
    declinedCount: declined.length,
    acceptedPct,
    declinedPct,
    tone: getTone(acceptedPct),
    cells: Array.from({ length: 20 }, (_, index) => ({
      id: `cell-${index + 1}`,
      tone: index < Math.round((acceptedPct / 100) * 20) ? 'green' : 'red',
    })),
  }
}

export const weekTaskApi = {
  async getStats() {
    await delay(260)
    return buildStatsPayload()
  },

  async getChartData(range = 'today', mode = 'completed') {
    await delay(180)
    return buildChartPayload(
      WEEK_TASK_CHART_DATASETS[mode]?.[range] ?? WEEK_TASK_CHART_DATASETS.completed.today,
    )
  },

  async getTaskHistory() {
    await delay(220)
    return WEEK_TASK_HISTORY.map(withTone)
  },

  async getCreatedTasks() {
    await delay(220)
    return WEEK_TASK_CREATED.map(withTone)
  },

  async getCreatedSummary() {
    await delay(160)
    return buildCreatedSummary(WEEK_TASK_CREATED)
  },
}
