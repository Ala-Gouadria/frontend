import { useRef, useEffect, useState } from 'react'
import MainNav from '../layout/MainNav'
import AgentPanel from './AgentPanel'
import { detectAgents, DEMO_AGENTS } from './agentPanelConfig'
import { noraWorkspaceApi } from '../../api/noraWorkspaceApi'
import { voiceApi } from '../../api/voiceApi'
import { matchDemoTurn } from './demoScript'
import './NoraVoice.css'

const DEMO_AGENT_KEYS = DEMO_AGENTS.map((a) => a.key)

// Index of the earliest keyword for `agentKey` within `lowerText` (-1 if none).
function firstKeywordIndex(lowerText, agentKey) {
  const agent = DEMO_AGENTS.find((a) => a.key === agentKey)
  if (!agent) return -1
  let best = -1
  for (const kw of agent.keywords) {
    const i = lowerText.indexOf(kw)
    if (i >= 0 && (best < 0 || i < best)) best = i
  }
  return best
}

// Baked-in look/feel constants (were the prototype's live "Tweaks" defaults).
const CONFIG = {
  ringColor: '#7c83f5',
  sensitivity: 1.3,
  rippleSpeed: 1,
  calmness: 0.86,
  glow: 1,
  wobble: 1,
  showWordmark: true,
  bgTone: '#e9eefc',
}

// ---- small helpers ---------------------------------------------------------
function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function lerp(a, b, t) {
  return a + (b - a) * t
}

export default function NoraVoice({ activeNavId = 'stars', onNavigate }) {
  const [mode, setMode] = useState('idle') // 'idle' | 'listening' | 'speaking'
  const [notice, setNotice] = useState('')
  const [prompt, setPrompt] = useState('')
  // Live voice chat with Nora, right here on the orb screen.
  const [isSending, setIsSending] = useState(false)
  const [revealedAgents, setRevealedAgents] = useState(() => new Set())
  const conversationIdRef = useRef(null)
  const modeRef = useRef('idle')
  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  const canvasRef = useRef(null)
  const orbRef = useRef(null)
  const glowRef = useRef(null)

  // animation state
  const levelRef = useRef(0.07)
  const ringsRef = useRef([])
  const spawnAccRef = useRef(0)
  // one-time "waking up" intro: elapsed seconds since mount; drives a 0→1 ramp.
  // Skip it (start fully awake) when the user prefers reduced motion.
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const WAKE_DURATION = 3 // seconds — full intro: ignite → settle (paced to fill it)
  const wakeRef = useRef(prefersReducedMotion ? WAKE_DURATION : 0)

  // Until the orb finishes waking (3s), only the orb is shown; the rest of the
  // UI (nav, prompt, controls, dashboard button) snaps in afterwards.
  const [revealed, setRevealed] = useState(prefersReducedMotion)
  useEffect(() => {
    if (prefersReducedMotion) return undefined
    const id = setTimeout(() => setRevealed(true), WAKE_DURATION * 1000)
    return () => clearTimeout(id)
  }, [prefersReducedMotion])

  // audio
  const audioRef = useRef({ ctx: null, analyser: null, stream: null, data: null, ok: false })
  // analyser bound to Nora's playback audio, so the orb pulses to her real voice
  const speakAudioRef = useRef({ ctx: null, analyser: null, data: null, ok: false, el: null, url: null })
  // A single AudioContext unlocked by the first user gesture (autoplay policy).
  // Reused for playback so it is never suspended when Nora speaks.
  const sharedCtxRef = useRef(null)
  useEffect(() => {
    const unlock = () => {
      if (!sharedCtxRef.current) {
        try {
          sharedCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
        } catch {
          return
        }
      }
      if (sharedCtxRef.current.state === 'suspended') {
        sharedCtxRef.current.resume().catch(() => {})
      }
    }
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])
  // browser SpeechRecognition (STT) instance + recording flag
  const recognitionRef = useRef(null)
  const [isListening, setIsListening] = useState(false)

  // ---- main animation loop -------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let running = true
    let W = 0
    let H = 0
    let DPR = 1

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas.clientWidth
      H = canvas.clientHeight
      canvas.width = W * DPR
      canvas.height = H * DPR
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Derive the orb radius from the actual rendered element so ripples spawn at
    // its edge regardless of the responsive size (falls back to 460px / 2).
    function orbRadius() {
      const w = orbRef.current?.offsetWidth
      return w ? w / 2 : 230
    }
    let last = performance.now()

    function targetLevel(now) {
      const a = audioRef.current
      const m = modeRef.current
      const ts = now / 1000
      if (m === 'listening') {
        if (a.ok && a.analyser) {
          a.analyser.getByteTimeDomainData(a.data)
          let sum = 0
          for (let i = 0; i < a.data.length; i++) {
            const v = (a.data[i] - 128) / 128
            sum += v * v
          }
          const rms = Math.sqrt(sum / a.data.length)
          return Math.min(1, rms * 4.2 * CONFIG.sensitivity)
        }
        // simulated listening (no mic): soft, lively-but-gentle
        const e = Math.max(0, Math.sin(ts * 3.1)) * 0.4 + Math.max(0, Math.sin(ts * 1.7 + 1)) * 0.25
        return (0.12 + e * 0.5) * CONFIG.sensitivity * 0.7
      }
      if (m === 'speaking') {
        // If Nora's real voice is playing, drive the orb off that audio's RMS so
        // it pulses to her actual speech. Falls back to a synthesised envelope.
        const s = speakAudioRef.current
        if (s.ok && s.analyser) {
          s.analyser.getByteTimeDomainData(s.data)
          let sum = 0
          for (let i = 0; i < s.data.length; i++) {
            const v = (s.data[i] - 128) / 128
            sum += v * v
          }
          const rms = Math.sqrt(sum / s.data.length)
          return Math.min(1, 0.12 + rms * 5.0)
        }
        // synthesised speech-like envelope: syllable bursts + phrase pauses
        const env =
          Math.max(0, Math.sin(ts * 9.0)) * 0.5 +
          Math.max(0, Math.sin(ts * 5.3 + 1.0)) * 0.3 +
          Math.max(0, Math.sin(ts * 13.0 + 2.0)) * 0.2
        const phrase = Math.sin(ts * 0.55) > -0.35 ? 1 : 0.12 // occasional breath
        return (0.18 + env * 0.82) * phrase
      }
      // idle breathing
      return 0.06 + (Math.sin(ts * 0.9) * 0.5 + 0.5) * 0.05
    }

    function frame(now) {
      if (!running) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const tw = CONFIG
      const ORB_R = orbRadius()

      // ── Wake-up: from black, everything eases up together ───────────────
      // Start on pure black; the orb (and its glow) gently fade up over the full
      // WAKE_DURATION, easing in sync with the breathing — no pop, no bloom, no
      // ripple. One calm, clean fade-from-black.
      wakeRef.current = Math.min(WAKE_DURATION, wakeRef.current + dt)
      const wakeRaw = wakeRef.current / WAKE_DURATION // 0..1 over the full duration
      const waking = wakeRaw < 1

      // smoothstep — eased in AND out, so the fade is soft at both ends.
      const smooth = (t) => {
        const x = Math.min(1, Math.max(0, t))
        return x * x * (3 - 2 * x)
      }
      const wake = smooth(wakeRaw)

      // smooth the level
      const target = targetLevel(now)
      const k = 1 - Math.pow(tw.calmness, dt * 60) // frame-rate independent smoothing
      levelRef.current = lerp(levelRef.current, target, k)
      const lvl = levelRef.current

      // spawn ripples — faster cadence & stronger when louder (held during wake)
      spawnAccRef.current += dt
      const interval = lerp(1.25, 0.34, Math.min(1, lvl)) // seconds between rings
      if (!waking && spawnAccRef.current >= interval) {
        spawnAccRef.current = 0
        ringsRef.current.push({ r: ORB_R - 6, strength: 0.35 + lvl * 0.65, seed: Math.random() * 100 })
      }

      // draw
      ctx.clearRect(0, 0, W, H)
      const cx = W / 2
      const cy = H / 2
      const maxR = Math.max(W, H) * 0.62
      const [cr, cg, cb] = hexToRgb(tw.ringColor)

      const baseSpeed = 60 * tw.rippleSpeed // px/sec
      const rings = ringsRef.current
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i]
        ring.r += baseSpeed * dt * (0.7 + lvl * 0.9)
        const p = (ring.r - ORB_R) / (maxR - ORB_R) // 0..1 progress
        if (p >= 1) {
          rings.splice(i, 1)
          continue
        }
        const fade = Math.pow(1 - p, 1.7)
        const alpha = fade * ring.strength * 0.55
        if (alpha <= 0.004) continue

        // organic "voice wave" wobble around the circle
        const wob = tw.wobble * (3 + lvl * 22) * (0.4 + p * 0.6)
        const pts = 72
        ctx.beginPath()
        for (let j = 0; j <= pts; j++) {
          const ang = (j / pts) * Math.PI * 2
          const w =
            Math.sin(ang * 3 + ring.seed + now / 900) * 0.6 +
            Math.sin(ang * 5 - ring.seed + now / 1300) * 0.4
          const rr = ring.r + w * wob
          const x = cx + Math.cos(ang) * rr
          const y = cy + Math.sin(ang) * rr
          if (j === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.lineWidth = lerp(2.4, 0.5, p)
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`
        ctx.stroke()
      }

      // soft reactive halo right at the orb edge (immediate feedback)
      const haloR = ORB_R + 6 + lvl * 46
      const g = ctx.createRadialGradient(cx, cy, ORB_R * 0.6, cx, cy, haloR + 30)
      g.addColorStop(0, `rgba(${cr},${cg},${cb},0)`)
      g.addColorStop(0.72, `rgba(${cr},${cg},${cb},${0.12 + lvl * 0.22})`)
      g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
      ctx.beginPath()
      ctx.arc(cx, cy, haloR + 30, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()

      // Idle "breathing": a slow, clearly-visible scale + brightness pulse that
      // only shows when there's little voice activity. It eases in with the wake
      // (from black) so the breath emerges as the orb fades up — no sudden onset.
      const breath = Math.sin(now / 1000 * 1.15) * 0.5 + 0.5 // 0..1, ~5.5s cycle
      const calm = Math.max(0, 1 - lvl * 6) // fades the breathing out as voice rises
      const breathScale = 1 + breath * 0.045 * calm * wake // up to ~4.5% — visible but gentle
      const breathBright = 1 + breath * 0.16 * calm * wake // subtle glow pulse

      // drive the orb element without re-rendering React. From black, the orb
      // simply eases up in opacity (with the breathing) — no pop, no bloom.
      if (orbRef.current) {
        const s = (1 + lvl * 0.07) * breathScale
        orbRef.current.style.transform = `scale(${s.toFixed(4)})`
        orbRef.current.style.opacity = wake.toFixed(3)
        orbRef.current.style.filter = `brightness(${breathBright.toFixed(3)})`
      }
      if (glowRef.current) {
        const glowBreath = 1 + breath * 0.25 * calm
        glowRef.current.style.opacity = ((0.35 + lvl * 0.65 * tw.glow) * wake * glowBreath).toFixed(3)
        glowRef.current.style.transform = `scale(${((1 + lvl * 0.25) * (1 + breath * 0.06 * calm)).toFixed(3)})`
      }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // ---- audio control -------------------------------------------------------
  async function startListening() {
    setMode('listening')
    setNotice('')
    const a = audioRef.current
    if (a.ok) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const src = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 1024
      analyser.smoothingTimeConstant = 0.6
      src.connect(analyser)
      a.ctx = ctx
      a.analyser = analyser
      a.stream = stream
      a.data = new Uint8Array(analyser.fftSize)
      a.ok = true
    } catch {
      a.ok = false
      setNotice(
        'Mic unavailable here — showing a simulated voice. Allow microphone access to drive the waves with your real voice.',
      )
    }
  }
  function stopAudio() {
    const a = audioRef.current
    if (a.stream) a.stream.getTracks().forEach((tk) => tk.stop())
    if (a.ctx) a.ctx.close()
    audioRef.current = { ctx: null, analyser: null, stream: null, data: null, ok: false }
  }
  function goIdle() {
    stopAudio()
    setMode('idle')
    setNotice('')
  }
  function toggleSpeak() {
    if (mode === 'speaking') {
      setMode('idle')
    } else {
      stopAudio()
      setMode('speaking')
      setNotice('')
    }
  }

  // ---- Nora voice playback (TTS) -------------------------------------------
  function stopNoraVoice() {
    const s = speakAudioRef.current
    if (s.el) {
      s.el.pause()
      s.el.src = ''
    }
    if (s.ctx) s.ctx.close()
    if (s.url) URL.revokeObjectURL(s.url)
    speakAudioRef.current = { ctx: null, analyser: null, data: null, ok: false, el: null, url: null }
  }

  // Speak `text` aloud with Nora's voice, pulse the orb off the real audio, and
  // reveal agent cards progressively as she names each one (synced to playback).
  // `cachedAudioUrl` (optional) skips live TTS and plays a pre-generated file.
  async function playNoraVoice(text, cachedAudioUrl) {
    stopNoraVoice()
    setMode('speaking')

    let url = cachedAudioUrl
    if (!url) {
      try {
        url = await voiceApi.speak(text)
      } catch {
        // No audio — still reveal cards from the text so the demo isn't blank.
        setRevealedAgents((prev) => new Set([...prev, ...detectAgents(text)]))
        setMode('idle')
        setNotice('Voice unavailable right now — showing Nora’s answer visually.')
        return
      }
    }

    const el = new Audio(url)
    el.volume = 1
    el.preload = 'auto'

    // Start playback FIRST and unconditionally — this is the guaranteed sound
    // path. The Web Audio analyser is attached afterwards purely to read levels
    // for the orb; if it fails, sound still plays.
    let played = false
    try {
      await el.play()
      played = true
    } catch (err) {
      // Autoplay blocked — reveal cards from text and prompt a tap to unlock.
      console.warn('Nora audio play() blocked:', err)
      setRevealedAgents((prev) => new Set([...prev, ...detectAgents(text)]))
      setNotice('Tap anywhere once, then ask again to hear Nora.')
    }

    let analyser = null
    if (played) {
      try {
        let ctx = sharedCtxRef.current
        if (!ctx) {
          ctx = new (window.AudioContext || window.webkitAudioContext)()
          sharedCtxRef.current = ctx
        }
        if (ctx.state === 'suspended') await ctx.resume().catch(() => {})
        const src = ctx.createMediaElementSource(el)
        analyser = ctx.createAnalyser()
        analyser.fftSize = 1024
        analyser.smoothingTimeConstant = 0.6
        // Route through the analyser AND to the speakers so it stays audible.
        src.connect(analyser)
        analyser.connect(ctx.destination)
      } catch (err) {
        // Analyser attach failed — sound still plays via the element directly.
        console.warn('Nora orb analyser unavailable (audio still plays):', err)
        analyser = null
      }
    }

    speakAudioRef.current = {
      ctx: null, // shared context is owned by sharedCtxRef — don't close it here
      analyser,
      data: analyser ? new Uint8Array(analyser.fftSize) : null,
      ok: Boolean(analyser),
      el,
      url,
    }

    // Progressive card reveal synced to playback: reveal each agent when its
    // keyword's position in the text is "reached" (ratio of text → audio time).
    const lower = text.toLowerCase()
    const scheduleAgentReveals = () => {
      const dur = el.duration && isFinite(el.duration) ? el.duration : 6
      DEMO_AGENT_KEYS.forEach((key) => {
        const idx = firstKeywordIndex(lower, key)
        if (idx < 0) return
        // approximate when this word is spoken: position ratio * duration
        const ratio = idx / Math.max(1, text.length)
        const delayMs = Math.max(0, ratio * dur * 1000)
        setTimeout(() => {
          setRevealedAgents((prev) => (prev.has(key) ? prev : new Set([...prev, key])))
        }, delayMs)
      })
    }

    el.addEventListener('ended', () => {
      stopNoraVoice()
      setMode('idle')
    })
    // Metadata is usually available once play() has started; schedule now, and
    // also on loadedmetadata in case duration wasn't ready yet.
    if (el.duration && isFinite(el.duration)) {
      scheduleAgentReveals()
    } else {
      el.addEventListener('loadedmetadata', scheduleAgentReveals, { once: true })
    }

    // If audio never played, still reveal the cards so the demo isn't blank.
    if (!played) {
      setRevealedAgents((prev) => new Set([...prev, ...detectAgents(text)]))
      setMode('idle')
    }
  }

  // ---- full voice conversation loop ----------------------------------------
  async function handleConversation(userText) {
    const text = (userText || '').trim()
    if (!text || isSending) return
    setIsSending(true)
    setNotice('')

    // Demo fast-path: if the question matches a pre-captured turn, play the
    // cached reply + pre-generated audio instantly (no live chat/TTS latency).
    const demoTurn = matchDemoTurn(text)
    if (demoTurn) {
      try {
        await playNoraVoice(demoTurn.text, demoTurn.audio)
      } finally {
        setIsSending(false)
      }
      return
    }

    try {
      if (!conversationIdRef.current) {
        const convo = await noraWorkspaceApi.createConversation({ serviceId: 'general' })
        conversationIdRef.current = convo.id
      }
      const result = await noraWorkspaceApi.sendMessage({
        conversationId: conversationIdRef.current,
        serviceId: 'general',
        text,
        chatOnly: true, // voice demo wants Nora's spoken chat reply, not the planner echo
      })
      const reply = result?.assistantMessage?.text || ''
      if (reply) {
        await playNoraVoice(reply)
      } else {
        setMode('idle')
      }
    } catch {
      setNotice('Nora is unreachable right now. Check the backend is running.')
      setMode('idle')
    } finally {
      setIsSending(false)
    }
  }

  // ---- speech-to-text (browser SpeechRecognition) --------------------------
  function startRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setNotice('Voice input needs Chrome. You can type your question instead.')
      return
    }
    stopNoraVoice()
    const rec = new SR()
    rec.lang = 'en-US'
    rec.interimResults = true
    rec.continuous = false
    let finalText = ''
    rec.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) finalText += t
        else interim += t
      }
      setPrompt(finalText || interim)
    }
    rec.onerror = () => {
      setIsListening(false)
      setMode('idle')
    }
    rec.onend = () => {
      setIsListening(false)
      recognitionRef.current = null
      const said = (finalText || prompt).trim()
      if (said) {
        setPrompt('')
        void handleConversation(said)
      } else {
        setMode('idle')
      }
    }
    recognitionRef.current = rec
    setIsListening(true)
    setMode('listening')
    startListening() // light up the orb off the user's mic while they talk
    rec.start()
  }
  function stopRecognition() {
    const rec = recognitionRef.current
    if (rec) rec.stop()
    stopAudio()
    setIsListening(false)
  }
  function toggleMic() {
    if (isListening) stopRecognition()
    else startRecognition()
  }

  // Tear down audio if the component unmounts mid-session.
  useEffect(() => () => { stopAudio(); stopNoraVoice() }, [])

  return (
    <div className="nora-voice">
      <div className="stage" style={{ '--tone': CONFIG.bgTone }}>
        {revealed && (
          <div className="nora-voice-nav">
            <MainNav activeId={activeNavId} onSelect={onNavigate} />
          </div>
        )}

        <canvas ref={canvasRef} className="ripple-canvas" />

        <div className="orb-wrap">
          <div
            ref={glowRef}
            className="orb-glow"
            style={{
              background: `radial-gradient(circle, ${CONFIG.ringColor}, transparent 66%)`,
              // Starts off (from black); the wake fades it up. (No first-frame flash.)
              opacity: prefersReducedMotion ? undefined : 0,
            }}
          />
          <div
            ref={orbRef}
            className="orb"
            style={{
              // From black: the orb starts invisible and eases up in opacity.
              opacity: prefersReducedMotion ? undefined : 0,
            }}
          >
            {CONFIG.showWordmark && <span className="wordmark">nora</span>}
          </div>
        </div>

        {revealed && (
        <div className="dock">
          <div className="state-label nv-enter" style={{ '--d': '60ms' }} data-mode={mode}>
            {isSending && 'Nora is thinking…'}
            {!isSending && mode === 'idle' && 'Tap the mic to talk to Nora'}
            {!isSending && mode === 'listening' && 'Listening…'}
            {!isSending && mode === 'speaking' && 'Nora is speaking…'}
          </div>

          <div className="prompt-bar nv-enter" style={{ '--d': '140ms' }}>
            <input
              className="prompt-input"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && prompt.trim()) {
                  const said = prompt.trim()
                  setPrompt('')
                  void handleConversation(said)
                }
              }}
              placeholder="Ask Nora about your business"
              aria-label="Ask Nora about your business"
            />
            <button
              type="button"
              className={'prompt-mic ' + (isListening ? 'active' : '')}
              onClick={toggleMic}
              aria-label={isListening ? 'Stop listening' : 'Talk to Nora'}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0" />
                <path d="M12 18v3" />
              </svg>
            </button>
            <button
              type="button"
              className="prompt-send"
              aria-label="Send"
              disabled={isSending || !prompt.trim()}
              onClick={() => {
                const said = prompt.trim()
                if (!said) return
                setPrompt('')
                void handleConversation(said)
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          <div className="controls nv-enter" style={{ '--d': '220ms' }}>
            <button
              type="button"
              className={'ctl ' + (mode === 'speaking' ? 'active' : '')}
              onClick={toggleSpeak}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 9v6h4l5 4V5L8 9H4z" />
                <path d="M17 8a5 5 0 0 1 0 8" />
              </svg>
              Hear Nora
            </button>
            {mode !== 'idle' && (
              <button type="button" className="ctl ghost" onClick={goIdle} aria-label="Stop">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            )}
          </div>

          {notice && <div className="notice">{notice}</div>}
        </div>
        )}

        {revealed && (
          <button
            type="button"
            className="nora-voice-dashboard nv-enter nv-enter--right"
            style={{ '--d': '0ms' }}
            onClick={() => onNavigate?.('stars-map')}
          >
            Open dashboard
          </button>
        )}

        {revealedAgents.size > 0 && (
          <div className="nora-voice-agents">
            <AgentPanel revealed={revealedAgents} />
          </div>
        )}
      </div>
    </div>
  )
}
