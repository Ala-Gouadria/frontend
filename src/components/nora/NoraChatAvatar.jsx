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

      <div style={{ position: 'relative', width: size, height: size }}>

        {/* Outer ambient ring */}
        <div style={{
          position: 'absolute',
          inset: -28,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 68%)',
          animation: 'outerRingPulse 3.8s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* Inner glow */}
        <div style={{
          position: 'absolute',
          inset: -14,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,130,255,0.28) 0%, transparent 65%)',
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
          background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 35%, #C4B5FD 75%, #FFFFFF 100%)',
          boxShadow: `
            inset 6px 6px 15px rgba(255,255,255,0.4),
            inset -8px -8px 20px rgba(255,255,255,0.8),
            0 12px 32px rgba(37,99,235,0.2)
          `,
          animation: 'breatheScale 3.8s ease-in-out infinite',
          zIndex: 1,
        }}>
          {/* Color layer 1 */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.55) 0%, rgba(59,130,246,0.3) 45%, transparent 70%)',
            animation: 'layer1Drift 4.8s ease-in-out infinite',
            pointerEvents: 'none', zIndex: 2,
          }} />

          {/* Color layer 2 */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(196,181,253,0.65) 0%, rgba(167,139,250,0.35) 40%, transparent 65%)',
            animation: 'layer2Drift 6.2s ease-in-out infinite',
            pointerEvents: 'none', zIndex: 3,
          }} />

          {/* Specular highlight */}
          <div style={{
            position: 'absolute', top: '8%', left: '12%',
            width: '35%', height: '30%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.72) 0%, transparent 80%)',
            filter: 'blur(5px)',
            animation: 'highlightShift 3.8s ease-in-out infinite',
            zIndex: 4, pointerEvents: 'none',
          }} />

          {/* Depth shadow */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 30% 50%, rgba(37,99,235,0.4) 0%, transparent 60%)',
            pointerEvents: 'none', zIndex: 2,
          }} />

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
