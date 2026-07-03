import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import './Terms.css'

// Structural metadata only — all display text comes from the `terms`
// namespace in the translation files (EN + AR).
const TOC_ITEMS = [
  { id: 'privacy-policy', parent: 'privacy', primary: true },
  { id: 'privacy-information', parent: 'privacy' },
  { id: 'privacy-use', parent: 'privacy' },
  { id: 'privacy-lawful', parent: 'privacy' },
  { id: 'privacy-ai', parent: 'privacy' },
  { id: 'privacy-sharing', parent: 'privacy' },
  { id: 'privacy-transfers', parent: 'privacy' },
  { id: 'privacy-retention', parent: 'privacy' },
  { id: 'privacy-rights', parent: 'privacy' },
  { id: 'privacy-security', parent: 'privacy' },
  { id: 'privacy-children', parent: 'privacy' },
  { id: 'privacy-updates', parent: 'privacy' },
  { id: 'terms-conditions', parent: 'terms', primary: true },
  { id: 'refund-policy', parent: 'refund', primary: true },
  { id: 'disclaimer', parent: 'disclaimer', primary: true },
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

const SCROLL_SPY_IDS = [
  ...SECTION_IDS,
  'terms-conditions',
  ...TERMS_SECTION_IDS,
  'refund-policy',
  'disclaimer',
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

function DocumentBlock({ id, title, lastUpdated, intro, sections, sectionIds }) {
  return (
    <article className="terms-document" id={id}>
      <header className="terms-document__header">
        <h2>{title}</h2>
        <p>{lastUpdated}</p>
        {intro.map((line) => <p key={line}>{line}</p>)}
      </header>

      {sections.map((section, index) => (
        <TermsSection key={section.title} section={section} id={sectionIds?.[index]} />
      ))}
    </article>
  )
}

export default function Terms({ initialSection = 'privacy-policy', onNavigate }) {
  const { t } = useTranslation()
  const [activeId, setActiveId] = useState(initialSection)

  const toc = t('terms.toc', { returnObjects: true })
  const lastUpdated = t('terms.lastUpdated')
  const privacy = t('terms.privacy', { returnObjects: true })
  const termsConditions = t('terms.termsConditions', { returnObjects: true })
  const refund = t('terms.refund', { returnObjects: true })
  const disclaimer = t('terms.disclaimer', { returnObjects: true })

  useEffect(() => {
    const page = document.querySelector('.terms-page')
    if (!page) return undefined

    const updateActiveSection = () => {
      const pageTop = page.getBoundingClientRect().top
      let nextActive = SCROLL_SPY_IDS[0]

      SCROLL_SPY_IDS.forEach((sectionId) => {
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
          <h1>{t('terms.title')}</h1>
          <p>{t('terms.subtitle')}</p>
        </header>

        <div className="terms-rule" />

        <div className="terms-layout">
          <aside className="terms-toc" aria-label={t('terms.tocTitle')}>
            <p>{t('terms.tocTitle')}</p>
            <nav>
              {TOC_ITEMS.map((item) => {
                const isPrimaryActive = item.primary && item.parent === activeParent
                const isSubActive = !item.primary && item.id === activeId

                return (
                <a
                  key={item.id}
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
                  <span>{toc[item.id]}</span>
                  {item.primary ? <span className="terms-toc__chevron" aria-hidden="true">›</span> : null}
                </a>
                )
              })}
            </nav>
          </aside>

          <div className="terms-documents">
            <DocumentBlock
              id="privacy-policy"
              title={privacy.title}
              lastUpdated={lastUpdated}
              intro={privacy.intro}
              sections={privacy.sections}
              sectionIds={SECTION_IDS}
            />

            <DocumentBlock
              id="terms-conditions"
              title={termsConditions.title}
              lastUpdated={lastUpdated}
              intro={termsConditions.intro}
              sections={termsConditions.sections}
              sectionIds={TERMS_SECTION_IDS}
            />

            <article className="terms-document terms-document--compact" id="refund-policy">
              <header className="terms-document__header">
                <h2>{refund.title}</h2>
                <p>{lastUpdated}</p>
                <p>{refund.body}</p>
              </header>
            </article>

            <article className="terms-document terms-document--compact" id="disclaimer">
              <header className="terms-document__header">
                <h2>{disclaimer.title}</h2>
                <p>{disclaimer.body}</p>
              </header>
            </article>
          </div>
        </div>
      </section>

      <BottomAIStatusTools />
    </main>
  )
}
