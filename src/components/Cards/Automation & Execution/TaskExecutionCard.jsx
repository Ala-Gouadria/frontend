import {
  AiActionButton,
  AiInsight,
  SegmentedStripedBar,
} from '../../visuals-parts'
import { taskExecutionCardData } from '../../../api/automationExecutionMockData.js'
import './Automation & ExecutionCardShared.css'
import './TaskExecutionCard.css'

function getPercent(value) {
  const percent = Number.parseFloat(String(value).replace('%', ''))

  return Number.isFinite(percent) ? percent : 0
}

export function TaskExecutionCard({ data = taskExecutionCardData }) {
  const insight =
    'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.'

  return (
    <article className="analytics-card automation-card task-execution-card">
      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      <section className="task-execution-card__stats">
        {data.stats.map((item) => (
          <div
            key={item.label}
            className={`task-execution-card__stat ${item.tone === 'red' ? 'task-execution-card__stat--red' : ''}`}
            data-tooltip={`${item.label}: ${item.value}`}
          >
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </section>

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
                segments={5}
                tone="blue"
                label={`${task.label}: ${task.progress}`}
              />
            </div>
          ))}
        </div>
      </section>

      <footer className="analytics-card__footer">
        <AiInsight>{insight}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>
    </article>
  )
}

export default TaskExecutionCard
