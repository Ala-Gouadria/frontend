import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import { workflowAutomationCardData } from '../data/automationExecutionMockData.js'
import styles from './WorkflowAutomationCard.module.css'

export function WorkflowAutomationCard({ data = workflowAutomationCardData }) {
  const { title, subtitle, status, pulseLabel, pulseValue, chainsTitle, chainsMeta, workflows, insight, ctaLabel } = data

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <span className={styles.status}>{status}</span>
      </div>

      <div className={styles.pulseRow}>
        <span className={styles.pulseLabel}>{pulseLabel}</span>
        <strong className={styles.pulseValue}>{pulseValue}</strong>
      </div>

      <div className={styles.sectionHead}>
        <span>{chainsTitle}</span>
        <span>{chainsMeta}</span>
      </div>

      <div className={styles.workflowList}>
        {workflows.map((workflow) => (
          <div key={workflow.label} className={styles.workflowItem}>
            <div className={styles.workflowTop}>
              <div className={styles.workflowInfo}>
                <strong>{workflow.label}</strong>
                <span>{workflow.note}</span>
              </div>
              <div className={styles.workflowState}>
                <span className={styles.stateLabel}>{workflow.state}</span>
                <strong className={styles.stateResult}>{workflow.result}</strong>
              </div>
            </div>
            <div className={styles.blockRow}>
              {workflow.blocks.map((value, index) => (
                <span
                  key={`${workflow.label}-${index}`}
                  className={`${styles.block} ${value >= 1 ? styles.active : styles.inactive}`}
                  style={{ '--block-index': `${index}`, opacity: value }}
                />
              ))}
            </div>
          </div>
        ))}
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
