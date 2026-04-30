import { useEffect, useMemo, useState } from 'react'

import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import { activityLogApi } from '../../api/activityLogApi'
import ActivityLogView from './activityLogView'
import './activityLog.css'

const LOG_FILTERS = ['All', 'Today', 'Yesterday', 'This Month', 'Successful', 'Failed']
const SUMMARY = [
  { label: 'Total Actions', value: 18, tone: 'blue' },
  { label: 'Pending approval', value: 7, tone: 'blue' },
  { label: 'Totals Fails', value: 5, tone: 'red' },
]

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="8.7" cy="8.7" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="m12.6 12.6 3.2 3.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3.5 5.2h13L11.4 11v4.1l-2.8 1.4V11L3.5 5.2Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function ExportIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <rect x="3.5" y="3.5" width="13" height="13" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6.3v6M7.6 9.9 10 12.3l2.4-2.4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.4 12s3.1-5.2 8.6-5.2 8.6 5.2 8.6 5.2-3.1 5.2-8.6 5.2S3.4 12 3.4 12Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export default function ActivityLog({ onNavigate }) {
  const [logs, setLogs] = useState([])
  const [filter, setFilter] = useState('This Month')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All Status')
  const [selectedLog, setSelectedLog] = useState(null)

  useEffect(() => {
    let isMounted = true

    activityLogApi.listLogs().then((items) => {
      if (isMounted) {
        setLogs(items)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const visibleLogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return logs.filter((log) => {
      const matchesQuery = !normalizedQuery
        || log.title.toLowerCase().includes(normalizedQuery)
        || log.department.toLowerCase().includes(normalizedQuery)
      const matchesFilter = filter === 'All'
        || filter === 'This Month'
        || filter === log.status
        || filter === 'Today'
        || filter === 'Yesterday'
      const matchesStatus = status === 'All Status' || log.status === status

      return matchesQuery && matchesFilter && matchesStatus
    })
  }, [filter, logs, query, status])

  const exportCsv = () => {
    const header = 'Title,Time,Department,Type,Impact,Status'
    const rows = visibleLogs.map((log) => [
      log.title,
      log.time,
      log.department,
      log.type,
      log.impact,
      log.status,
    ].map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'activity-log.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className={`activity-log-page ${selectedLog ? 'activity-log-page--viewing' : ''}`}>
      <Photo />
      <MainNav activeId="chat" onSelect={onNavigate} />
      <ProjectList onNavigate={onNavigate} />

      <section className="activity-log-content" aria-hidden={selectedLog ? 'true' : undefined}>
        <header className="activity-log-header">
          <h1>ACTIVITY LOG</h1>
          <p>Review everything Nora has created, published, executed, or changed across content, strategy, automation, and analytics.</p>
        </header>

        <div className="activity-log-divider" />

        <div className="activity-log-topbar">
          <div className="activity-log-filter-group">
            <strong>Logs</strong>
            <div className="activity-log-tabs">
              {LOG_FILTERS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={filter === item ? 'activity-log-tabs__button activity-log-tabs__button--active' : 'activity-log-tabs__button'}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="activity-log-summary">
            <strong>Summary Today</strong>
            <div className="activity-log-summary__pills">
              {SUMMARY.map((item) => (
                <span key={item.label} className={`activity-log-summary__pill activity-log-summary__pill--${item.tone}`}>
                  {item.label}
                  <b>{item.value}</b>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="activity-log-controls">
          <label className="activity-log-search">
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search log, campaign, posts, workflows..."
            />
          </label>

          <button type="button" className="activity-log-filter-button">
            <span>Apply Filters</span>
            <FilterIcon />
          </button>

          <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">
            <option>All Status</option>
            <option>Successful</option>
            <option>Failed</option>
          </select>

          <button type="button" className="activity-log-export" onClick={exportCsv}>
            <ExportIcon />
            <span>EXPORT AS CSV</span>
          </button>
        </div>

        <div className="activity-log-table-wrap">
          <table className="activity-log-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Time</th>
                <th>Department</th>
                <th>Type</th>
                <th>Impact</th>
                <th>Status</th>
                <th>View Detail</th>
              </tr>
            </thead>
            <tbody>
              {visibleLogs.map((log, index) => (
                <tr key={log.id} style={{ '--log-delay': `${index * 28}ms` }}>
                  <td>{log.title}</td>
                  <td>{log.time}</td>
                  <td>{log.department}</td>
                  <td><span className="activity-log-type">{log.type}</span></td>
                  <td>{log.impact}</td>
                  <td>
                    <span className={`activity-log-status activity-log-status--${log.status.toLowerCase()}`}>
                      {log.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="activity-log-eye"
                      onClick={() => setSelectedLog(log)}
                      aria-label={`View ${log.title}`}
                    >
                      <EyeIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedLog ? <ActivityLogView log={selectedLog} onBack={() => setSelectedLog(null)} /> : null}
      <BottomAIStatusTools />
    </main>
  )
}
