// Pre-captured demo turns. When the user asks a question that matches one of
// these (voice or text), the orb plays the cached reply + pre-generated audio
// instantly instead of waiting on the live chat + TTS round-trip. Anything that
// doesn't match falls through to the live path.

export const DEMO_TURNS = [
  {
    id: 'intro',
    // Trigger phrases — matched loosely (lowercased substring / keyword set).
    match: ['introduce', 'who are you', 'what do you do', 'tell me about yourself'],
    // The frozen reply Nora "says" (also scanned for agent keywords → cards).
    text:
      "Hello! I am Nora AI, an advanced AI orchestrator designed to help businesses operate, grow, and make informed decisions. I don't answer alone; instead, I coordinate a specialized team of agents to tackle your tasks. My Analyst agent reads the numbers to understand performance, funnels, and what's working. The Strategy agent then turns these insights into actionable plans for growth, positioning, and opportunities. Finally, my Social Media agent creates and schedules content like posts and captions. I intelligently route each task to the best model for the job across leading providers: Anthropic (Claude), OpenAI, and Google Gemini, ensuring you get the most precise and effective assistance.",
    // Pre-generated audio served statically from /public.
    audio: '/demo-audio/intro.mp3',
  },
]

/** Return the matching demo turn for `userText`, or null for the live path. */
export function matchDemoTurn(userText) {
  const t = (userText || '').toLowerCase()
  for (const turn of DEMO_TURNS) {
    if (turn.match.some((phrase) => t.includes(phrase))) {
      return turn
    }
  }
  return null
}
