import { useEffect, useMemo, useRef, useState } from 'react'
import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import { memoryApi } from '../../api/memoryApi'
import './MemoryPage.css'

const ALL_FILTER = 'All'
const DEFAULT_FILTERS = {
  category: 'Strategy',
  duration: 'Custom',
  status: 'Negative',
  query: '',
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="8" cy="8" r="5" />
      <path d="m12 12 3 3" />
    </svg>
  )
}

function Segmented({ label, items, active, onChange, extra, align = 'left' }) {
  const allItems = label === 'Category' || label === 'Duration' || label === 'Status' ? [ALL_FILTER, ...items] : items

  return (
    <div className={`memory-page__segmented memory-page__segmented--${align}`}>
      <span className="memory-page__segmented-label">{label}</span>
      <div className="memory-page__segmented-pills">
        {allItems.map((item) => (
          <button
            key={item}
            type="button"
            className={`memory-page__pill ${item === active ? `memory-page__pill--active memory-page__pill--${item.toLowerCase()}` : ''}`}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        ))}
        {extra ? <span className="memory-page__pill memory-page__pill--active">{extra}</span> : null}
      </div>
    </div>
  )
}

function Tag({ children, tone = 'neutral' }) {
  return <span className={`memory-page__tag memory-page__tag--${String(tone).toLowerCase()}`}>{children}</span>
}

function memoryMatchesFilters(memory, filters) {
  const query = filters.query.trim().toLowerCase()
  const searchable = [
    memory.title,
    memory.summary,
    memory.category,
    memory.categoryLabel,
    memory.status,
    memory.decision,
    memory.reasoning,
  ].join(' ').toLowerCase()

  return (!query || searchable.includes(query))
    && (filters.category === ALL_FILTER || memory.category === filters.category)
    && (filters.duration === ALL_FILTER || memory.duration === filters.duration)
    && (filters.status === ALL_FILTER || memory.status === filters.status)
}

export default function MemoryPage({ onNavigate }) {
  const [memories, setMemories] = useState([])
  const [filterOptions, setFilterOptions] = useState({ categories: [], durations: [], statuses: [] })
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [detailKey, setDetailKey] = useState(0)
  const [removingIds, setRemovingIds] = useState([])
  const removeTimersRef = useRef([])

  useEffect(() => {
    let isMounted = true

    Promise.all([memoryApi.listMemories(), memoryApi.getMemoryFilters()]).then(([items, options]) => {
      if (!isMounted) {
        return
      }

      setMemories(items)
      setFilterOptions(options)
      setSelectedId(items[0]?.id ?? null)
      setLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => () => {
    removeTimersRef.current.forEach((timerId) => window.clearTimeout(timerId))
  }, [])

  const visibleMemories = useMemo(() => (
    memories.filter((memory) => memoryMatchesFilters(memory, filters))
  ), [filters, memories])

  const selected = useMemo(() => (
    visibleMemories.find((item) => item.id === selectedId)
      ?? visibleMemories[0]
      ?? null
  ), [selectedId, visibleMemories])

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  const selectMemory = (id) => {
    if (removingIds.includes(id)) {
      return
    }

    setSelectedId(id)
    setDetailKey((current) => current + 1)
    setRemovingIds((current) => [...current, id])

    const timerId = window.setTimeout(() => {
      setMemories((current) => current.filter((memory) => memory.id !== id))
      setRemovingIds((current) => current.filter((itemId) => itemId !== id))
      setSelectedId((current) => (current === id ? null : current))
      setDetailKey((current) => current + 1)
    }, 680)

    removeTimersRef.current.push(timerId)
  }

  return (
    <div className="memory-page">
      <Photo />
      <MainNav activeId="layers" onSelect={onNavigate} />
      <ProjectList onNavigate={onNavigate} />

      <main className="memory-page__viewport">
        <div className="memory-page__content">
          <header className="memory-page__header">
            <h1>Memory</h1>
            <p>A record of Nora's decisions, outcomes, and reasoning.</p>
          </header>

          <section className="memory-page__toolbar">
            <Segmented label="Category" items={filterOptions.categories} active={filters.category} onChange={(value) => updateFilter('category', value)} />
            <Segmented
              label="Duration"
              items={filterOptions.durations}
              active={filters.duration}
              onChange={(value) => updateFilter('duration', value)}
              extra={filters.duration === 'Custom' ? 'Jan 1 - Jan 31' : null}
              align="right"
            />
          </section>

          <section className="memory-page__workspace">
            <div className="memory-page__list-card">
              <div className="memory-page__search-row">
                <label className="memory-page__search">
                  <SearchIcon />
                  <input
                    type="search"
                    placeholder="Search events, agents, or systems..."
                    value={filters.query}
                    onChange={(event) => updateFilter('query', event.target.value)}
                  />
                </label>
                <Segmented label="Status" items={filterOptions.statuses} active={filters.status} onChange={(value) => updateFilter('status', value)} align="right" />
              </div>

              <div className="memory-page__list">
                {loading ? <div className="memory-page__empty">Loading memory...</div> : null}
                {!loading && !visibleMemories.length ? <div className="memory-page__empty">No memory records match these filters.</div> : null}
                {visibleMemories.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={[
                      'memory-page__memory-card',
                      item.id === selected?.id ? 'memory-page__memory-card--active' : '',
                      removingIds.includes(item.id) ? 'memory-page__memory-card--removing' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => selectMemory(item.id)}
                    disabled={removingIds.includes(item.id)}
                  >
                    <span className="memory-page__memory-title">
                      <i />
                      <strong>{item.title}</strong>
                    </span>
                    <small>{item.summary}</small>
                    <time>{item.time}</time>
                    <div className="memory-page__memory-tags">
                      <Tag>{item.categoryLabel}</Tag>
                      <Tag tone={item.status}>{item.status}</Tag>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <aside className="memory-page__detail">
              <h2>Decision Details</h2>
              {selected ? (
                <div key={`${selected.id}-${detailKey}`} className="memory-page__detail-body">
                  <dl>
                    <div>
                      <dt>Decision</dt>
                      <dd>{selected.decision}</dd>
                    </div>
                    <div>
                      <dt>Decision duration</dt>
                      <dd>{selected.decisionDuration}</dd>
                    </div>
                    <div>
                      <dt>Outcome</dt>
                      <dd>{selected.outcome}</dd>
                    </div>
                    <div>
                      <dt>Reasoning</dt>
                      <dd>{selected.reasoning}</dd>
                    </div>
                    <div>
                      <dt>Details</dt>
                      <dd>{selected.details}</dd>
                    </div>
                  </dl>

                  <div className="memory-page__detail-tags">
                    <Tag>{selected.categoryLabel}</Tag>
                    <Tag tone={selected.status}>{selected.status}</Tag>
                  </div>
                </div>
              ) : (
                <div className="memory-page__empty memory-page__empty--detail">Select a memory to view Nora's reasoning.</div>
              )}
            </aside>
          </section>
        </div>
      </main>

      <BottomAIStatusTools />
    </div>
  )
}
