// Voice/text → UI action router (Phase A: navigation + side panel only, no
// backend operations yet). Given an utterance, return a structured action the
// orb can execute, or `null` to fall through to the normal chat Q&A path.
//
// Design notes:
// - Navigation only fires when the utterance is an *imperative* ("open reports",
//   "take me to settings") or is *just* a destination word ("dashboard"). A real
//   question like "what's in my reports this week?" has no nav verb and isn't a
//   bare destination, so it falls through to chat instead of hijacking it.
// - `target` values are exactly the ids that App.jsx's handleNavigation accepts.
//
// Action shapes returned:
//   { kind: 'navigate', target, say }           // route to another view
//   { kind: 'panel', op: 'open'|'close', say }  // toggle the orb's side panel
//   null                                        // not a command → chat

// Verbs that signal "go somewhere" / "do this UI thing".
const NAV_VERBS = [
  'open', 'show me', 'show', 'go to', 'goto', 'take me to', 'take me',
  'navigate to', 'navigate', 'switch to', 'bring up', 'jump to', 'launch',
  'pull up', 'reveal', 'connect', 'link',
]

// Ordered most-specific → most-general so multi-word destinations win over the
// single words they contain (e.g. "team" before "settings", "activity log"
// before "activity"). First keyword hit wins.
const DESTINATIONS = [
  { target: 'dashboard',  say: 'Opening your dashboard.',
    keywords: ['dashboard', 'intelligence map', 'the map', 'analytics', 'analytic', 'insights'] },
  { target: 'activityLog', say: 'Opening the activity log.',
    keywords: ['activity log', 'audit log', 'activity history'] },
  { target: 'settings-team', say: 'Opening your team.',
    keywords: ['team', 'teammates', 'members', 'invite people'] },
  { target: 'layers', say: 'Opening your reports.',
    keywords: ['reports', 'report', 'briefing', 'layers'] },
  { target: 'connect', say: 'Opening integrations.',
    keywords: ['integrations', 'integration', 'connect social', 'connect account', 'link account', 'connections', 'connect'] },
  { target: 'database', say: 'Opening your data.',
    keywords: ['database', 'data base', 'my data', 'data source'] },
  { target: 'memory', say: 'Opening memory.',
    keywords: ['memory', 'what you remember', 'remembered'] },
  { target: 'events', say: 'Opening events.',
    keywords: ['events', 'event log'] },
  { target: 'notifications', say: 'Opening notifications.',
    keywords: ['notifications', 'notification', 'alerts'] },
  { target: 'album', say: 'Opening your assets.',
    keywords: ['album', 'assets', 'media library', 'gallery'] },
  { target: 'chat', say: 'Opening chat.',
    keywords: ['chat', 'messages', 'text chat'] },
  { target: 'pricing', say: 'Opening pricing.',
    keywords: ['pricing', 'plans', 'subscription', 'billing', 'upgrade'] },
  { target: 'settings', say: 'Opening settings.',
    keywords: ['settings', 'preferences', 'configuration'] },
  { target: 'stars', say: 'Taking you home.',
    keywords: ['home', 'ai magic', 'voice home', 'start screen', 'main screen'] },
]

// Words that name the orb's side panel (the capability/agent cards).
const PANEL_NOUNS = ['side panel', 'sidepane', 'side pane', 'panel', 'capabilities', 'capability', 'agent cards', 'cards']
const OPEN_WORDS = ['open', 'show', 'reveal', 'bring up', 'pull up', 'expand']
const CLOSE_WORDS = ['close', 'hide', 'dismiss', 'collapse']

function normalize(raw) {
  return (raw || '').toLowerCase().trim().replace(/[.!?]+$/g, '').trim()
}

/** Parse `utterance` into a UI action, or null if it isn't a command. */
export function matchCommand(utterance) {
  const t = normalize(utterance)
  if (!t) return null

  // --- side panel toggle ---------------------------------------------------
  const mentionsPanel = PANEL_NOUNS.some((n) => t.includes(n))
  if (mentionsPanel) {
    if (CLOSE_WORDS.some((w) => t.includes(w))) {
      return { kind: 'panel', op: 'close', say: 'Closing the panel.' }
    }
    if (OPEN_WORDS.some((w) => t.includes(w))) {
      return { kind: 'panel', op: 'open', say: 'Here are my capabilities.' }
    }
  }

  // --- navigation ----------------------------------------------------------
  const hasVerb = NAV_VERBS.some((v) => t.includes(v))
  for (const dest of DESTINATIONS) {
    const hit = dest.keywords.find((k) => t.includes(k))
    if (!hit) continue
    const isBareDestination = dest.keywords.some((k) => t === k)
    if (hasVerb || isBareDestination) {
      return { kind: 'navigate', target: dest.target, say: dest.say }
    }
  }

  return null
}
