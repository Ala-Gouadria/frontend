import { useEffect, useRef, useState } from 'react'
import { voiceApi } from '../../api/voiceApi'
import { noraWorkspaceApi } from '../../api/noraWorkspaceApi'
import { orchestrationsApi } from '../../api/orchestrationsApi'
import { matchCommand } from './voiceCommands'
import { GREETING, consumeGreet } from './voiceGreeting'
import AgentIndicator from './AgentIndicator'
import AgentCorrection from './AgentCorrection'
import './GlobalVoiceAssistant.css'

// Wake phrases that arm the assistant in always-listening mode. Anything spoken
// AFTER the phrase in the same utterance is taken as the command; if nothing
// follows, the assistant arms and treats the NEXT utterance as the command.
const WAKE_PHRASES = ['hey nora', 'hey, nora', 'hi nora', 'okay nora', 'ok nora', 'nora']
const MUTE_KEY = 'nora:voiceMuted'
const MAX_CONVERSATION_TURNS = 10 // Keep last N turns for context

// Generate a session ID for conversation tracking
function generateSessionId() {
  return `gva-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function getSR() {
  return typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null
}

function stripWake(lower) {
  for (const w of WAKE_PHRASES) {
    const i = lower.indexOf(w)
    if (i >= 0) return { matched: true, rest: lower.slice(i + w.length).replace(/^[\s,]+/, '').trim() }
  }
  return { matched: false, rest: '' }
}

// Strip markdown so TTS doesn't read "#", "*", etc. and the panel stays clean.
function cleanForVoice(text) {
  return String(text || '')
    .replace(/```[\s\S]*?```/g, ' ')        // code blocks
    .replace(/!?\[(.*?)\]\(.*?\)/g, '$1')   // links/images → label
    .replace(/^\s{0,3}#{1,6}\s*/gm, '')     // headings
    .replace(/^\s*[-*•]\s+/gm, '')          // bullet markers
    .replace(/[*_`~>#]/g, '')               // leftover md symbols
    .replace(/\s+/g, ' ')
    .trim()
}

// A short, voice-friendly version: clean + capped near `maxWords`, backed off to
// a sentence boundary when possible. Keeps spoken replies snappy (~60 words).
function summarizeForSpeech(text, maxWords = 60) {
  const clean = cleanForVoice(text)
  const words = clean.split(' ')
  if (words.length <= maxWords) return clean
  let cut = words.slice(0, maxWords).join(' ')
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '))
  if (lastStop > 60) return cut.slice(0, lastStop + 1).trim()
  return cut.trim() + '…'
}

/**
 * Persistent, app-wide voice assistant. Mounted once (above the view switch) so
 * it survives navigation: always-listening for "Hey Nora", a floating mic on
 * every screen, speaks replies, and runs UI actions (navigate / open panel) or
 * answers questions from anywhere. `onNavigate` is App's handleNavigation.
 *
 * The control-flow helpers below are declared with `function` (hoisted) so they
 * can reference each other freely; live values are read through refs to keep the
 * recognition/audio callbacks free of stale closures.
 */
export default function GlobalVoiceAssistant({ onNavigate, wakeless = false }) {
  const SR = getSR()
  const [mode, setMode] = useState('idle') // 'idle' | 'listening' | 'thinking' | 'speaking'
  const [armed, setArmed] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [reply, setReply] = useState('')
  const [notice, setNotice] = useState('')
  const [textValue, setTextValue] = useState('')
  const [muted, setMuted] = useState(() => {
    try { return window.localStorage.getItem(MUTE_KEY) === '1' } catch { return false }
  })
  // Agent routing state for voice orchestration
  const [agentRouting, setAgentRouting] = useState(null)
  const [isClassifying, setIsClassifying] = useState(false)
  const [followUpSuggestions, setFollowUpSuggestions] = useState([])
  // Multi-turn conversation tracking
  const [conversationHistory, setConversationHistory] = useState([])
  const [isFollowUp, setIsFollowUp] = useState(false)
  const sessionIdRef = useRef(generateSessionId())

  // Control refs (read inside async/recognition callbacks without stale closures).
  const recRef = useRef(null)
  const suppressRestartRef = useRef(false) // true while speaking / muted / unmounting
  const armedRef = useRef(false)
  const armTimerRef = useRef(null)
  const audioRef = useRef(null)
  const audioUrlRef = useRef(null)
  const conversationIdRef = useRef(null)
  const mutedRef = useRef(muted)
  const startingRef = useRef(false)
  const wakelessRef = useRef(wakeless)
  const lastGreetRef = useRef(0)

  useEffect(() => { mutedRef.current = muted }, [muted])
  useEffect(() => { wakelessRef.current = wakeless }, [wakeless])

  function disarm() {
    armedRef.current = false
    setArmed(false)
    if (armTimerRef.current) { clearTimeout(armTimerRef.current); armTimerRef.current = null }
  }

  // ---- TTS ------------------------------------------------------------------
  function stopAudio() {
    const el = audioRef.current
    if (el) { try { el.pause() } catch { /* ignore */ } el.src = '' }
    if (audioUrlRef.current) { URL.revokeObjectURL(audioUrlRef.current); audioUrlRef.current = null }
    audioRef.current = null
  }

  // Speak `text`. Resolves once playback STARTS (or immediately if TTS fails),
  // so callers can navigate right away while the confirmation keeps playing
  // (the assistant is mounted above the views, so audio survives navigation).
  async function speak(text, displayText) {
    if (!text) return
    stopAudio()
    suppressRestartRef.current = true // don't let the mic hear Nora
    if (recRef.current) { try { recRef.current.abort() } catch { /* ignore */ } recRef.current = null }
    setMode('speaking')
    setReply(displayText ?? text)
    let url
    try {
      url = await voiceApi.speak(text)
    } catch {
      setMode('idle')
      setNotice('Voice unavailable right now — showing the reply.')
      suppressRestartRef.current = false
      maybeStartLoop()
      return
    }
    audioUrlRef.current = url
    const el = new Audio(url)
    audioRef.current = el
    el.addEventListener('ended', () => {
      stopAudio()
      setMode('idle')
      suppressRestartRef.current = false
      maybeStartLoop()
    })
    try {
      await el.play()
    } catch {
      // Autoplay blocked (no user gesture yet) — keep the text visible.
      setMode('idle')
      setNotice('Tap the mic once to enable Nora’s voice.')
      suppressRestartRef.current = false
      maybeStartLoop()
    }
  }

  // ---- action / conversation routing ----------------------------------------
  async function runUtterance(rawText) {
    const text = (rawText || '').trim()
    if (!text) return
    disarm()
    setTranscript(text)
    setNotice('')
    setAgentRouting(null) // Reset previous agent info
    setFollowUpSuggestions([]) // Reset suggestions
    setIsFollowUp(false)

    const command = matchCommand(text)
    if (command?.kind === 'navigate') {
      // Route instantly for snappy response; the spoken confirmation plays
      // afterwards in the background (audio survives the view change).
      onNavigate?.(command.target)
      void speak(command.say)
      return
    }
    if (command?.kind === 'panel') {
      setExpanded(command.op === 'open')
      void speak(command.say)
      return
    }

    // Not a command → use voice orchestration for intelligent agent routing.
    setMode('thinking')
    setIsClassifying(true)
    setExpanded(true)

    // Add user turn to history before sending
    const userTurn = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }

    try {
      // Use voice orchestration for full agent routing + response
      const result = await orchestrationsApi.voiceOrchestrate({
        transcript: text,
        context: {
          currentPage: window.location.pathname,
        },
        maxWords: 60, // Keep voice responses concise
        conversationHistory: conversationHistory,
        sessionId: sessionIdRef.current,
      })

      // Update agent routing info for display
      if (result.routing) {
        setAgentRouting({
          agent: result.routing.primary_agent,
          confidence: result.routing.confidence,
          reasoning: result.routing.reasoning,
          secondaryAgents: result.routing.secondary_agents || [],
          intentSummary: result.routing.intent_summary,
        })
        // Check if this was detected as a follow-up
        if (result.routing.is_follow_up) {
          setIsFollowUp(true)
        }
      }
      setIsClassifying(false)

      // Store follow-up suggestions
      if (result.follow_up_suggestions?.length > 0) {
        setFollowUpSuggestions(result.follow_up_suggestions)
      }

      const answer = result.answer || ''

      // Update conversation history with both user and assistant turns
      if (answer) {
        const assistantTurn = {
          role: 'assistant',
          content: answer,
          agent: result.routing?.primary_agent,
          timestamp: new Date().toISOString(),
        }
        setConversationHistory((prev) => {
          const updated = [...prev, userTurn, assistantTurn]
          // Keep only the last N turns
          return updated.slice(-MAX_CONVERSATION_TURNS)
        })
        await speak(summarizeForSpeech(answer), cleanForVoice(answer))
      } else {
        // Still add user turn even if no answer
        setConversationHistory((prev) => {
          const updated = [...prev, userTurn]
          return updated.slice(-MAX_CONVERSATION_TURNS)
        })
        setMode('idle')
        maybeStartLoop()
      }
    } catch (orchError) {
      // Fall back to regular chat if orchestration fails
      setIsClassifying(false)
      setAgentRouting(null)
      console.warn('Voice orchestration failed, falling back to chat:', orchError)

      try {
        if (!conversationIdRef.current) {
          const convo = await noraWorkspaceApi.createConversation({ serviceId: 'general' })
          conversationIdRef.current = convo.id
        }
        const result = await noraWorkspaceApi.sendMessage({
          conversationId: conversationIdRef.current,
          serviceId: 'general',
          text,
          chatOnly: true,
          mode: 'voice',
        })
        const answer = result?.assistantMessage?.text || ''
        if (answer) {
          // Update history even for fallback chat
          setConversationHistory((prev) => {
            const updated = [...prev, userTurn, { role: 'assistant', content: answer, timestamp: new Date().toISOString() }]
            return updated.slice(-MAX_CONVERSATION_TURNS)
          })
          await speak(summarizeForSpeech(answer), cleanForVoice(answer))
        } else {
          setConversationHistory((prev) => [...prev, userTurn].slice(-MAX_CONVERSATION_TURNS))
          setMode('idle')
          maybeStartLoop()
        }
      } catch {
        setMode('idle')
        setNotice('Nora is unreachable right now.')
        maybeStartLoop()
      }
    }
  }

  // ---- continuous (always-listening) recognition ----------------------------
  function maybeStartLoop() {
    if (!SR || mutedRef.current || suppressRestartRef.current) return
    if (recRef.current || startingRef.current) return
    startingRef.current = true
    const rec = new SR()
    rec.lang = 'en-US'
    rec.continuous = true
    rec.interimResults = true

    rec.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const seg = e.results[i][0].transcript
        if (e.results[i].isFinal) {
          const lower = seg.toLowerCase().trim()
          // Orb conversational mode (wakeless) or already armed: every utterance
          // is a command — no "Hey Nora" needed. Strip a wake prefix if present,
          // ignore a bare wake word on its own.
          if (wakelessRef.current || armedRef.current) {
            const stripped = stripWake(lower)
            const cmd = stripped.matched ? stripped.rest : lower
            if (cmd.length > 1) { void runUtterance(cmd); return }
            return
          }
          const { matched, rest } = stripWake(lower)
          if (matched) {
            if (rest.length > 1) { void runUtterance(rest); return }
            // Wake word alone → arm for the next utterance.
            armedRef.current = true
            setArmed(true)
            setMode('listening')
            setExpanded(true)
            setNotice('Yes boss? I’m listening…')
            if (armTimerRef.current) clearTimeout(armTimerRef.current)
            armTimerRef.current = setTimeout(() => { disarm(); setMode('idle'); setNotice('') }, 8000)
          }
        } else {
          interim += seg
        }
      }
      if (armedRef.current && interim) setTranscript(interim)
    }

    rec.onerror = (e) => {
      if (rec !== recRef.current) return // a newer recognition owns the mic
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        // Permission problem — pause the loop but DON'T persist mute (that used
        // to trap the assistant off with no way back). It retries on next mount.
        suppressRestartRef.current = true
        setNotice('Microphone blocked. Allow it for this site, then reload.')
      }
      // 'no-speech' / 'aborted' / 'network' fall through to onend → restart.
    }

    rec.onend = () => {
      // Only the CURRENT instance may clear state / schedule a restart. Stale
      // instances (aborted during a speak() pause or a StrictMode remount) must
      // not clobber recRef or kick off a second loop — that race caused the
      // rapid start/stop "blinking mic" that swallowed the wake word.
      if (rec !== recRef.current) return
      recRef.current = null
      startingRef.current = false
      if (!suppressRestartRef.current && !mutedRef.current && SR) {
        setTimeout(() => maybeStartLoop(), 400)
      }
    }

    try {
      rec.start()
      recRef.current = rec
      startingRef.current = false
    } catch {
      startingRef.current = false // start() throws if already running — ignore
    }
  }

  function stopLoop() {
    suppressRestartRef.current = true
    if (recRef.current) { try { recRef.current.abort() } catch { /* ignore */ } recRef.current = null }
  }

  function toggleMute() {
    const next = !mutedRef.current
    mutedRef.current = next
    setMuted(next)
    try { window.localStorage.setItem(MUTE_KEY, next ? '1' : '0') } catch { /* ignore */ }
    if (next) { stopLoop(); setMode('idle'); disarm() }
    else { suppressRestartRef.current = false; maybeStartLoop() }
  }

  function submitText(e) {
    e.preventDefault()
    const said = textValue.trim()
    if (!said) return
    setTextValue('')
    void runUtterance(said)
  }

  // Speak the greeting, throttled so the login-greet and the orb-entry greet
  // can't fire back to back.
  function greet() {
    const now = Date.now()
    if (now - lastGreetRef.current < 4000) return
    lastGreetRef.current = now
    void speak(GREETING)
  }

  // ---- mount: start listening immediately, greet once on login -------------
  useEffect(() => {
    // Always begin always-listening on mount — including the orb home, which is
    // the default landing after login. The greeting (if any) plays on top and
    // pauses/resumes the mic around itself, so listening is never gated behind
    // the greeting finishing.
    suppressRestartRef.current = false
    maybeStartLoop()
    let greetTimer
    if (consumeGreet()) {
      greetTimer = setTimeout(greet, 700)
    }
    return () => {
      if (greetTimer) clearTimeout(greetTimer)
      suppressRestartRef.current = true
      if (armTimerRef.current) clearTimeout(armTimerRef.current)
      if (recRef.current) { try { recRef.current.abort() } catch { /* ignore */ } recRef.current = null }
      stopAudio()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Entering the orb (wakeless mode) → Nora greets ("Hey boss, how can I help?")
  // and then auto-listens for your command directly (no "Hey Nora" needed). The
  // throttle in greet() avoids doubling up with the login greeting.
  useEffect(() => {
    if (!wakeless) return
    const t = setTimeout(greet, 500)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wakeless])

  // No floating button: the panel surfaces itself only while Nora is active
  // (listening/thinking/speaking) or has something to show, then tucks away a
  // few seconds after returning to idle. Always-listening keeps running headless.
  useEffect(() => {
    const active = mode !== 'idle' || !!notice
    // Show ~immediately when active; linger ~5s after going idle, then hide.
    const t = setTimeout(() => setExpanded(active), active ? 0 : 5000)
    return () => clearTimeout(t)
  }, [mode, notice])

  const stateLabel =
    mode === 'speaking' ? 'Nora is speaking…'
      : mode === 'thinking' ? 'Nora is thinking…'
        : mode === 'listening' ? (armed ? 'Listening for your command…' : 'Listening…')
          : muted ? 'Tap to talk' : 'Listening for “Hey Nora”'

  return (
    <div className={`gva gva--${mode}${expanded ? ' gva--open' : ''}`} aria-live="polite">
      {expanded && (
        <div className="gva-panel">
          <div className="gva-panel-head">
            <span className="gva-title">Nora</span>
            <button type="button" className="gva-x" aria-label="Close" onClick={() => setExpanded(false)}>×</button>
          </div>
          <div className="gva-state">{stateLabel}</div>
          {/* Show conversation context indicator */}
          {conversationHistory.length > 0 && mode === 'idle' && (
            <div className="gva-context-bar">
              <span className="gva-context-label">
                {conversationHistory.length} turn{conversationHistory.length !== 1 ? 's' : ''} in conversation
              </span>
              <button
                type="button"
                className="gva-context-clear"
                onClick={() => {
                  setConversationHistory([])
                  sessionIdRef.current = generateSessionId()
                }}
                title="Start new conversation"
              >
                New chat
              </button>
            </div>
          )}
          {/* Show follow-up indicator */}
          {isFollowUp && transcript && (
            <div className="gva-follow-up-badge">Following up on previous question</div>
          )}
          {/* Show agent routing indicator when processing */}
          {(isClassifying || agentRouting) && (
            <div className="gva-agent">
              <AgentIndicator
                agent={agentRouting?.agent}
                confidence={agentRouting?.confidence}
                reasoning={agentRouting?.reasoning}
                secondaryAgents={agentRouting?.secondaryAgents}
                isLoading={isClassifying}
                compact={false}
              />
              {/* Show correction option after response */}
              {agentRouting && !isClassifying && mode === 'idle' && transcript && (
                <AgentCorrection
                  query={transcript}
                  currentAgent={agentRouting.agent}
                  onCorrected={(newAgent) => {
                    setAgentRouting((prev) => prev ? { ...prev, agent: newAgent } : null)
                  }}
                  inline
                />
              )}
            </div>
          )}
          {transcript && <div className="gva-line gva-you"><b>You:</b> {transcript}</div>}
          {reply && <div className="gva-line gva-nora"><b>Nora:</b> {reply}</div>}
          {notice && <div className="gva-notice">{notice}</div>}
          {/* Follow-up suggestions */}
          {followUpSuggestions.length > 0 && mode === 'idle' && (
            <div className="gva-suggestions">
              <span className="gva-suggestions-label">Try asking:</span>
              {followUpSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="gva-suggestion"
                  onClick={() => {
                    setTextValue(suggestion)
                    void runUtterance(suggestion)
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          <form className="gva-textbar" onSubmit={submitText}>
            <input
              className="gva-input"
              value={textValue}
              onChange={(ev) => setTextValue(ev.target.value)}
              placeholder="Type a command or question…"
              aria-label="Type a command or question"
            />
            <button type="submit" className="gva-send" aria-label="Send">↵</button>
          </form>
          <label className="gva-mute">
            <input type="checkbox" checked={!muted} onChange={toggleMute} />
            <span>Always listening (“Hey Nora”)</span>
          </label>
        </div>
      )}
    </div>
  )
}
