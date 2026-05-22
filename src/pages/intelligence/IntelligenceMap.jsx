import { useEffect, useMemo, useState } from 'react'
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
import './IntelligenceMap.css'
import WeekTask from '../../components/tasks/Weektask'
import DotGrid from '../../components/background/DotGrid'
const CANVAS = {
  width: 7800,
  height: 4300,
  centerX: 3900,
  centerY: 2150,
}

const AVATAR = {
  x: CANVAS.centerX,
  y: CANVAS.centerY,
  radius: 66,
}

const CARD_WIDTH = 418
const CARD_HEIGHT = 500

function createNode(Component, left, top, options = {}) {
  const width = options.width ?? CARD_WIDTH
  const height = options.height ?? CARD_HEIGHT

  return {
    Component,
    left,
    top,
    width,
    height,
    revealDelay: options.revealDelay ?? 420,
    enterX: options.enterX ?? (left < CANVAS.centerX ? -56 : 56),
    enterY: options.enterY ?? 0,
    ports: {
      left: { x: 0, y: height / 2 },
      right: { x: width, y: height / 2 },
      top: { x: width / 2, y: 0 },
      bottom: { x: width / 2, y: height },
    },
  }
}

const CARD_NODES = {
  analytics: createNode(AnalyticsReportingCard, 2440, 610, { height: 560, revealDelay: 360, enterY: -34 }),
  campaignPerformance: createNode(CampaignPerformanceCard, 1860, 1110, { revealDelay: 510, enterY: -18 }),
  conversionFunnel: createNode(ConversionFunnelCard, 2520, 1280, { revealDelay: 660 }),
  performanceSummary: createNode(PerformanceSummaryCard, 1440, 1740, { revealDelay: 810, enterY: 24 }),
  portfolioAnalytics: createNode(PortfolioAnalyticsCard, 2080, 2060, { revealDelay: 960, enterY: 28 }),
  salesReport: createNode(SalesReportCard, 2740, 2080, { revealDelay: 1110, enterY: 28 }),
  trafficSourceBreakdown: createNode(TrafficSourceBreakdownCard, 1440, 860, { revealDelay: 1260, enterY: -28 }),

  automation: createNode(AutomationExecutionCard, 3280, 2920, { height: 430, revealDelay: 470, enterY: 40 }),
  workflowAutomation: createNode(WorkflowAutomationCard, 2380, 3200, { revealDelay: 640, enterY: 46 }),
  taskExecution: createNode(TaskExecutionCard, 3280, 3560, { revealDelay: 810, enterY: 50 }),
  systemMonitoring: createNode(SystemMonitoringCard, 1480, 3060, { revealDelay: 980, enterY: 54 }),

  website: createNode(WebsiteTrafficCard, 900, 2360, { revealDelay: 520, enterY: 38 }),
  trafficQuality: createNode(TrafficQualityCard, 760, 1540, { revealDelay: 690, enterY: 18 }),
  userBehavior: createNode(UserBehaviorCard, 760, 3180, { revealDelay: 860, enterY: 52 }),
  pagePerformance: createNode(PagePerformanceCard, 1180, 2360, { revealDelay: 1030, enterY: 38 }),
  seoInsights: createNode(SEOInsightsCard, 1800, 2680, { revealDelay: 1200, enterY: 42 }),
  conversionSignals: createNode(ConversionSignalsCard, 1180, 760, { revealDelay: 1370, enterY: -32 }),
  websiteTrafficStatus: createNode(WebsiteTrafficStatusCard, 520, 2360, { revealDelay: 1540, enterY: 38 }),

  strategy: createNode(StrategyIntelligenceCard, 4420, 610, { height: 490, revealDelay: 420, enterY: -34 }),
  marketInsights: createNode(MarketInsightsCard, 5040, 840, { revealDelay: 590, enterY: -28 }),
  competitorTracking: createNode(CompetitorTrackingCard, 5680, 610, { revealDelay: 760, enterY: -34 }),
  growthStrategy: createNode(GrowthStrategyCard, 4440, 1280, { revealDelay: 930 }),
  opportunityDetection: createNode(OpportunityDetectionCard, 5120, 1490, { revealDelay: 1100, enterY: 16 }),
  riskDetection: createNode(RiskDetectionCard, 5900, 1320, { revealDelay: 1270, enterY: 18 }),

  social: createNode(SocialMediaManagerCard, 4580, 2040, { width: 419, height: 496, revealDelay: 520 }),
  socialStrategy: createNode(SocialMediaStrategyCard, 5200, 2040, { revealDelay: 690 }),
  performance: createNode(PerformanceTrackingCard, 5840, 2040, { revealDelay: 860 }),
  image: createNode(ImageGenerationCard, 6500, 1490, { revealDelay: 1030, enterY: -18 }),
  caption: createNode(CaptionGenerationCard, 6500, 2520, { revealDelay: 1200, enterY: 24 }),
  publishing: createNode(SocialMediaPublishingCard, 7000, 2020, { revealDelay: 1370 }),

  sales: createNode(SalesAndLeadsCard, 4360, 3120, { height: 490, revealDelay: 570, enterY: 44 }),
  leadGeneration: createNode(LeadGenerationCard, 5020, 2920, { revealDelay: 740, enterY: 42 }),
  leadScoring: createNode(LeadScoringCard, 5680, 3140, { revealDelay: 910, enterY: 48 }),
  pipelineTracking: createNode(PipelineTrackingCard, 6380, 3120, { revealDelay: 1080, enterY: 50 }),
  revenueFeedback: createNode(RevenueFeedbackCard, 5020, 3560, { revealDelay: 1250, enterY: 54 }),
}

const EDGE_DEFS = [
  { id: 'avatar-analytics', from: 'avatar', fromPort: 'left', to: 'analytics', toPort: 'right', axis: 'horizontal', bendRatio: 0.54, drawDelay: 120, width: 8, beamDuration: 3300, beamDirection: 'toAvatar' },
  { id: 'avatar-website', from: 'avatar', fromPort: 'left', to: 'website', toPort: 'right', axis: 'horizontal', bendRatio: 0.52, drawDelay: 240, width: 7.5, beamDuration: 3200, beamDirection: 'toAvatar' },
  { id: 'avatar-automation', from: 'avatar', fromPort: 'bottom', to: 'automation', toPort: 'top', axis: 'vertical', bendRatio: 0.56, drawDelay: 360, width: 7.5, beamDuration: 3150, beamDirection: 'toAvatar' },
  { id: 'avatar-strategy', from: 'avatar', fromPort: 'right', to: 'strategy', toPort: 'left', axis: 'horizontal', bendRatio: 0.48, drawDelay: 480, width: 8, beamDuration: 3300, beamDirection: 'fromAvatar' },
  { id: 'avatar-social', from: 'avatar', fromPort: 'right', to: 'social', toPort: 'left', axis: 'horizontal', bendRatio: 0.46, drawDelay: 600, width: 8.5, beamDuration: 3100, beamDirection: 'fromAvatar' },
  { id: 'avatar-sales', from: 'avatar', fromPort: 'bottom', to: 'sales', toPort: 'top', axis: 'vertical', bendRatio: 0.58, drawDelay: 720, width: 7.5, beamDuration: 3000, beamDirection: 'fromAvatar' },

  { id: 'analytics-campaign', from: 'analytics', fromPort: 'left', to: 'campaignPerformance', toPort: 'right', axis: 'horizontal', bendRatio: 0.54, drawDelay: 860, width: 5.8, beamDuration: 2600, beamDirection: 'forward' },
  { id: 'analytics-conversion', from: 'analytics', fromPort: 'bottom', to: 'conversionFunnel', toPort: 'top', axis: 'vertical', bendRatio: 0.44, drawDelay: 940, width: 5.8, beamDuration: 2600, beamDirection: 'forward' },
  { id: 'campaign-traffic-source', from: 'campaignPerformance', fromPort: 'left', to: 'trafficSourceBreakdown', toPort: 'right', axis: 'horizontal', bendRatio: 0.5, drawDelay: 1020, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'campaign-performance-summary', from: 'campaignPerformance', fromPort: 'bottom', to: 'performanceSummary', toPort: 'top', axis: 'vertical', bendRatio: 0.48, drawDelay: 1100, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'conversion-portfolio', from: 'conversionFunnel', fromPort: 'bottom', to: 'portfolioAnalytics', toPort: 'top', axis: 'vertical', bendRatio: 0.54, drawDelay: 1180, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'conversion-sales-report', from: 'conversionFunnel', fromPort: 'bottom', to: 'salesReport', toPort: 'top', axis: 'vertical', bendRatio: 0.58, drawDelay: 1260, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },

  { id: 'website-status', from: 'website', fromPort: 'left', to: 'websiteTrafficStatus', toPort: 'right', axis: 'horizontal', bendRatio: 0.52, drawDelay: 900, width: 5.4, beamDuration: 2600, beamDirection: 'forward' },
  { id: 'website-quality', from: 'website', fromPort: 'top', to: 'trafficQuality', toPort: 'bottom', axis: 'vertical', bendRatio: 0.46, drawDelay: 980, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'website-page-performance', from: 'website', fromPort: 'right', to: 'pagePerformance', toPort: 'left', axis: 'horizontal', bendRatio: 0.5, drawDelay: 1060, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'website-user-behavior', from: 'website', fromPort: 'bottom', to: 'userBehavior', toPort: 'top', axis: 'vertical', bendRatio: 0.52, drawDelay: 1140, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'page-seo', from: 'pagePerformance', fromPort: 'right', to: 'seoInsights', toPort: 'left', axis: 'horizontal', bendRatio: 0.5, drawDelay: 1220, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'quality-conversion-signals', from: 'trafficQuality', fromPort: 'top', to: 'conversionSignals', toPort: 'bottom', axis: 'vertical', bendRatio: 0.48, drawDelay: 1300, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },

  { id: 'automation-workflow', from: 'automation', fromPort: 'left', to: 'workflowAutomation', toPort: 'right', axis: 'horizontal', bendRatio: 0.52, drawDelay: 920, width: 5.4, beamDuration: 2600, beamDirection: 'forward' },
  { id: 'automation-task', from: 'automation', fromPort: 'bottom', to: 'taskExecution', toPort: 'top', axis: 'vertical', bendRatio: 0.5, drawDelay: 1000, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'workflow-monitoring', from: 'workflowAutomation', fromPort: 'left', to: 'systemMonitoring', toPort: 'right', axis: 'horizontal', bendRatio: 0.5, drawDelay: 1080, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },

  { id: 'strategy-market', from: 'strategy', fromPort: 'right', to: 'marketInsights', toPort: 'left', axis: 'horizontal', bendRatio: 0.5, drawDelay: 900, width: 5.4, beamDuration: 2600, beamDirection: 'forward' },
  { id: 'market-competitor', from: 'marketInsights', fromPort: 'right', to: 'competitorTracking', toPort: 'left', axis: 'horizontal', bendRatio: 0.5, drawDelay: 980, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'strategy-growth', from: 'strategy', fromPort: 'bottom', to: 'growthStrategy', toPort: 'top', axis: 'vertical', bendRatio: 0.48, drawDelay: 1060, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'growth-opportunity', from: 'growthStrategy', fromPort: 'right', to: 'opportunityDetection', toPort: 'left', axis: 'horizontal', bendRatio: 0.52, drawDelay: 1140, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'competitor-risk', from: 'competitorTracking', fromPort: 'bottom', to: 'riskDetection', toPort: 'top', axis: 'vertical', bendRatio: 0.54, drawDelay: 1220, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },

  { id: 'social-strategy', from: 'social', fromPort: 'right', to: 'socialStrategy', toPort: 'left', axis: 'horizontal', bendRatio: 0.5, drawDelay: 940, width: 5.6, beamDuration: 2600, beamDirection: 'forward' },
  { id: 'social-performance', from: 'socialStrategy', fromPort: 'right', to: 'performance', toPort: 'left', axis: 'horizontal', bendRatio: 0.5, drawDelay: 1020, width: 5.4, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'performance-image', from: 'performance', fromPort: 'top', to: 'image', toPort: 'bottom', axis: 'vertical', bendRatio: 0.5, drawDelay: 1100, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'performance-caption', from: 'performance', fromPort: 'bottom', to: 'caption', toPort: 'top', axis: 'vertical', bendRatio: 0.5, drawDelay: 1180, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'image-publishing', from: 'image', fromPort: 'right', to: 'publishing', toPort: 'top', axis: 'horizontal', bendRatio: 0.58, drawDelay: 1260, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'caption-publishing', from: 'caption', fromPort: 'right', to: 'publishing', toPort: 'bottom', axis: 'horizontal', bendRatio: 0.58, drawDelay: 1340, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },

  { id: 'sales-lead-generation', from: 'sales', fromPort: 'right', to: 'leadGeneration', toPort: 'left', axis: 'horizontal', bendRatio: 0.5, drawDelay: 960, width: 5.4, beamDuration: 2600, beamDirection: 'forward' },
  { id: 'lead-generation-scoring', from: 'leadGeneration', fromPort: 'right', to: 'leadScoring', toPort: 'left', axis: 'horizontal', bendRatio: 0.5, drawDelay: 1040, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'lead-scoring-pipeline', from: 'leadScoring', fromPort: 'right', to: 'pipelineTracking', toPort: 'left', axis: 'horizontal', bendRatio: 0.5, drawDelay: 1120, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
  { id: 'lead-generation-revenue', from: 'leadGeneration', fromPort: 'bottom', to: 'revenueFeedback', toPort: 'top', axis: 'vertical', bendRatio: 0.52, drawDelay: 1200, width: 5.2, beamDuration: 2500, beamDirection: 'forward' },
]

const MAIN_CARD_NODE_IDS = ['analytics', 'website', 'automation', 'strategy', 'social', 'sales']
const MAIN_CARD_NODE_SET = new Set(MAIN_CARD_NODE_IDS)
const OPEN_START_DELAY_MS = 260
const CLOSE_DURATION_MS = 1400
const INITIAL_SCALE = 1.10625

function createInitialCollapsedNodes() {
  return new Set(MAIN_CARD_NODE_IDS)
}

function createInitialPositions() {
  return Object.fromEntries(
    Object.entries(CARD_NODES).map(([id, node]) => [
      id,
      {
        left: node.left,
        top: node.top,
      },
    ]),
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

function getAvatarPort(portName) {
  const avatarPorts = {
    left: { x: AVATAR.x - AVATAR.radius, y: AVATAR.y },
    right: { x: AVATAR.x + AVATAR.radius, y: AVATAR.y },
    top: { x: AVATAR.x, y: AVATAR.y - AVATAR.radius },
    bottom: { x: AVATAR.x, y: AVATAR.y + AVATAR.radius },
  }

  return avatarPorts[portName]
}

function getPortPoint(nodeId, portName, positions) {
  if (nodeId === 'avatar') {
    return getAvatarPort(portName)
  }

  const node = CARD_NODES[nodeId]
  const port = node.ports[portName]
  const position = positions[nodeId]

  return {
    x: position.left + port.x,
    y: position.top + port.y,
  }
}

function buildVisibleNodeSet(collapsedNodes) {
  const visible = new Set(['avatar'])
  const queue = ['avatar']

  while (queue.length > 0) {
    const current = queue.shift()
    const children = CHILDREN_BY_NODE[current] ?? []

    if (current !== 'avatar' && collapsedNodes.has(current)) {
      continue
    }

    for (const child of children) {
      if (!visible.has(child)) {
        visible.add(child)
        queue.push(child)
      }
    }
  }

  return visible
}

function buildOrthogonalPoints(start, end, axis, bendRatio) {
  if (axis === 'vertical') {
    const middleY = start.y + (end.y - start.y) * bendRatio
    return [
      start,
      { x: start.x, y: middleY },
      { x: end.x, y: middleY },
      end,
    ]
  }

  const middleX = start.x + (end.x - start.x) * bendRatio
  return [
    start,
    { x: middleX, y: start.y },
    { x: middleX, y: end.y },
    end,
  ]
}

function buildRoundedCablePath(points, radius = 24) {
  if (points.length <= 2) {
    return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  }

  let path = `M ${points[0].x} ${points[0].y}`

  for (let index = 1; index < points.length - 1; index += 1) {
    const previous = points[index - 1]
    const current = points[index]
    const next = points[index + 1]

    const inX = current.x - previous.x
    const inY = current.y - previous.y
    const outX = next.x - current.x
    const outY = next.y - current.y

    const inLength = Math.hypot(inX, inY)
    const outLength = Math.hypot(outX, outY)
    const usableRadius = Math.min(radius, inLength / 2, outLength / 2)

    const entry = {
      x: current.x - (inX / inLength) * usableRadius,
      y: current.y - (inY / inLength) * usableRadius,
    }

    const exit = {
      x: current.x + (outX / outLength) * usableRadius,
      y: current.y + (outY / outLength) * usableRadius,
    }

    path += ` L ${entry.x} ${entry.y} Q ${current.x} ${current.y} ${exit.x} ${exit.y}`
  }

  const end = points[points.length - 1]
  path += ` L ${end.x} ${end.y}`

  return path
}

function createCardStyle(node, position, isVisible, isDragging) {
  const delay = isVisible ? node.revealDelay : 0

  return {
    position: 'absolute',
    left: position.left,
    top: position.top,
    zIndex: isDragging ? 20 : position.left > CANVAS.centerX ? 5 : 4,
    opacity: isVisible ? 1 : 0,
    transform: `translate(${isVisible ? 0 : node.enterX}px, ${isVisible ? 0 : node.enterY}px) scale(${isVisible ? 1 : 0.94})`,
    transformOrigin: position.left > CANVAS.centerX ? 'left center' : 'right center',
    transition: [
      `opacity ${isVisible ? 720 : 260}ms cubic-bezier(.16,1,.3,1) ${delay}ms`,
      `transform ${isVisible ? 1180 : 420}ms cubic-bezier(.16,1,.3,1) ${delay}ms`,
      `filter ${isVisible ? 1180 : 420}ms cubic-bezier(.16,1,.3,1) ${delay}ms`,
      isDragging ? 'box-shadow 180ms ease' : 'box-shadow 260ms ease',
    ].join(', '),
    filter: isVisible ? 'blur(0px) brightness(1)' : 'blur(8px) brightness(1.08)',
    pointerEvents: isVisible ? 'auto' : 'none',
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: 'none',
    touchAction: 'none',
    boxShadow: isDragging ? '0 22px 48px rgba(15, 23, 42, 0.2)' : 'none',
    willChange: 'transform, opacity, filter',
  }
}

function buildUsedPortsMap(visibleEdges) {
  const map = {}

  for (const edge of visibleEdges) {
    map[edge.from] ??= new Set()
    map[edge.to] ??= new Set()
    map[edge.from].add(edge.fromPort)
    map[edge.to].add(edge.toPort)
  }

  return map
}

function GraphLines({ sceneVisible, visibleEdges, positions }) {
  const dashLength = 6200

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'visible',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <defs>
        <filter id="cable-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="9" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="beam-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="beam-soft-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="11" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(47,121,255,0)" />
          <stop offset="12%" stopColor="rgba(47,121,255,0)" />
          <stop offset="42%" stopColor="rgba(86,188,255,0.16)" />
          <stop offset="74%" stopColor="rgba(126,224,255,0.78)" />
          <stop offset="92%" stopColor="rgba(230,247,255,0.98)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id="beam-core-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="52%" stopColor="rgba(255,255,255,0)" />
          <stop offset="82%" stopColor="rgba(214,244,255,0.42)" />
          <stop offset="100%" stopColor="rgba(255,255,255,1)" />
        </linearGradient>
        <linearGradient id="beam-wake-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(47,121,255,0)" />
          <stop offset="24%" stopColor="rgba(47,121,255,0)" />
          <stop offset="58%" stopColor="rgba(78,190,255,0.1)" />
          <stop offset="100%" stopColor="rgba(150,225,255,0.5)" />
        </linearGradient>
      </defs>

      {EDGE_DEFS.map((edge) => {
        const start = getPortPoint(edge.from, edge.fromPort, positions)
        const end = getPortPoint(edge.to, edge.toPort, positions)
        const points = buildOrthogonalPoints(start, end, edge.axis, edge.bendRatio)
        const path = buildRoundedCablePath(points)
        const isVisible = sceneVisible && visibleEdges.has(edge.id)
        const delay = isVisible ? edge.drawDelay : 0
        const forwardGradientId = `beam-forward-${edge.id}`
        const wakeGradientId = `beam-wake-${edge.id}`
        const beamStartsAtFrom = edge.beamDirection !== 'toAvatar'
        const beamStart = beamStartsAtFrom ? start : end
        const beamEnd = beamStartsAtFrom ? end : start
        const forwardDuration = Math.max(Math.round(edge.beamDuration * 0.96), 1900)
        const wakeDuration = Math.max(Math.round(edge.beamDuration * 1.3), 2600)

        return (
          <g key={edge.id}>
            <defs>
              <linearGradient id={forwardGradientId} gradientUnits="userSpaceOnUse" x1={beamStart.x - 180} y1={beamStart.y} x2={beamStart.x + 180} y2={beamStart.y}>
                <stop offset="0%" stopColor="rgba(47,121,255,0)" />
                <stop offset="18%" stopColor="rgba(47,121,255,0.04)" />
                <stop offset="52%" stopColor="rgba(86,188,255,0.88)" />
                <stop offset="82%" stopColor="rgba(216,244,255,0.96)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                <animate attributeName="x1" values={`${beamStart.x - 180};${beamEnd.x - 180}`} dur={`${forwardDuration}ms`} begin={`${delay}ms`} repeatCount="indefinite" />
                <animate attributeName="y1" values={`${beamStart.y};${beamEnd.y}`} dur={`${forwardDuration}ms`} begin={`${delay}ms`} repeatCount="indefinite" />
                <animate attributeName="x2" values={`${beamStart.x + 180};${beamEnd.x + 180}`} dur={`${forwardDuration}ms`} begin={`${delay}ms`} repeatCount="indefinite" />
                <animate attributeName="y2" values={`${beamStart.y};${beamEnd.y}`} dur={`${forwardDuration}ms`} begin={`${delay}ms`} repeatCount="indefinite" />
              </linearGradient>
              <linearGradient id={wakeGradientId} gradientUnits="userSpaceOnUse" x1={beamStart.x - 260} y1={beamStart.y} x2={beamStart.x + 120} y2={beamStart.y}>
                <stop offset="0%" stopColor="rgba(47,121,255,0)" />
                <stop offset="30%" stopColor="rgba(47,121,255,0.02)" />
                <stop offset="66%" stopColor="rgba(101,201,255,0.24)" />
                <stop offset="100%" stopColor="rgba(194,236,255,0.82)" />
                <animate attributeName="x1" values={`${beamStart.x - 260};${beamEnd.x - 260}`} dur={`${wakeDuration}ms`} begin={`${delay + 140}ms`} repeatCount="indefinite" />
                <animate attributeName="y1" values={`${beamStart.y};${beamEnd.y}`} dur={`${wakeDuration}ms`} begin={`${delay + 140}ms`} repeatCount="indefinite" />
                <animate attributeName="x2" values={`${beamStart.x + 120};${beamEnd.x + 120}`} dur={`${wakeDuration}ms`} begin={`${delay + 140}ms`} repeatCount="indefinite" />
                <animate attributeName="y2" values={`${beamStart.y};${beamEnd.y}`} dur={`${wakeDuration}ms`} begin={`${delay + 140}ms`} repeatCount="indefinite" />
              </linearGradient>
            </defs>
            <path
              d={path}
              fill="none"
              stroke="rgba(47,121,255,0.10)"
              strokeWidth={edge.width + 10}
              strokeLinecap="round"
              filter="url(#cable-glow)"
              style={{
                opacity: isVisible ? 0.88 : 0,
                animation: isVisible ? `cableGlowPulse ${Math.max(edge.beamDuration * 2.8, 6800)}ms ease-in-out ${delay}ms infinite` : 'none',
                transition: `opacity ${isVisible ? 760 : 260}ms ease ${delay}ms`,
              }}
            />
            <path
              d={path}
              fill="none"
              stroke="rgba(47,121,255,0.22)"
              strokeWidth={edge.width + 4}
              strokeLinecap="round"
              style={{
                strokeDasharray: dashLength,
                strokeDashoffset: isVisible ? 0 : dashLength,
                opacity: isVisible ? 0.92 : 0,
                animation: isVisible ? `cableBreathe ${Math.max(edge.beamDuration * 3.1, 7600)}ms ease-in-out ${delay}ms infinite` : 'none',
                transition: [
                  `stroke-dashoffset ${isVisible ? 1460 : 760}ms cubic-bezier(.22,1,.36,1) ${delay}ms`,
                  `opacity ${isVisible ? 760 : 260}ms ease ${delay}ms`,
                ].join(', '),
              }}
            />
            <path
              d={path}
              fill="none"
              stroke="rgba(47,121,255,0.46)"
              strokeWidth={edge.width}
              strokeLinecap="round"
              style={{
                strokeDasharray: dashLength,
                strokeDashoffset: isVisible ? 0 : dashLength,
                opacity: isVisible ? 0.94 : 0,
                transition: [
                  `stroke-dashoffset ${isVisible ? 1460 : 760}ms cubic-bezier(.22,1,.36,1) ${delay}ms`,
                  `opacity ${isVisible ? 760 : 260}ms ease ${delay}ms`,
                ].join(', '),
              }}
            />
            <path
              d={path}
              fill="none"
              stroke="rgba(224,242,255,0.12)"
              strokeWidth={Math.max(edge.width - 4.2, 1.6)}
              strokeLinecap="round"
              style={{
                opacity: isVisible ? 0.66 : 0,
                transition: `opacity ${isVisible ? 760 : 220}ms ease ${delay}ms`,
              }}
            />
            <path
              d={path}
              fill="none"
              stroke="rgba(202,236,255,0.18)"
              strokeWidth={Math.max(edge.width - 2.2, 2.8)}
              strokeLinecap="round"
              style={{
                opacity: isVisible ? 0.72 : 0,
                transition: `opacity ${isVisible ? 760 : 200}ms ease ${delay}ms`,
              }}
            />
            <path
              d={path}
              fill="none"
              stroke={`url(#${wakeGradientId})`}
              strokeWidth={Math.max(edge.width + 1.2, 4.8)}
              strokeLinecap="round"
              filter="url(#beam-soft-glow)"
              style={{
                opacity: isVisible ? 0.68 : 0,
                transition: `opacity ${isVisible ? 760 : 200}ms ease ${delay}ms`,
              }}
            />
            <path
              d={path}
              fill="none"
              stroke={`url(#${forwardGradientId})`}
              strokeWidth={Math.max(edge.width - 0.4, 4.2)}
              strokeLinecap="round"
              filter="url(#beam-glow)"
              style={{
                opacity: isVisible ? 1 : 0,
                transition: `opacity ${isVisible ? 760 : 200}ms ease ${delay}ms`,
              }}
            />
          </g>
        )
      })}
    </svg>
  )
}

function ConnectorsLayer({
  sceneVisible,
  visibleNodeIds,
  visibleEdges,
  positions,
  collapsedNodes,
  onToggleCollapse,
}) {
  const usedPorts = buildUsedPortsMap(
    EDGE_DEFS.filter((edge) => visibleEdges.has(edge.id)),
  )

  const connectorButtons = Object.entries(CHILDREN_BY_NODE)
    .filter(([nodeId]) => MAIN_CARD_NODE_SET.has(nodeId) && visibleNodeIds.has(nodeId))
    .flatMap(([nodeId]) => {
      const ports = [
        ...new Set(
          EDGE_DEFS
            .filter((edge) => edge.from === nodeId)
            .map((edge) => edge.fromPort),
        ),
      ]
      return ports.map((portName) => ({ nodeId, portName }))
    })

  const passiveSockets = Object.entries(usedPorts).flatMap(([nodeId, ports]) => {
    return [...ports]
      .filter(() => !(nodeId !== 'avatar' && (CHILDREN_BY_NODE[nodeId] ?? []).length > 0))
      .map((portName) => ({ nodeId, portName }))
  })

  return (
    <>
      {passiveSockets.map(({ nodeId, portName }) => {
        const point = getPortPoint(nodeId, portName, positions)

        return (
          <div
            key={`${nodeId}-${portName}-socket`}
            className="intelligence-map-socket"
            style={{
              position: 'absolute',
              left: point.x,
              top: point.y,
              width: nodeId === 'avatar' ? 18 : 14,
              height: nodeId === 'avatar' ? 18 : 14,
              transform: 'translate(-50%, -50%)',
              opacity: sceneVisible ? 1 : 0,
              pointerEvents: 'none',
              zIndex: 8,
            }}
          >
            <div className="intelligence-map-socket__core" />
          </div>
        )
      })}

      {connectorButtons.map(({ nodeId, portName }) => {
        const point = getPortPoint(nodeId, portName, positions)
        const isCollapsed = collapsedNodes.has(nodeId)

        return (
          <button
            key={`${nodeId}-${portName}-toggle`}
            type="button"
            className={isCollapsed
              ? 'intelligence-map-connector intelligence-map-connector--collapsed'
              : 'intelligence-map-connector intelligence-map-connector--expanded'}
            onPointerDown={(event) => {
              event.stopPropagation()
            }}
            onClick={(event) => {
              event.stopPropagation()
              onToggleCollapse(nodeId)
            }}
            style={{
              position: 'absolute',
              left: point.x,
              top: point.y,
              transform: 'translate(-50%, -50%)',
              opacity: sceneVisible ? 1 : 0,
              zIndex: 9,
            }}
            aria-label={isCollapsed ? 'Expand connected cards' : 'Collapse connected cards'}
          >
            <span className="intelligence-map-connector__icon">{isCollapsed ? '+' : '-'}</span>
          </button>
        )
      })}
    </>
  )
}

function CardsLayer({ mounted, sceneVisible, visibleNodeIds, positions, draggingId, onCardPointerDown }) {
  if (!mounted) {
    return null
  }

  return Object.entries(CARD_NODES).map(([id, node]) => {
    const Component = node.Component
    const position = positions[id]
    const isVisible = sceneVisible && visibleNodeIds.has(id)

    return (
      <div
        key={id}
        className={isVisible
          ? 'intelligence-map-card-shell intelligence-map-card-shell--visible'
          : 'intelligence-map-card-shell'}
        style={createCardStyle(node, position, isVisible, draggingId === id)}
        onPointerDown={(event) => onCardPointerDown(event, id)}
      >
        <Component />
      </div>
    )
  })
}

function MapCanvas({
  mounted,
  sceneVisible,
  visibleNodeIds,
  visibleEdges,
  positions,
  draggingId,
  collapsedNodes,
  onAvatarClick,
  onCardPointerDown,
  onToggleCollapse,
}) {
  return (
    <div
      className="intelligence-map-grid"
      style={{
        width: CANVAS.width,
        height: CANVAS.height,
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(245,247,250,0.96) 100%)',
      }}
    >
      <DotGrid
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        dotSize={4}
        gap={28}
        baseColor="#aaaaaa"
        activeColor="#555555"
        proximity={120}
        shockRadius={250}
        shockStrength={5}
        resistance={750}
        returnDuration={1.5}
      />

      <div
        className="intelligence-map-ambient"
        style={{
          position: 'absolute',
          left: AVATAR.x - 320,
          top: AVATAR.y - 320,
          width: 640,
          height: 640,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(88, 148, 255, 0.18) 0%, rgba(88, 148, 255, 0.09) 35%, rgba(88, 148, 255, 0) 75%)',
          filter: 'blur(16px)',
          opacity: sceneVisible ? 1 : 0.32,
          transition: 'opacity 1200ms ease',
        }}
      />

      <GraphLines sceneVisible={sceneVisible} visibleEdges={visibleEdges} positions={positions} />

      <CardsLayer
        mounted={mounted}
        sceneVisible={sceneVisible}
        visibleNodeIds={visibleNodeIds}
        positions={positions}
        draggingId={draggingId}
        onCardPointerDown={onCardPointerDown}
      />

      <ConnectorsLayer
        sceneVisible={sceneVisible}
        visibleNodeIds={visibleNodeIds}
        visibleEdges={visibleEdges}
        positions={positions}
        collapsedNodes={collapsedNodes}
        onToggleCollapse={onToggleCollapse}
      />

      <div
        style={{
          position: 'absolute',
          left: AVATAR.x,
          top: AVATAR.y,
          transform: `translate(-50%, -50%) scale(${sceneVisible ? 1 : 0.965})`,
          zIndex: 12,
          transition: 'transform 1200ms cubic-bezier(.22,1,.36,1)',
        }}
      >
        <NoraAvatar active={sceneVisible} onClick={onAvatarClick} />
      </div>
    </div>
  )
}


export default function IntelligenceMap({ activeNavId = 'stars', onNavigate }) {
  const [isActive, setIsActive] = useState(false)
  const [isTaskOpen, setIsTaskOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [sceneVisible, setSceneVisible] = useState(false)
  const [positions, setPositions] = useState(() => createInitialPositions())
  const [scale, setScale] = useState(INITIAL_SCALE)
  const [viewportSize, setViewportSize] = useState(() => ({
    width: typeof window === 'undefined' ? 1920 : window.innerWidth,
    height: typeof window === 'undefined' ? 1080 : window.innerHeight,
  }))
  const [toolMode, setToolMode] = useState('hand')
  const [dragState, setDragState] = useState(null)
  const [collapsedNodes, setCollapsedNodes] = useState(() => createInitialCollapsedNodes())
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false)
  const panelsPaired = isWorkspaceOpen && isTaskOpen
  const shouldShowWorkspace = isWorkspaceOpen
  const shouldShowTaskPanel = isTaskOpen

  useEffect(() => {
    let mountTimer
    let showTimer
    let sceneTimer
    let hideTimer

    if (isActive) {
      mountTimer = window.setTimeout(() => setMounted(true), 0)
      showTimer = window.setTimeout(() => setSceneVisible(true), OPEN_START_DELAY_MS)
    } else {
      sceneTimer = window.setTimeout(() => setSceneVisible(false), 0)
      hideTimer = window.setTimeout(() => setMounted(false), CLOSE_DURATION_MS)
    }

    return () => {
      window.clearTimeout(mountTimer)
      window.clearTimeout(showTimer)
      window.clearTimeout(sceneTimer)
      window.clearTimeout(hideTimer)
    }
  }, [isActive])

  useEffect(() => {
    if (!dragState) {
      return undefined
    }

    const handlePointerMove = (event) => {
      const deltaX = (event.clientX - dragState.startClientX) / scale
      const deltaY = (event.clientY - dragState.startClientY) / scale

      setPositions((current) => ({
        ...current,
        [dragState.id]: {
          left: dragState.startLeft + deltaX,
          top: dragState.startTop + deltaY,
        },
      }))
    }

    const handlePointerUp = () => {
      setDragState(null)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [dragState, scale])

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const wrapperStyle = useMemo(
    () => ({
      width: '100vw',
      height: '100vh',
    }),
    [],
  )

  const contentStyle = useMemo(
    () => ({
      width: `${CANVAS.width}px`,
      height: `${CANVAS.height}px`,
    }),
    [],
  )

  const visibleNodeIds = useMemo(() => buildVisibleNodeSet(collapsedNodes), [collapsedNodes])

  const visibleEdges = useMemo(() => {
    const edgeIds = new Set()

    for (const edge of EDGE_DEFS) {
      if (visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to)) {
        edgeIds.add(edge.id)
      }
    }

    return edgeIds
  }, [visibleNodeIds])

  const initialPositionX = viewportSize.width / 2 - AVATAR.x * INITIAL_SCALE
  const initialPositionY = viewportSize.height / 2 - AVATAR.y * INITIAL_SCALE

  const handleCardPointerDown = (event, id) => {
    event.preventDefault()
    event.stopPropagation()

    const position = positions[id]

    setDragState({
      id,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startLeft: position.left,
      startTop: position.top,
    })
  }

  const handleToggleCollapse = (nodeId) => {
    setCollapsedNodes((current) => {
      const next = new Set(current)

      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }

      return next
    })
  }
return (
  <>
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: 'linear-gradient(180deg, #ffffff 0%, #f4f6f8 100%)',
        cursor: dragState ? 'grabbing' : toolMode === 'hand' ? 'grab' : 'default',
      }}
    >

      {/* ── Map content wrapper — gentle dim when workspace is open ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform',
          transition: 'transform 580ms cubic-bezier(0.22, 1, 0.36, 1)',
          ...(shouldShowWorkspace
            ? {
                transform: 'scale(1) translateX(0px)',
                pointerEvents: 'none',
              }
            : {
                transform: 'scale(1) translateX(0px)',
              }),
        }}
      >
        <Photo />
        <MainNav activeId={activeNavId} onSelect={onNavigate} />
        <ProjectList onNavigate={onNavigate} />
        <TransformWrapper
          initialScale={INITIAL_SCALE}
          initialPositionX={initialPositionX}
          initialPositionY={initialPositionY}
          minScale={0.18}
          maxScale={1.8}
          limitToBounds={false}
          smooth
          wheel={{ step: 0.012 }}
          panning={{ disabled: Boolean(dragState) || toolMode === 'cursor', velocityDisabled: true }}
          doubleClick={{ disabled: true }}
          onTransformed={(_, state) => setScale(state.scale)}
        >
          <BottomAITools
  scale={scale}
  initialScale={INITIAL_SCALE}
  mode={toolMode}
  onTaskOpen={() => {
    setIsTaskOpen((current) => !current)
  }}
  onModeChange={(nextMode) => {
    if (nextMode === 'ask-nora') {
      setIsWorkspaceOpen((current) => !current)
      return
    }
    setToolMode(nextMode)
  }}
/>
          <TransformComponent wrapperStyle={wrapperStyle} contentStyle={contentStyle}>
            <MapCanvas
              mounted={mounted}
              sceneVisible={sceneVisible}
              visibleNodeIds={visibleNodeIds}
              visibleEdges={visibleEdges}
              positions={positions}
              draggingId={dragState?.id ?? null}
              collapsedNodes={collapsedNodes}
              onAvatarClick={() => setIsActive((current) => !current)}
              onCardPointerDown={handleCardPointerDown}
              onToggleCollapse={handleToggleCollapse}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>

      {/* ── Click-outside overlay — real backdrop blur ── */}
      <div
        onClick={shouldShowWorkspace ? () => setIsWorkspaceOpen(false) : undefined}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 44,
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          background: 'rgba(0, 0, 0, 0)',
          transition: 'background 220ms ease',
          pointerEvents: shouldShowWorkspace ? 'auto' : 'none',
          cursor: shouldShowWorkspace ? 'pointer' : 'default',
        }}
        aria-hidden="true"
      />

      {shouldShowWorkspace ? (
        <NoraWorkspace
          open={shouldShowWorkspace}
          onClose={() => setIsWorkspaceOpen(false)}
          pairedWithTask={panelsPaired}
        />
      ) : null}
      {/* ── Task Overview panel — slides in from the left ── */}
      {shouldShowTaskPanel ? (
        <>
          <div
            onClick={() => setIsTaskOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 54,
              backdropFilter: 'blur(0px) brightness(1)',
              WebkitBackdropFilter: 'blur(0px) brightness(1)',
              background: 'rgba(0,0,0,0)',
              transition: 'background 500ms cubic-bezier(0.22,1,0.36,1)',
              cursor: 'pointer',
            }}
            aria-hidden="true"
          />

          <div
            className={panelsPaired ? 'intelligence-week-panel intelligence-week-panel--paired' : 'intelligence-week-panel'}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: 24,
              right: 24,
              bottom: 24,
              zIndex: 55,
              width: panelsPaired ? '496px' : 'min(520px, calc(100vw - 48px))',
              overflowY: 'auto',
              transition: 'transform 520ms cubic-bezier(0.22,1,0.36,1)',
              boxShadow: '-18px 0 48px rgba(20,35,76,0.12)',
              borderRadius: 24,
            }}
          >
            <WeekTask onClose={() => setIsTaskOpen(false)} />
          </div>
        </>
      ) : null}
    </div>
    
  </>
)
}
