import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import { memoryApi } from '../../api/memoryApi'
import './MemoryPage.css'

const ALL_FILTER = 'All'
const DEFAULT_FILTERS = {
  category: ALL_FILTER,
  duration: 'Custom',
  status: ALL_FILTER,
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
  const { t } = useTranslation()
  const [memories, setMemories] = useState([])
  const [filterOptions, setFilterOptions] = useState({ categories: [], durations: [], statuses: [] })
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [detailKey, setDetailKey] = useState(0)
  const [removingIds, setRemovingIds] = useState([])
  const removeTimersRef = useRef([])
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

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

  const reloadMemories = async () => {
    const items = await memoryApi.listMemories()
    setMemories(items)
    setSelectedId((current) => current ?? items[0]?.id ?? null)
    return items
  }

  // Upload one or more documents straight into the knowledge base (RAG), then
  // refresh the list and keep re-polling so each doc flips Processing -> Ready
  // on its own without a manual refresh.
  const handleUploadDocuments = async (files) => {
    if (!files.length) return
    setUploading(true)
    try {
      for (const file of files) {
        await memoryApi.uploadDocument(file)
      }
      await reloadMemories()
      let tries = 0
      const poll = window.setInterval(async () => {
        tries += 1
        const items = await reloadMemories()
        if (tries >= 6 || !items.some((item) => item.status === 'Processing')) {
          window.clearInterval(poll)
        }
      }, 2500)
    } catch (err) {
      console.warn('[memory] document upload failed:', err?.message ?? err)
    } finally {
      setUploading(false)
    }
  }

  // Select a document to view its details. (Previously this also removed the
  // item from the list after 680ms — a mock leftover that made documents vanish
  // on click. Documents must stay in the list, so we only select here.)
  const selectMemory = (id) => {
    setSelectedId(id)
    setDetailKey((current) => current + 1)
  }

  return (
    <div className="memory-page">
      <Photo />
      <MainNav activeId="layers" onSelect={onNavigate} />
      <ProjectList onNavigate={onNavigate} />

      <main className="memory-page__viewport">
        <div className="memory-page__content">
          <header className="memory-page__header">
            <h1>{t('memory.title')}</h1>
            <p>{t('memory.subtitle')}</p>
          </header>

          <section className="memory-page__toolbar">
            <Segmented label={t('memory.category')} items={filterOptions.categories} active={filters.category} onChange={(value) => updateFilter('category', value)} />
            <Segmented
              label={t('memory.duration')}
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
                    placeholder={t('memory.searchPlaceholder')}
                    value={filters.query}
                    onChange={(event) => updateFilter('query', event.target.value)}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    cursor: uploading ? 'default' : 'pointer',
                    background: '#3b5bdb',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    opacity: uploading ? 0.6 : 1,
                  }}
                >
                  {uploading ? 'Uploading…' : '+ Upload document'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  multiple
                  accept=".pdf,.docx,.txt,.md,.csv"
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? [])
                    handleUploadDocuments(files)
                    event.target.value = ''
                  }}
                />
                <Segmented label={t('memory.status')} items={filterOptions.statuses} active={filters.status} onChange={(value) => updateFilter('status', value)} align="right" />
              </div>

              <div className="memory-page__list">
                {loading ? <div className="memory-page__empty">{t('memory.loading')}</div> : null}
                {!loading && !visibleMemories.length ? <div className="memory-page__empty">{t('memory.noMatch')}</div> : null}
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
              <h2>{t('memory.decisionDetails')}</h2>
              {selected ? (
                <div key={`${selected.id}-${detailKey}`} className="memory-page__detail-body">
                  <dl>
                    <div>
                      <dt>{t('memory.decision')}</dt>
                      <dd>{selected.decision}</dd>
                    </div>
                    <div>
                      <dt>{t('memory.decisionDuration')}</dt>
                      <dd>{selected.decisionDuration}</dd>
                    </div>
                    <div>
                      <dt>{t('memory.outcome')}</dt>
                      <dd>{selected.outcome}</dd>
                    </div>
                    <div>
                      <dt>{t('memory.reasoning')}</dt>
                      <dd>{selected.reasoning}</dd>
                    </div>
                    <div>
                      <dt>{t('memory.details')}</dt>
                      <dd>{selected.details}</dd>
                    </div>
                  </dl>

                  <div className="memory-page__detail-tags">
                    <Tag>{selected.categoryLabel}</Tag>
                    <Tag tone={selected.status}>{selected.status}</Tag>
                  </div>
                </div>
              ) : (
                <div className="memory-page__empty memory-page__empty--detail">{t('memory.selectToView')}</div>
              )}
            </aside>
          </section>
        </div>
      </main>

      <BottomAIStatusTools />
    </div>
  )
}
