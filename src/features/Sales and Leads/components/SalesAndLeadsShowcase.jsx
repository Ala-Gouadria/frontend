import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import {
  leadGenerationCardData,
  leadScoringCardData,
  pipelineTrackingCardData,
  revenueFeedbackCardData,
  salesAndLeadsCardData,
} from '../data/salesAndLeadsMockData.js'
import { LeadScoringCard } from './LeadScoringCard.jsx'
import { LeadGenerationCard } from './LeadGenerationCard.jsx'
import { PipelineTrackingCard } from './PipelineTrackingCard.jsx'
import { SalesAndLeadsCard } from './SalesAndLeadsCard.jsx'
import { RevenueFeedbackCard } from './RevenueFeedbackCard.jsx'
import styles from './SalesAndLeadsShowcase.module.css'

const cards = [
  { label: 'Lead Scoring', render: () => <LeadScoringCard data={leadScoringCardData} /> },
  { label: 'Lead Generation', render: () => <LeadGenerationCard data={leadGenerationCardData} /> },
  { label: 'Pipeline Tracking', render: () => <PipelineTrackingCard data={pipelineTrackingCardData} /> },
  { label: 'Sales and Leads', render: () => <SalesAndLeadsCard data={salesAndLeadsCardData} /> },
  { label: 'Revenue Feedback', render: () => <RevenueFeedbackCard data={revenueFeedbackCardData} /> },
]

export function SalesAndLeadsShowcase() {
  return (
    <section className={styles.shell}>
      <div className={styles.headerPill}>
        <span className={styles.logoBubble}>
          <img src={logoMark} alt="" aria-hidden="true" />
        </span>
        <span>Sales and Leads</span>
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
