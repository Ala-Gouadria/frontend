import './SocialMediaStuffsCardShared.css'
import './SocialMediaManagerCard.css'
import {
  ActivityProgressPill,
  AiActionButton,
  AiInsight,
  DottedDataBars,
  MetricVisualPanel,
  MiniLineChart,
  PlatformEngagementCard,
} from '../../visuals-parts'
import facebookIcon from '../../../assets/icons/Social-Media-Card-Icon/fb.svg'
import linkedinIcon from '../../../assets/icons/Social-Media-Card-Icon/in.svg'
import instagramIcon from '../../../assets/icons/Social-Media-Card-Icon/instagram.svg'

const defaultEngagement = [
  {
    id: 'fb',
    iconSrc: facebookIcon,
    iconAlt: 'Facebook',
    delta: '+ 32%',
    tone: 'facebook',
    points: '0,36 14,34 28,37 42,35 56,38 70,31 84,32 98,28 112,31 126,26 140,42 154,24 168,47 182,29 194,38',
  },
  {
    id: 'li',
    iconSrc: linkedinIcon,
    iconAlt: 'LinkedIn',
    delta: '+ 32%',
    tone: 'linkedin',
    points: '0,39 14,36 28,38 42,41 56,35 70,37 84,33 98,35 112,29 126,31 140,43 154,24 168,45 182,25 194,39',
  },
  {
    id: 'ig',
    iconSrc: instagramIcon,
    iconAlt: 'Instagram',
    delta: '+ 24%',
    tone: 'instagram',
    points: '0,26 14,43 28,38 42,40 56,36 70,42 84,37 98,40 112,34 126,37 140,35 154,23 168,42 182,54 194,35',
  },
]

const crtColumns = [2, 7, 4, 9, 5, 8, 3, 6, 9, 4, 5, 8, 7, 4]

export function SocialMediaManagerCard({
  status = 'Active',
  currentActivity = 'Running Instagram Campaign',
  activityProgress = 75,
  engagement = defaultEngagement,
  crt = '3.2%',
  share = '+9%',
  aiText = 'Instagram is driving the strongest growth today, while LinkedIn needs attention.',
  className = '',
}) {
  return (
    <div className={`analytics-card smm-card ${className}`}>
      <div className="analytics-card__header smm-card__header">
        <div>
          <h2 className="analytics-card__title smm-card__title">Social Media Manager</h2>
          <p className="analytics-card__subtitle smm-card__subtitle">Content, publishing, and engagement</p>
        </div>
        <span className="analytics-card__status smm-card__status">{status}</span>
      </div>

      <section className="smm-card__section" aria-label="Current activity">
        <p className="analytics-card__section-title smm-card__section-title">Current Activity</p>
        <ActivityProgressPill
          label={currentActivity}
          progress={activityProgress}
          className="smm-card__activity"
        />
      </section>

      <section className="smm-card__section" aria-label="Engagement breakdown">
        <p className="analytics-card__section-title smm-card__section-title">Engagement Breakdown</p>
        <div className="smm-card__engagement-grid">
          {engagement.map((platform) => (
            <PlatformEngagementCard
              key={platform.id}
              iconSrc={platform.iconSrc}
              iconAlt={platform.iconAlt}
              delta={platform.delta}
              points={platform.points}
              tone={platform.tone}
            />
          ))}
        </div>
      </section>

      <div className="smm-card__metrics-grid">
        <MetricVisualPanel label="CRT" value={crt} className="smm-card__metric smm-card__metric--crt">
          <DottedDataBars columns={crtColumns} tone="ink" className="smm-card__dotted-bars" />
        </MetricVisualPanel>
        <MetricVisualPanel label="Share" value={share} valueTone="good" className="smm-card__metric smm-card__metric--share">
          <MiniLineChart
            points="0,48 14,42 28,36 42,22 56,18 70,24 84,20 98,26 112,30 126,32 140,34 154,30 168,28 182,12 194,8"
            tone="green"
            className="smm-card__share-chart"
          />
        </MetricVisualPanel>
      </div>

      <AiInsight className="smm-card__insight">{aiText}</AiInsight>
      <AiActionButton className="smm-card__action" />
    </div>
  )
}

export default SocialMediaManagerCard
