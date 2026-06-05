import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import { activityLogApi } from '../../api/activityLogApi'
import ActivityLogView from './activityLogView'
import './activityLog.css'

const LOG_FILTERS = ['All', 'Today', 'Yesterday', 'This Month', 'Successful', 'Failed']

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
  const { t } = useTranslation()
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

  const filterLabel = (key) => {
    const map = {
      All: t('activityLog.filterAll'),
      Today: t('activityLog.filterToday'),
      Yesterday: t('activityLog.filterYesterday'),
      'This Month': t('activityLog.filterThisMonth'),
      Successful: t('activityLog.filterSuccessful'),
      Failed: t('activityLog.filterFailed'),
    }
    return map[key] ?? key
  }

  const SUMMARY = [
    { label: t('activityLog.totalActions'), value: 18, tone: 'blue' },
    { label: t('activityLog.pendingApproval'), value: 7, tone: 'blue' },
    { label: t('activityLog.totalFails'), value: 5, tone: 'red' },
  ]

  return (
    <main className={`activity-log-page ${selectedLog ? 'activity-log-page--viewing' : ''}`}>
      <Photo />
      <MainNav activeId="chat" onSelect={onNavigate} />
      <ProjectList onNavigate={onNavigate} />

      <section className="activity-log-content" aria-hidden={selectedLog ? 'true' : undefined}>
        <header className="activity-log-header">
          <h1>{t('activityLog.title')}</h1>
          <p>{t('activityLog.subtitle')}</p>
        </header>

        <div className="activity-log-divider" />

        <div className="activity-log-topbar">
          <div className="activity-log-filter-group">
            <strong>{t('activityLog.logs')}</strong>
            <div className="activity-log-tabs">
              {LOG_FILTERS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={filter === item ? 'activity-log-tabs__button activity-log-tabs__button--active' : 'activity-log-tabs__button'}
                  onClick={() => setFilter(item)}
                >
                  {filterLabel(item)}
                </button>
              ))}
            </div>
          </div>

          <div className="activity-log-summary">
            <strong>{t('activityLog.summaryToday')}</strong>
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
              placeholder={t('activityLog.searchPlaceholder')}
            />
          </label>

          <button type="button" className="activity-log-filter-button">
            <span>{t('activityLog.applyFilters')}</span>
            <FilterIcon />
          </button>

          <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">
            <option value="All Status">{t('activityLog.allStatus')}</option>
            <option value="Successful">{t('activityLog.statusSuccessful')}</option>
            <option value="Failed">{t('activityLog.statusFailed')}</option>
          </select>

          <button type="button" className="activity-log-export" onClick={exportCsv}>
            <ExportIcon />
            <span>{t('activityLog.exportCsv')}</span>
          </button>
        </div>

        <div className="activity-log-table-wrap">
          <table className="activity-log-table">
            <thead>
              <tr>
                <th>{t('activityLog.colTitle')}</th>
                <th>{t('activityLog.colTime')}</th>
                <th>{t('activityLog.colDepartment')}</th>
                <th>{t('activityLog.colType')}</th>
                <th>{t('activityLog.colImpact')}</th>
                <th>{t('activityLog.colStatus')}</th>
                <th>{t('activityLog.colViewDetail')}</th>
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
