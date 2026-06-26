import { useMemo } from 'react'
import { userBehaviorCardData } from '../../../api/websiteTrafficMockData'
import { useTrafficData } from '../../../hooks/useAnalyticsData'
import {
  CardFooter,
  CardHeader,
  MetricDots,
  StripedList,
  TrendRow,
} from './WebsiteCardParts'
import './WebsiteTrafficCardShared.css'
import './UserBehaviorCard.css'

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
      title: 'User Behavior',
      subtitle: 'No data available',
      status: 'No Data',
      trendLabel: 'Behavior trend',
      trendValue: 'No behavior data',
      trendDelta: '0%',
      topChart: mockData.topChart,
      metrics: [
        { label: 'Avg. session', value: '0m 0s', bars: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { label: 'Pages / visit', value: '0', bars: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { label: 'Bounce', value: '0%', bars: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { label: 'CTA clicks', value: '0', bars: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { label: 'Scroll depth', value: '0%', bars: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { label: 'Form starts', value: '0', bars: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      ],
      userflow: [{ label: 'No data', value: '0%', width: '0%' }],
      insight: 'No user behavior data available. Connect Google Analytics to see real data.',
    }
  }

  const current = apiData.current

  // Format session duration
  const avgDuration = current.avgSessionDuration || 0
  const minutes = Math.floor(avgDuration / 60)
  const seconds = Math.round(avgDuration % 60)

  // Build trend chart from history
  const trendValues = (apiData.history || []).slice(0, 14).reverse().map((h) => h.sessions || 0)
  const trendChart = arrayToChartPoints(trendValues)

  // Calculate bounce rate percentage
  const bounceRate = current.bounceRate ? Math.round(Number(current.bounceRate) * 100) : 0

  // Get top pages for userflow
  const topPages = (current.topPages || []).slice(0, 3).map((p) => ({
    label: p.page || p.path || 'Page',
    value: `${Math.round(p.percentage || (p.pageviews / current.pageviews) * 100)}%`,
    width: `${Math.min(100, Math.round(p.percentage || (p.pageviews / current.pageviews) * 100))}%`,
  }))

  return {
    ...mockData,
    title: 'User Behavior',
    subtitle: 'Real-time data from Google Analytics',
    status: 'Live',
    trendLabel: 'Session trend',
    trendValue: current.sessions > 0 ? 'Users are engaging' : 'Low engagement',
    trendDelta: `${apiData.visitorsChange >= 0 ? '+' : ''}${(apiData.visitorsChange || 0).toFixed(1)}%`,
    topChart: trendChart || mockData.topChart,
    metrics: [
      { label: 'Avg. session', value: `${minutes}m ${seconds}s`, bars: mockData.metrics[0].bars },
      { label: 'Pages / visit', value: (current.pagesPerSession || 0).toFixed(1), bars: mockData.metrics[1].bars },
      { label: 'Bounce', value: `${bounceRate}%`, bars: mockData.metrics[2].bars, tone: bounceRate > 50 ? 'red' : undefined },
      { label: 'CTA clicks', value: 'N/A', bars: mockData.metrics[3].bars },
      { label: 'Scroll depth', value: 'N/A', bars: mockData.metrics[4].bars },
      { label: 'Form starts', value: 'N/A', bars: mockData.metrics[5].bars },
    ],
    userflow: topPages.length > 0 ? topPages : mockData.userflow,
    insight: `Average session duration: ${minutes}m ${seconds}s. Bounce rate: ${bounceRate}%. ${bounceRate < 40 ? 'Good engagement!' : 'Consider improving page experience.'}`,
  }
}

export function UserBehaviorCard({ data: propData, useRealData = true }) {
  const { data: apiData, loading } = useTrafficData({ days: 30 })

  const data = useMemo(() => {
    if (propData) return propData
    if (useRealData && apiData) {
      const transformed = transformApiData(apiData, userBehaviorCardData)
      if (transformed) return transformed
    }
    return userBehaviorCardData
  }, [propData, useRealData, apiData])

  return (
    <article className={`website-card user-behavior-card ${loading ? 'loading' : ''}`}>
      <CardHeader title={data.title} subtitle={data.subtitle} status={data.status} />
      <TrendRow label={data.trendLabel} value={data.trendValue} delta={data.trendDelta} chart={data.topChart} />
      <MetricDots title={data.panelTitle} metrics={data.metrics} columns={3} />

      <section className="user-behavior-card__flow">
        <h3>{data.userflowTitle}</h3>
        <StripedList items={data.userflow} />
      </section>

      <CardFooter insight={data.insight} ctaLabel={data.ctaLabel} />
    </article>
  )
}

export default UserBehaviorCard
