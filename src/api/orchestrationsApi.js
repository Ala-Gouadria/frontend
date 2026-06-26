import { get, post } from './client.js'

/**
 * @typedef {Object} ConversationTurn
 * @property {'user' | 'assistant'} role - Who said this
 * @property {string} content - The message content
 * @property {string} [agent] - Agent that handled this turn (for assistant)
 * @property {string} [timestamp] - ISO timestamp
 */

export const orchestrationsApi = {
  async create({ message, context = {} }) {
    // Backend contract is `intent` (see createOrchestrationSchema). Send `intent`
    // and mirror to `message` so either backend build accepts the body.
    return post('/api/v1/orchestrations', { intent: message, message, context })
  },

  async get(workflowId) {
    return get(`/api/v1/orchestrations/${workflowId}`)
  },

  async list({ page = 1, pageSize = 20, status } = {}) {
    return get('/api/v1/orchestrations', { params: { page, pageSize, status } })
  },

  /**
   * Classify a voice transcript to determine which agent should handle it.
   * Returns routing information with confidence scores.
   * Supports multi-turn conversations with history tracking.
   *
   * @param {Object} params
   * @param {string} params.transcript - The voice transcript to classify
   * @param {Object} [params.context] - Optional business context
   * @param {ConversationTurn[]} [params.conversationHistory] - Recent conversation turns
   * @param {string} [params.sessionId] - Session ID for conversation tracking
   * @returns {Promise<{
   *   primary_agent: string,
   *   confidence: number,
   *   reasoning: string,
   *   secondary_agents: Array<{agent: string, confidence: number, reasoning: string}>,
   *   requires_multi_agent: boolean,
   *   intent_summary: string,
   *   routing_method: 'semantic' | 'keyword',
   *   is_follow_up: boolean,
   *   resolved_query: string
   * }>}
   */
  async voiceClassify({ transcript, context = {}, conversationHistory = [], sessionId }) {
    return post('/api/v1/orchestrations/voice/classify', {
      transcript,
      context,
      conversation_history: conversationHistory,
      session_id: sessionId,
    })
  },

  /**
   * Full voice orchestration: classify intent, run tools, and return voice response.
   * This is the main endpoint for voice-driven interactions.
   * Supports multi-turn conversations with context tracking.
   *
   * @param {Object} params
   * @param {string} params.transcript - The voice transcript
   * @param {Object} [params.context] - Optional business context
   * @param {number} [params.maxWords=60] - Maximum words in the response (for TTS)
   * @param {ConversationTurn[]} [params.conversationHistory] - Recent conversation turns
   * @param {string} [params.sessionId] - Session ID for conversation tracking
   * @returns {Promise<{
   *   workflowId: string,
   *   status: 'completed' | 'completed_partial' | 'failed',
   *   routing: {
   *     primary_agent: string,
   *     confidence: number,
   *     reasoning: string,
   *     secondary_agents: Array,
   *     requires_multi_agent: boolean,
   *     intent_summary: string,
   *     routing_method: string,
   *     is_follow_up: boolean,
   *     resolved_query: string
   *   },
   *   answer: string,
   *   confidence: number,
   *   artifacts: Array,
   *   follow_up_suggestions: Array<string>,
   *   failedSteps: Array
   * }>}
   */
  async voiceOrchestrate({ transcript, context = {}, maxWords = 60, conversationHistory = [], sessionId }) {
    return post('/api/v1/orchestrations/voice', {
      transcript,
      context,
      max_words: maxWords,
      conversation_history: conversationHistory,
      session_id: sessionId,
    })
  },

  /**
   * Submit routing correction feedback when user selects a different agent.
   * This helps the system learn routing preferences over time.
   *
   * @param {Object} params
   * @param {string} params.query - The original query that was classified
   * @param {string} params.predictedAgent - The agent that was predicted
   * @param {string} params.correctAgent - The correct agent the user selected
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async voiceRoutingFeedback({ query, predictedAgent, correctAgent }) {
    return post('/api/v1/orchestrations/voice/feedback', {
      query,
      predicted_agent: predictedAgent,
      correct_agent: correctAgent,
    })
  },
}
