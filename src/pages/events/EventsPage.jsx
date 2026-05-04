import { useMemo, useState } from 'react'
import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import './EventsPage.css'

const SUMMARY = [
  ['Total Events', '12'],
  ['Processed', '12'],
  ['Processing', '12'],
  ['Critical', '12'],
  ['Blocked', '12'],
]

const EVENTS = [
  { id: 1, title: 'Traffic spike detected from LinkedIn campaign', type: 'Automation and Execution', severity: 'Low', status: 'Received', agent: 'Automation Agent', time: '15 min ago', tone: 'low' },
  { id: 2, title: 'Traffic spike detected from LinkedIn campaign', type: 'Automation and Execution', severity: 'Critical', status: 'Processing', agent: 'Automation Agent', time: '15 min ago', tone: 'critical' },
  { id: 3, title: 'Traffic spike detected from LinkedIn campaign', type: 'Automation and Execution', severity: 'High', status: 'Blocked', agent: 'Automation Agent', time: '15 min ago', tone: 'high' },
  { id: 4, title: 'Traffic spike detected from LinkedIn campaign', type: 'Automation and Execution', severity: 'Medium', status: 'Processed', agent: 'Automation Agent', time: '15 min ago', tone: 'medium' },
  { id: 5, title: 'Traffic spike detected from LinkedIn campaign', type: 'Automation and Execution', severity: 'High', status: 'Processed', agent: 'Automation Agent', time: '15 min ago', tone: 'high' },
  { id: 6, title: 'Traffic spike detected from LinkedIn campaign', type: 'Automation and Execution', severity: 'High', status: 'Processed', agent: 'Automation Agent', time: '15 min ago', tone: 'high' },
  { id: 7, title: 'Traffic spike detected from LinkedIn campaign', type: 'Automation and Execution', severity: 'High', status: 'Processed', agent: 'Automation Agent', time: '15 min ago', tone: 'high' },
]

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

function SelectBox({ label }) {
  return (
    <button type="button" className="events-page__select">
      <span>{label}</span>
      <svg viewBox="0 0 18 18" aria-hidden="true">
        <path d="m5 7 4 4 4-4" />
      </svg>
    </button>
  )
}

function Badge({ children, tone }) {
  return <span className={`events-page__badge events-page__badge--${tone}`}>{children}</span>
}

export default function EventsPage({ onNavigate }) {
  const [selectedId, setSelectedId] = useState(1)
  const selected = useMemo(() => EVENTS.find((event) => event.id === selectedId) ?? EVENTS[0], [selectedId])

  return (
    <div className="events-page">
      <Photo />
      <MainNav activeId="layers" onSelect={onNavigate} />
      <ProjectList onNavigate={onNavigate} />

      <main className="events-page__viewport">
        <div className="events-page__content">
          <header className="events-page__header">
            <h1>Events</h1>
            <p>A real-time view of what Nora detects, how important it is, what status it is in, and which agent is responsible.</p>
          </header>

          <section className="events-page__summary">
            <div className="events-page__summary-pills">
              {SUMMARY.map(([label, value]) => (
                <div key={label} className="events-page__summary-pill">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <button type="button" className="events-page__export">
              <span>Export As CSV</span>
              <DownloadIcon />
            </button>
          </section>

          <section className="events-page__workspace">
            <div className="events-page__table-card">
              <div className="events-page__search-row">
                <label className="events-page__search">
                  <SearchIcon />
                  <input type="search" placeholder="Search events, agents, or systems..." />
                </label>
                <button type="button" className="events-page__reset">Reset Filter</button>
              </div>

              <div className="events-page__filters">
                <SelectBox label="Select event type" />
                <SelectBox label="Select Severity Type" />
                <SelectBox label="Select Status" />
                <SelectBox label="Select related agent" />
              </div>

              <div className="events-page__table">
                <div className="events-page__table-head">
                  <span>Title</span>
                  <span>Type</span>
                  <span>Severity</span>
                  <span>Status</span>
                  <span>Agent</span>
                  <span>Time</span>
                </div>
                {EVENTS.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    className={`events-page__row ${event.id === selectedId ? 'events-page__row--active' : ''}`}
                    onClick={() => setSelectedId(event.id)}
                  >
                    <span className="events-page__title-cell">
                      <i />
                      <strong>{event.title}</strong>
                      <small>Nora detected website sessions increased by 42% in 30 minutes.</small>
                    </span>
                    <span>{event.type}</span>
                    <span><Badge tone={event.tone}>{event.severity}</Badge></span>
                    <span><Badge tone={event.status.toLowerCase()}>{event.status}</Badge></span>
                    <span>{event.agent}</span>
                    <span>{event.time}</span>
                  </button>
                ))}
              </div>
            </div>

            <aside className="events-page__detail">
              <div className="events-page__detail-head">
                <span>Selected Event</span>
                <Badge tone="medium">Medium</Badge>
              </div>
              <h2>{selected.title}</h2>
              <div className="events-page__tags">
                <Badge tone="neutral">Website and Traffic</Badge>
                <Badge tone="processed">Processed</Badge>
                <Badge tone="neutral">Automation Agent</Badge>
              </div>

              <div className="events-page__info-block">
                <span>What Nora Detected</span>
                <p>Nora detected website sessions increased by 42% in 30 minutes.</p>
              </div>
              <div className="events-page__info-block">
                <span>Reasoning Summary</span>
                <p>Continuing without valid access could create incomplete or duplicated actions.</p>
              </div>

              <div className="events-page__trail">
                <span>Event Trail</span>
                <div className="events-page__trail-item">
                  <i />
                  <strong>Received</strong>
                  <small>Event Received by Nora</small>
                </div>
                <div className="events-page__trail-item events-page__trail-item--active">
                  <i />
                  <strong>Processed</strong>
                  <small>Current event state</small>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>

      <BottomAIStatusTools />
    </div>
  )
}
