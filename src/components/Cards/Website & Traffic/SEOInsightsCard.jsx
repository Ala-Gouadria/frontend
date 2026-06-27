import { useMemo } from 'react'
import { WebsiteArcGauge } from '../../visuals-parts'
import { seoInsightsCardData } from '../../../api/websiteTrafficMockData'
import { useSeoData } from '../../../hooks/useAnalyticsData'
import {
  CardFooter,
  CardHeader,
  StripedRow,
  TrendRow,
} from './WebsiteCardParts'
import { getPercent } from './websiteCardUtils'
import './WebsiteTrafficCardShared.css'
import './SEOInsightsCard.css'

// Helper to convert array of values to SVG path points
function arrayToChartPoints(values, width = 234, height = 40, baseline = 40) {
  if (!values || values.length === 0) return null
  const max = Math.max(...values, 1)
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
  if (!apiData) return null

  // If API returned but no current data, show zeros
  if (!apiData.current) {
    return {
      ...mockData,
      title: 'SEO Insights',
      subtitle: 'No data available',
      status: 'No Data',
      trendLabel: 'Organic Traffic Trend',
      trendValue: '0',
      trendDelta: '0%',
      topChart: mockData.topChart,
      gauge: { current: '0', label: 'Organic Clicks', progress: 0 },
      keywords: [{ label: 'No keywords', note: 'Connect Search Console', rank: '#0', delta: '0', width: '0%' }],
      insight: 'No SEO data available. Connect Google Search Console to see real data.',
    }
  }

  const current = apiData.current
  const clicksChange = apiData.clicksChange || 0

  // Build trend chart data
  const trendValues = (apiData.history || [])
    .slice(0, 14)
    .reverse()
    .map((h) => h.totalClicks || 0)
  const trendChart = arrayToChartPoints(trendValues)

  // Transform keywords data
  const keywords = (current.keywords || []).slice(0, 3).map((k) => ({
    label: k.query || k.keyword,
    note: `Vol ${(k.volume || 0).toLocaleString()} · ${k.intent || 'Unknown'} intent`,
    rank: `#${k.position || 0}`,
    delta: k.change ? `${k.change > 0 ? '+' : ''}${k.change}` : '0',
    width: `${Math.min(100, (k.clicks / current.totalClicks) * 100)}%`,
  }))

  return {
    ...mockData,
    title: 'SEO Insights',
    subtitle: 'Real-time data from Search Console',
    status: 'Live',
    trendLabel: 'Organic Traffic Trend',
    trendValue: current.totalClicks?.toLocaleString() || '0',
    trendDelta: `${clicksChange >= 0 ? '+' : ''}${clicksChange.toFixed(1)}%`,
    topChart: trendChart || mockData.topChart,
    gauge: {
      current: current.totalClicks?.toLocaleString() || '0',
      label: 'Organic Clicks',
      progress: Math.min(100, Math.round((current.totalClicks / 12000) * 100)),
    },
    keywordsTitle: 'Top Keywords',
    keywordsMeta: 'by clicks',
    keywords: keywords.length > 0 ? keywords : mockData.keywords,
    insight: current.totalClicks > 0
      ? `Organic clicks ${clicksChange >= 0 ? 'up' : 'down'} ${Math.abs(clicksChange).toFixed(1)}% from last period. Avg position: ${current.avgPosition != null ? Number(current.avgPosition).toFixed(1) : 'N/A'}.`
      : mockData.insight,
  }
}

export function SEOInsightsCard({ data: propData, useRealData = true }) {
  const { data: apiData, loading, hasRealData } = useSeoData({ days: 30 })

  const data = useMemo(() => {
    if (propData) return propData
    // Show real data even if it's 0 (only fallback to mock if API fails)
    if (useRealData && apiData) {
      const transformed = transformApiData(apiData, seoInsightsCardData)
      if (transformed) return transformed
    }
    return seoInsightsCardData
  }, [propData, useRealData, apiData])

  return (
    <article className={`website-card seo-insights-card ${loading ? 'loading' : ''}`}>
      <CardHeader title={data.title} subtitle={data.subtitle} status={data.status} />
      <TrendRow label={data.trendLabel} value={data.trendValue} delta={data.trendDelta} chart={data.topChart} />
      <WebsiteArcGauge value={data.gauge.current} label={data.gauge.label} progress={data.gauge.progress} />

      <section className="seo-insights-card__keywords">
        <div className="seo-insights-card__head">
          <span>{data.keywordsTitle}</span>
          <span>{data.keywordsMeta}</span>
        </div>
        {data.keywords.map((keyword) => (
          <StripedRow
            key={keyword.label}
            label={keyword.label}
            note={keyword.note.replace('Â·', '·')}
            value={keyword.delta}
            width={keyword.width}
            rightTop={keyword.rank}
            rightBottom={keyword.delta}
            tone={getPercent(keyword.delta) < 0 ? 'red' : 'green'}
          />
        ))}
      </section>

      <CardFooter insight={data.insight} ctaLabel={data.ctaLabel} />
    </article>
  )
}

export default SEOInsightsCard
