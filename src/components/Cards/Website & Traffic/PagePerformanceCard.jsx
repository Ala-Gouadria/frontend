import { useMemo } from 'react'
import { WebsiteArcGauge } from '../../visuals-parts'
import { pagePerformanceCardData } from '../../../api/websiteTrafficMockData'
import { usePerformanceData } from '../../../hooks/useAnalyticsData'
import {
  CardFooter,
  CardHeader,
  StripedList,
} from './WebsiteCardParts'
import './WebsiteTrafficCardShared.css'
import './PagePerformanceCard.css'

// Transform real API data to card data format
function transformApiData(apiData, mockData) {
  if (!apiData) return null

  // If API returned but no actual data, show zeros
  if (!apiData.scores && !apiData.coreWebVitals) {
    return {
      ...mockData,
      title: 'Page Performance',
      subtitle: 'No data available',
      status: 'No Data',
      gauges: [
        { value: '0.0s', label: 'Avg. Load', progress: 0 },
        { value: 0, label: 'Perf. Score', progress: 0 },
      ],
      pages: [{ label: 'No data', note: 'Connect PageSpeed Insights', value: '0s', tag: 'Score 0', width: '0%' }],
      insight: 'No performance data available. Connect PageSpeed Insights to see real data.',
    }
  }

  // Get scores - default to 0 if not available
  const perfScore = apiData.scores?.performance || 0
  const accessScore = apiData.scores?.accessibility || 0

  // Calculate average load time from Core Web Vitals
  const lcp = apiData.coreWebVitals?.lcp || 0
  const avgLoad = lcp > 0 ? (lcp / 1000).toFixed(1) : '0.0' // Convert ms to seconds

  // Transform opportunities to page breakdown
  const opportunities = apiData.opportunities || []
  const pages = opportunities.slice(0, 3).map((opp) => {
    const loadTime = opp.numericValue ? (opp.numericValue / 1000).toFixed(1) : '0.0'
    const score = Math.round((1 - (opp.numericValue / 5000)) * 100) // Estimate score based on load time

    return {
      label: opp.title || opp.description || 'Page',
      note: opp.description || opp.title || 'Loading issue',
      value: `${loadTime}s`,
      tag: `Score ${score}`,
      width: `${Math.max(20, Math.min(100, score))}%`,
    }
  })

  return {
    ...mockData,
    title: 'Page Performance',
    subtitle: 'Real-time data from PageSpeed Insights',
    status: 'Live',
    gauges: [
      {
        value: `${avgLoad}s`,
        label: 'Avg. Load',
        progress: Math.max(0, Math.min(100, 100 - (parseFloat(avgLoad) / 5) * 100)),
      },
      {
        value: perfScore,
        label: 'Perf. Score',
        progress: perfScore,
      },
    ],
    leftTitle: 'Page Issues',
    rightTitle: 'Load Time',
    pages: pages.length > 0 ? pages : mockData.pages,
    insight: perfScore > 0
      ? `Performance score is ${perfScore}/100. ${perfScore >= 90 ? 'Great!' : perfScore >= 50 ? 'Needs improvement.' : 'Poor performance detected.'} LCP: ${(lcp / 1000).toFixed(2)}s`
      : mockData.insight,
  }
}

export function PagePerformanceCard({ data: propData, useRealData = true }) {
  const { data: apiData, loading, hasRealData } = usePerformanceData({ strategy: 'mobile' })

  const data = useMemo(() => {
    if (propData) return propData
    // Show real data even if it's 0 (only fallback to mock if API fails)
    if (useRealData && apiData) {
      const transformed = transformApiData(apiData, pagePerformanceCardData)
      if (transformed) return transformed
    }
    return pagePerformanceCardData
  }, [propData, useRealData, apiData])

  return (
    <article className={`website-card page-performance-card ${loading ? 'loading' : ''}`}>
      <CardHeader title={data.title} subtitle={data.subtitle} status={data.status} />

      <section className="page-performance-card__gauges">
        {data.gauges.map((gauge) => (
          <WebsiteArcGauge
            key={gauge.label}
            value={gauge.value}
            label={gauge.label}
            progress={gauge.progress}
            compact
          />
        ))}
      </section>

      <section className="page-performance-card__pages">
        <div className="page-performance-card__section-head">
          <span>{data.leftTitle}</span>
          <span>{data.rightTitle}</span>
        </div>
        <StripedList
          items={data.pages.map((page) => ({
            label: page.label,
            note: page.note,
            value: page.width,
            width: page.width,
            rightTop: page.value,
            rightBottom: page.tag,
          }))}
        />
      </section>

      <CardFooter insight={data.insight} ctaLabel={data.ctaLabel} />
    </article>
  )
}

export default PagePerformanceCard
