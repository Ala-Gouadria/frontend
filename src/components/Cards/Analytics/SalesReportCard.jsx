import { useMemo } from 'react'
import {
  AiActionButton,
  AiInsight,
  ColoredPanel,
  MiniLineChart,
  QualityBlocks,
} from '../../visuals-parts'
import { salesReportCardData } from '../../../api/analyticsMockData'
import { useRevenueData } from '../../../hooks/useAnalyticsData'
import './SalesReportCard.css'

function toneFromValue(value) {
  return String(value).includes('-') ? 'red' : 'green'
}

function transformData(revenueData, mockData) {
  if (!revenueData) return null

  // If no current data, show zeros
  if (!revenueData.current) {
    return {
      ...mockData,
      title: 'Sales Report',
      subtitle: 'No data available',
      status: 'No Data',
      growthValue: '+$0',
      results: [
        { ...mockData.results[0], label: 'Orders', value: '+0' },
        { ...mockData.results[1], value: '+0%' },
      ],
      sourceLegend: [
        { label: 'High', value: '0%', tone: 'blue' },
        { label: 'Mid', value: '0%', tone: 'green' },
        { label: 'Low', value: '0%', tone: 'orange' },
      ],
      sourceBlocks: [{ tone: 'gray', count: 17 }],
      insight: 'No sales data available. Connect your e-commerce platform to see real data.',
    }
  }

  const current = revenueData.current
  const revenueChange = revenueData.revenueChange || 0
  const totalRevenue = current.totalRevenue ? Math.round(current.totalRevenue / 1000) : 0
  const totalOrders = current.totalOrders || 0

  // Calculate source distribution
  const revenueBySource = current.revenueBySource || {}
  const sources = Object.entries(revenueBySource).sort((a, b) => b[1] - a[1])
  const total = Object.values(revenueBySource).reduce((sum, v) => sum + v, 0) || 1

  const highPct = sources[0] ? Math.round((sources[0][1] / total) * 100) : 0
  const midPct = sources[1] ? Math.round((sources[1][1] / total) * 100) : 0
  const lowPct = 100 - highPct - midPct

  return {
    ...mockData,
    title: 'Sales Report',
    subtitle: 'Real-time revenue data',
    status: 'Live',
    growthValue: `${revenueChange >= 0 ? '+' : ''}$${totalRevenue}K`,
    results: [
      { ...mockData.results[0], label: 'Orders', value: `+${totalOrders}` },
      { ...mockData.results[1], value: `${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(0)}%` },
    ],
    sourceLegend: [
      { label: sources[0]?.[0] || 'Primary', value: `${highPct}%`, tone: 'blue' },
      { label: sources[1]?.[0] || 'Secondary', value: `${midPct}%`, tone: 'green' },
      { label: 'Other', value: `${lowPct}%`, tone: 'orange' },
    ],
    sourceBlocks: [
      { tone: 'blue', count: Math.round(highPct / 6) || 1 },
      { tone: 'green', count: Math.round(midPct / 6) || 1 },
      { tone: 'orange', count: Math.round(lowPct / 6) || 1 },
    ],
    insight: current.totalRevenue > 0
      ? `Total revenue: $${totalRevenue}k from ${totalOrders} orders. Revenue ${revenueChange >= 0 ? 'up' : 'down'} ${Math.abs(revenueChange).toFixed(0)}%.`
      : mockData.insight,
  }
}

export function SalesReportCard({ data: propData, useRealData = true }) {
  const { data: revenueData, loading } = useRevenueData({ days: 30 })

  const data = useMemo(() => {
    if (propData) return propData
    if (useRealData && revenueData) {
      const transformed = transformData(revenueData, salesReportCardData)
      if (transformed) return transformed
    }
    return salesReportCardData
  }, [propData, useRealData, revenueData])

  return (
    <article className={`analytics-card sales-report-card ${loading ? 'loading' : ''}`}>
      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      <section className="analytics-card__row">
        <div>
          <span className="analytics-card__label">{data.growthLabel}</span>
          <strong className="analytics-card__value analytics-card__value--good">{data.growthValue}</strong>
        </div>
        <MiniLineChart
          points={data.growthChart.points}
          fillPoints={data.growthChart.fillPoints}
          className="analytics-card__top-chart"
        />
      </section>

      <ColoredPanel title={data.panelTitle} tone="orange" bodyClassName="analytics-card__panel-grid">
        {data.results.map((result) => (
          <div className="analytics-card__mini-stat" key={result.label}>
            <span>{result.label}</span>
            <span>{result.value}</span>
            <MiniLineChart points={result.points} fillPoints={result.fillPoints} tooltips={result.tooltips} tone={toneFromValue(result.value)} />
          </div>
        ))}
      </ColoredPanel>

      <section>
        <h3 className="analytics-card__section-title">{data.sourceTitle}</h3>
        <div className="analytics-card__legend">
          {data.sourceLegend.map((item) => (
            <span className="analytics-card__legend-item" key={item.label}>
              <span className={`analytics-card__swatch analytics-card__swatch--${item.tone}`} />
              {item.label} {item.value}
            </span>
          ))}
        </div>
        <QualityBlocks blocks={data.sourceBlocks} />
      </section>

      <footer className="analytics-card__footer">
        <AiInsight>{data.insight}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>
    </article>
  )
}

export default SalesReportCard
