import { useEffect, useMemo, useState } from 'react'
import { weekTaskApi } from '../../api/weekTaskApi'
import { TaskAcceptanceBars, TaskHistoryLineChart } from '../visuals-parts'
import './Weektask.css'

function filterHistory(tasks, filterValue) {
  if (filterValue === 'created') {
    return tasks.filter((task) => task.status === 'created')
  }

  if (filterValue === 'completed') {
    return tasks.filter((task) => task.status === 'completed')
  }

  return tasks
}

function filterCreated(tasks, filterValue) {
  if (filterValue === 'accepted') {
    return tasks.filter((task) => task.accepted)
  }

  if (filterValue === 'declined') {
    return tasks.filter((task) => !task.accepted)
  }

  return tasks
}

function PendingCircle() {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="pendGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d6ea48" />
          <stop offset="100%" stopColor="#a8c91d" />
        </linearGradient>
      </defs>
      <circle
        cx="9"
        cy="9"
        r="7.2"
        stroke="url(#pendGrad)"
        strokeWidth="1.7"
        strokeDasharray="3.4 2.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CompletedCircle() {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" fill="none" aria-hidden="true">
      <defs>
        <filter id="ckGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#ckGlow)">
        <circle cx="9" cy="9" r="9" fill="#b5d42d" />
        <path d="M5.4 9.2 7.6 11.4 12.8 6.2" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

function DotGrid() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true">
      {[[4, 4], [8, 4], [12, 4], [4, 8], [8, 8], [12, 8], [4, 12], [8, 12], [12, 12]].map(([cx, cy]) => (
        <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="1.5" fill="rgba(255,255,255,0.9)" />
      ))}
    </svg>
  )
}

export default function WeekTask({ onClose }) {
  const [stats, setStats] = useState({ completed: 0, total: 0, completionRate: 0, tone: 'blue' })
  const [chartState, setChartState] = useState({ points: [], latest: 0, average: 0, tone: 'blue' })
  const [overviewMode, setOverviewMode] = useState('completed')
  const [chartRange, setChartRange] = useState('month')
  const [historyFilter, setHistoryFilter] = useState('completed')
  const [createdFilter, setCreatedFilter] = useState('accepted')
  const [allHistory, setAllHistory] = useState([])
  const [allCreated, setAllCreated] = useState([])
  const [createdSummary, setCreatedSummary] = useState({
    acceptedPct: 0,
    declinedPct: 0,
    acceptedCount: 0,
    declinedCount: 0,
    tone: 'blue',
    cells: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let dead = false

    ;(async () => {
      const [nextStats, nextHistory, nextCreated, nextSummary] = await Promise.all([
        weekTaskApi.getStats(),
        weekTaskApi.getTaskHistory(),
        weekTaskApi.getCreatedTasks(),
        weekTaskApi.getCreatedSummary(),
      ])

      if (dead) {
        return
      }

      setStats(nextStats)
      setAllHistory(nextHistory)
      setAllCreated(nextCreated)
      setCreatedSummary(nextSummary)
      setLoading(false)
    })()

    return () => {
      dead = true
    }
  }, [])

  useEffect(() => {
    let dead = false

    ;(async () => {
      const nextChartState = await weekTaskApi.getChartData(chartRange, overviewMode)
      if (!dead) {
        setChartState(nextChartState)
      }
    })()

    return () => {
      dead = true
    }
  }, [chartRange, overviewMode])

  const visibleHistory = useMemo(
    () => filterHistory(allHistory, historyFilter),
    [allHistory, historyFilter],
  )

  const visibleCreated = useMemo(
    () => filterCreated(allCreated, createdFilter).slice(0, 5),
    [allCreated, createdFilter],
  )

  const progressDash = `${(stats.completionRate || 0) * 1.005} 100.5`

  if (loading || chartState.points.length === 0) {
    return (
      <div className="wt-root">
        <div className="wt-panel wt-panel--loading">
          <div className="wt-loading"><div className="wt-spinner" /></div>
        </div>
      </div>
    )
  }

  return (
    <div className="wt-root">
      <div className={`wt-panel wt-panel--tone-${chartState.tone}`}>
        <div className="wt-header">
          <div className="wt-header-left">
            <div className="wt-progress-ring" aria-hidden="true">
              <svg viewBox="0 0 38 38" width="42" height="42">
                <circle cx="19" cy="19" r="16" fill="none" className="wt-progress-ring__track" strokeWidth="3.6" />
                <circle
                  cx="19"
                  cy="19"
                  r="16"
                  fill="none"
                  className="wt-progress-ring__value"
                  strokeWidth="3.6"
                  strokeDasharray={progressDash}
                  strokeLinecap="round"
                  transform="rotate(-90 19 19)"
                />
              </svg>
            </div>
            <p className="wt-header-title">Track your <strong>task</strong> history here</p>
          </div>
          <div className="wt-header-right">
            <span className={`wt-count-badge wt-count-badge--${stats.tone}`}>
              <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="5.6" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2.2 2.2" />
              </svg>
              {stats.completed}/{stats.total}
            </span>
            <button type="button" className="wt-close-btn" onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 18 18" width="13" height="13" fill="none" aria-hidden="true">
                <path d="M5.2 5.2 12.8 12.8M12.8 5.2 5.2 12.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
          <TaskHistoryLineChart data={chartState.points} tone={chartState.tone} />
        </div>

        <section className="wt-section">
          <div className="wt-section-head">
            <h2 className="wt-section-title">Task history</h2>
            <div className="wt-pills-right">
              {['all', 'created', 'completed'].map((filterValue) => (
                <button
                  key={filterValue}
                  type="button"
                  className={`wt-pill wt-pill--small ${historyFilter === filterValue ? 'active-blue' : ''}`}
                  onClick={() => setHistoryFilter(filterValue)}
                >
                  {filterValue[0].toUpperCase() + filterValue.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="wt-task-list">
            {visibleHistory.map((task, index) => (
              <div
                key={task.id}
                className={`wt-task-row wt-task-row--${task.tone}`}
                style={{ animationDelay: `${160 + index * 55}ms` }}
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

        <section className="wt-section wt-section--spaced">
          <div className="wt-section-head">
            <h2 className="wt-section-title">Created Tasks</h2>
            <div className="wt-pills-right">
              <button
                type="button"
                className={`wt-pill wt-pill--small ${createdFilter === 'all' ? 'active-blue' : ''}`}
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
          <TaskAcceptanceBars cells={createdSummary.cells} />
          <div className="wt-task-list wt-task-list--compact">
            {visibleCreated.map((task, index) => (
              <div
                key={task.id}
                className={`wt-task-row wt-task-row--compact wt-task-row--${task.tone}`}
                style={{ animationDelay: `${250 + index * 55}ms` }}
              >
                <span className="wt-check"><PendingCircle /></span>
                <span className="wt-task-title">{task.title}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="wt-actions">
          <button type="button" className="wt-btn decline" onClick={() => setCreatedFilter('declined')}>
            <span>DECLINE</span>
            <DotGrid />
          </button>
          <button type="button" className="wt-btn accept" onClick={() => setCreatedFilter('accepted')}>
            <span>ACCEPTED</span>
            <DotGrid />
          </button>
        </div>
      </div>
    </div>
  )
}
