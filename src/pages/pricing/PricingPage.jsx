import { useMemo, useState } from 'react'
import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import PillButton from '../../components/pages-parts/PillButton'
import './PricingPage.css'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    oldPrice: '$39',
    monthlyPrice: '$29',
    yearlyPrice: '$290',
    features: [
      'Access to NORA core AI agent',
      'Basic automation (reports, insights)',
      'Limited usage (soft cap)',
      '1 workspace / solo founder',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    oldPrice: '$89',
    monthlyPrice: '$79',
    yearlyPrice: '$790',
    recommended: true,
    features: [
      'Full NORA AI agent capabilities',
      'Multi-task execution (marketing, analytics, community)',
      'Advanced reports (daily/weekly/monthly)',
      'Multi-agent coordination (basic)',
      'Priority performance',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    oldPrice: '$249',
    monthlyPrice: '$199',
    yearlyPrice: '$1990',
    features: [
      'Full AI system (not just agent)',
      'Multi-agent orchestration (advanced)',
      'Team collaboration (multi-users)',
      'Deeper analytics + business planning',
      'Integrations (CRM, DB, APIs)',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    oldPrice: '$249',
    monthlyPrice: '$199',
    yearlyPrice: 'Custom',
    features: [
      'Full AI system (not just agent)',
      'Multi-agent orchestration (advanced)',
      'Team collaboration (multi-users)',
      'Deeper analytics + business planning',
      'Integrations (CRM, DB, APIs)',
    ],
  },
]

function CheckIcon() {
  return (
    <span className="pricing-page__check" aria-hidden="true">
      <svg viewBox="0 0 18 18">
        <path d="m5 9 2.5 2.5L13 6" />
      </svg>
    </span>
  )
}

function BillingToggle({ billing, onChange }) {
  return (
    <div className="pricing-page__billing" role="tablist" aria-label="Billing period">
      {['Monthly', 'Yearly'].map((item) => (
        <button
          key={item}
          type="button"
          className={`pricing-page__billing-option ${billing === item ? 'pricing-page__billing-option--active' : ''}`}
          onClick={() => onChange(item)}
          role="tab"
          aria-selected={billing === item}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

function PlanCard({ plan, billing }) {
  const price = billing === 'Yearly' ? plan.yearlyPrice : plan.monthlyPrice
  const suffix = billing === 'Yearly' && price !== 'Custom' ? '/year' : billing === 'Monthly' ? '/month' : ''

  return (
    <article className={`pricing-page__card ${plan.recommended ? 'pricing-page__card--recommended' : ''}`}>
      <div className="pricing-page__price-panel">
        <div className="pricing-page__card-head">
          <h2>{plan.name}</h2>
          {plan.recommended ? <span className="pricing-page__recommended">Recommended</span> : null}
        </div>
        <div className="pricing-page__price">
          {price !== 'Custom' ? <span className="pricing-page__old-price">{plan.oldPrice}</span> : null}
          <strong>{price}</strong>
          {suffix ? <span>{suffix}</span> : null}
        </div>
      </div>

      <ul className="pricing-page__features">
        {plan.features.map((feature) => (
          <li key={feature}>
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <PillButton width="100%" height="58px" compact className="pricing-page__choose-button">
        CHOOSE PLAN
      </PillButton>
    </article>
  )
}

export default function PricingPage({ onNavigate }) {
  const [billing, setBilling] = useState('Monthly')
  const planCards = useMemo(() => PLANS.map((plan) => (
    <PlanCard key={plan.id} plan={plan} billing={billing} />
  )), [billing])

  return (
    <div className="pricing-page">
      <Photo />
      <MainNav activeId={null} onSelect={onNavigate} />
      <ProjectList onNavigate={onNavigate} />

      <main className="pricing-page__viewport">
        <div className="pricing-page__content">
          <header className="pricing-page__header">
            <h1>Pricing</h1>
            <p>Check which plan suits you the best</p>
          </header>

          <section className="pricing-page__plans-section">
            <BillingToggle billing={billing} onChange={setBilling} />
            <div className="pricing-page__plans">
              {planCards}
            </div>
          </section>
        </div>
      </main>

      <BottomAIStatusTools />
    </div>
  )
}
