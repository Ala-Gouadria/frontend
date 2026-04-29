import logoMark from '../../../assets/Logo/Nora_Componennts_Logo.png'
import {
  competitorTrackingCardData,
  growthStrategyCardData,
  marketInsightsCardData,
  opportunityDetectionCardData,
  riskDetectionCardData,
  strategyIntelligenceCardData,
} from '../data/strategyIntelligenceMockData.js'
import { MarketInsightsCard } from './MarketInsightsCard.jsx'
import { GrowthStrategyCard } from './GrowthStrategyCard.jsx'
import { OpportunityDetectionCard } from './OpportunityDetectionCard.jsx'
import { StrategyIntelligenceCard } from './StrategyIntelligenceCard.jsx'
import { CompetitorTrackingCard } from './CompetitorTrackingCard.jsx'
import { RiskDetectionCard } from './RiskDetectionCard.jsx'
import styles from './StrategyIntelligenceShowcase.module.css'

const cards = [
  { label: 'Market Insights', render: () => <MarketInsightsCard data={marketInsightsCardData} /> },
  { label: 'Growth Strategy', render: () => <GrowthStrategyCard data={growthStrategyCardData} /> },
  { label: 'Opportunity Detection', render: () => <OpportunityDetectionCard data={opportunityDetectionCardData} /> },
  { label: 'Strategy & Intelligence', render: () => <StrategyIntelligenceCard data={strategyIntelligenceCardData} /> },
  { label: 'Competitor Tracking', render: () => <CompetitorTrackingCard data={competitorTrackingCardData} /> },
  { label: 'Risk Detection', render: () => <RiskDetectionCard data={riskDetectionCardData} /> },
]

export function StrategyIntelligenceShowcase() {
  return (
    <section className={styles.shell}>
      <div className={styles.headerPill}>
        <span className={styles.logoBubble}>
          <img src={logoMark} alt="" aria-hidden="true" />
        </span>
        <span>Strategy &amp; Intelligence</span>
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
