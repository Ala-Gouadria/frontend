import noraLogo from '../../assets/logo/Nora-AI-logo.png'

export default function NoraAvatar({
  size = 140,
  logoWidth = 68,
  logoSrc = noraLogo,
  logoAlt = 'Nora AI',
}) {
  return (
    <>
      <style>{`
        @keyframes breatheScale {
          0%, 100% { transform: scale(1); }
          40%       { transform: scale(1.065); }
          60%       { transform: scale(1.05); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.18; transform: scale(1); }
          40%      { opacity: 0.42; transform: scale(1.18); }
          60%      { opacity: 0.32; transform: scale(1.12); }
        }
        @keyframes outerRingPulse {
          0%, 100% { opacity: 0.08; transform: scale(1); }
          40%      { opacity: 0.22; transform: scale(1.25); }
          60%      { opacity: 0.14; transform: scale(1.16); }
        }
        @keyframes highlightShift {
          0%, 100% { opacity: 0.65; transform: translate(-2px,-2px) scale(1); }
          40%      { opacity: 0.85; transform: translate(0px,-4px) scale(1.08); }
          60%      { opacity: 0.75; transform: translate(-1px,-3px) scale(1.04); }
        }
        @keyframes layer1Drift {
          0%   { transform: translateX(-28%) scaleX(1.55); opacity: 0.7; }
          50%  { transform: translateX(28%)  scaleX(1.55); opacity: 0.9; }
          100% { transform: translateX(-28%) scaleX(1.55); opacity: 0.7; }
        }
        @keyframes layer2Drift {
          0%   { transform: translateX(22%)  scaleX(1.45); opacity: 0.55; }
          50%  { transform: translateX(-22%) scaleX(1.45); opacity: 0.75; }
          100% { transform: translateX(22%)  scaleX(1.45); opacity: 0.55; }
        }
        @keyframes logoBreath {
          0%, 100% { filter: brightness(1.7) drop-shadow(0 0 4px rgba(255,255,255,0.4)); transform: scale(1); }
          40%      { filter: brightness(2.1) drop-shadow(0 0 8px rgba(255,255,255,0.7)); transform: scale(1.06); }
          60%      { filter: brightness(1.9) drop-shadow(0 0 6px rgba(255,255,255,0.55)); transform: scale(1.03); }
        }
      `}</style>

      <div className="nora-chat-avatar" style={{ position: 'relative', width: size, height: size }}>

        {/* Outer ambient ring */}
        <div className="nora-chat-avatar__ambient" style={{
          position: 'absolute',
          inset: -70,
          borderRadius: '50%',
          border: '1px solid rgba(73, 139, 235, 0.22)',
          background: 'rgba(126, 177, 255, 0.07)',
          animation: 'outerRingPulse 3.8s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* Inner glow */}
        <div className="nora-chat-avatar__ring" style={{
          position: 'absolute',
          inset: -38,
          borderRadius: '50%',
          border: '1px solid rgba(73, 139, 235, 0.30)',
          background: 'rgba(126, 177, 255, 0.10)',
          animation: 'glowPulse 3.8s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* Sphere */}
        <div style={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          background: 'linear-gradient(97.07deg, #1877F2 6.35%, #6DA3FF 42.96%, #FFDFEA 94.89%)',
          boxShadow: `
            inset 10px 10px 20px rgba(255,255,255,0.35),
            inset -10px -10px 24px rgba(255,255,255,0.70),
            0 18px 42px rgba(47,128,255,0.22)
          `,
          animation: 'breatheScale 3.8s ease-in-out infinite',
          zIndex: 1,
        }}>

          {/* Logo */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10,
          }}>
            <img
              src={logoSrc}
              alt={logoAlt}
              style={{
                width: logoWidth,
                objectFit: 'contain',
                animation: 'logoBreath 3.8s ease-in-out infinite',
              }}
              draggable={false}
            />
          </div>
        </div>
      </div>
    </>
  )
}
