import { useMemo } from 'react'
import { websiteTrafficCardData } from '../../../api/websiteTrafficMockData'
import { useTrafficData } from '../../../hooks/useAnalyticsData'
import {
  BlockLegend,
  BlockMix,
  CardFooter,
  CardHeader,
  MetricDots,
  StripedList,
  TrendRow,
} from './WebsiteCardParts'
import './WebsiteTrafficCardShared.css'
import './WebsiteTrafficCard.css'

// Transform real API data to card data format
function transformApiData(apiData, mockData) {
  if (!apiData?.current) return null

  const current = apiData.current
  const visitorsChange = apiData.visitorsChange || 0

  // Transform source mix
  const sourceMix = Object.entries(current.sourceMix || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([channel, percentage]) => ({
      label: channel,
      value: `${Math.round(percentage)}%`,
    }))

  // Transform device split
  const deviceSplit = current.deviceSplit || {}
  const deviceTotal = Object.values(deviceSplit).reduce((sum, v) => sum + v, 0) || 1
  const deviceColors = { desktop: '#2f79ff', mobile: '#34d399', tablet: '#f59e0b' }
  const deviceLegend = Object.entries(deviceSplit)
    .filter(([_, pct]) => pct > 0)
    .map(([device, pct]) => ({
      color: deviceColors[device.toLowerCase()] || '#888',
      label: device.charAt(0).toUpperCase() + device.slice(1),
    }))
  const deviceBlocks = Object.entries(deviceSplit)
    .filter(([_, pct]) => pct > 0)
    .map(([device, pct]) => ({
      color: deviceColors[device.toLowerCase()] || '#888',
      weight: Math.round((pct / deviceTotal) * 18),
    }))

  // Transform geo data
  const countries = (current.geoData || []).slice(0, 5).map((g) => ({
    label: g.country,
    value: `${Math.round(g.percentage)}%`,
  }))

  // Build trend chart data
  const trendChart = (apiData.history || [])
    .slice(0, 14)
    .reverse()
    .map((h) => h.visitors || 0)

  return {
    ...mockData,
    title: 'Website Traffic',
    subtitle: 'Real-time data from Google Analytics',
    status: { label: 'Live', tone: 'green' },
    trendLabel: 'Total Visitors',
    trendValue: current.visitors?.toLocaleString() || '0',
    trendDelta: `${visitorsChange >= 0 ? '+' : ''}${visitorsChange.toFixed(1)}%`,
    topChart: trendChart.length > 0 ? trendChart : mockData.topChart,
    panelTitle: 'Key Metrics',
    reasonMetrics: [
      { label: 'Sessions', value: current.sessions?.toLocaleString() || '0' },
      { label: 'Pageviews', value: current.pageviews?.toLocaleString() || '0' },
      { label: 'Bounce Rate', value: `${Math.round((current.bounceRate || 0) * 100)}%` },
      { label: 'Avg Duration', value: `${Math.floor((current.avgSessionDuration || 0) / 60)}m` },
      { label: 'Pages/Session', value: (current.pagesPerSession || 0).toFixed(1) },
    ],
    sourceMixTitle: 'Traffic Sources',
    sourceMix: sourceMix.length > 0 ? sourceMix : mockData.sourceMix,
    deviceTitle: 'Device Breakdown',
    deviceLegend: deviceLegend.length > 0 ? deviceLegend : mockData.deviceLegend,
    deviceBlocks: deviceBlocks.length > 0 ? deviceBlocks : mockData.deviceBlocks,
    countriesTitle: 'Top Countries',
    countries: countries.length > 0 ? countries : mockData.countries,
    insight: current.visitors > 0
      ? `Traffic is ${visitorsChange >= 0 ? 'up' : 'down'} ${Math.abs(visitorsChange).toFixed(1)}% compared to the previous period.`
      : mockData.insight,
  }
}

export function WebsiteTrafficCard({ data: propData, useRealData = true }) {
  const { data: apiData, loading, hasRealData } = useTrafficData({ days: 30 })

  const data = useMemo(() => {
    if (propData) return propData
    if (useRealData && hasRealData) {
      const transformed = transformApiData(apiData, websiteTrafficCardData)
      if (transformed) return transformed
    }
    return websiteTrafficCardData
  }, [propData, useRealData, hasRealData, apiData])

  return (
    <article className={`website-card website-traffic-card ${loading ? 'loading' : ''}`}>
      <CardHeader title={data.title} subtitle={data.subtitle} status={data.status} />
      <TrendRow label={data.trendLabel} value={data.trendValue} delta={data.trendDelta} chart={data.topChart} />
      <MetricDots title={data.panelTitle} metrics={data.reasonMetrics} columns={3} />

      <section className="website-traffic-card__source">
        <h3>{data.sourceMixTitle}</h3>
        <StripedList items={data.sourceMix} />
      </section>

      <section className="website-traffic-card__device">
        <h3>{data.deviceTitle}</h3>
        <BlockLegend items={data.deviceLegend} />
        <BlockMix blocks={data.deviceBlocks} segments={18} />
      </section>

      <section className="website-traffic-card__countries">
        <h3>{data.countriesTitle}</h3>
        {data.countries.map((country) => (
          <div key={country.label}>
            <span>{country.label}</span>
            <strong>{country.value}</strong>
          </div>
        ))}
      </section>

      <CardFooter insight={data.insight} ctaLabel={data.ctaLabel} />
    </article>
  )
}

export default WebsiteTrafficCard
