import {
  AiActionButton,
  AiInsight,
  DottedDataBars,
  MiniLineChart,
  StatusPill,
  SegmentedStripedBar,
  StripedBars,
} from '../../visuals-parts'
import { getPercent } from './websiteCardUtils'

export function CardHeader({ title, subtitle, status }) {
  return (
    <header className="website-card__header">
      <div>
        <h2 className="website-card__title">{title}</h2>
        <p className="website-card__subtitle">{subtitle}</p>
      </div>
      <StatusPill className="website-card__status">{status}</StatusPill>
    </header>
  )
}

export function CardFooter({ insight, ctaLabel }) {
  return (
    <footer className="website-card__footer">
      <AiInsight>{insight}</AiInsight>
      <AiActionButton>{ctaLabel}</AiActionButton>
    </footer>
  )
}

export function TrendRow({ label, value, delta, chart, tone = 'green' }) {
  return (
    <section className="website-card__trend">
      <div>
        <span className="website-card__label">{label}</span>
        <p>
          <strong>{value}</strong>
          {delta ? <span>{delta}</span> : null}
        </p>
      </div>
      {chart ? (
        <MiniLineChart
          points={chart.points}
          fillPoints={chart.fillPoints}
          tone={tone}
          className="website-card__trend-chart"
        />
      ) : null}
    </section>
  )
}

export function MetricDots({ metrics, columns = 3, panel = 'orange', title }) {
  return (
    <section className={`website-card__metric-panel website-card__metric-panel--${panel}`}>
      {title ? <h3>{title}</h3> : null}
      <div className="website-card__metric-grid" style={{ '--website-metric-columns': columns }}>
        {metrics.map((metric) => (
          <div key={metric.label} className="website-card__metric" data-tooltip={`${metric.label}: ${metric.value}`}>
            <span>{metric.label}</span>
            <strong className={metric.tone === 'red' ? 'website-card__value--red' : ''}>{metric.value}</strong>
            <DottedDataBars
              columns={(metric.columns ?? metric.bars ?? []).map((count, index) =>
                typeof count === 'number' ? { label: `Point ${index + 1}`, count: Math.max(1, Math.round(count / 12)) } : count,
              )}
              tone={metric.chartTone ?? 'ink'}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export function StripedRow({ label, value, width, note, rightTop, rightBottom, tone = 'green' }) {
  const percent = getPercent(width ?? value, 0)

  return (
    <div className={`website-card__striped-row website-card__striped-row--${tone}`}>
      <div className="website-card__row-head">
        <div>
          <span>{label}</span>
          {note ? <small>{note}</small> : null}
        </div>
        <div>
          <strong>{rightTop ?? value}</strong>
          {rightBottom ? <small>{rightBottom}</small> : null}
        </div>
      </div>
      <StripedBars value={percent} tone={tone} className="website-card__striped-bar" />
    </div>
  )
}

export function StripedList({ items }) {
  return (
    <div className="website-card__striped-list">
      {items.map((item) => (
        <StripedRow key={item.label} {...item} />
      ))}
    </div>
  )
}

export function BlockLegend({ items }) {
  return (
    <div className="website-card__legend">
      {items.map((item) => (
        <span key={item.label}>
          <i className={`website-card__legend-swatch website-card__legend-swatch--${item.tone}`} />
          {item.label} {item.value}
        </span>
      ))}
    </div>
  )
}
