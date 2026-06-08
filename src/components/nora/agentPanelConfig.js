import { StrategyIntelligenceCard, GrowthStrategyCard, MarketInsightsCard } from '../Cards/Strategy & Intelligence'
import { SocialMediaManagerCard, SocialMediaStrategyCard } from '../Cards/Social Media Stuffs'
import { AnalyticsReportingCard, PerformanceSummaryCard } from '../Cards/Analytics'

/**
 * The capabilities Nora surfaces as she talks. Each is a module of Nora — the
 * AI Operating System by XWorldLTD — NOT a third-party model or provider. The
 * `module` label is what shows on the card badge (never a vendor name).
 * `keywords` are scanned (case-insensitive) against Nora's streaming reply to
 * decide when each module's cards animate into the side panel.
 */
export const DEMO_AGENTS = [
  {
    key: 'analyst',
    label: 'Analysis',
    module: 'Nora',
    tagline: 'Reads the numbers — performance, funnels, what is working.',
    keywords: ['analyst', 'analyt', 'analy', 'data', 'insight', 'report'],
    cards: [AnalyticsReportingCard, PerformanceSummaryCard],
  },
  {
    key: 'strategy',
    label: 'Strategy',
    module: 'Nora',
    tagline: 'Turns insight into a plan — growth, positioning, opportunities.',
    keywords: ['strateg', 'growth', 'plan', 'opportun', 'market', 'positioning'],
    cards: [StrategyIntelligenceCard, GrowthStrategyCard, MarketInsightsCard],
  },
  {
    key: 'social',
    label: 'Social & Content',
    module: 'Nora',
    tagline: 'Creates and ships content — posts, captions, scheduling.',
    keywords: ['social', 'content', 'caption', 'post', 'community', 'media'],
    cards: [SocialMediaManagerCard, SocialMediaStrategyCard],
  },
]

/** Returns the set of agent keys whose keywords appear in `text`. */
export function detectAgents(text) {
  const haystack = (text || '').toLowerCase()
  const found = new Set()
  for (const agent of DEMO_AGENTS) {
    if (agent.keywords.some((kw) => haystack.includes(kw))) {
      found.add(agent.key)
    }
  }
  return found
}
