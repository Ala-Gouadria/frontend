import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import BottomAITools from '../../components/bottom-ai/BottomAITools'
import MainNav from '../../components/layout/MainNav'
import NoraAvatar from '../../components/nora/NoraAvatar'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import NoraWorkspace from '../../components/nora/NoraWorkspace'
import {
  AnalyticsReportingCard,
  CampaignPerformanceCard,
  ConversionFunnelCard,
  PerformanceSummaryCard,
  PortfolioAnalyticsCard,
  SalesReportCard,
  TrafficSourceBreakdownCard,
} from '../../components/Cards/Analytics'
import {
  AutomationExecutionCard,
  SystemMonitoringCard,
  TaskExecutionCard,
  WorkflowAutomationCard,
} from '../../components/Cards/Automation & Execution'
import {
  LeadGenerationCard,
  LeadScoringCard,
  PipelineTrackingCard,
  RevenueFeedbackCard,
  SalesAndLeadsCard,
} from '../../components/Cards/Sales and Leads'
import {
  CaptionGenerationCard,
  ImageGenerationCard,
  PerformanceTrackingCard,
  SocialMediaManagerCard,
  SocialMediaPublishingCard,
  SocialMediaStrategyCard,
} from '../../components/Cards/Social Media Stuffs'
import {
  CompetitorTrackingCard,
  GrowthStrategyCard,
  MarketInsightsCard,
  OpportunityDetectionCard,
  RiskDetectionCard,
  StrategyIntelligenceCard,
} from '../../components/Cards/Strategy & Intelligence'
import {
  ConversionSignalsCard,
  PagePerformanceCard,
  SEOInsightsCard,
  TrafficQualityCard,
  UserBehaviorCard,
  WebsiteTrafficCard,
  WebsiteTrafficStatusCard,
} from '../../components/Cards/Website & Traffic'
import WeekTask from '../../components/tasks/Weektask'
import DotGrid from '../../components/background/DotGrid'
import './IntelligenceMap.css'

// ─── Canvas constants ───────────────────────────────────────────────────────
const CANVAS = { width: 7800, height: 4300, centerX: 3900, centerY: 2150 }
const AVATAR  = { x: CANVAS.centerX, y: CANVAS.centerY, radius: 66 }
const CARD_WIDTH  = 480
const CARD_HEIGHT = 500

// ─── Node factory ───────────────────────────────────────────────────────────
function createNode(Component, left, top, options = {}) {
  const width  = options.width  ?? CARD_WIDTH
  const height = options.height ?? CARD_HEIGHT
  return {
    Component,
    left, top, width, height,
    revealDelay: options.revealDelay ?? 420,
    enterX: options.enterX ?? (left < CANVAS.centerX ? -56 : 56),
    enterY: options.enterY ?? 0,
    ports: {
      left:   { x: 0,       y: height / 2 },
      right:  { x: width,   y: height / 2 },
      top:    { x: width / 2, y: 0 },
      bottom: { x: width / 2, y: height },
    },
  }
}

// ─── Card nodes ─────────────────────────────────────────────────────────────
const CARD_NODES = {
  analytics:            createNode(AnalyticsReportingCard,    2440,  610, { height: 560, revealDelay: 360,  enterY: -34 }),
  campaignPerformance:  createNode(CampaignPerformanceCard,   1860, 1110, { revealDelay: 510,  enterY: -18 }),
  conversionFunnel:     createNode(ConversionFunnelCard,      2520, 1280, { revealDelay: 660 }),
  performanceSummary:   createNode(PerformanceSummaryCard,    1440, 1740, { revealDelay: 810,  enterY:  24 }),
  portfolioAnalytics:   createNode(PortfolioAnalyticsCard,    2080, 2060, { revealDelay: 960,  enterY:  28 }),
  salesReport:          createNode(SalesReportCard,           2740, 2080, { revealDelay: 1110, enterY:  28 }),
  trafficSourceBreakdown: createNode(TrafficSourceBreakdownCard, 1440, 860, { revealDelay: 1260, enterY: -28 }),

  automation:           createNode(AutomationExecutionCard,   3280, 2920, { height: 430, revealDelay: 470, enterY:  40 }),
  workflowAutomation:   createNode(WorkflowAutomationCard,    2380, 3200, { revealDelay: 640,  enterY:  46 }),
  taskExecution:        createNode(TaskExecutionCard,         3280, 3560, { revealDelay: 810,  enterY:  50 }),
  systemMonitoring:     createNode(SystemMonitoringCard,      1480, 3060, { revealDelay: 980,  enterY:  54 }),

  website:              createNode(WebsiteTrafficCard,         900, 2360, { revealDelay: 520,  enterY:  38 }),
  trafficQuality:       createNode(TrafficQualityCard,         760, 1540, { revealDelay: 690,  enterY:  18 }),
  userBehavior:         createNode(UserBehaviorCard,           760, 3180, { revealDelay: 860,  enterY:  52 }),
  pagePerformance:      createNode(PagePerformanceCard,       1180, 2360, { revealDelay: 1030, enterY:  38 }),
  seoInsights:          createNode(SEOInsightsCard,           1800, 2680, { revealDelay: 1200, enterY:  42 }),
  conversionSignals:    createNode(ConversionSignalsCard,     1180,  760, { revealDelay: 1370, enterY: -32 }),
  websiteTrafficStatus: createNode(WebsiteTrafficStatusCard,   520, 2360, { revealDelay: 1540, enterY:  38 }),

  strategy:             createNode(StrategyIntelligenceCard,  4420,  610, { height: 490, revealDelay: 420, enterY: -34 }),
  marketInsights:       createNode(MarketInsightsCard,        5040,  840, { revealDelay: 590,  enterY: -28 }),
  competitorTracking:   createNode(CompetitorTrackingCard,    5680,  610, { revealDelay: 760,  enterY: -34 }),
  growthStrategy:       createNode(GrowthStrategyCard,        4440, 1280, { revealDelay: 930 }),
  opportunityDetection: createNode(OpportunityDetectionCard,  5120, 1490, { revealDelay: 1100, enterY:  16 }),
  riskDetection:        createNode(RiskDetectionCard,         5900, 1320, { revealDelay: 1270, enterY:  18 }),

  social:               createNode(SocialMediaManagerCard,    4580, 2040, { height: 496, revealDelay: 520 }),
  socialStrategy:       createNode(SocialMediaStrategyCard,   5200, 2040, { revealDelay: 690 }),
  performance:          createNode(PerformanceTrackingCard,   5840, 2040, { revealDelay: 860 }),
  image:                createNode(ImageGenerationCard,       6500, 1490, { revealDelay: 1030, enterY: -18 }),
  caption:              createNode(CaptionGenerationCard,     6500, 2520, { revealDelay: 1200, enterY:  24 }),
  publishing:           createNode(SocialMediaPublishingCard, 7000, 2020, { revealDelay: 1370 }),

  sales:                createNode(SalesAndLeadsCard,         4360, 3120, { height: 490, revealDelay: 570, enterY:  44 }),
  leadGeneration:       createNode(LeadGenerationCard,        5020, 2920, { revealDelay: 740,  enterY:  42 }),
  leadScoring:          createNode(LeadScoringCard,           5680, 3140, { revealDelay: 910,  enterY:  48 }),
  pipelineTracking:     createNode(PipelineTrackingCard,      6380, 3120, { revealDelay: 1080, enterY:  50 }),
  revenueFeedback:      createNode(RevenueFeedbackCard,       5020, 3560, { revealDelay: 1250, enterY:  54 }),
}

// ─── FIX #3 — memo-wrap every card component once at module level ────────────
// This means card bodies NEVER re-render unless their own internal state changes.
const CARD_COMPONENTS = Object.fromEntries(
  Object.entries(CARD_NODES).map(([id, node]) => [id, memo(node.Component)])
)

// ─── Edge definitions ────────────────────────────────────────────────────────
const EDGE_DEFS = [
  { id: 'avatar-analytics',    from: 'avatar', fromPort: 'left',   to: 'analytics',    toPort: 'right',  axis: 'horizontal', bendRatio: 0.54, drawDelay: 120,  width: 8,   beamDuration: 3300, beamDirection: 'toAvatar' },
  { id: 'avatar-website',      from: 'avatar', fromPort: 'left',   to: 'website',      toPort: 'right',  axis: 'horizontal', bendRatio: 0.52, drawDelay: 240,  width: 7.5, beamDuration: 3200, beamDirection: 'toAvatar' },
  { id: 'avatar-automation',   from: 'avatar', fromPort: 'bottom', to: 'automation',   toPort: 'top',    axis: 'vertical',   bendRatio: 0.56, drawDelay: 360,  width: 7.5, beamDuration: 3150, beamDirection: 'toAvatar' },
  { id: 'avatar-strategy',     from: 'avatar', fromPort: 'right',  to: 'strategy',     toPort: 'left',   axis: 'horizontal', bendRatio: 0.48, drawDelay: 480,  width: 8,   beamDuration: 3300, beamDirection: 'fromAvatar' },
  { id: 'avatar-social',       from: 'avatar', fromPort: 'right',  to: 'social',       toPort: 'left',   axis: 'horizontal', bendRatio: 0.46, drawDelay: 600,  width: 8.5, beamDuration: 3100, beamDirection: 'fromAvatar' },
  { id: 'avatar-sales',        from: 'avatar', fromPort: 'bottom', to: 'sales',        toPort: 'top',    axis: 'vertical',   bendRatio: 0.58, drawDelay: 720,  width: 7.5, beamDuration: 3000, beamDirection: 'fromAvatar' },

  { id: 'analytics-campaign',        from: 'analytics',         fromPort: 'left',   to: 'campaignPerformance',   toPort: 'right', axis: 'horizontal', bendRatio: 0.54, drawDelay: 860,  width: 5.8, beamDuration: 2600, beamDirection: 'forward' },
  { id: 'analytics-conversion',      from: 'analytics',         fromPort: 'bottom', to: 'conversionFunnel',      toPort: 'top',   axis: 'vertical',   bendRatio: 0.44, drawDelay: 940,  width: 5.8, beamDuration: 2600, beamDirection: 'forward' },
  { id: 'campaign-traffic-source',   from: 'campaignPerformance', fromPort: 'left', to: 'trafficSourceBreakdown', toPort: 'right', axis: 'horizontal', bendRatio: 0.5,  drawDelay: 1020, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'campaign-performance-summary', from: 'campaignPerformance', fromPort: 'bottom', to: 'performanceSummary', toPort: 'top', axis: 'vertical', bendRatio: 0.48, drawDelay: 1100, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'conversion-portfolio',      from: 'conversionFunnel',  fromPort: 'bottom', to: 'portfolioAnalytics',    toPort: 'top',   axis: 'vertical',   bendRatio: 0.54, drawDelay: 1180, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'conversion-sales-report',   from: 'conversionFunnel',  fromPort: 'bottom', to: 'salesReport',           toPort: 'top',   axis: 'vertical',   bendRatio: 0.58, drawDelay: 1260, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },

  { id: 'website-status',            from: 'website',           fromPort: 'left',   to: 'websiteTrafficStatus',  toPort: 'right',  axis: 'horizontal', bendRatio: 0.52, drawDelay: 900,  width: 5.4, beamDuration: 2600, beamDirection: 'forward' },
  { id: 'website-quality',           from: 'website',           fromPort: 'top',    to: 'trafficQuality',        toPort: 'bottom', axis: 'vertical',   bendRatio: 0.46, drawDelay: 980,  width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'website-page-performance',  from: 'website',           fromPort: 'right',  to: 'pagePerformance',       toPort: 'left',   axis: 'horizontal', bendRatio: 0.5,  drawDelay: 1060, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'website-user-behavior',     from: 'website',           fromPort: 'bottom', to: 'userBehavior',          toPort: 'top',    axis: 'vertical',   bendRatio: 0.52, drawDelay: 1140, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'page-seo',                  from: 'pagePerformance',   fromPort: 'right',  to: 'seoInsights',           toPort: 'left',   axis: 'horizontal', bendRatio: 0.5,  drawDelay: 1220, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'quality-conversion-signals', from: 'trafficQuality',   fromPort: 'top',    to: 'conversionSignals',     toPort: 'bottom', axis: 'vertical',   bendRatio: 0.48, drawDelay: 1300, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },

  { id: 'automation-workflow',       from: 'automation',        fromPort: 'left',   to: 'workflowAutomation',    toPort: 'right',  axis: 'horizontal', bendRatio: 0.52, drawDelay: 920,  width: 5.4, beamDuration: 2600, beamDirection: 'forward' },
  { id: 'automation-task',           from: 'automation',        fromPort: 'bottom', to: 'taskExecution',         toPort: 'top',    axis: 'vertical',   bendRatio: 0.5,  drawDelay: 1000, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'workflow-monitoring',       from: 'workflowAutomation', fromPort: 'left',  to: 'systemMonitoring',      toPort: 'right',  axis: 'horizontal', bendRatio: 0.5,  drawDelay: 1080, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },

  { id: 'strategy-market',           from: 'strategy',          fromPort: 'right',  to: 'marketInsights',        toPort: 'left',   axis: 'horizontal', bendRatio: 0.5,  drawDelay: 900,  width: 5.4, beamDuration: 2600, beamDirection: 'forward' },
  { id: 'market-competitor',         from: 'marketInsights',    fromPort: 'right',  to: 'competitorTracking',    toPort: 'left',   axis: 'horizontal', bendRatio: 0.5,  drawDelay: 980,  width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'strategy-growth',           from: 'strategy',          fromPort: 'bottom', to: 'growthStrategy',        toPort: 'top',    axis: 'vertical',   bendRatio: 0.48, drawDelay: 1060, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'growth-opportunity',        from: 'growthStrategy',    fromPort: 'right',  to: 'opportunityDetection',  toPort: 'left',   axis: 'horizontal', bendRatio: 0.52, drawDelay: 1140, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'competitor-risk',           from: 'competitorTracking', fromPort: 'bottom', to: 'riskDetection',        toPort: 'top',    axis: 'vertical',   bendRatio: 0.54, drawDelay: 1220, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },

  { id: 'social-strategy',           from: 'social',            fromPort: 'right',  to: 'socialStrategy',        toPort: 'left',   axis: 'horizontal', bendRatio: 0.5,  drawDelay: 940,  width: 5.6, beamDuration: 2600, beamDirection: 'forward' },
  { id: 'social-performance',        from: 'socialStrategy',    fromPort: 'right',  to: 'performance',           toPort: 'left',   axis: 'horizontal', bendRatio: 0.5,  drawDelay: 1020, width: 5.4, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'performance-image',         from: 'performance',       fromPort: 'top',    to: 'image',                 toPort: 'bottom', axis: 'vertical',   bendRatio: 0.5,  drawDelay: 1100, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'performance-caption',       from: 'performance',       fromPort: 'bottom', to: 'caption',               toPort: 'top',    axis: 'vertical',   bendRatio: 0.5,  drawDelay: 1180, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'image-publishing',          from: 'image',             fromPort: 'right',  to: 'publishing',            toPort: 'top',    axis: 'horizontal', bendRatio: 0.58, drawDelay: 1260, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'caption-publishing',        from: 'caption',           fromPort: 'right',  to: 'publishing',            toPort: 'bottom', axis: 'horizontal', bendRatio: 0.58, drawDelay: 1340, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },

  { id: 'sales-lead-generation',     from: 'sales',             fromPort: 'right',  to: 'leadGeneration',        toPort: 'left',   axis: 'horizontal', bendRatio: 0.5,  drawDelay: 960,  width: 5.4, beamDuration: 2600, beamDirection: 'forward' },
  { id: 'lead-generation-scoring',   from: 'leadGeneration',    fromPort: 'right',  to: 'leadScoring',           toPort: 'left',   axis: 'horizontal', bendRatio: 0.5,  drawDelay: 1040, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'lead-scoring-pipeline',     from: 'leadScoring',       fromPort: 'right',  to: 'pipelineTracking',      toPort: 'left',   axis: 'horizontal', bendRatio: 0.5,  drawDelay: 1120, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'lead-generation-revenue',   from: 'leadGeneration',    fromPort: 'bottom', to: 'revenueFeedback',       toPort: 'top',    axis: 'vertical',   bendRatio: 0.52, drawDelay: 1200, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
]

// ─── Derived statics (built once) ───────────────────────────────────────────
const MAIN_CARD_NODE_IDS  = ['analytics', 'website', 'automation', 'strategy', 'social', 'sales']
const MAIN_CARD_NODE_SET  = new Set(MAIN_CARD_NODE_IDS)
const OPEN_START_DELAY_MS = 260
const CLOSE_DURATION_MS   = 1400
const INITIAL_SCALE       = 1.10625

function createInitialCollapsedNodes() { return new Set(MAIN_CARD_NODE_IDS) }

function createInitialPositions() {
  return Object.fromEntries(
    Object.entries(CARD_NODES).map(([id, node]) => [id, { left: node.left, top: node.top }])
  )
}

function buildChildrenMap() {
  const map = {}
  for (const edge of EDGE_DEFS) {
    map[edge.from] ??= []
    map[edge.from].push(edge.to)
  }
  return map
}
const CHILDREN_BY_NODE = buildChildrenMap()

// ─── Pure geometry helpers ───────────────────────────────────────────────────
function getAvatarPort(portName) {
  const avatarPorts = {
    left:   { x: AVATAR.x - AVATAR.radius, y: AVATAR.y },
    right:  { x: AVATAR.x + AVATAR.radius, y: AVATAR.y },
    top:    { x: AVATAR.x, y: AVATAR.y - AVATAR.radius },
    bottom: { x: AVATAR.x, y: AVATAR.y + AVATAR.radius },
  }
  return avatarPorts[portName]
}

function getPortPoint(nodeId, portName, positions, cardElsRef) {
  if (nodeId === 'avatar') return getAvatarPort(portName)
  const node     = CARD_NODES[nodeId]
  const position = positions[nodeId]
  const el       = cardElsRef?.current?.[nodeId]
  const w        = el ? el.clientWidth  : node.width
  const h        = el ? el.clientHeight : node.height
  const ports = {
    left:   { x: 0,     y: h / 2 },
    right:  { x: w,     y: h / 2 },
    top:    { x: w / 2, y: 0 },
    bottom: { x: w / 2, y: h },
  }
  return { x: position.left + ports[portName].x, y: position.top + ports[portName].y }
}

function buildVisibleNodeSet(collapsedNodes) {
  const visible = new Set(['avatar'])
  const queue   = ['avatar']
  while (queue.length > 0) {
    const current  = queue.shift()
    const children = CHILDREN_BY_NODE[current] ?? []
    if (current !== 'avatar' && collapsedNodes.has(current)) continue
    for (const child of children) {
      if (!visible.has(child)) { visible.add(child); queue.push(child) }
    }
  }
  return visible
}

function buildOrthogonalPoints(start, end, axis, bendRatio) {
  if (axis === 'vertical') {
    const midY = start.y + (end.y - start.y) * bendRatio
    return [start, { x: start.x, y: midY }, { x: end.x, y: midY }, end]
  }
  const midX = start.x + (end.x - start.x) * bendRatio
  return [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end]
}

function buildRoundedCablePath(points, radius = 24) {
  if (points.length <= 2) {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  }
  let path = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1], cur = points[i], next = points[i + 1]
    const inX = cur.x - prev.x, inY = cur.y - prev.y
    const outX = next.x - cur.x, outY = next.y - cur.y
    const inLen = Math.hypot(inX, inY), outLen = Math.hypot(outX, outY)
    const r = Math.min(radius, inLen / 2, outLen / 2)
    const entry = { x: cur.x - (inX / inLen) * r,  y: cur.y - (inY / inLen) * r }
    const exit  = { x: cur.x + (outX / outLen) * r, y: cur.y + (outY / outLen) * r }
    path += ` L ${entry.x} ${entry.y} Q ${cur.x} ${cur.y} ${exit.x} ${exit.y}`
  }
  const end = points[points.length - 1]
  path += ` L ${end.x} ${end.y}`
  return path
}

function buildElasticDragPath(start, end, axis, velocityX = 0, velocityY = 0) {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const dist = Math.hypot(dx, dy)
  const tension = Math.min(dist * 0.4, 320)
  const speed = Math.hypot(velocityX, velocityY)
  const bulge = Math.min(speed * 0.35, 120)

  let cp1, cp2
  if (axis === 'vertical') {
    cp1 = { x: start.x + velocityX * 0.15, y: start.y + tension }
    cp2 = { x: end.x   + velocityX * 0.25,  y: end.y   - tension + bulge * Math.sign(dy) }
  } else {
    const dirX = dx >= 0 ? 1 : -1
    cp1 = { x: start.x + tension * dirX, y: start.y + velocityY * 0.15 }
    cp2 = { x: end.x   - tension * dirX + bulge * dirX, y: end.y + velocityY * 0.25 }
  }
  return `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y} ${cp2.x} ${cp2.y} ${end.x} ${end.y}`
}

function createCardStyle(node, position, isVisible, isDragging) {
  const delay = isVisible ? node.revealDelay : 0
  return {
    position: 'absolute',
    left: position.left,
    top:  position.top,
    width: node.width,
    zIndex: isDragging ? 20 : position.left > CANVAS.centerX ? 5 : 4,
    opacity: isVisible ? 1 : 0,
    transform: `translate(${isVisible ? 0 : node.enterX}px, ${isVisible ? 0 : node.enterY}px) scale(${isVisible ? 1 : 0.94})`,
    transformOrigin: position.left > CANVAS.centerX ? 'left center' : 'right center',
    transition: isDragging ? 'box-shadow 120ms ease' : [
      `opacity ${isVisible ? 720 : 260}ms cubic-bezier(.16,1,.3,1) ${delay}ms`,
      `transform ${isVisible ? 1180 : 420}ms cubic-bezier(.16,1,.3,1) ${delay}ms`,
      `filter ${isVisible ? 1180 : 420}ms cubic-bezier(.16,1,.3,1) ${delay}ms`,
      'box-shadow 260ms ease',
    ].join(', '),
    // 'blur(0px)' still creates a compositor layer — use 'none' to avoid it
    filter:        isVisible ? 'none' : 'blur(8px) brightness(1.08)',
    pointerEvents: isVisible ? 'auto' : 'none',
    cursor:        isDragging ? 'grabbing' : 'grab',
    userSelect:    'none',
    touchAction:   'none',
    boxShadow:     isDragging ? '0 22px 48px rgba(15, 23, 42, 0.2)' : 'none',
    // Only promote the actively dragged card to its own GPU layer.
    // Applying willChange to all 32 cards exhausts the compositor texture budget
    // and causes cards to go blank when zoomed out.
    willChange:    isDragging ? 'transform' : 'auto',
  }
}

function buildUsedPortsMap(visibleEdges) {
  const map = {}
  for (const edge of visibleEdges) {
    map[edge.from] ??= new Set(); map[edge.from].add(edge.fromPort)
    map[edge.to]   ??= new Set(); map[edge.to].add(edge.toPort)
  }
  return map
}

// ─── FIX #4+5 — GraphLines: memo + useMemo for all 252 SVG paths ────────────
// svgRef is forwarded so the drag handler can query path elements directly.
const GraphLines = memo(function GraphLines({ sceneVisible, visibleEdges, positions, svgRef, cardEls }) {
  const dashLength = 6200

  // Recompute paths only when positions actually change (drag-end or collapse)
  const edgeData = useMemo(() => EDGE_DEFS.map(edge => {
    const start  = getPortPoint(edge.from, edge.fromPort, positions, cardEls)
    const end    = getPortPoint(edge.to,   edge.toPort,   positions, cardEls)
    const points = buildOrthogonalPoints(start, end, edge.axis, edge.bendRatio)
    const beamStartsAtFrom = edge.beamDirection !== 'toAvatar'
    return {
      ...edge,
      path: buildRoundedCablePath(points),
      beamStart: beamStartsAtFrom ? start : end,
      beamEnd:   beamStartsAtFrom ? end   : start,
      gradStart: start,
      gradEnd:   end,
    }
  }), [positions])

  return (
    <svg ref={svgRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', overflow:'visible', pointerEvents:'none', zIndex:1 }}>

      {edgeData.map(({ id, path, beamStart, beamEnd, gradStart, gradEnd, beamDuration, drawDelay }) => {
        const isVisible       = sceneVisible && visibleEdges.has(id)
        const delay           = isVisible ? drawDelay : 0
        const cableGradId     = `cg-${id}`
        const fwdId           = `bf-${id}`
        const forwardDuration = Math.max(Math.round(beamDuration * 0.96), 1900)

        return (
          <g key={id} data-edge-group={id}>
            <defs>
              <linearGradient id={cableGradId} gradientUnits="userSpaceOnUse"
                x1={gradStart.x} y1={gradStart.y} x2={gradEnd.x} y2={gradEnd.y}>
                <stop offset="3.59%"  stopColor="#1877F2" />
                <stop offset="94.78%" stopColor="#6DA3FF" />
              </linearGradient>
              <linearGradient id={fwdId} gradientUnits="userSpaceOnUse"
                x1={beamStart.x - 180} y1={beamStart.y} x2={beamStart.x + 180} y2={beamStart.y}>
                <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
                <stop offset="30%"  stopColor="rgba(255,255,255,0.15)" />
                <stop offset="60%"  stopColor="rgba(255,255,255,0.6)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                <animate attributeName="x1" values={`${beamStart.x-180};${beamEnd.x-180}`} dur={`${forwardDuration}ms`} begin={`${delay}ms`} repeatCount="indefinite"/>
                <animate attributeName="y1" values={`${beamStart.y};${beamEnd.y}`}         dur={`${forwardDuration}ms`} begin={`${delay}ms`} repeatCount="indefinite"/>
                <animate attributeName="x2" values={`${beamStart.x+180};${beamEnd.x+180}`} dur={`${forwardDuration}ms`} begin={`${delay}ms`} repeatCount="indefinite"/>
                <animate attributeName="y2" values={`${beamStart.y};${beamEnd.y}`}         dur={`${forwardDuration}ms`} begin={`${delay}ms`} repeatCount="indefinite"/>
              </linearGradient>
            </defs>

            {/* cable */}
            <path d={path} fill="none" stroke={`url(#${cableGradId})`} strokeWidth={6} strokeLinecap="round"
              style={{ strokeDasharray:dashLength, strokeDashoffset:isVisible?0:dashLength, opacity:isVisible?1:0, transition:[`stroke-dashoffset ${isVisible?1460:760}ms cubic-bezier(.22,1,.36,1) ${delay}ms`,`opacity ${isVisible?760:260}ms ease ${delay}ms`].join(',') }}/>
            {/* traveling beam */}
            <path d={path} fill="none" stroke={`url(#${fwdId})`} strokeWidth={5} strokeLinecap="round"
              style={{ opacity:isVisible?1:0, transition:`opacity ${isVisible?760:200}ms ease ${delay}ms` }}/>
          </g>
        )
      })}
    </svg>
  )
})

// ─── FIX #4 — ConnectorsLayer: memo + internal useMemo ───────────────────────
const ConnectorsLayer = memo(function ConnectorsLayer({
  sceneVisible, visibleNodeIds, visibleEdges, positions, collapsedNodes, onToggleCollapse, cardEls,
}) {
  const visibleEdgeList = useMemo(
    () => EDGE_DEFS.filter(e => visibleEdges.has(e.id)),
    [visibleEdges]
  )
  const usedPorts = useMemo(() => buildUsedPortsMap(visibleEdgeList), [visibleEdgeList])

  const connectorButtons = useMemo(() =>
    Object.entries(CHILDREN_BY_NODE)
      .filter(([nodeId]) => MAIN_CARD_NODE_SET.has(nodeId) && visibleNodeIds.has(nodeId))
      .flatMap(([nodeId]) => {
        const ports = [...new Set(EDGE_DEFS.filter(e => e.from === nodeId).map(e => e.fromPort))]
        return ports.map(portName => ({ nodeId, portName }))
      }),
    [visibleNodeIds]
  )

  const passiveSockets = useMemo(() =>
    Object.entries(usedPorts).flatMap(([nodeId, ports]) =>
      [...ports]
        .filter(() => !(nodeId !== 'avatar' && (CHILDREN_BY_NODE[nodeId] ?? []).length > 0))
        .map(portName => ({ nodeId, portName }))
    ),
    [usedPorts]
  )

  return (
    <>
      {passiveSockets.map(({ nodeId, portName }) => {
        const point = getPortPoint(nodeId, portName, positions, cardEls)
        const isH = portName === 'left' || portName === 'right'
        const w = isH ? 10 : 20
        const h = isH ? 20 : 10
        const tx = portName === 'left' ? '-100%' : portName === 'right' ? '0' : '-50%'
        const ty = portName === 'top' ? '-100%' : portName === 'bottom' ? '0' : '-50%'
        return (
          <div key={`${nodeId}-${portName}-socket`} className="intelligence-map-socket"
            data-port-node={nodeId} data-port-name={portName}
            style={{ position:'absolute', left:point.x, top:point.y, width:w, height:h, transform:`translate(${tx},${ty})`, opacity:sceneVisible?1:0, pointerEvents:'none', zIndex:8 }} />
        )
      })}

      {connectorButtons.map(({ nodeId, portName }) => {
        const point      = getPortPoint(nodeId, portName, positions)
        const isCollapsed = collapsedNodes.has(nodeId)
        const tx = portName === 'left' ? '-100%' : portName === 'right' ? '0' : '-50%'
        const ty = portName === 'top' ? '-100%' : portName === 'bottom' ? '0' : '-50%'
        return (
          <button key={`${nodeId}-${portName}-toggle`} type="button"
            className={isCollapsed ? 'intelligence-map-connector intelligence-map-connector--collapsed' : 'intelligence-map-connector intelligence-map-connector--expanded'}
            data-port-node={nodeId} data-port-name={portName}
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onToggleCollapse(nodeId) }}
            style={{ position:'absolute', left:point.x, top:point.y, transform:`translate(${tx},${ty})`, opacity:sceneVisible?1:0, zIndex:9 }}
            aria-label={isCollapsed ? 'Expand connected cards' : 'Collapse connected cards'}>
            <span className="intelligence-map-connector__icon" />
          </button>
        )
      })}
    </>
  )
})

// ─── FIX #3 — CardsLayer: memo, each card body is already memo-wrapped ───────
const CardsLayer = memo(function CardsLayer({
  mounted, sceneVisible, visibleNodeIds, positions, draggingId, onCardPointerDown, cardEls,
}) {
  if (!mounted) return null

  return Object.entries(CARD_NODES).map(([id, node]) => {
    const MemoCard  = CARD_COMPONENTS[id]          // stable memo'd component
    const position  = positions[id]
    const isVisible = sceneVisible && visibleNodeIds.has(id)

    return (
      <div
        key={id}
        // FIX #1 — ref lets drag update DOM directly (no React re-render)
        ref={el => { if (el) cardEls.current[id] = el }}
        className={isVisible ? 'intelligence-map-card-shell intelligence-map-card-shell--visible' : 'intelligence-map-card-shell'}
        style={createCardStyle(node, position, isVisible, draggingId === id)}
        onPointerDown={e => onCardPointerDown(e, id)}
      >
        <MemoCard />
      </div>
    )
  })
})

// ─── MapCanvas: memo so it skips re-renders from unrelated parent state ───────
const MapCanvas = memo(function MapCanvas({
  mounted, sceneVisible, visibleNodeIds, visibleEdges, positions,
  draggingId, collapsedNodes, onAvatarClick, onCardPointerDown, onToggleCollapse, cardEls, svgRef,
}) {
  return (
    <div className="intelligence-map-grid"
      style={{ width:CANVAS.width, height:CANVAS.height, position:'relative', background:'transparent' }}>

      {/* Ambient glow around avatar */}
      <div style={{ position:'absolute', left:AVATAR.x-320, top:AVATAR.y-320, width:640, height:640, borderRadius:'50%',
        background:'radial-gradient(circle,rgba(88,148,255,0.18) 0%,rgba(88,148,255,0.09) 35%,rgba(88,148,255,0) 75%)',
        filter:'blur(16px)', opacity:sceneVisible?1:0.32, transition:'opacity 1200ms ease' }} />

      <GraphLines sceneVisible={sceneVisible} visibleEdges={visibleEdges} positions={positions} svgRef={svgRef} />

      <CardsLayer
        mounted={mounted} sceneVisible={sceneVisible} visibleNodeIds={visibleNodeIds}
        positions={positions} draggingId={draggingId}
        onCardPointerDown={onCardPointerDown} cardEls={cardEls} />

      <ConnectorsLayer
        sceneVisible={sceneVisible} visibleNodeIds={visibleNodeIds} visibleEdges={visibleEdges}
        positions={positions} collapsedNodes={collapsedNodes} onToggleCollapse={onToggleCollapse} />

      <div style={{ position:'absolute', left:AVATAR.x, top:AVATAR.y,
        transform:`translate(-50%,-50%) scale(${sceneVisible?1:0.965})`,
        zIndex:12, transition:'transform 1200ms cubic-bezier(.22,1,.36,1)' }}>
        <NoraAvatar active={sceneVisible} onClick={onAvatarClick} />
      </div>
    </div>
  )
})

// Focus cards for the voice-demo dashboard hand-off: Analyst (analytics),
// Strategy (strategy), Social Media (social). When IntelligenceMap is opened
// with autoReveal, the scene starts active and these three groups expanded.
const FOCUS_NODE_IDS = ['analytics', 'strategy', 'social']

// ─── Root component ──────────────────────────────────────────────────────────
export default function IntelligenceMap({ activeNavId = 'stars', onNavigate, autoReveal = false }) {
  const [isActive,        setIsActive]        = useState(autoReveal)
  const [isTaskOpen,      setIsTaskOpen]       = useState(false)
  const [mounted,         setMounted]          = useState(false)
  const [sceneVisible,    setSceneVisible]     = useState(false)
  const [collapsedNodes,  setCollapsedNodes]   = useState(() =>
    autoReveal
      ? new Set(MAIN_CARD_NODE_IDS.filter((id) => !FOCUS_NODE_IDS.includes(id)))
      : createInitialCollapsedNodes(),
  )
  const [isWorkspaceOpen, setIsWorkspaceOpen]  = useState(false)
  const [toolMode,        setToolMode]         = useState('hand')

  // ── FIX #1 — Ref-based drag: zero React re-renders during pointermove ──────
  // positionsRef is the live source-of-truth; React state is only synced on drop.
  const positionsRef = useRef(null)
  if (!positionsRef.current) positionsRef.current = createInitialPositions()
  const [positions, setPositions] = useState(positionsRef.current)

  const dragRef     = useRef(null)          // current drag data (no state needed)
  const [draggingId, setDraggingId] = useState(null)  // only for visual feedback
  const cardEls     = useRef({})            // DOM refs keyed by card id
  const scaleRef    = useRef(INITIAL_SCALE) // read in pointermove without stale closure
  const svgRef      = useRef(null)          // ref to the GraphLines <svg> for imperative updates

  // Imperatively update SVG edge paths AND connector buttons/sockets for the
  // dragged card. Runs inside pointermove — zero React re-renders, everything
  // follows the card in real time.
  const dragEdgeGroupsRef = useRef([])

  const updateEdgesForDrag = useCallback((dragId, positions, vx = 0, vy = 0) => {
    const svg = svgRef.current
    if (svg) {
      const affected = EDGE_DEFS.filter(e => e.from === dragId || e.to === dragId)
      const groups = []
      for (const edge of affected) {
        const group = svg.querySelector(`[data-edge-group="${edge.id}"]`)
        if (!group) continue
        groups.push(group)
        const start = getPortPoint(edge.from, edge.fromPort, positions)
        const end   = getPortPoint(edge.to,   edge.toPort,   positions)
        const d     = buildElasticDragPath(start, end, edge.axis, vx, vy)
        group.querySelectorAll('path').forEach(p => p.setAttribute('d', d))
        if (!group.classList.contains('edge-dragging')) group.classList.add('edge-dragging')
      }
      dragEdgeGroupsRef.current = groups
    }

    const node = CARD_NODES[dragId]
    if (node) {
      const pos = positions[dragId]
      document.querySelectorAll(`[data-port-node="${dragId}"]`).forEach(el => {
        const portName = el.dataset.portName
        const port     = node.ports[portName]
        if (!port) return
        el.style.left = `${pos.left + port.x}px`
        el.style.top  = `${pos.top  + port.y}px`
      })
    }
  }, [])

  // ── FIX #7 — viewportSize as ref instead of state ──────────────────────────
  // Divide by --app-scale because html has CSS `zoom: var(--app-scale)`:
  // window.innerWidth is the visual viewport, but layout coordinates are
  // inflated to 1/scale so the orb must be centered against that wider box.
  const appScale = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--app-scale')
  ) || 1
  const viewportRef       = useRef({
    width:  window.innerWidth  / appScale,
    height: window.innerHeight / appScale,
  })
  const initialPositionX  = useMemo(() => viewportRef.current.width  / 2 - AVATAR.x * INITIAL_SCALE, [])
  const initialPositionY  = useMemo(() => viewportRef.current.height / 2 - AVATAR.y * INITIAL_SCALE, [])

  // ── FIX #6 — stable pointermove/pointerup handlers via ref ─────────────────
  // Storing the handler body in a ref lets us avoid re-adding listeners when
  // scale or positions change, while still reading the latest values.
  const onMoveBody = useRef(null)
  const onUpBody   = useRef(null)

  // Stable wrapper — same function reference for the lifetime of the component
  const stableMove = useRef((e) => onMoveBody.current?.(e))
  const stableUp   = useRef(() => onUpBody.current?.())

  onMoveBody.current = (event) => {
    if (!dragRef.current) return
    const drag   = dragRef.current
    const scale  = scaleRef.current
    const deltaX = (event.clientX - drag.startClientX) / scale
    const deltaY = (event.clientY - drag.startClientY) / scale
    const newLeft = drag.startLeft + deltaX
    const newTop  = drag.startTop  + deltaY

    const now = performance.now()
    const dt  = Math.max(now - (drag.lastTime || now), 1)
    drag.velocityX = ((event.clientX - (drag.lastClientX ?? event.clientX)) / scale) / dt * 16
    drag.velocityY = ((event.clientY - (drag.lastClientY ?? event.clientY)) / scale) / dt * 16
    drag.lastClientX = event.clientX
    drag.lastClientY = event.clientY
    drag.lastTime    = now

    const el = cardEls.current[drag.id]
    if (el) { el.style.left = `${newLeft}px`; el.style.top = `${newTop}px` }

    positionsRef.current = { ...positionsRef.current, [drag.id]: { left: newLeft, top: newTop } }
    updateEdgesForDrag(drag.id, positionsRef.current, drag.velocityX, drag.velocityY)
  }

  onUpBody.current = () => {
    if (!dragRef.current) return
    const dropId = dragRef.current.id
    for (const g of dragEdgeGroupsRef.current) g.classList.remove('edge-dragging')
    dragEdgeGroupsRef.current = []

    const el = cardEls.current[dropId]
    if (el) el.style.transition = ''

    const svg = svgRef.current
    if (svg) {
      const affected = EDGE_DEFS.filter(e => e.from === dropId || e.to === dropId)
      for (const edge of affected) {
        const group = svg.querySelector(`[data-edge-group="${edge.id}"]`)
        if (!group) continue
        const start = getPortPoint(edge.from, edge.fromPort, positionsRef.current)
        const end   = getPortPoint(edge.to,   edge.toPort,   positionsRef.current)
        const pts   = buildOrthogonalPoints(start, end, edge.axis, edge.bendRatio)
        const d     = buildRoundedCablePath(pts)
        group.classList.add('edge-settling')
        group.querySelectorAll('path').forEach(p => p.setAttribute('d', d))
        setTimeout(() => group.classList.remove('edge-settling'), 400)
      }
    }

    setPositions({ ...positionsRef.current })
    setDraggingId(null)
    dragRef.current = null
    window.removeEventListener('pointermove', stableMove.current)
    window.removeEventListener('pointerup',   stableUp.current)
  }

  // ── FIX #6 — useCallback on all handlers ───────────────────────────────────
  const handleCardPointerDown = useCallback((event, id) => {
    event.preventDefault()
    event.stopPropagation()
    const pos = positionsRef.current[id]
    dragRef.current = {
      id,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startLeft:    pos.left,
      startTop:     pos.top,
      lastClientX:  event.clientX,
      lastClientY:  event.clientY,
      lastTime:     performance.now(),
      velocityX:    0,
      velocityY:    0,
    }
    const el = cardEls.current[id]
    if (el) {
      el.style.transition = 'box-shadow 120ms ease'
      el.setPointerCapture(event.pointerId)
    }
    setDraggingId(id)
    window.addEventListener('pointermove', stableMove.current)
    window.addEventListener('pointerup',   stableUp.current)
  }, [])

  const handleToggleCollapse = useCallback((nodeId) => {
    hasMeasured.current = false
    setCollapsedNodes(cur => {
      const next = new Set(cur)
      next.has(nodeId) ? next.delete(nodeId) : next.add(nodeId)
      return next
    })
  }, [])

  const handleWorkspaceToggle = useCallback(() => setIsWorkspaceOpen(c => !c), [])
  const handleTaskToggle      = useCallback(() => setIsTaskOpen(c => !c), [])
  const closeAllPanels        = useCallback(() => { setIsWorkspaceOpen(false); setIsTaskOpen(false) }, [])
  const handleAvatarClick     = useCallback(() => setIsActive(c => !c), [])
  const gridElRef = useRef(null)
  const handleTransformed = useCallback((_, state) => {
    scaleRef.current = state.scale
    // Cache the grid DOM element on first call
    if (!gridElRef.current) gridElRef.current = document.querySelector('.intelligence-map-grid')
    if (gridElRef.current) {
      // Below 0.45 all 32 cards are visible simultaneously — switch to low-cost
      // rendering mode: hide card internals + disable SVG blur filters via CSS.
      // Direct DOM class toggle = zero React re-renders during zoom.
      gridElRef.current.classList.toggle('intelligence-map-grid--zoomed-out', state.scale < 0.45)
    }
  }, [])

  // ── Cursor-pivoted wheel zoom (replaces library's built-in wheel) ───────────
  // The library reads event.clientX/Y as if they were in the same coordinate
  // system as its internal positionX/Y, but html has CSS `zoom: var(--app-scale)`
  // so clientX/Y are in visual-viewport pixels while positionX/Y / scale operate
  // in layout (pre-zoom-inflated) pixels. The mismatch is exactly 1/appScale,
  // which is why the zoom pivot drifts off-cursor. We do our own pivot math here
  // so the world point under the cursor stays pinned during wheel zoom.
  const transformRef = useRef(null)
  const zoomContainerRef = useRef(null)
  // Floor sits just above the 0.45 "zoomed-out fallback" threshold so all 32 cards
  // never render simultaneously — that mode exhausts the compositor texture budget.
  const MIN_SCALE = 0.5
  const MAX_SCALE = 1.8

  const handleWheelZoom = useCallback((event) => {
    const ctx = transformRef.current
    const container = zoomContainerRef.current
    if (!ctx || !container) return

    // Only react to non-pinch wheel; ctrl+wheel is the browser pinch-zoom proxy
    // and should also pivot on cursor, so we accept it too.
    event.preventDefault()

    const { scale, positionX, positionY } = ctx.state
    const rect = container.getBoundingClientRect()
    const appScale = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--app-scale')
    ) || 1

    // event.clientX/Y and rect.left/top are both in visual-viewport pixels.
    // Divide by appScale to land in the layout coordinate system that the
    // library's positionX/Y and scale operate in.
    const cursorX = (event.clientX - rect.left) / appScale
    const cursorY = (event.clientY - rect.top) / appScale

    // The world (canvas) coordinate currently under the cursor.
    const worldX = (cursorX - positionX) / scale
    const worldY = (cursorY - positionY) / scale

    // Exponential step gives the same zoom feel across mouse wheels (deltaY≈100
    // per notch) and trackpads (deltaY ranging from ~1 to ~50 per frame). Tweak
    // 0.0015 to make zoom faster/slower.
    const factor = Math.exp(-event.deltaY * 0.0015)
    const nextScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * factor))
    if (nextScale === scale) return

    // Solve for new position so that worldX/Y projects back to the same
    // cursor pixel under the new scale: cursor = position + world * scale
    const nextPositionX = cursorX - worldX * nextScale
    const nextPositionY = cursorY - worldY * nextScale

    ctx.setTransform(nextPositionX, nextPositionY, nextScale, 0)
  }, [])

  useEffect(() => {
    const el = zoomContainerRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheelZoom, { passive: false })
    return () => el.removeEventListener('wheel', handleWheelZoom)
  }, [handleWheelZoom])

  // Block browser-level zoom shortcuts (Ctrl/Cmd + -, =, +, 0) while the map
  // is mounted. The map manages its own zoom via TransformWrapper, and browser
  // zoom-out re-rasterises the whole page including all 32 cards — expensive
  // and visually broken since CSS `zoom: var(--app-scale)` already fixes layout.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return
      if (e.key === '-' || e.key === '=' || e.key === '+' || e.key === '0') {
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', onKeyDown, { passive: false })
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // NOTE: We intentionally do NOT compensate browser-menu zoom-out here.
  // The container is sized in `vw`/`vh` units (--vw/--vh), which already track
  // the visible viewport at any browser zoom — it always covers exactly the
  // screen, no more. The previous `zoom: 1/ratio` hack double-counted that
  // (vw grows AND we re-zoomed), inflating the container to ~2x the viewport on
  // zoom-out. That overflow is what rendered/animated DotGrid dots off-screen
  // ("invisible barrier") and tanked performance. Browser zoom on this page now
  // behaves like every other page in the app.

  // Cleanup stale listeners if component unmounts mid-drag
  useEffect(() => () => {
    window.removeEventListener('pointermove', stableMove.current)
    window.removeEventListener('pointerup',   stableUp.current)
  }, [])

  // Scene mount/unmount on avatar toggle
  useEffect(() => {
    let mountTimer, showTimer, sceneTimer, hideTimer
    if (isActive) {
      mountTimer = setTimeout(() => setMounted(true), 0)
      showTimer  = setTimeout(() => setSceneVisible(true), OPEN_START_DELAY_MS)
    } else {
      sceneTimer = setTimeout(() => setSceneVisible(false), 0)
      hideTimer  = setTimeout(() => setMounted(false), CLOSE_DURATION_MS)
    }
    return () => { clearTimeout(mountTimer); clearTimeout(showTimer); clearTimeout(sceneTimer); clearTimeout(hideTimer) }
  }, [isActive])

  // Measure actual card heights after render and update port positions so
  // cables and connectors align with the real card edges, not the static
  // height estimates from createNode.
  const hasMeasured = useRef(false)
  useEffect(() => {
    if (!mounted || !sceneVisible || hasMeasured.current) return
    const timer = setTimeout(() => {
      let changed = false
      for (const [id, el] of Object.entries(cardEls.current)) {
        if (!el) continue
        const h = el.clientHeight
        const w = el.clientWidth
        const node = CARD_NODES[id]
        if (Math.abs(node.ports.left.y - h / 2) > 2) {
          node.ports.left.y   = h / 2
          node.ports.right.y  = h / 2
          node.ports.bottom.y = h
          node.ports.right.x  = w
          node.ports.top.x    = w / 2
          node.ports.bottom.x = w / 2
          node.width  = w
          node.height = h
          changed = true
        }
      }
      if (changed) {
        setPositions(prev => ({ ...prev }))
      }
      hasMeasured.current = true
    }, 300)
    return () => clearTimeout(timer)
  }, [mounted, sceneVisible, collapsedNodes])

  const visibleNodeIds = useMemo(() => buildVisibleNodeSet(collapsedNodes), [collapsedNodes])
  const visibleEdges   = useMemo(() => {
    const s = new Set()
    for (const edge of EDGE_DEFS) {
      if (visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to)) s.add(edge.id)
    }
    return s
  }, [visibleNodeIds])

  const wrapperStyle = useMemo(() => ({ width: 'var(--vw)', height: 'var(--vh)' }), [])
  const contentStyle = useMemo(() => ({ width: `${CANVAS.width}px`, height: `${CANVAS.height}px` }), [])

  const panelsPaired       = isWorkspaceOpen && isTaskOpen
  const shouldShowWorkspace = isWorkspaceOpen
  const shouldShowTask      = isTaskOpen
  const isAnyPanelOpen     = shouldShowWorkspace || shouldShowTask

  return (
    <>
      <div
        ref={zoomContainerRef}
        style={{
          width: 'var(--vw)', height: 'var(--vh)', overflow: 'hidden', position: 'relative',
          background: 'linear-gradient(180deg, #ffffff 0%, #f4f6f8 100%)',
          cursor: draggingId ? 'grabbing' : toolMode === 'hand' ? 'grab' : 'default',
        }}
      >
        {/* DotGrid: hard-capped to the visible viewport so it never builds dots
             off-screen, and its render loop idles when nothing is animating.
             Canvas background is transparent so dots show through the map gaps.
             Listens to window mousemove directly so pointer-events:none is fine. */}
        <DotGrid
          style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
          dotSize={4} gap={28} baseColor="#b0b8c8" activeColor="#4f7fff"
          proximity={130} shockRadius={260} shockStrength={5}
          resistance={750} returnDuration={1.5}
        />

        <div style={{ position:'absolute', inset:0, transformOrigin:'center center', willChange:'transform', transition:'transform 580ms cubic-bezier(0.22,1,0.36,1)', transform:'scale(1) translateX(0px)' }}>
          <Photo />
          <MainNav activeId={activeNavId} onSelect={onNavigate} />
          <ProjectList onNavigate={onNavigate} />

          <TransformWrapper
            ref={transformRef}
            initialScale={INITIAL_SCALE}
            initialPositionX={initialPositionX}
            initialPositionY={initialPositionY}
            minScale={MIN_SCALE} maxScale={MAX_SCALE}
            limitToBounds={false}
            smooth
            // Library wheel disabled — see handleWheelZoom above for the
            // cursor-pivoted replacement that accounts for CSS `zoom`.
            wheel={{ disabled: true }}
            panning={{ disabled: Boolean(draggingId) || toolMode === 'cursor', velocityDisabled: true }}
            doubleClick={{ disabled: true }}
            onTransformed={handleTransformed}
          >
            <BottomAITools
              scale={scaleRef.current}
              initialScale={INITIAL_SCALE}
              mode={toolMode}
              onTaskOpen={handleTaskToggle}
              onModeChange={(nextMode) => {
                if (nextMode === 'ask-nora') { handleWorkspaceToggle(); return }
                setToolMode(nextMode)
              }}
            />
            <TransformComponent wrapperStyle={wrapperStyle} contentStyle={contentStyle}>
              <MapCanvas
                mounted={mounted} sceneVisible={sceneVisible}
                visibleNodeIds={visibleNodeIds} visibleEdges={visibleEdges}
                positions={positions} draggingId={draggingId}
                collapsedNodes={collapsedNodes}
                onAvatarClick={handleAvatarClick}
                onCardPointerDown={handleCardPointerDown}
                onToggleCollapse={handleToggleCollapse}
                cardEls={cardEls}
                svgRef={svgRef}
              />
            </TransformComponent>
          </TransformWrapper>
        </div>

        {isAnyPanelOpen && (
          <div onClick={closeAllPanels}
            style={{ position:'fixed', inset:0, zIndex:44, background:'rgba(0,0,0,0)', cursor:'pointer' }}
            aria-hidden="true" />
        )}

        {shouldShowWorkspace && (
          <NoraWorkspace open pairedWithTask={panelsPaired} onClose={() => setIsWorkspaceOpen(false)} />
        )}

        {shouldShowTask && (
          <div
            className={panelsPaired ? 'intelligence-week-panel intelligence-week-panel--paired' : 'intelligence-week-panel'}
            onClick={e => e.stopPropagation()}
            style={{ position:'fixed', top:24, right:24, bottom:24, zIndex:55,
              width: panelsPaired ? '496px' : 'min(520px, calc(var(--vw) - 48px))',
              overflowY:'auto', transition:'transform 520ms cubic-bezier(0.22,1,0.36,1)',
              boxShadow:'-18px 0 48px rgba(20,35,76,0.12)', borderRadius:24 }}>
            <WeekTask onClose={() => setIsTaskOpen(false)} />
          </div>
        )}
      </div>
    </>
  )
}
