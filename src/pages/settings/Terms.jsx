import { useEffect, useState } from 'react'
import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import './Terms.css'

const PRIVACY_SECTIONS = [
  {
    title: '1. Information We Collect',
    body: 'We may collect:',
    bullets: [
      'Account information: name, email address, company name, role, password, billing details, and contact information.',
      'Business data: workspace content, documents, prompts, reports, tasks, workflows, integrations, and uploaded files.',
      'Usage data: login activity, device data, browser type, IP address, pages visited, features used, and system logs.',
      'Payment data: billing status, subscription plan, invoices, and payment confirmations. Payment card details are processed by third-party payment providers.',
      'AI interaction data: prompts, generated outputs, feedback, user instructions, and usage history.',
      'Communication data: support messages, emails, onboarding requests, and service inquiries.',
    ],
  },
  {
    title: '2. How We Use Data',
    body: 'We use personal data to:',
    bullets: [
      'Provide access to NORA and its dashboard.',
      'Operate AI tools, workflows, reports, automations, and business features.',
      'Manage accounts, subscriptions, billing, and customer support.',
      'Improve platform performance, security, reliability, and user experience.',
      'Detect abuse, fraud, misuse, or security risks.',
      'Send service updates, legal notices, and important account communications.',
      'Comply with legal, accounting, tax, and regulatory obligations.',
    ],
  },
  {
    title: '3. Lawful Basis',
    body: 'Where UK GDPR applies, we process personal data based on:',
    bullets: [
      'Contract: to provide the services users request.',
      'Legitimate interests: to secure, improve, and operate the platform.',
      'Legal obligation: to comply with accounting, tax, fraud prevention, and regulatory requirements.',
      'Consent: for optional marketing cookies, newsletters, or non-essential tracking.',
    ],
  },
  {
    title: '4. AI Processing',
    paragraphs: [
      'NORA uses AI systems to assist with business operations, analysis, planning, automation, and content generation. AI outputs may be inaccurate, incomplete, or require human review. Users are responsible for reviewing AI-generated outputs before relying on them for business, legal, financial, technical, or operational decisions.',
      'We do not intentionally use customer confidential business data for public disclosure. Data may be processed by infrastructure, AI, analytics, hosting, security, payment, and support providers strictly for service delivery and platform operation.',
    ],
  },
  {
    title: '5. Data Sharing',
    body: 'We may share data with:',
    bullets: [
      'Hosting and cloud infrastructure providers.',
      'AI model and automation providers.',
      'Payment processors.',
      'Analytics and monitoring providers.',
      'Security and fraud prevention tools.',
      'Legal, accounting, or compliance advisors.',
      'Authorities where legally required.',
    ],
    footer: 'We do not sell personal data.',
  },
  {
    title: '6. International Transfers',
    paragraphs: [
      'Some service providers may process data outside the UK or European Economic Area. Where required, we use appropriate safeguards such as contractual protections, data processing agreements, or approved transfer mechanisms.',
    ],
  },
  {
    title: '7. Data Retention',
    paragraphs: [
      'We retain personal data only as long as necessary for platform operation, legal compliance, dispute resolution, security, accounting, and legitimate business purposes. Account data may be retained after cancellation where required by law or for fraud prevention, audit, or compliance reasons.',
    ],
  },
  {
    title: '8. User Rights',
    body: 'Depending on applicable law, users may have the right to:',
    bullets: [
      'Access their personal data.',
      'Correct inaccurate data.',
      'Request deletion.',
      'Object to certain processing.',
      'Restrict processing.',
      'Request data portability.',
      'Withdraw consent where processing is based on consent.',
    ],
    footer: 'Requests can be sent to: nor-legal@xworldltd.com. Website: www.xworldltd.com',
  },
  {
    title: '9. Security',
    paragraphs: [
      'We apply technical and organisational measures designed to protect user data, including access controls, authentication, monitoring, encryption where appropriate, and internal security processes. No online system is guaranteed to be completely secure.',
    ],
  },
  {
    title: '10. Children',
    paragraphs: [
      'NORA is intended for business and professional users. It is not intended for children or users under 18.',
    ],
  },
  {
    title: '11. Updates',
    paragraphs: [
      'We may update this Privacy Policy from time to time. Continued use of NORA after updates means the user accepts the revised policy.',
    ],
  },
]

const TERMS_SECTIONS = [
  {
    title: '1. Information We Collect',
    body: 'We may collect:',
    bullets: PRIVACY_SECTIONS[0].bullets,
  },
  {
    title: '2. How We Use Data',
    body: 'We use personal data to:',
    bullets: PRIVACY_SECTIONS[1].bullets,
  },
  {
    title: '3. Lawful Basis',
    body: 'Where UK GDPR applies, we process personal data based on:',
    bullets: PRIVACY_SECTIONS[2].bullets,
  },
  {
    title: '4. AI Processing',
    paragraphs: PRIVACY_SECTIONS[3].paragraphs,
  },
  {
    title: '5. Data Sharing',
    body: 'We may share data with:',
    bullets: PRIVACY_SECTIONS[4].bullets,
    footer: PRIVACY_SECTIONS[4].footer,
  },
  {
    title: '6. International Transfers',
    paragraphs: PRIVACY_SECTIONS[5].paragraphs,
  },
  {
    title: '7. Data Retention',
    paragraphs: PRIVACY_SECTIONS[6].paragraphs,
  },
  {
    title: '8. User Rights',
    body: 'Depending on applicable law, users may have the right to:',
    bullets: PRIVACY_SECTIONS[7].bullets,
    footer: PRIVACY_SECTIONS[7].footer,
  },
  {
    title: '9. Security',
    paragraphs: PRIVACY_SECTIONS[8].paragraphs,
  },
  {
    title: '10. Children',
    paragraphs: PRIVACY_SECTIONS[9].paragraphs,
  },
]

const TOC_ITEMS = [
  { id: 'privacy-policy', label: 'Privacy Policy', parent: 'privacy', primary: true },
  { id: 'privacy-information', label: 'Information We Collect', parent: 'privacy' },
  { id: 'privacy-use', label: 'How we use data', parent: 'privacy' },
  { id: 'privacy-lawful', label: 'Lawful Basis', parent: 'privacy' },
  { id: 'privacy-ai', label: 'AI Processing', parent: 'privacy' },
  { id: 'privacy-sharing', label: 'Data Sharing', parent: 'privacy' },
  { id: 'privacy-transfers', label: 'International Transfers', parent: 'privacy' },
  { id: 'privacy-retention', label: 'Data Retention', parent: 'privacy' },
  { id: 'privacy-rights', label: 'User Rights', parent: 'privacy' },
  { id: 'privacy-security', label: 'Security', parent: 'privacy' },
  { id: 'privacy-children', label: 'Children', parent: 'privacy' },
  { id: 'privacy-updates', label: 'Updates', parent: 'privacy' },
  { id: 'terms-conditions', label: 'Terms & Conditions', parent: 'terms', primary: true },
  { id: 'refund-policy', label: 'Refund & Cancellation Policy', parent: 'refund', primary: true },
  { id: 'disclaimer', label: 'Disclaimer', parent: 'disclaimer', primary: true },
]

const SECTION_IDS = [
  'privacy-information',
  'privacy-use',
  'privacy-lawful',
  'privacy-ai',
  'privacy-sharing',
  'privacy-transfers',
  'privacy-retention',
  'privacy-rights',
  'privacy-security',
  'privacy-children',
  'privacy-updates',
]

const TERMS_SECTION_IDS = [
  'terms-information',
  'terms-use',
  'terms-lawful',
  'terms-ai',
  'terms-sharing',
  'terms-transfers',
  'terms-retention',
  'terms-rights',
  'terms-security',
  'terms-children',
]

function TermsSection({ section, id }) {
  return (
    <section className="terms-document__section" id={id}>
      <h3>{section.title}</h3>
      {section.body ? <p>{section.body}</p> : null}
      {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {section.bullets ? (
        <ul>
          {section.bullets.map((item) => <li key={item}>{item}</li>)}
        </ul>
      ) : null}
      {section.footer ? <p>{section.footer}</p> : null}
    </section>
  )
}

function DocumentBlock({ id, title, intro, sections, sectionIds }) {
  return (
    <article className="terms-document" id={id}>
      <header className="terms-document__header">
        <h2>{title}</h2>
        <p>Last updated: [05/11/2026]</p>
        {intro.map((line) => <p key={line}>{line}</p>)}
      </header>

      {sections.map((section, index) => (
        <TermsSection key={section.title} section={section} id={sectionIds?.[index]} />
      ))}
    </article>
  )
}

export default function Terms({ initialSection = 'privacy-policy', onNavigate }) {
  const [activeId, setActiveId] = useState(initialSection)

  useEffect(() => {
    const page = document.querySelector('.terms-page')
    if (!page) return undefined

    const sectionIds = [
      'privacy-information',
      'privacy-use',
      'privacy-lawful',
      'privacy-ai',
      'privacy-sharing',
      'privacy-transfers',
      'privacy-retention',
      'privacy-rights',
      'privacy-security',
      'privacy-children',
      'privacy-updates',
      'terms-conditions',
      'terms-information',
      'terms-use',
      'terms-lawful',
      'terms-ai',
      'terms-sharing',
      'terms-transfers',
      'terms-retention',
      'terms-rights',
      'terms-security',
      'terms-children',
      'refund-policy',
      'disclaimer',
    ]

    const updateActiveSection = () => {
      const pageTop = page.getBoundingClientRect().top
      let nextActive = sectionIds[0]

      sectionIds.forEach((sectionId) => {
        const section = document.getElementById(sectionId)
        if (!section) return

        if (section.getBoundingClientRect().top - pageTop <= 180) {
          nextActive = sectionId
        }
      })

      setActiveId(nextActive)
    }

    const initialTarget = document.getElementById(initialSection)
    if (initialTarget) {
      requestAnimationFrame(() => {
        setActiveId(initialSection)
        initialTarget.scrollIntoView({ block: 'start' })
      })
    } else {
      updateActiveSection()
    }

    page.addEventListener('scroll', updateActiveSection, { passive: true })
    return () => page.removeEventListener('scroll', updateActiveSection)
  }, [initialSection])

  const scrollToSection = (event, id) => {
    event.preventDefault()
    const section = document.getElementById(id)
    if (!section) return

    setActiveId(id)
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const activeParent = activeId.startsWith('privacy')
    ? 'privacy'
    : activeId.startsWith('terms')
      ? 'terms'
      : activeId === 'refund-policy'
        ? 'refund'
        : activeId === 'disclaimer'
          ? 'disclaimer'
          : 'privacy'

  return (
    <main className="terms-page">
      <Photo />
      <MainNav activeId="layers" onSelect={onNavigate} />
      <ProjectList onNavigate={onNavigate} />

      <section className="terms-shell">
        <header className="terms-heading">
          <h1>Terms</h1>
          <p>Understand the terms, responsibilities, platform usage policies, and conditions that govern access to NORA and its services.</p>
        </header>

        <div className="terms-rule" />

        <div className="terms-layout">
          <aside className="terms-toc" aria-label="Table of contents">
            <p>Table of contents</p>
            <nav>
              {TOC_ITEMS.map((item) => {
                const isPrimaryActive = item.primary && item.parent === activeParent
                const isSubActive = !item.primary && item.id === activeId

                return (
                <a
                  key={item.label}
                  href={`#${item.id}`}
                  onClick={(event) => scrollToSection(event, item.id)}
                  className={[
                    'terms-toc__link',
                    item.id === 'privacy-policy' ? 'terms-toc__link--root' : '',
                    item.primary && item.id !== 'privacy-policy' ? 'terms-toc__link--parent' : '',
                    isPrimaryActive ? 'terms-toc__link--active' : '',
                    isSubActive ? 'terms-toc__link--subactive' : '',
                  ].filter(Boolean).join(' ')}
                >
                  <span>{item.label}</span>
                  {item.primary ? <span aria-hidden="true">›</span> : null}
                </a>
                )
              })}
            </nav>
          </aside>

          <div className="terms-documents">
            <DocumentBlock
              id="privacy-policy"
              title="Privacy Policy"
              intro={[
                'NORA is operated by XWorld LTD ("XWorld", "NORA", "we", "us", or "our"). This Privacy Policy explains how we collect, use, store, and protect personal data when users access NORA, our AI operating system, dashboard, tools, websites, and related services.',
              ]}
              sections={PRIVACY_SECTIONS}
              sectionIds={SECTION_IDS}
            />

            <DocumentBlock
              id="terms-conditions"
              title="Terms & Conditions"
              intro={[
                'These Terms & Conditions govern access to and use of NORA, an AI-powered business operating system operated by XWorld LTD.',
                'By using NORA, users agree to these Terms.',
              ]}
              sections={TERMS_SECTIONS}
              sectionIds={TERMS_SECTION_IDS}
            />

            <article className="terms-document terms-document--compact" id="refund-policy">
              <header className="terms-document__header">
                <h2>Refund & Cancellation Policy</h2>
                <p>Last updated: [05/11/2026]</p>
                <p>Refunds and cancellations are reviewed according to the active subscription, service usage, billing status, and applicable legal requirements.</p>
              </header>
            </article>

            <article className="terms-document terms-document--compact" id="disclaimer">
              <header className="terms-document__header">
                <h2>Disclaimer</h2>
                <p>NORA provides AI-assisted business tools and generated outputs for operational support. Users remain responsible for reviewing outputs before relying on them for business, legal, financial, technical, or strategic decisions.</p>
              </header>
            </article>
          </div>
        </div>
      </section>

      <BottomAIStatusTools />
    </main>
  )
}
