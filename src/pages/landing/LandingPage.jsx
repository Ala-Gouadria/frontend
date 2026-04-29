import NoraAvatar from '../../components/nora/NoraAvatar'
import noraLogo    from '../../assets/logo/Nora-AI-logo.png'
import companyLogo from '../../assets/logo/Nora_Componennts_Logo.png'
import profilePhoto from '../../assets/logo/Photo-Profile-log.png'
import starsIcon   from '../../assets/icons/Main-Nav-icons/StarsIcon.png'
import connectIcon from '../../assets/icons/Main-Nav-icons/ConnectIcon.png'
import databaseIcon from '../../assets/icons/Main-Nav-icons/DataBaseIcon.png'
import layersIcon  from '../../assets/icons/Main-Nav-icons/layersIcon.png'
import chatIcon    from '../../assets/icons/Main-Nav-icons/BubbleChatSparkIcon.png'
import albumIcon   from '../../assets/icons/Main-Nav-icons/albumIcon.png'

const railIcons = [connectIcon, databaseIcon, layersIcon, chatIcon, albumIcon]

/* ─── tiny shared primitives (identical to IntelligenceMap) ─── */

function ChevronDown() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <path d="M4 6.3L8 10.2L12 6.3" stroke="#64748b" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ─── LeftRail (pixel-identical copy from IntelligenceMap) ──── */
function LeftRail() {
  return (
    <>
      {/* Logo + profile photo */}
      <div style={{ position:'fixed', top:21, left:28, zIndex:40,
                    display:'flex', alignItems:'flex-start' }}>
        <div style={{ width:68, height:68, borderRadius:22,
                      background:'linear-gradient(180deg,#80afff 0%,#2f79ff 100%)',
                      border:'5px solid rgba(255,255,255,0.98)',
                      boxShadow:'0 18px 34px rgba(47,121,255,0.16)',
                      display:'grid', placeItems:'center' }}>
          <img src={noraLogo} alt="Nora" style={{ width:36, height:36, objectFit:'contain' }} />
        </div>
        <div style={{ width:34, height:34, marginLeft:-15, marginTop:38,
                      borderRadius:999, border:'3px solid #ffffff',
                      overflow:'hidden', background:'#ffffff',
                      boxShadow:'0 10px 18px rgba(15,23,42,0.12)' }}>
          <img src={profilePhoto} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        </div>
      </div>

      {/* Icon rail */}
      <div style={{ position:'fixed', left:25, top:'50%',
                    transform:'translateY(-50%)', zIndex:35,
                    display:'grid', gap:14 }}>
        {/* Stars button */}
        <button type="button" style={{ width:54, height:54, borderRadius:999,
                  padding:2, border:'none',
                  background:'linear-gradient(135deg,#2f79ff 6%,#8eb9ff 48%,#f2d1f0 100%)',
                  boxShadow:'0 10px 22px rgba(47,121,255,0.12)', cursor:'pointer' }}>
          <span style={{ width:'100%', height:'100%', borderRadius:'50%',
                         display:'grid', placeItems:'center', background:'#ffffff' }}>
            <img src={starsIcon} alt="" style={{ width:22, height:22, objectFit:'contain' }} />
          </span>
        </button>

        {/* Nav icon pill */}
        <div style={{ width:60, padding:'16px 0 14px', borderRadius:30,
                      background:'rgba(255,255,255,0.95)',
                      border:'1px solid rgba(15,23,42,0.06)',
                      boxShadow:'0 18px 36px rgba(15,23,42,0.06)',
                      display:'grid', gap:12, justifyItems:'center' }}>
          {railIcons.map((icon) => (
            <button key={icon} type="button"
              style={{ width:36, height:36, border:'none', background:'transparent',
                       borderRadius:14, display:'grid', placeItems:'center',
                       cursor:'pointer', padding:0 }}>
              <img src={icon} alt="" style={{ width:20, height:20, objectFit:'contain', opacity:0.74 }} />
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

/* ─── WorkspaceBadge (identical copy) ───────────────────────── */
function WorkspaceBadge() {
  return (
    <div style={{ position:'fixed', top:22, right:28, zIndex:40,
                  display:'flex', alignItems:'center', gap:12,
                  height:56, padding:'0 13px 0 10px', borderRadius:999,
                  background:'rgba(255,255,255,0.95)',
                  border:'1px solid rgba(15,23,42,0.08)',
                  boxShadow:'0 16px 30px rgba(15,23,42,0.06)' }}>
      <div style={{ width:42, height:42, borderRadius:999,
                    background:'linear-gradient(180deg,#0b52c8 0%,#08347f 100%)',
                    display:'grid', placeItems:'center', overflow:'hidden' }}>
        <img src={companyLogo} alt="" style={{ width:27, height:18, objectFit:'contain' }} />
      </div>
      <span style={{ fontSize:15, fontWeight:500, color:'#2b3340', letterSpacing:'-0.02em' }}>
        XWorldLTD
      </span>
      <ChevronDown />
    </div>
  )
}

/* ─── BottomToolbar (static version, identical chrome) ──────── */
function BottomToolbar({ onEnter }) {
  return (
    <div style={{ position:'fixed', left:'50%', bottom:18,
                  transform:'translateX(-50%)', zIndex:42,
                  display:'grid', gap:10, justifyContent:'center' }}>

      {/* Row 1 */}
      <div style={{ display:'flex', alignItems:'center', gap:12, justifyContent:'center' }}>

        {/* Zoom strip */}
        <div style={{ display:'flex', alignItems:'center', gap:2, padding:5,
                      borderRadius:999, background:'rgba(255,255,255,0.96)',
                      border:'1px solid rgba(15,23,42,0.08)',
                      boxShadow:'0 14px 26px rgba(15,23,42,0.08)' }}>
          <button type="button" style={circleBtn}>
            <span style={{ fontSize:28, fontWeight:300, lineHeight:1, color:'#7f8898' }}>+</span>
          </button>
          <div style={{ minWidth:58, textAlign:'center', fontSize:16, fontWeight:500,
                        color:'#1f2937', letterSpacing:'-0.02em' }}>100%</div>
          <button type="button" style={circleBtn}>
            <span style={{ fontSize:28, fontWeight:300, lineHeight:1, color:'#7f8898', marginTop:-2 }}>-</span>
          </button>
          <button type="button" style={{
            height:44, padding:'0 18px', borderRadius:999,
            border:'1px solid rgba(15,23,42,0.08)', background:'#ffffff',
            color:'#1f2937', fontSize:15, fontWeight:500,
            letterSpacing:'-0.02em', cursor:'pointer' }}>Reset View</button>
        </div>

        {/* Cursor / Hand tools */}
        <div style={{ display:'flex', alignItems:'center', gap:4, padding:5,
                      borderRadius:999, background:'rgba(255,255,255,0.96)',
                      border:'1px solid rgba(15,23,42,0.08)',
                      boxShadow:'0 14px 26px rgba(15,23,42,0.08)' }}>
          <button type="button" style={circleBtn}>
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
              <path d="M4.5 3.5L13.8 9.1L9.3 10.4L11.8 15.5" stroke="#7f8898"
                    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" style={{ ...circleBtn,
            background:'linear-gradient(180deg,#fffdf4 0%,#fff4d6 100%)' }}>
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
              <path d="M7.3 8.4V5.9C7.3 5.2 7.8 4.6 8.5 4.6C9.2 4.6 9.7 5.2 9.7 5.9V8"
                    stroke="#f0a62d" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M9.7 8V4.9C9.7 4.2 10.2 3.7 10.9 3.7C11.5 3.7 12.1 4.2 12.1 4.9V8.4"
                    stroke="#f0a62d" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M12.1 8.4V5.8C12.1 5.2 12.6 4.7 13.2 4.7C13.9 4.7 14.4 5.2 14.4 5.8V10.4C14.4 13.6 12.1 16 9 16C6.7 16 4.8 14.7 4 12.6L3.2 10.7C2.9 10 3.2 9.2 3.9 8.9C4.6 8.6 5.3 8.9 5.7 9.6L6.4 10.9V6.9C6.4 6.2 7 5.7 7.6 5.7C8.3 5.7 8.8 6.2 8.8 6.9V8.4"
                    fill="#f0a62d" fillOpacity="0.15"/>
              <path d="M6.4 10.9V6.9C6.4 6.2 7 5.7 7.6 5.7C8.3 5.7 8.8 6.2 8.8 6.9V10.1"
                    stroke="#f0a62d" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M14.4 8.5C15.3 8.5 16 9.2 16 10.1V10.5C16 13.8 13.3 16.4 10.1 16.4H9.7C7.3 16.4 5.2 15 4.4 12.8L3.7 11"
                    stroke="#f0a62d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Ask Nora */}
        <button type="button" onClick={onEnter} style={{
          height:56, padding:'0 26px', borderRadius:999,
          border:'2px solid rgba(17,24,39,0.92)', background:'#ffffff',
          color:'#1d2430', fontSize:15, fontWeight:500,
          letterSpacing:'-0.02em',
          boxShadow:'0 12px 24px rgba(15,23,42,0.06)',
          cursor:'pointer', display:'flex', alignItems:'center', gap:12 }}>
          <img src={noraLogo} alt="" style={{ width:18, height:18, objectFit:'contain' }} />
          Ask Nora about your business
        </button>
      </div>

      {/* Row 2 */}
      <div style={{ display:'flex', alignItems:'center', gap:12,
                    justifyContent:'flex-end', paddingLeft:306 }}>
        {/* Task Overview */}
        <button type="button" style={{
          height:54, padding:'0 28px', borderRadius:999,
          border:'2px solid rgba(17,24,39,0.92)',
          background:'linear-gradient(180deg,#ffffff 0%,#f9fce9 100%)',
          color:'#1f2937', fontSize:15, fontWeight:500,
          letterSpacing:'-0.02em',
          boxShadow:'0 12px 24px rgba(15,23,42,0.06)',
          cursor:'pointer', display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ width:20, height:20, borderRadius:999,
                         border:'3px solid #98c21d', display:'inline-block',
                         boxSizing:'border-box' }} />
          Task Overview
        </button>

        {/* Analyzing competitors */}
        <button type="button" style={{
          height:54, padding:'0 24px', borderRadius:999,
          border:'2px solid rgba(17,24,39,0.92)',
          background:'linear-gradient(90deg,#f7fce8 0%,#d8eb97 52%,#eef7cc 100%)',
          color:'#1f2937', fontSize:15, fontWeight:500,
          letterSpacing:'-0.02em',
          boxShadow:'0 12px 24px rgba(15,23,42,0.06)',
          cursor:'pointer', display:'flex', alignItems:'center', gap:12,
          position:'relative', overflow:'hidden' }}>
          <span style={{ position:'absolute', inset:0,
            background:'linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(202,228,123,0.42) 46%,rgba(255,255,255,0) 100%)',
            transform:'translateX(-14%)' }} />
          <span style={{ position:'relative', width:18, height:18, borderRadius:999,
                         background:'#111827', display:'inline-block',
                         boxShadow:'0 0 0 5px rgba(17,24,39,0.04)' }} />
          <span style={{ position:'relative' }}>Analyzing competitors m...</span>
        </button>
      </div>
    </div>
  )
}

/* ─── shared style constant ─────────────────────────────────── */
const circleBtn = {
  width:44, height:44, borderRadius:999,
  border:'1px solid rgba(15,23,42,0.08)', background:'#ffffff',
  display:'grid', placeItems:'center',
  boxShadow:'none', cursor:'pointer', padding:0,
}

/* ─── Main LandingPage ───────────────────────────────────────── */
export default function LandingPage({ onEnter }) {
  return (
    <>
      <style>{`
        /* same dot-grid as the canvas */
        .lp-grid {
          background-color: #f8f8f7;
          background-image:
            radial-gradient(circle, rgba(148,163,184,0.46) 1.1px, transparent 1.2px),
            linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(245,247,250,0.96) 100%);
          background-size: 24px 24px, 100% 100%;
        }

        @keyframes lp-float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes lp-fade-up {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes lp-ambient-pulse {
          0%,100% { opacity:0.55; }
          50%      { opacity:1;   }
        }

        .lp-avatar-wrap  { animation: lp-float 4.2s ease-in-out infinite; }
        .lp-headline     { animation: lp-fade-up .88s cubic-bezier(.22,1,.36,1) .18s both; }
        .lp-subtitle     { animation: lp-fade-up .88s cubic-bezier(.22,1,.36,1) .34s both; }
        .lp-cta          { animation: lp-fade-up .88s cubic-bezier(.22,1,.36,1) .52s both; }
        .lp-badges       { animation: lp-fade-up .88s cubic-bezier(.22,1,.36,1) .70s both; }
        .lp-ambient      { animation: lp-ambient-pulse 5.4s ease-in-out infinite; }

        .lp-primary-btn {
          transition: transform 180ms ease, box-shadow 180ms ease !important;
        }
        .lp-primary-btn:hover {
          transform: scale(1.04) !important;
          box-shadow: 0 22px 44px rgba(47,121,255,0.30) !important;
        }
        .lp-ghost-btn {
          transition: background 160ms ease, transform 160ms ease !important;
        }
        .lp-ghost-btn:hover {
          background: rgba(250,250,255,0.98) !important;
          transform: scale(1.02) !important;
        }
      `}</style>

      <div className="lp-grid" style={{
        width:'100vw', height:'100vh',
        position:'relative', overflow:'hidden',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
      }}>

        {/* ── identical UI chrome ── */}
        <LeftRail />
        <WorkspaceBadge />

        {/* ── Hero ── */}
        <div style={{
          position:'relative', zIndex:10,
          display:'flex', flexDirection:'column',
          alignItems:'center', textAlign:'center', gap:0,
        }}>

          {/* large ambient glow behind avatar */}
          <div className="lp-ambient" style={{
            position:'absolute', top:'50%', left:'50%',
            transform:'translate(-50%,-50%)',
            width:480, height:480, borderRadius:'50%',
            background:'radial-gradient(circle, rgba(88,148,255,0.16) 0%, rgba(88,148,255,0.07) 42%, transparent 72%)',
            filter:'blur(22px)', pointerEvents:'none',
          }} />

          {/* Nora avatar — same component used in the map */}
          <div className="lp-avatar-wrap" style={{ marginBottom:38, position:'relative', zIndex:2 }}>
            <NoraAvatar active={false} onClick={null} />
          </div>

          {/* Headline */}
          <h1 className="lp-headline" style={{
            margin:0, marginBottom:16,
            fontSize:40, fontWeight:700, color:'#111827',
            letterSpacing:'-0.035em', lineHeight:1.14,
            maxWidth:540,
          }}>
            Your AI Business<br />Intelligence Hub
          </h1>

          {/* Subtitle */}
          <p className="lp-subtitle" style={{
            margin:0, marginBottom:38,
            fontSize:16, fontWeight:400, color:'#64748b',
            letterSpacing:'-0.012em', lineHeight:1.65,
            maxWidth:430,
          }}>
            Nora connects your analytics, automation, social&nbsp;media,
            and sales into one intelligent, interactive map.
          </p>

          {/* CTA buttons */}
          <div className="lp-cta" style={{ display:'flex', gap:12, alignItems:'center' }}>
            {/* Primary — launches the map */}
            <button
              type="button"
              className="lp-primary-btn"
              onClick={onEnter}
              style={{
                height:56, padding:'0 32px', borderRadius:999,
                border:'2px solid rgba(47,121,255,0.88)',
                background:'linear-gradient(135deg,#2f79ff 0%,#5a9fff 100%)',
                color:'#ffffff', fontSize:16, fontWeight:600,
                letterSpacing:'-0.02em', cursor:'pointer',
                display:'flex', alignItems:'center', gap:10,
                boxShadow:'0 14px 34px rgba(47,121,255,0.24)',
              }}>
              <img src={starsIcon} alt=""
                   style={{ width:18, height:18, objectFit:'contain',
                            filter:'brightness(0) invert(1)' }} />
              Open Intelligence Map
            </button>

            {/* Ghost */}
            <button
              type="button"
              className="lp-ghost-btn"
              style={{
                height:56, padding:'0 28px', borderRadius:999,
                border:'2px solid rgba(17,24,39,0.88)',
                background:'rgba(255,255,255,0.96)',
                color:'#1f2937', fontSize:15, fontWeight:500,
                letterSpacing:'-0.02em', cursor:'pointer',
                display:'flex', alignItems:'center', gap:10,
                boxShadow:'0 10px 24px rgba(15,23,42,0.06)',
              }}>
              <img src={noraLogo} alt="" style={{ width:16, height:16, objectFit:'contain' }} />
              Ask Nora anything
            </button>
          </div>

          {/* Status badge row — identical style to bottom toolbar badges */}
          <div className="lp-badges" style={{
            display:'flex', gap:10, marginTop:30, alignItems:'center',
          }}>
            {/* Task Overview badge */}
            <div style={{
              display:'flex', alignItems:'center', gap:8,
              padding:'9px 18px', borderRadius:999,
              background:'linear-gradient(180deg,#ffffff 0%,#f9fce9 100%)',
              border:'1.5px solid rgba(17,24,39,0.88)',
              boxShadow:'0 8px 18px rgba(15,23,42,0.06)',
            }}>
              <span style={{ width:16, height:16, borderRadius:999,
                             border:'2.5px solid #98c21d', display:'inline-block',
                             boxSizing:'border-box' }} />
              <span style={{ fontSize:13, fontWeight:500, color:'#374151',
                             letterSpacing:'-0.01em' }}>Task Overview</span>
            </div>

            {/* Analyzing badge */}
            <div style={{
              display:'flex', alignItems:'center', gap:8,
              padding:'9px 18px', borderRadius:999,
              background:'linear-gradient(90deg,#f7fce8 0%,#d8eb97 52%,#eef7cc 100%)',
              border:'1.5px solid rgba(17,24,39,0.88)',
              boxShadow:'0 8px 18px rgba(15,23,42,0.06)',
              position:'relative', overflow:'hidden',
            }}>
              <span style={{ position:'absolute', inset:0,
                background:'linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(202,228,123,0.42) 46%,rgba(255,255,255,0) 100%)',
                transform:'translateX(-14%)' }} />
              <span style={{ position:'relative', width:12, height:12, borderRadius:999,
                             background:'#111827', display:'inline-block',
                             boxShadow:'0 0 0 4px rgba(17,24,39,0.06)' }} />
              <span style={{ position:'relative', fontSize:13, fontWeight:500,
                             color:'#374151', letterSpacing:'-0.01em' }}>
                Analyzing competitors…
              </span>
            </div>
          </div>
        </div>

        {/* ── identical bottom toolbar (static version) ── */}
        <BottomToolbar onEnter={onEnter} />
      </div>
    </>
  )
}
