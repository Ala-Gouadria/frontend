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
      "Hello! I am Nora, the AI Operating System built by XWorldLTD. I bring everything a business needs to operate, grow, and make decisions into one unified intelligence. I handle analysis — reading your numbers, performance, and funnels to understand what's working. I handle strategy — turning those insights into clear plans for growth, positioning, and opportunities. And I handle social and content — creating and scheduling your posts and campaigns. One system, built by XWorldLTD, working across your whole business.",
    // NOTE: the previously cached intro.mp3 spoke the OLD script (named external
    // providers + "orchestrator"). Until a clean MP3 is regenerated from the text
    // above, no `audio` is set so this turn speaks the clean text via live TTS
    // (still instant-matched + reveals the capability cards in sync).
  },
  {
    id: 'dashboard',
    match: ['dashboard', 'take me to', 'open the dashboard', 'show me the dashboard'],
    text:
      'Of course. Opening your dashboard now — here are your analysis, strategy, and social capabilities working together.',
    // dashboard.mp3 does NOT name any external provider, so it stays cached; its
    // wording ("agents") is slightly older than the text above but is not a leak.
    audio: '/demo-audio/dashboard.mp3',
    // After Nora finishes speaking, navigate the app to this view.
    navigateTo: 'dashboard',
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
