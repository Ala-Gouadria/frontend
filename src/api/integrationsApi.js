import { get, post, del } from './client.js'

// Static catalog — visual metadata only; connection state comes from backend
const CATALOG = [
  { id: 'openai',      name: 'Open Ai',    iconKey: 'openAi',    description: 'Connect OpenAI to power AI-driven features and content generation.' },
  { id: 'vimeo',       name: 'Vimeo',      iconKey: 'vimeo',     description: 'Integrate your Vimeo account to upload videos and analyze viewer engagement.' },
  { id: 'shopify',     name: 'Shopify',    iconKey: 'shopify',   description: 'Connect Shopify to sync products, orders, and customer data.' },
  { id: 'notion',      name: 'Notion',     iconKey: 'notion',    description: 'Link Notion to manage notes, tasks, and databases all in one place.' },
  { id: 'google-ads',  name: 'Google Ads', iconKey: 'googleAds', description: 'Monitor campaigns and optimize ad performance in real time.' },
  { id: 'stripe',      name: 'Stripe',     iconKey: 'stripe',    description: 'Connect Stripe to track payments, subscriptions, and revenue.' },
  { id: 'slack',       name: 'Slack',      iconKey: 'slack',     description: 'Connect Slack to receive notifications and collaborate with your team.' },
  { id: 'discord',     name: 'Discord',    iconKey: 'discord',   description: 'Connect Discord for community engagement and notifications.' },
  { id: 'gmail',       name: 'Gmail',      iconKey: 'gmail',     description: 'Connect Gmail to manage emails and automate outreach.' },
  { id: 'github',      name: 'Github',     iconKey: 'github',    description: 'Integrate GitHub to monitor repositories and automate dev workflows.' },
  { id: 'paypal',      name: 'Paypal',     iconKey: 'paypal',    description: 'Connect PayPal to track payments and automate invoicing.' },
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
