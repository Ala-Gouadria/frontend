import logoMark from '../../../assets/Logo/Nora_Componennts_Logo.png'
import { taskExecutionCardData } from '../data/automationExecutionMockData.js'
import styles from './TaskExecutionCard.module.css'

function getPercent(value) {
  const percent = Number.parseFloat(String(value).replace('%', ''))

  return Number.isFinite(percent) ? percent : 0
}

function getProgressTone(progress) {
  if (progress >= 0.65) {
    return 'green'
  }

  if (progress >= 0.45) {
    return 'blue'
  }

  return 'red'
}

function getStatTone(item) {
  if (item.tone) {
    return item.tone
  }

  return item.label.toLowerCase().includes('stuck') ? 'red' : 'green'
}

export function TaskExecutionCard({ data = taskExecutionCardData }) {
  const { title, subtitle, status, stats, tasksTitle, tasksMeta, tasks, insight, ctaLabel } = data

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <span className={styles.status}>{status}</span>
      </div>

      <div className={styles.statsList}>
        {stats.map((item, index) => {
          const statTone = getStatTone(item)

          return (
            <div
              key={item.label}
              className={`${styles.statRow} ${styles[`${statTone}Stat`]}`}
              style={{ '--row-delay': `${index * 70}ms` }}
            >
              <span className={styles.statLabel}>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          )
        })}
      </div>

      <div className={styles.sectionHead}>
        <span>{tasksTitle}</span>
        <span>{tasksMeta}</span>
      </div>

      <div className={styles.taskList}>
        {tasks.map((task, taskIndex) => {
          const progress = getPercent(task.progress) / 100
          const taskTone = getProgressTone(progress)
          const totalBlocks = task.totalBlocks ?? 5
          const activeBlocks = Math.round(totalBlocks * progress)

          return (
            <div
              key={task.label}
              className={`${styles.taskItem} ${styles[`${taskTone}Task`]}`}
              style={{ '--task-delay': `${taskIndex * 120}ms` }}
            >
              <div className={styles.taskTop}>
                <span className={styles.taskLabel}>{task.label}</span>
                <strong className={styles.taskProgress}>{task.progress}</strong>
              </div>
              <div className={styles.blockRow}>
                {Array.from({ length: totalBlocks }).map((_, index) => (
                  <span
                    key={`${task.label}-${index}`}
                    className={`${styles.block} ${index < activeBlocks ? styles.active : styles.inactive}`}
                    style={{
                      '--block-index': `${index}`,
                      '--block-delay': `${taskIndex * 110 + index * 70}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.insight}>
        <div className={styles.insightHeader}>
          <img src={logoMark} alt="" aria-hidden="true" className={styles.insightLogo} />
          <span className={styles.insightTitle}>AI Insight</span>
        </div>
        <p>{insight}</p>
      </div>

      <button type="button" className={styles.cta}>
        {ctaLabel}
      </button>
    </article>
  )
}
