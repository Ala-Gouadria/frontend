import { get, post } from './client.js'

export const strategyApi = {
  async generateSwot(data) { return post('/api/v1/strategy/swot', data) },
  async getMarketTrends() { return get('/api/v1/strategy/market-trends') },
  async getRecommendations() { return get('/api/v1/strategy/recommendations') },
  async decideRecommendation(data) { return post('/api/v1/strategy/recommendations/decide', data) },
}
