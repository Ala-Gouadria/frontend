import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import {
  automationExecutionCardData,
  systemMonitoringCardData,
  taskExecutionCardData,
  workflowAutomationCardData,
} from '../data/automationExecutionMockData.js'
import { SystemMonitoringCard } from './SystemMonitoringCard.jsx'
import { TaskExecutionCard } from './TaskExecutionCard.jsx'
import { WorkflowAutomationCard } from './WorkflowAutomationCard.jsx'
import { AutomationExecutionCard } from './AutomationExecutionCard.jsx'
import styles from './AutomationExecutionShowcase.module.css'

const cards = [
  { label: 'System Monitoring', render: () => <SystemMonitoringCard data={systemMonitoringCardData} /> },
  { label: 'Task Execution', render: () => <TaskExecutionCard data={taskExecutionCardData} /> },
  { label: 'Workflow Automation', render: () => <WorkflowAutomationCard data={workflowAutomationCardData} /> },
  { label: 'Automation & Execution', render: () => <AutomationExecutionCard data={automationExecutionCardData} /> },
]

export function AutomationExecutionShowcase() {
  return (
    <section className={styles.shell}>
      <div className={styles.headerPill}>
        <span className={styles.logoBubble}>
          <img src={logoMark} alt="" aria-hidden="true" />
        </span>
        <span>Automation &amp; Execution</span>
      </div>

      <div className={styles.stage}>
        <div className={styles.deck}>
          {cards.map(({ label, render }) => (
            <div className={styles.cardColumn} key={label}>
              <p className={styles.cardLabel}>{label}</p>
              {render()}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
