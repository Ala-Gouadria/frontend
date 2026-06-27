import { get, post, del, patch } from './client.js'

// Static catalog — visual metadata only; connection state comes from backend
const CATALOG = [
  { id: 'openai',      name: 'Open Ai',    iconKey: 'openAi',    description: 'Connect OpenAI to power AI-driven features and content generation.' },
  { id: 'vimeo',       name: 'Vimeo',      iconKey: 'vimeo',     description: 'Integrate your Vimeo account to upload videos and analyze viewer engagement.' },
  { id: 'shopify',     name: 'Shopify',    iconKey: 'shopify',   description: 'Connect Shopify to sync products, orders, and customer data.', hasOAuth: true },
  { id: 'notion',      name: 'Notion',     iconKey: 'notion',    description: 'Link Notion to manage notes, tasks, and databases all in one place.' },
  { id: 'google-ads',  name: 'Google Ads', iconKey: 'googleAds', description: 'Monitor campaigns and optimize ad performance in real time.' },
  { id: 'stripe',      name: 'Stripe',     iconKey: 'stripe',    description: 'Connect Stripe to track payments, subscriptions, and revenue.' },
  { id: 'slack',       name: 'Slack',      iconKey: 'slack',     description: 'Connect Slack to receive notifications and collaborate with your team.' },
  { id: 'discord',     name: 'Discord',    iconKey: 'discord',   description: 'Connect Discord for community engagement and notifications.' },
  { id: 'gmail',       name: 'Gmail',      iconKey: 'gmail',     description: 'Connect Gmail to manage emails and automate outreach.' },
  { id: 'github',      name: 'Github',     iconKey: 'github',    description: 'Integrate GitHub to monitor repositories and automate dev workflows.' },
  { id: 'paypal',      name: 'Paypal',     iconKey: 'paypal',    description: 'Connect PayPal to track payments and automate invoicing.' },
  // Analytics integrations
  { id: 'google',      name: 'Google Analytics', iconKey: 'google', description: 'Connect Google Analytics and Search Console for traffic and SEO data.', hasOAuth: true },
  { id: 'hubspot',     name: 'HubSpot',    iconKey: 'hubspot',   description: 'Connect HubSpot CRM to sync leads, deals, and pipeline data.', hasOAuth: true },
  { id: 'linkedin',    name: 'LinkedIn',   iconKey: 'linkedin',  description: 'Connect LinkedIn to sign in and link your professional profile.', hasOAuth: true },
  { id: 'ahrefs',      name: 'Ahrefs',     iconKey: 'ahrefs',    description: 'Connect Ahrefs for backlink analysis and SEO insights.', hasApiKey: true },
  { id: 'mixpanel',    name: 'Mixpanel',   iconKey: 'mixpanel',  description: 'Connect Mixpanel for user behavior and product analytics.', hasApiKey: true },
]

function mergeWithCatalog(backendItems) {
  const connectedByProvider = Object.fromEntries(
    backendItems.map((item) => [item.provider?.toLowerCase(), item]),
  )

  return CATALOG.map((entry) => {
    const live = connectedByProvider[entry.id]
    return {
      ...entry,
      // Store the backend UUID so we can DELETE it later
      _backendId: live?.id ?? null,
      connected: Boolean(live && live.status !== 'inactive'),
    }
  })
}

export const integrationsApi = {
  async listIntegrations() {
    try {
      const items = await get('/api/v1/integrations')
      return mergeWithCatalog(Array.isArray(items) ? items : [])
    } catch {
      return CATALOG.map((entry) => ({ ...entry, _backendId: null, connected: false }))
    }
  },

  async setConnection(integrationId, connected) {
    const current = (await this.listIntegrations()).find((i) => i.id === integrationId)

    if (!connected && current?._backendId) {
      await del(`/api/v1/integrations/${current._backendId}`)
      return { ...current, connected: false, _backendId: null }
    }

    if (connected) {
      const result = await post('/api/v1/integrations', {
        provider: integrationId,
        type: 'oauth',
        config: {},
        credentials: {},
      })
      return {
        ...(current ?? { id: integrationId }),
        _backendId: result.id,
        connected: true,
      }
    }

    return current ?? { id: integrationId, connected: false }
  },
}

// Facebook / Instagram (Meta) — real OAuth via the backend. Instagram rides on
// the same connection (the IG account is linked to the connected Facebook Page).
export const facebookApi = {
  // { connected, pages, adAccounts, connectedAt, tokenExpiresAt, lastSyncAt }
  async status() {
    return get('/api/v1/integrations/facebook/status')
  },
  // Returns the Meta OAuth dialog URL; caller redirects the browser to it.
  async connectUrl() {
    const res = await get('/api/v1/integrations/facebook/connect')
    return res?.url
  },
  async disconnect() {
    return del('/api/v1/integrations/facebook')
  },
  // Pull real posts/campaigns from Meta and push a summary into Nora's memory.
  async sync() {
    return post('/api/v1/integrations/facebook/sync', {})
  },
  async posts() {
    return get('/api/v1/integrations/facebook/posts')
  },
  async campaigns() {
    return get('/api/v1/integrations/facebook/campaigns')
  },
}

// Google Analytics + Search Console — OAuth integration
export const googleApi = {
  // { connected, ga4Properties, searchConsoleSites, selectedGa4Property, selectedSearchConsoleSite, ... }
  async status() {
    return get('/api/v1/integrations/google/status')
  },
  async connectUrl() {
    const res = await get('/api/v1/integrations/google/connect')
    return res?.url
  },
  async disconnect() {
    return del('/api/v1/integrations/google')
  },
  // Update selected GA4 property or Search Console site
  async updateSelection({ ga4PropertyId, searchConsoleSite }) {
    return patch('/api/v1/integrations/google/selection', { ga4PropertyId, searchConsoleSite })
  },
  async sync() {
    return post('/api/v1/integrations/google/sync', {})
  },
  async getTrafficData(options = {}) {
    const params = new URLSearchParams()
    if (options.startDate) params.append('startDate', options.startDate)
    if (options.endDate) params.append('endDate', options.endDate)
    return get(`/api/v1/integrations/google/traffic?${params}`)
  },
  async getSeoData(options = {}) {
    const params = new URLSearchParams()
    if (options.startDate) params.append('startDate', options.startDate)
    if (options.endDate) params.append('endDate', options.endDate)
    return get(`/api/v1/integrations/google/seo?${params}`)
  },
}

// HubSpot CRM — OAuth integration
export const hubspotApi = {
  // { connected, portalId, hubDomain, pipelines, connectedAt, lastSyncAt }
  async status() {
    return get('/api/v1/integrations/hubspot/status')
  },
  async connectUrl() {
    const res = await get('/api/v1/integrations/hubspot/connect')
    return res?.url
  },
  async disconnect() {
    return del('/api/v1/integrations/hubspot')
  },
  async sync() {
    return post('/api/v1/integrations/hubspot/sync', {})
  },
  async getCrmData(options = {}) {
    const params = new URLSearchParams()
    if (options.days) params.append('days', options.days)
    return get(`/api/v1/integrations/hubspot/crm?${params}`)
  },
}

// LinkedIn — OAuth integration (Sign In with LinkedIn / OpenID Connect)
export const linkedinApi = {
  // { connected, memberId, name, email, picture, scope, connectedAt, tokenExpiresAt, lastSyncAt }
  async status() {
    return get('/api/v1/integrations/linkedin/status')
  },
  async connectUrl() {
    const res = await get('/api/v1/integrations/linkedin/connect')
    return res?.url
  },
  async disconnect() {
    return del('/api/v1/integrations/linkedin')
  },
}

// Shopify — OAuth integration (requires shop domain)
export const shopifyApi = {
  // { connected, shop, scope, connectedAt, lastSyncAt }
  async status() {
    return get('/api/v1/integrations/shopify/status')
  },
  // Shopify requires shop domain upfront; returns OAuth URL
  async connectUrl(shopDomain) {
    const res = await post('/api/v1/integrations/shopify/connect', { shop: shopDomain })
    return res?.url
  },
  async disconnect() {
    return del('/api/v1/integrations/shopify')
  },
  async sync() {
    return post('/api/v1/integrations/shopify/sync', {})
  },
  async getRevenueData(options = {}) {
    const params = new URLSearchParams()
    if (options.days) params.append('days', options.days)
    return get(`/api/v1/integrations/shopify/revenue?${params}`)
  },
}

// Ahrefs — API key integration
export const ahrefsApi = {
  // { connected, domain, connectedAt, lastSyncAt }
  async status() {
    return get('/api/v1/integrations/ahrefs/status')
  },
  // Configure with API key and domain
  async configure({ apiKey, domain }) {
    return post('/api/v1/integrations/ahrefs/configure', { apiKey, domain })
  },
  async disconnect() {
    return del('/api/v1/integrations/ahrefs')
  },
  async sync() {
    return post('/api/v1/integrations/ahrefs/sync', {})
  },
  async getSeoData() {
    return get('/api/v1/integrations/ahrefs/data')
  },
}

// Mixpanel — API key integration
export const mixpanelApi = {
  // { connected, projectId, connectedAt, lastSyncAt }
  async status() {
    return get('/api/v1/integrations/mixpanel/status')
  },
  // Configure with service account credentials
  async configure({ serviceAccountId, secret, projectId }) {
    return post('/api/v1/integrations/mixpanel/configure', { serviceAccountId, secret, projectId })
  },
  async disconnect() {
    return del('/api/v1/integrations/mixpanel')
  },
  async sync() {
    return post('/api/v1/integrations/mixpanel/sync', {})
  },
  async getAnalyticsData(options = {}) {
    const params = new URLSearchParams()
    if (options.days) params.append('days', options.days)
    return get(`/api/v1/integrations/mixpanel/data?${params}`)
  },
}
