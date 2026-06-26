import { useMemo } from 'react'
import {
  AiActionButton,
  AiInsight,
  MiniLineChart,
  StripedBars,
} from '../../visuals-parts'
import { conversionFunnelCardData } from '../../../api/analyticsMockData'
import { useFunnelData, useTrafficData } from '../../../hooks/useAnalyticsData'
import './ConversionFunnelCard.css'

function percentNumber(value) {
  return Number.parseFloat(String(value).replace(/[^\d.-]/g, '')) || 0
}

function toneFromPercent(value) {
  const percent = percentNumber(value)

  if (percent < 30) {
    return 'orange'
  }

  return 'green'
}

// Transform real API data to card data format
function transformApiData(funnelData, trafficData, mockData) {
  // If funnel data is null (API failed), return null for mock fallback
  if (funnelData === null) return null

  // If funnel data is empty array or undefined, show zeros
  if (!funnelData || funnelData.length === 0) {
    return {
      ...mockData,
      title: 'Conversion Funnel',
      subtitle: 'No data available',
      status: 'No Data',
      visitsLabel: 'Total Visits',
      visitsValue: '0',
      stages: [
        { label: 'Visitors', percent: '0%', width: '0%', tooltip: '0 users' },
        { label: 'Leads', percent: '0%', width: '0%', tooltip: '0 users' },
        { label: 'Qualified', percent: '0%', width: '0%', tooltip: '0 users' },
        { label: 'Converted', percent: '0%', width: '0%', tooltip: '0 users' },
      ],
      totalConversionLabel: 'Total Conversion',
      totalConversionValue: '+0%',
      insight: 'No funnel data available. Connect your analytics to see real conversion data.',
    }
  }

  const traffic = trafficData?.current

  // Calculate total visits from traffic data
  const totalVisits = traffic?.visitors || 0

  // Build trend chart from traffic history
  const visitsChart = (trafficData?.history || [])
    .slice(0, 7)
    .reverse()
    .map((h) => h.visitors || 0)

  // Transform funnel stages
  const stages = funnelData.map((stage) => {
    const percentage = stage.percentage || 0
    return {
      label: stage.stage,
      percent: `${Math.round(percentage)}%`,
      width: `${Math.round(percentage)}%`,
      tooltip: `${stage.count?.toLocaleString() || 0} users`,
    }
  })

  // Calculate total conversion (last stage percentage)
  const lastStage = funnelData[funnelData.length - 1]
  const totalConversion = lastStage?.percentage || 0

  return {
    ...mockData,
    title: 'Conversion Funnel',
    subtitle: 'Real-time lead funnel data',
    status: 'Live',
    visitsLabel: 'Total Visits',
    visitsValue: totalVisits.toLocaleString(),
    visitsChart: {
      points: visitsChart.length > 0 ? visitsChart : mockData.visitsChart.points,
      fillPoints: visitsChart.length > 0 ? visitsChart : mockData.visitsChart.fillPoints,
    },
    funnelTitle: 'Funnel Stages',
    stages: stages.length > 0 ? stages : mockData.stages,
    totalConversionLabel: 'Total Conversion',
    totalConversionValue: `+${Math.round(totalConversion)}%`,
    bottomChart: mockData.bottomChart, // Keep mock for now
    insight: stages.length > 0
      ? `${Math.round(totalConversion)}% of visitors convert. ${funnelData[0]?.stage || 'First stage'} to ${lastStage?.stage || 'final stage'} drop-off.`
      : mockData.insight,
    ctaLabel: 'Optimize Funnel',
  }
}

export function ConversionFunnelCard({ data: propData, useRealData = true }) {
  const { data: funnelData, loading: funnelLoading, hasRealData: hasFunnelData } = useFunnelData()
  const { data: trafficData, loading: trafficLoading } = useTrafficData({ days: 7 })

  const loading = funnelLoading || trafficLoading

  const data = useMemo(() => {
    if (propData) return propData
    // Show real data even if it's 0 (only fallback to mock if API fails)
    if (useRealData && funnelData) {
      const transformed = transformApiData(funnelData, trafficData, conversionFunnelCardData)
      if (transformed) return transformed
    }
    return conversionFunnelCardData
  }, [propData, useRealData, funnelData, trafficData])

  return (
    <article className={`analytics-card conversion-funnel-card ${loading ? 'loading' : ''}`}>
      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      <section className="analytics-card__row">
        <div>
          <span className="analytics-card__label">{data.visitsLabel}</span>
          <strong className="analytics-card__value analytics-card__value--good">{data.visitsValue}</strong>
        </div>
        <MiniLineChart
          points={data.visitsChart.points}
          fillPoints={data.visitsChart.fillPoints}
          className="analytics-card__top-chart"
        />
      </section>

      <section>
        <h3 className="analytics-card__section-title">{data.funnelTitle}</h3>
        <div className="analytics-card__funnel">
          {data.stages.map((stage) => (
            <div className="analytics-card__funnel-row" key={stage.label}>
              <div className="analytics-card__funnel-head">
                <span>{stage.label}</span>
                <span>{stage.percent}</span>
              </div>
              <StripedBars value={percentNumber(stage.width)} tone={toneFromPercent(stage.percent)} label={stage.label} endLabel={stage.percent} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <span className="analytics-card__label">{data.totalConversionLabel}</span>
        <strong className="analytics-card__value analytics-card__value--good">{data.totalConversionValue}</strong>
        <div className="conversion-funnel-card__bottom-chart-wrap">
          <MiniLineChart
            points={data.bottomChart.points}
            fillPoints={data.bottomChart.fillPoints}
            className="conversion-funnel-card__bottom-chart"
          />
        </div>
      </section>

      <footer className="analytics-card__footer">
        <AiInsight>{data.insight}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>
    </article>
  )
}

export default ConversionFunnelCard
