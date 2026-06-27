import { useMemo } from 'react'
import {
  AiActionButton,
  AiInsight,
  SegmentedStripedBar,
} from '../../visuals-parts'
import { taskExecutionCardData } from '../../../api/automationExecutionMockData.js'
import { useTasksData } from '../../../hooks/useAutomationData'
import './Automation & ExecutionCardShared.css'
import './TaskExecutionCard.css'

function getPercent(value) {
  const percent = Number.parseFloat(String(value).replace('%', ''))
  return Number.isFinite(percent) ? percent : 0
}

// Nominal progress per task status (tasks carry no explicit progress field).
const STATUS_PROGRESS = { in_progress: 60, approved: 30, pending_approval: 15, draft: 5 }
const ACTIVE_STATUSES = ['in_progress', 'approved', 'pending_approval', 'draft']

function transformData(tasks, mockData) {
  if (!tasks) return null

  const countBy = (status) => tasks.filter((t) => t.status === status).length
  const running = countBy('in_progress')
  const queued = countBy('draft') + countBy('pending_approval') + countBy('approved')
  const completed = countBy('completed')
  const failed = countBy('rejected') + countBy('cancelled')

  const stats = [
    { label: 'Completed', value: String(completed), tone: 'green' },
    { label: 'Running', value: String(running), tone: 'green' },
    { label: 'Queued', value: String(queued), tone: 'green' },
    { label: 'Failed', value: String(failed), tone: failed > 0 ? 'red' : 'default' },
  ]

  if (tasks.length === 0) {
    return {
      ...mockData,
      status: 'No Data',
      subtitle: 'No tasks yet',
      stats: stats.map((s) => ({ ...s, tone: s.label === 'Failed' ? 'red' : 'default' })),
      tasks: [],
      insight: 'No tasks have been created yet. Ask Nora to create or assign a task to get started.',
    }
  }

  const activeTasks = tasks
    .filter((t) => ACTIVE_STATUSES.includes(t.status))
    .slice(0, 4)
    .map((t) => {
      const p = STATUS_PROGRESS[t.status] ?? 10
      return {
        label: t.title || 'Untitled task',
        progress: `${p}%`,
        activeBlocks: Math.max(1, Math.round((p / 100) * 5)),
        totalBlocks: 5,
      }
    })

  return {
    ...mockData,
    status: 'Live',
    stats,
    tasks: activeTasks,
    insight:
      activeTasks.length > 0
        ? `${running} task${running === 1 ? '' : 's'} running, ${queued} queued. ${completed} completed.`
        : `${completed} task${completed === 1 ? '' : 's'} completed, none currently active.`,
  }
}

export function TaskExecutionCard({ data: propData, useRealData = true }) {
  const { items: tasks, loading } = useTasksData()

  const data = useMemo(() => {
    if (propData) return propData
    if (useRealData && tasks) {
      const transformed = transformData(tasks, taskExecutionCardData)
      if (transformed) return transformed
    }
    return taskExecutionCardData
  }, [propData, useRealData, tasks])

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
