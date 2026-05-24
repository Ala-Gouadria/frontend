import { useEffect, useMemo, useState } from 'react'
import { weekTaskApi } from '../../api/weekTaskApi'
import {
  WEEK_TASK_CHART_DATASETS,
  WEEK_TASK_CREATED,
  WEEK_TASK_HISTORY,
  WEEK_TASK_STATS,
} from '../../api/weekTaskMockData'
import { QualityBlocks, TaskHistoryLineChart } from '../visuals-parts'
import PillButton from '../pages-parts/PillButton'
import './Weektask.css'

function filterHistory(tasks, filterValue) {
  if (filterValue === 'created') return tasks.filter((task) => task.status === 'created')
  if (filterValue === 'completed') return tasks.filter((task) => task.status === 'completed')
  return tasks
}

function filterCreated(tasks, filterValue) {
  if (filterValue === 'accepted') return tasks.filter((task) => task.accepted)
  if (filterValue === 'declined') return tasks.filter((task) => !task.accepted)
  return tasks
}

// Convert cells array from API to QualityBlocks groups format
function cellsToBlocks(cells = []) {
  const groups = {}
  cells.forEach((cell) => {
    const tone = cell.tone ?? 'green'
    if (!groups[tone]) groups[tone] = 0
    groups[tone]++
  })
  return Object.entries(groups).map(([tone, count]) => ({ tone, count }))
}

function createFallbackSummary() {
  const acceptedCount = WEEK_TASK_CREATED.filter((task) => task.accepted).length
  const declinedCount = WEEK_TASK_CREATED.length - acceptedCount
  const acceptedPct = Math.round((acceptedCount / WEEK_TASK_CREATED.length) * 100)

  return {
    acceptedCount,
    declinedCount,
    acceptedPct,
    declinedPct: 100 - acceptedPct,
    cells: WEEK_TASK_CREATED.map((task) => ({
      id: `fallback-cell-${task.id}`,
      tone: task.accepted ? 'green' : 'red',
    })),
  }
}

function isEmptyStats(nextStats) {
  return !nextStats || ((nextStats.total ?? 0) === 0 && (nextStats.completed ?? 0) === 0)
}

function isEmptyChart(nextChartState) {
  return !Array.isArray(nextChartState?.points)
    || nextChartState.points.length < 2
    || nextChartState.points.every((point) => Number(point) === 0)
}

function normalizeHistoryTask(task, index) {
  return {
    status: task.status ?? (task.completedAt ? 'completed' : 'created'),
    time: task.time ?? task.completedAgo ?? task.createdAgo ?? `${index + 1}m ago`,
    ...task,
  }
}

function PendingCircle() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
      <circle
        cx="10"
        cy="10"
        r="7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CompletedCircle() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <path d="m6 10.2 2.3 2.25L14 7" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function WeekTask({ onClose }) {
  const [stats, setStats] = useState({ completed: 0, total: 0, completionRate: 0 })
  const [chartState, setChartState] = useState({ points: [], latest: 0 })
  const [overviewMode, setOverviewMode] = useState('completed')
  const [chartRange, setChartRange] = useState('today')
  const [historyFilter, setHistoryFilter] = useState('completed')
  const [createdFilter, setCreatedFilter] = useState('accepted')
  const [allHistory, setAllHistory] = useState([])
  const [allCreated, setAllCreated] = useState([])
  const [createdSummary, setCreatedSummary] = useState({
    acceptedPct: 0,
    declinedPct: 0,
    cells: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const [nextStats, nextHistory, nextCreated, nextSummary] = await Promise.all([
        weekTaskApi.getStats(),
        weekTaskApi.getTaskHistory(),
        weekTaskApi.getCreatedTasks(),
        weekTaskApi.getCreatedSummary(),
      ])

      if (cancelled) return

      setStats(isEmptyStats(nextStats) ? {
        ...WEEK_TASK_STATS,
        completionRate: Math.round((WEEK_TASK_STATS.completed / WEEK_TASK_STATS.total) * 100),
      } : nextStats)
      setAllHistory(nextHistory.length ? nextHistory.map(normalizeHistoryTask) : WEEK_TASK_HISTORY)
      setAllCreated(nextCreated.length ? nextCreated : WEEK_TASK_CREATED)
      setCreatedSummary(nextSummary.cells?.length ? nextSummary : createFallbackSummary())
      setLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const nextChartState = await weekTaskApi.getChartData(chartRange, overviewMode)
      if (!cancelled) {
        setChartState(isEmptyChart(nextChartState)
          ? {
              points: WEEK_TASK_CHART_DATASETS[overviewMode][chartRange],
              latest: WEEK_TASK_CHART_DATASETS[overviewMode][chartRange].at(-1),
              average: 28,
              tone: 'green',
            }
          : nextChartState)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [chartRange, overviewMode])

  const visibleHistory = useMemo(() => {
    const filtered = filterHistory(allHistory, historyFilter)
    return historyFilter === 'completed' ? allHistory.slice(0, 6) : filtered.slice(0, 6)
  }, [allHistory, historyFilter])

  const visibleCreated = useMemo(
    () => filterCreated(allCreated, createdFilter).slice(0, 5),
    [allCreated, createdFilter],
  )

  const qualityBlocks = useMemo(
    () => cellsToBlocks(createdSummary.cells),
    [createdSummary.cells],
  )

  const progressDash = `${(stats.completionRate || 0) * 1.005} 100.5`

  if (loading || chartState.points.length === 0) {
    return (
      <div className="wt-root">
        <div className="wt-panel wt-panel--loading">
          <div className="wt-spinner" />
        </div>
      </div>
    )
  }

  return (
    <div className="wt-root">
      <div className="wt-panel">
        <div className="wt-header">
          <div className="wt-header-left">
            <div className="wt-progress-ring" aria-hidden="true">
              <svg viewBox="0 0 38 38">
                <circle cx="19" cy="19" r="15.2" fill="none" className="wt-progress-ring__track" strokeWidth="3.8" />
                <circle
                  cx="19"
                  cy="19"
                  r="15.2"
                  fill="none"
                  className="wt-progress-ring__value"
                  strokeWidth="3.8"
                  strokeDasharray={progressDash}
                  strokeLinecap="round"
                  transform="rotate(-90 19 19)"
                />
              </svg>
            </div>
            <p className="wt-header-title">Track your task history here</p>
          </div>
          <div className="wt-header-right">
            <span className="wt-count-badge">
              <span className="wt-count-dot" aria-hidden="true" />
              {stats.completed}/{stats.total}
            </span>
            <button type="button" className="wt-close-btn" onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 18 18" width="12" height="12" fill="none" aria-hidden="true">
                <path d="M5.3 5.3 12.7 12.7M12.7 5.3 5.3 12.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="wt-toolbar">
          <div className="wt-pill-row">
            <button
              type="button"
              className={`wt-pill ${overviewMode === 'created' ? 'active-light' : ''}`}
              onClick={() => setOverviewMode('created')}
            >
              Created
            </button>
            <button
              type="button"
              className={`wt-pill ${overviewMode === 'completed' ? 'active-blue' : ''}`}
              onClick={() => setOverviewMode('completed')}
            >
              Completed
            </button>
          </div>
          <div className="wt-pill-row">
            {['month', 'week', 'today'].map((range) => (
              <button
                key={range}
                type="button"
                className={`wt-pill ${chartRange === range ? 'active-dark' : ''}`}
                onClick={() => setChartRange(range)}
              >
                {range[0].toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="wt-chart-card">
          <TaskHistoryLineChart
            data={chartState.points}
            tone="green"
            className="wt-history-chart"
          />
          <span className="wt-chart-badge">{chartState.average}</span>
        </div>

        <section className="wt-section">
          <div className="wt-section-head">
            <h2 className="wt-section-title">Task history</h2>
            <div className="wt-pills-right">
              {['all', 'created', 'completed'].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`wt-pill wt-pill--small ${historyFilter === filter ? 'active-blue' : ''}`}
                  onClick={() => setHistoryFilter(filter)}
                >
                  {filter[0].toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="wt-task-list">
            {visibleHistory.map((task, index) => (
              <div
                key={task.id}
                className={`wt-task-row wt-task-row--${task.status}`}
                style={{ animationDelay: `${120 + index * 35}ms` }}
              >
                <span className="wt-check">
                  {task.status === 'completed' ? <CompletedCircle /> : <PendingCircle />}
                </span>
                <div className="wt-task-info">
                  <span className="wt-task-title">{task.title}</span>
                  <span className="wt-task-time">
                    {task.status === 'completed' ? `Completed ${task.time}` : `Created ${task.time}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="wt-section wt-section--created">
          <div className="wt-section-head">
            <h2 className="wt-section-title">Created Tasks</h2>
            <div className="wt-pills-right">
              <button
                type="button"
                className={`wt-pill wt-pill--small ${createdFilter === 'all' ? 'active-light' : ''}`}
                onClick={() => setCreatedFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`wt-pill wt-pill--small ${createdFilter === 'accepted' ? 'active-green' : ''}`}
                onClick={() => setCreatedFilter('accepted')}
              >
                Accepted
              </button>
              <button
                type="button"
                className={`wt-pill wt-pill--small ${createdFilter === 'declined' ? 'active-red' : 'wt-pill--danger-text'}`}
                onClick={() => setCreatedFilter('declined')}
              >
                Declined
              </button>
            </div>
          </div>

          <div className="wt-legend">
            <span className="wt-legend-item">
              <span className="wt-legend-dot green" />
              <span className="wt-legend-label">Accepted</span>
              <span className="wt-legend-value">{createdSummary.acceptedPct}%</span>
            </span>
            <span className="wt-legend-item">
              <span className="wt-legend-dot red" />
              <span className="wt-legend-label">Declined</span>
              <span className="wt-legend-value">{createdSummary.declinedPct}%</span>
            </span>
          </div>

          <QualityBlocks
            blocks={qualityBlocks}
            className="wt-quality-blocks"
          />

          <div className="wt-task-list wt-task-list--created">
            {visibleCreated.map((task, index) => (
              <div
                key={task.id}
                className="wt-task-row wt-task-row--created"
                style={{ animationDelay: `${220 + index * 35}ms` }}
              >
                <span className="wt-check"><PendingCircle /></span>
                <span className="wt-task-title">{task.title}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="wt-actions">
          <div className="wt-pill-btn-wrap wt-pill-btn-wrap--decline">
            <PillButton width="100%" height="40px" compact onClick={() => setCreatedFilter('declined')}>
              DECLINE
            </PillButton>
          </div>
          <div className="wt-pill-btn-wrap wt-pill-btn-wrap--accept">
            <PillButton width="100%" height="40px" compact onClick={() => setCreatedFilter('accepted')}>
              ACCEPTED
            </PillButton>
          </div>
        </div>
      </div>
    </div>
  )
}
