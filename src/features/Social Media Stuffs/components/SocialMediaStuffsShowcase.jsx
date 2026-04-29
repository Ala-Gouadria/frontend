import logoMark from '../../../assets/Logo/Nora_Componennts_Logo.png'
import {
  captionGenerationCardData,
  imageGenerationCardData,
  performanceTrackingCardData,
  socialMediaManagerCardData,
  socialMediaPublishingCardData,
  socialMediaStrategyCardData,
} from '../data/socialMediaStuffsMockData.js'
import { SocialMediaPublishingCard } from './SocialMediaPublishingCard.jsx'
import { CaptionGenerationCard } from './CaptionGenerationCard.jsx'
import { ImageGenerationCard } from './ImageGenerationCard.jsx'
import { SocialMediaManagerCard } from './SocialMediaManagerCard.jsx'
import { SocialMediaStrategyCard } from './SocialMediaStrategyCard.jsx'
import { PerformanceTrackingCard } from './PerformanceTrackingCard.jsx'
import styles from './SocialMediaStuffsShowcase.module.css'

const cards = [
  { label: 'Social Media Publishing', render: () => <SocialMediaPublishingCard data={socialMediaPublishingCardData} /> },
  { label: 'Caption Generation', render: () => <CaptionGenerationCard data={captionGenerationCardData} /> },
  { label: 'Image Generation', render: () => <ImageGenerationCard data={imageGenerationCardData} /> },
  { label: 'Social Media Manager', render: () => <SocialMediaManagerCard data={socialMediaManagerCardData} /> },
  { label: 'Social Media Strategy', render: () => <SocialMediaStrategyCard data={socialMediaStrategyCardData} /> },
  { label: 'Performance Tracking', render: () => <PerformanceTrackingCard data={performanceTrackingCardData} /> },
]

export function SocialMediaStuffsShowcase() {
  return (
    <section className={styles.shell}>
      <div className={styles.headerPill}>
        <span className={styles.logoBubble}>
          <img src={logoMark} alt="" aria-hidden="true" />
        </span>
        <span>Social Media Stuffs</span>
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
