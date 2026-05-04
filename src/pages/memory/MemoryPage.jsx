import { useMemo, useState } from 'react'
import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import './MemoryPage.css'

const CATEGORIES = ['All', 'Social Media', 'Analytics', 'Strategy', 'Sales', 'Website', 'Automation']
const DURATIONS = ['All', 'Today', 'Weekly', 'Monthly', 'Custom']
const STATUSES = ['All', 'Positive', 'Neutral', 'Negative']

const MEMORIES = [
  { id: 1, title: 'Adjusted Instagram posting schedule', summary: 'Engagement increased by 24% over 3 days', time: '5 min ago', category: 'Website and Traffic', status: 'Positive' },
  { id: 2, title: 'Adjusted Instagram posting schedule', summary: 'Engagement increased by 24% over 3 days', time: '5 min ago', category: 'Website and Traffic', status: 'Positive' },
  { id: 3, title: 'Adjusted Instagram posting schedule', summary: 'Engagement increased by 24% over 3 days', time: '5 min ago', category: 'Website and Traffic', status: 'Positive' },
  { id: 4, title: 'Adjusted Instagram posting schedule', summary: 'Engagement increased by 24% over 3 days', time: '5 min ago', category: 'Website and Traffic', status: 'Positive' },
  { id: 5, title: 'Adjusted Instagram posting schedule', summary: 'Engagement increased by 24% over 3 days', time: '5 min ago', category: 'Website and Traffic', status: 'Positive' },
  { id: 6, title: 'Adjusted Instagram posting schedule', summary: 'Engagement increased by 24% over 3 days', time: '5 min ago', category: 'Website and Traffic', status: 'Positive' },
  { id: 7, title: 'Adjusted Instagram posting schedule', summary: 'Engagement increased by 24% over 3 days', time: '5 min ago', category: 'Website and Traffic', status: 'Positive' },
]

function SearchIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="8" cy="8" r="5" />
      <path d="m12 12 3 3" />
    </svg>
  )
}

function Segmented({ label, items, active, onChange, extra, align = 'left' }) {
  return (
    <div className={`memory-page__segmented memory-page__segmented--${align}`}>
      <span className="memory-page__segmented-label">{label}</span>
      <div className="memory-page__segmented-pills">
        {items.map((item) => (
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
  return <span className={`memory-page__tag memory-page__tag--${tone}`}>{children}</span>
}

export default function MemoryPage({ onNavigate }) {
  const [category, setCategory] = useState('Strategy')
  const [duration, setDuration] = useState('Custom')
  const [status, setStatus] = useState('Negative')
  const [selectedId, setSelectedId] = useState(1)
  const selected = useMemo(() => MEMORIES.find((item) => item.id === selectedId) ?? MEMORIES[0], [selectedId])

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
            <Segmented label="Category" items={CATEGORIES} active={category} onChange={setCategory} />
            <Segmented
              label="Duration"
              items={DURATIONS}
              active={duration}
              onChange={setDuration}
              extra={duration === 'Custom' ? 'Jan 1 - Jan 31' : null}
              align="right"
            />
          </section>

          <section className="memory-page__workspace">
            <div className="memory-page__list-card">
              <div className="memory-page__search-row">
                <label className="memory-page__search">
                  <SearchIcon />
                  <input type="search" placeholder="Search events, agents, or systems..." />
                </label>
                <Segmented label="Status" items={STATUSES} active={status} onChange={setStatus} align="right" />
              </div>

              <div className="memory-page__list">
                {MEMORIES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`memory-page__memory-card ${item.id === selectedId ? 'memory-page__memory-card--active' : ''}`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <span className="memory-page__memory-title">
                      <i />
                      <strong>{item.title}</strong>
                    </span>
                    <small>{item.summary}</small>
                    <time>{item.time}</time>
                    <div className="memory-page__memory-tags">
                      <Tag>{item.category}</Tag>
                      <Tag tone="positive">{item.status}</Tag>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <aside className="memory-page__detail">
              <h2>Decision Details</h2>

              <dl>
                <div>
                  <dt>Decision</dt>
                  <dd>Nora detected website sessions increased by 42% in 30 minutes.</dd>
                </div>
                <div>
                  <dt>Outcome</dt>
                  <dd>{selected.summary}</dd>
                </div>
                <div>
                  <dt>Reasoning</dt>
                  <dd>Audience activity peaks shifted to evening hours</dd>
                </div>
                <div>
                  <dt>Details</dt>
                  <dd>Analyzed engagement heatmaps and moved posting time</dd>
                </div>
              </dl>

              <div className="memory-page__detail-tags">
                <Tag>{selected.category}</Tag>
                <Tag tone="positive">{selected.status}</Tag>
              </div>
            </aside>
          </section>
        </div>
      </main>

      <BottomAIStatusTools />
    </div>
  )
}
