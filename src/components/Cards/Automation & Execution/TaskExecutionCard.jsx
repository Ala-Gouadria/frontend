import { useMemo } from 'react'
import {
  AiActionButton,
  AiInsight,
  SegmentedStripedBar,
} from '../../visuals-parts'
import { taskExecutionCardData } from '../../../api/automationExecutionMockData.js'
import { useSocialData } from '../../../hooks/useAnalyticsData'
import './Automation & ExecutionCardShared.css'
import './TaskExecutionCard.css'

function getPercent(value) {
  const percent = Number.parseFloat(String(value).replace('%', ''))
  return Number.isFinite(percent) ? percent : 0
}

function transformData(socialData, mockData) {
  if (!socialData) return null

  // If no platforms data, show zeros
  if (!socialData.platforms || Object.keys(socialData.platforms).length === 0) {
    return {
      ...mockData,
      title: 'Task Execution',
      subtitle: 'No data available',
      status: 'No Data',
      stats: [
        { label: 'Completed', value: '0', tone: 'default' },
        { label: 'Running', value: '0', tone: 'default' },
        { label: 'Queued', value: '0', tone: 'default' },
        { label: 'Failed', value: '0', tone: 'red' },
      ],
      tasks: mockData.tasks.map(t => ({ ...t, progress: '0%', activeBlocks: 0 })),
      insight: 'No task data available. Connect your integrations to enable task execution.',
    }
  }

  const connectedPlatforms = Object.keys(socialData.platforms).length

  return {
    ...mockData,
    status: 'Live',
    insight: `${connectedPlatforms} integrations connected. Task execution ready.`,
  }
}

export function TaskExecutionCard({ data: propData, useRealData = true }) {
  const { data: socialData, loading } = useSocialData({ days: 30 })

  const data = useMemo(() => {
    if (propData) return propData
    if (useRealData && socialData) {
      const transformed = transformData(socialData, taskExecutionCardData)
      if (transformed) return transformed
    }
    return taskExecutionCardData
  }, [propData, useRealData, socialData])

  return (
    <article className={`analytics-card automation-card task-execution-card ${loading ? 'loading' : ''}`}>

      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      {/* ── Stats rows ── */}
      <section className="task-execution-card__stats">
        {data.stats.map((item) => (
          <div
            key={item.label}
            className={`task-execution-card__stat${item.tone === 'red' ? ' task-execution-card__stat--red' : ''}`}
            data-tooltip={`${item.label}: ${item.value}`}
          >
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </section>

      {/* ── Active tasks ── */}
      <section className="task-execution-card__panel">
        <div className="task-execution-card__panel-title">
          <span>{data.tasksTitle}</span>
          <span>{data.tasksMeta}</span>
        </div>

        <div className="task-execution-card__tasks">
          {data.tasks.map((task) => (
            <div key={task.label} className="task-execution-card__task">
              <div className="task-execution-card__task-head">
                <span>{task.label}</span>
                <strong>{task.progress}</strong>
              </div>
              <SegmentedStripedBar
                value={getPercent(task.progress)}
                segments={task.totalBlocks ?? 5}
                activeSegments={task.activeBlocks}
                tone="blue"
                label={`${task.label}: ${task.progress}`}
              />
            </div>
          ))}
        </div>
      </section>

      <footer className="analytics-card__footer">
        <AiInsight>{data.insight}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>

    </article>
  )
}

export default TaskExecutionCard
