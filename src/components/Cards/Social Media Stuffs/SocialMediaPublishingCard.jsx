import './SocialMediaStuffsCardShared.css'
import './SocialMediaPublishingCard.css'
import {
  ActivityProgressPill,
  AiActionButton,
  AiInsight,
  SocialPlatformBadge,
  SocialPostPreview,
} from '../../visuals-parts'
import facebookIcon from '../../../assets/icons/Social-Media-Card-Icon/fb.svg'
import linkedinIcon from '../../../assets/icons/Social-Media-Card-Icon/in.svg'
import instagramIcon from '../../../assets/icons/Social-Media-Card-Icon/instagram.svg'
import accountLogo from '../../../assets/logo/Xword-Logo.png'

const defaultBatch = [
  { label: 'Instagram Live Hack posts', count: '12 Images' },
  { label: 'Facebook Video Tutorials', count: '8 Images' },
  { label: 'Twitter Engagement Tips', count: '10 Images' },
]

const platforms = [
  { id: 'fb', iconSrc: facebookIcon, iconAlt: 'Facebook', tone: 'blue', state: 'done' },
  { id: 'li', iconSrc: linkedinIcon, iconAlt: 'LinkedIn', tone: 'blue', state: 'done' },
  { id: 'ig', iconSrc: instagramIcon, iconAlt: 'Instagram', tone: 'pink', state: 'loading' },
]

export function SocialMediaPublishingCard({
  status = 'Active',
  batchLabel = 'Instagram Live Hack posts',
  batchProgress = 7,
  batchTotal = 12,
  accountName = 'XWorldLTD',
  accountSub = 'Manchester, United Kingdom',
  accountSrc = accountLogo,
  postSrc,
  caption = "Most people don't fail because they lack talent.\nThey fail because they lack consistency....",
  upcomingBatch = defaultBatch,
  aiText = 'Users are saving educational posts more than other content',
  className = '',
}) {
  const progress = Math.round((batchProgress / Math.max(batchTotal, 1)) * 100)

  return (
    <div className={`analytics-card smp-card ${className}`}>
      <div className="analytics-card__header smp-card__header">
        <div>
          <h2 className="analytics-card__title smp-card__title">Social Media Publishing</h2>
          <p className="analytics-card__subtitle smp-card__subtitle">Post delivery and scheduling</p>
        </div>
        <span className="analytics-card__status smp-card__status">{status}</span>
      </div>

      <section className="smp-card__section" aria-label="Current batch">
        <p className="analytics-card__section-title smp-card__section-title">Current Batch</p>
        <ActivityProgressPill
          label={batchLabel}
          progress={progress}
          value={`${batchProgress}/${batchTotal}`}
          className="smp-card__current-batch"
        />
      </section>

      <div className="smp-card__platforms" aria-label="Publishing platforms">
        {platforms.map((platform) => (
          <SocialPlatformBadge key={platform.id} {...platform} />
        ))}
      </div>

      <SocialPostPreview
        accountName={accountName}
        accountSub={accountSub}
        accountSrc={accountSrc}
        postSrc={postSrc}
        caption={caption}
      />

      <div className="smc-card__upcoming-panel smp-card__upcoming-panel">
        <div className="smc-card__upcoming-title">Upcoming Batch</div>
        <div className="smc-card__upcoming-body">
          {upcomingBatch.map((item) => (
            <div key={item.label} className="smc-card__upcoming-row">
              <span className="smc-card__upcoming-dot" />
              <span className="smc-card__upcoming-label">{item.label}</span>
              <span className="smc-card__upcoming-count">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <AiInsight className="smp-card__insight">{aiText}</AiInsight>
      <AiActionButton className="smp-card__action" />
    </div>
  )
}

export default SocialMediaPublishingCard
