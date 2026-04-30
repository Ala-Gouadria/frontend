import { useEffect, useMemo, useState } from 'react'
import { weekTaskApi } from '../../api/weekTaskApi'
import './Weektask.css'

const TONE_COLORS = {
  green: {
    fillTop: 'rgba(176,211,28,0.34)',
    fillMid: 'rgba(176,211,28,0.11)',
    lineGlow: 'rgba(160,200,20,0.18)',
    line: '#9fbe18',
    badge: '#b5d42d',
  },
  red: {
    fillTop: 'rgba(238,100,98,0.30)',
    fillMid: 'rgba(238,100,98,0.10)',
    lineGlow: 'rgba(238,100,98,0.20)',
    line: '#ef6a66',
    badge: '#ef6a66',
  },
  blue: {
    fillTop: 'rgba(91,152,255,0.30)',
    fillMid: 'rgba(91,152,255,0.10)',
    lineGlow: 'rgba(91,152,255,0.18)',
    line: '#5b98ff',
    badge: '#5b98ff',
  },
}

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

function SparklineChart({ data, tone = 'green' }) {
  if (!data || data.length < 2) {
    return null
  }

  const palette = TONE_COLORS[tone] ?? TONE_COLORS.green
  const width = 420
  const height = 96
  const paddingX = 0
  const paddingTop = 6
  const paddingBottom = 18
  const min = Math.min(...data)
  const max = Math.max(...data)
  const usableWidth = width - paddingX * 2
  const usableHeight = height - paddingTop - paddingBottom
  const step = usableWidth / (data.length - 1)
  const normalizeY = (value) => (
    max === min
      ? paddingTop + usableHeight / 2
      : paddingTop + usableHeight - ((value - min) / (max - min)) * usableHeight
  )

  const points = data.map((value, index) => ({
    x: paddingX + index * step,
    y: normalizeY(value),
    value,
  }))

  const linePath = points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`
    }

    const previous = points[index - 1]
    const controlX = (previous.x + point.x) / 2
    return `${path} C ${controlX} ${previous.y} ${controlX} ${point.y} ${point.x} ${point.y}`
  }, '')

  const areaPath = `${linePath} L ${points.at(-1).x} ${height - 2} L ${points[0].x} ${height - 2} Z`
  const badgeIndex = Math.max(data.length - 7, 1)
  const badgePoint = points[badgeIndex]
  const endPoint = points.at(-1)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="wt-sparkline" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="wtFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.fillTop} />
          <stop offset="62%" stopColor={palette.fillMid} />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <filter id="wtLineGlow" x="-20%" y="-80%" width="140%" height="260%">
          <feGaussianBlur stdDeviation="2.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="wtBadgeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path d={areaPath} fill="url(#wtFill)" className="wt-chart-area" />

      <path
        d={linePath}
        pathLength="100"
        fill="none"
        stroke={palette.lineGlow}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#wtLineGlow)"
        className="wt-chart-line"
        style={{ animationDelay: '2ms' }}
      />
      <path
        d={linePath}
        pathLength="100"
        fill="none"
        stroke={palette.line}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="wt-chart-line"
      />

      <g transform={`translate(${badgePoint.x},${badgePoint.y})`} filter="url(#wtBadgeGlow)">
        <g className="wt-chart-badge">
          <circle r="12" fill={palette.badge} />
          <text y="4.5" textAnchor="middle" className="wt-chart-badge-text">{badgePoint.value}</text>
        </g>
      </g>

      <circle cx={endPoint.x} cy={endPoint.y} r="6" fill="rgba(255,255,255,0.95)" className="wt-chart-end-ring" />
      <circle cx={endPoint.x} cy={endPoint.y} r="3.2" fill={palette.line} className="wt-chart-end-dot" />
    </svg>
  )
}

function AcceptanceBar({ cells }) {
  return (
    <div className="wt-accept-bar" aria-hidden="true">
      {cells.map((cell, index) => (
        <span
          key={cell.id}
          className={`wt-accept-cell ${cell.tone}`}
          style={{ animationDelay: `${160 + index * 30}ms` }}
        />
      ))}
    </div>
  )
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
          <SparklineChart data={chartState.points} tone={chartState.tone} />
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
          <AcceptanceBar cells={createdSummary.cells} />
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
