const INTEGRATIONS = [
  {
    id: 'open-ai',
    name: 'Open Ai',
    iconKey: 'openAi',
    description: 'Integrate your Vimeo account to upload videos directly and analyze viewer engagement.',
    connected: false,
  },
  {
    id: 'vimeo',
    name: 'Vimeo',
    iconKey: 'vimeo',
    description: 'Integrate your Vimeo account to upload videos directly and analyze viewer engagement.',
    connected: false,
  },
  {
    id: 'shopify',
    name: 'Shopify',
    iconKey: 'shopify',
    description: 'Link Asana to streamline task management and keep project updates in sync.',
    connected: false,
  },
  {
    id: 'notion',
    name: 'Notion',
    iconKey: 'notion',
    description: 'Link Asana to streamline task management and keep project updates in sync.',
    connected: false,
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    iconKey: 'googleAds',
    description: 'Link Asana to streamline task management and keep project updates in sync.',
    connected: false,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    iconKey: 'stripe',
    description: 'Integrate Google Ads to monitor campaigns and optimize ad performance in real time.',
    connected: false,
  },
  {
    id: 'slack',
    name: 'Slack',
    iconKey: 'slack',
    description: 'Connect Notion to manage notes, tasks, and databases all in one place effortlessly.',
    connected: false,
  },
  {
    id: 'discord',
    name: 'Discord',
    iconKey: 'discord',
    description: 'Connect Notion to manage notes, tasks, and databases all in one place effortlessly.',
    connected: false,
  },
  {
    id: 'gmail',
    name: 'Gmail',
    iconKey: 'gmail',
    description: 'Connect Notion to manage notes, tasks, and databases all in one place effortlessly.',
    connected: false,
  },
  {
    id: 'github',
    name: 'Github',
    iconKey: 'github',
    description: 'Integrate Google Ads to monitor campaigns and optimize ad performance in real time.',
    connected: false,
  },
  {
    id: 'paypal',
    name: 'Paypal',
    iconKey: 'paypal',
    description: 'Integrate Google Ads to monitor campaigns and optimize ad performance in real time.',
    connected: false,
  },
]

function delay(ms) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms))
}

let integrations = INTEGRATIONS.map((integration) => ({ ...integration }))

export const integrationsApi = {
  async listIntegrations() {
    await delay(160)
    return integrations.map((integration) => ({ ...integration }))
  },

  async setConnection(integrationId, connected) {
    await delay(180)
    integrations = integrations.map((integration) => (
      integration.id === integrationId ? { ...integration, connected } : integration
    ))

    return integrations.find((integration) => integration.id === integrationId)
  },
}
