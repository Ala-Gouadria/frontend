import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import { eventsApi } from '../../api/eventsApi'
import './EventsPage.css'

const ALL_FILTER = 'All'
const EMPTY_FILTERS = {
  types: [],
  severities: [],
  statuses: [],
  agents: [],
}

const DEFAULT_FILTER_STATE = {
  query: '',
  type: ALL_FILTER,
  severity: ALL_FILTER,
  status: ALL_FILTER,
  agent: ALL_FILTER,
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="8" cy="8" r="5" />
      <path d="m12 12 3 3" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M9 3.2v7.1" />
      <path d="m6.4 7.9 2.6 2.6 2.6-2.6" />
      <rect x="4" y="11.2" width="10" height="3.8" rx="1.5" />
    </svg>
  )
}

function normalizeTone(value) {
  return String(value ?? '').toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')
}

function SelectBox({ label, value, options, onChange }) {
  return (
    <label className="events-page__select">
      <select value={value} onChange={(event) => onChange(event.target.value)} aria-label={label}>
        <option value={ALL_FILTER}>{label}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <svg viewBox="0 0 18 18" aria-hidden="true">
        <path d="m5 7 4 4 4-4" />
      </svg>
    </label>
  )
}

function Badge({ children, tone }) {
  return <span className={`events-page__badge events-page__badge--${normalizeTone(tone ?? children)}`}>{children}</span>
}

function eventMatchesFilters(event, filters) {
  const query = filters.query.trim().toLowerCase()
  const searchable = [
    event.title,
    event.description,
    event.type,
    event.severity,
    event.status,
    event.agent,
  ].join(' ').toLowerCase()

  return (!query || searchable.includes(query))
    && (filters.type === ALL_FILTER || event.type === filters.type)
    && (filters.severity === ALL_FILTER || event.severity === filters.severity)
    && (filters.status === ALL_FILTER || event.status === filters.status)
    && (filters.agent === ALL_FILTER || event.agent === filters.agent)
}

function exportEventsAsCsv(events) {
  const columns = ['Title', 'Type', 'Severity', 'Status', 'Agent', 'Time', 'Description']
  const rows = events.map((event) => [
    event.title,
    event.type,
    event.severity,
    event.status,
    event.agent,
    event.time,
    event.description,
  ])
  const csv = [columns, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = 'nora-events.csv'
  anchor.click()
  URL.revokeObjectURL(url)
}

export default function EventsPage({ onNavigate }) {
  const { t } = useTranslation()
  const [events, setEvents] = useState([])
  const [filterOptions, setFilterOptions] = useState(EMPTY_FILTERS)
  const [filters, setFilters] = useState(DEFAULT_FILTER_STATE)
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    Promise.all([eventsApi.listEvents(), eventsApi.getEventFilters()]).then(([eventItems, options]) => {
      if (!isMounted) {
        return
      }

      setEvents(eventItems)
      setFilterOptions(options)
      setSelectedId(eventItems[0]?.id ?? null)
      setLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [])

  const visibleEvents = useMemo(() => (
    events.filter((event) => eventMatchesFilters(event, filters))
  ), [events, filters])

  const summary = useMemo(() => [
    { key: 'totalEvents', value: events.length },
    { key: 'processed', value: events.filter((e) => e.status === 'Processed').length },
    { key: 'processing', value: events.filter((e) => e.status === 'Processing').length },
    { key: 'critical', value: events.filter((e) => e.severity === 'Critical').length },
    { key: 'blocked', value: events.filter((e) => e.status === 'Blocked').length },
  ], [events])

  const selected = useMemo(() => (
    visibleEvents.find((event) => event.id === selectedId)
      ?? events.find((event) => event.id === selectedId)
      ?? visibleEvents[0]
      ?? events[0]
      ?? null
  ), [events, selectedId, visibleEvents])

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  const resetFilters = () => {
    setFilters(DEFAULT_FILTER_STATE)
  }

  return (
    <div className="events-page">
      <Photo />
      <MainNav activeId="layers" onSelect={onNavigate} />
      <ProjectList onNavigate={onNavigate} />

      <main className="events-page__viewport">
        <div className="events-page__content">
          <header className="events-page__header">
            <h1>{t('events.title')}</h1>
            <p>{t('events.subtitle')}</p>
          </header>

          <section className="events-page__summary">
            <div className="events-page__summary-pills">
              {summary.map(({ key, value }) => (
                <div key={key} className="events-page__summary-pill">
                  <span>{t(`events.${key}`)}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <button type="button" className="events-page__export" onClick={() => exportEventsAsCsv(visibleEvents)} disabled={!visibleEvents.length}>
              <span>{t('events.exportCsv')}</span>
              <DownloadIcon />
            </button>
          </section>

          <section className="events-page__workspace">
            <div className="events-page__table-card">
              <div className="events-page__search-row">
                <label className="events-page__search">
                  <SearchIcon />
                  <input
                    type="search"
                    placeholder={t('events.searchPlaceholder')}
                    value={filters.query}
                    onChange={(event) => updateFilter('query', event.target.value)}
                  />
                </label>
                <button type="button" className="events-page__reset" onClick={resetFilters}>{t('events.resetFilter')}</button>
              </div>

              <div className="events-page__filters">
                <SelectBox label={t('events.filterType')} value={filters.type} options={filterOptions.types} onChange={(value) => updateFilter('type', value)} />
                <SelectBox label={t('events.filterSeverity')} value={filters.severity} options={filterOptions.severities} onChange={(value) => updateFilter('severity', value)} />
                <SelectBox label={t('events.filterStatus')} value={filters.status} options={filterOptions.statuses} onChange={(value) => updateFilter('status', value)} />
                <SelectBox label={t('events.filterAgent')} value={filters.agent} options={filterOptions.agents} onChange={(value) => updateFilter('agent', value)} />
              </div>

              <div className="events-page__table">
                <div className="events-page__table-head">
                  <span>{t('events.colTitle')}</span>
                  <span>{t('events.colType')}</span>
                  <span>{t('events.colSeverity')}</span>
                  <span>{t('events.colStatus')}</span>
                  <span>{t('events.colAgent')}</span>
                  <span>{t('events.colTime')}</span>
                </div>
                {loading ? (
                  <div className="events-page__empty">{t('events.loading')}</div>
                ) : null}
                {!loading && !visibleEvents.length ? (
                  <div className="events-page__empty">{t('events.noMatch')}</div>
                ) : null}
                {visibleEvents.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    className={`events-page__row ${event.id === selectedId ? 'events-page__row--active' : ''}`}
                    onClick={() => setSelectedId(event.id)}
                  >
                    <span className="events-page__title-cell">
                      <i />
                      <strong>{event.title}</strong>
                      <small>{event.description}</small>
                    </span>
                    <span>{event.type}</span>
                    <span><Badge>{event.severity}</Badge></span>
                    <span><Badge>{event.status}</Badge></span>
                    <span>{event.agent}</span>
                    <span>{event.time}</span>
                  </button>
                ))}
              </div>
            </div>

            <aside className="events-page__detail">
              {selected ? (
                <>
                  <div className="events-page__detail-head">
                    <span>{t('events.selectedEvent')}</span>
                    <Badge>{selected.severity}</Badge>
                  </div>
                  <h2>{selected.title}</h2>
                  <div className="events-page__tags">
                    <Badge tone="neutral">{selected.type}</Badge>
                    <Badge>{selected.status}</Badge>
                    <Badge tone="neutral">{selected.agent}</Badge>
                  </div>

                  <div className="events-page__info-block">
                    <span>{t('events.whatDetected')}</span>
                    <p>{selected.detected}</p>
                  </div>
                  <div className="events-page__info-block">
                    <span>{t('events.reasoningSummary')}</span>
                    <p>{selected.reasoning}</p>
                  </div>
                  <div className="events-page__info-block">
                    <span>{t('events.businessImpact')}</span>
                    <p>{selected.impact}</p>
                  </div>

                  <div className="events-page__trail">
                    <span>{t('events.eventTrail')}</span>
                    {selected.trail.map((item) => (
                      <div key={`${selected.id}-${item.label}`} className={`events-page__trail-item ${item.state === 'current' ? 'events-page__trail-item--active' : ''}`}>
                        <i />
                        <strong>{item.label}</strong>
                        <small>{item.detail}</small>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="events-page__empty events-page__empty--detail">{t('events.selectToView')}</div>
              )}
            </aside>
          </section>
        </div>
      </main>

      <BottomAIStatusTools />
    </div>
  )
}
