import { useMemo } from 'react'
import { QualityBlocks } from '../../visuals-parts'
import { websiteTrafficCardData } from '../../../api/websiteTrafficMockData'
import { useTrafficData } from '../../../hooks/useAnalyticsData'
import {
  BlockLegend,
  CardFooter,
  CardHeader,
  MetricDots,
  StripedList,
  TrendRow,
} from './WebsiteCardParts'
import './WebsiteTrafficCardShared.css'
import './WebsiteTrafficCard.css'

// Helper to convert array of values to SVG path points
function arrayToChartPoints(values, width = 234, height = 40, baseline = 40) {
  if (!values || values.length === 0) return null
  const max = Math.max(...values, 1) // Avoid division by zero
  const step = width / Math.max(values.length - 1, 1)

  const points = values.map((v, i) => {
    const x = Math.round(i * step)
    const y = Math.round(baseline - (v / max) * (height - 10))
    return `${x},${y}`
  }).join(' ')

  const fillPoints = `0,${baseline} ${points} ${Math.round((values.length - 1) * step)},${baseline}`

  return { points, fillPoints }
}

// Transform real API data to card data format
function transformApiData(apiData, mockData) {
  // Always return real data structure, even if values are 0
  if (!apiData) return null

  // If API returned but no current data, show zeros
  if (!apiData.current) {
    return {
      ...mockData,
      title: 'Website Traffic',
      subtitle: 'No data available',
      status: 'No Data',
      trendLabel: 'Total Visitors',
      trendValue: '0',
      trendDelta: '0%',
      topChart: mockData.topChart, // Use mock chart format for empty state
      reasonMetrics: [
        { label: 'Sessions', value: '0' },
        { label: 'Pageviews', value: '0' },
        { label: 'Bounce Rate', value: '0%' },
        { label: 'Avg Duration', value: '0m' },
        { label: 'Pages/Session', value: '0' },
      ],
      sourceMix: [{ label: 'No data', value: '0%' }],
      deviceLegend: [{ color: '#888', label: 'No data' }],
      deviceBlocks: [{ color: '#888', weight: 18 }],
      countries: [{ label: 'No data', value: '0%' }],
      insight: 'No traffic data available. Connect Google Analytics to see real data.',
    }
  }

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
  const trendValues = (apiData.history || [])
    .slice(0, 14)
    .reverse()
    .map((h) => h.visitors || 0)
  const trendChart = arrayToChartPoints(trendValues)

  return {
    ...mockData,
    title: 'Website Traffic',
    subtitle: 'Real-time data from Google Analytics',
    status: 'Live',
    trendLabel: 'Total Visitors',
    trendValue: current.visitors?.toLocaleString() || '0',
    trendDelta: `${visitorsChange >= 0 ? '+' : ''}${visitorsChange.toFixed(1)}%`,
    topChart: trendChart || mockData.topChart,
    panelTitle: 'Key Metrics',
    reasonMetrics: [
      { label: 'Sessions', value: current.sessions?.toLocaleString() || '0' },
      { label: 'Pageviews', value: current.pageviews?.toLocaleString() || '0' },
      { label: 'Bounce Rate', value: `${Math.round((current.bounceRate || 0) * 100)}%` },
      { label: 'Avg Duration', value: `${Math.floor((current.avgSessionDuration || 0) / 60)}m` },
      { label: 'Pages/Session', value: Number(current.pagesPerSession || 0).toFixed(1) },
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
    // Show real data even if it's 0 (only fallback to mock if API fails)
    if (useRealData && apiData) {
      const transformed = transformApiData(apiData, websiteTrafficCardData)
      if (transformed) return transformed
    }
    return websiteTrafficCardData
  }, [propData, useRealData, apiData])

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
        <QualityBlocks blocks={data.deviceBlocks} />
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
