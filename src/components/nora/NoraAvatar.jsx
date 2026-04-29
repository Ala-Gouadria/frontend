import noraLogo from '../../assets/logo/Nora-AI-logo.png'

export default function NoraAvatar({
  active = false,
  onClick,
  size = 140,
  logoWidth = 70,
  logoSrc = noraLogo,
  logoAlt = 'Nora AI',
}) {
  return (
    <>
      <style>{`
        @keyframes colorDrift {
          0%   { transform: translateX(-30%) scaleX(1.6); opacity: 0.75; }
          50%  { transform: translateX(30%) scaleX(1.6); opacity: 1; }
          100% { transform: translateX(-30%) scaleX(1.6); opacity: 0.75; }
        }

        @keyframes colorDriftReverse {
          0%   { transform: translateX(25%) scaleX(1.5); opacity: 0.6; }
          50%  { transform: translateX(-25%) scaleX(1.5); opacity: 0.9; }
          100% { transform: translateX(25%) scaleX(1.5); opacity: 0.6; }
        }

        @keyframes hueIdle {
          0%   { filter: hue-rotate(0deg) saturate(1); }
          33%  { filter: hue-rotate(20deg) saturate(1.2); }
          66%  { filter: hue-rotate(-15deg) saturate(1.1); }
          100% { filter: hue-rotate(0deg) saturate(1); }
        }

        @keyframes heartbeat {
          0%   { transform: scale(1); filter: brightness(1); }
          15%  { transform: scale(1.18); filter: brightness(1.6); }
          30%  { transform: scale(1.08); filter: brightness(1.2); }
          45%  { transform: scale(1.22); filter: brightness(1.8); }
          65%  { transform: scale(1.05); filter: brightness(1.3); }
          80%  { transform: scale(1.12); filter: brightness(1.5); }
          100% { transform: scale(1); filter: brightness(1); }
        }

        @keyframes glowBurst {
          0%   { opacity: 0.15; transform: scale(1); }
          40%  { opacity: 0.6; transform: scale(1.5); }
          100% { opacity: 0; transform: scale(2.2); }
        }

        .nora-sphere-idle { animation: hueIdle 6s ease-in-out infinite; cursor: pointer; }
        .nora-sphere-active { animation: heartbeat 0.9s ease-in-out forwards; cursor: pointer; }
        .color-layer-1 { animation: colorDrift 4s ease-in-out infinite; }
        .color-layer-2 { animation: colorDriftReverse 5.5s ease-in-out infinite; }
        .glow-burst-ring { animation: glowBurst 0.9s ease-out forwards; }
      `}</style>

      <div
        style={{ position: 'relative', width: size, height: size }}
        onClick={onClick}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-20px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />

        {active && (
          <div
            className="glow-burst-ring"
            style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,150,255,0.55) 0%, transparent 70%)',
              filter: 'blur(10px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}

        <div
          className={active ? 'nora-sphere-active' : 'nora-sphere-idle'}
          style={{
            position: 'relative',
            width: size,
            height: size,
            borderRadius: '50%',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 35%, #C4B5FD 75%, #FFFFFF 100%)',
            boxShadow: `
              inset 6px 6px 15px rgba(255,255,255,0.4),
              inset -8px -8px 20px rgba(255,255,255,0.8),
              0 12px 30px rgba(37,99,235,0.15)
            `,
            zIndex: 1,
          }}
        >
          <div
            className="color-layer-1"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.55) 0%, rgba(59,130,246,0.3) 45%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          <div
            className="color-layer-2"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(196,181,253,0.65) 0%, rgba(167,139,250,0.35) 40%, transparent 65%)',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: '8%',
              left: '12%',
              width: '35%',
              height: '30%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 80%)',
              filter: 'blur(6px)',
              transform: 'rotate(-20deg)',
              zIndex: 4,
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 30% 50%, rgba(37,99,235,0.4) 0%, transparent 60%)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <img
              src={logoSrc}
              alt={logoAlt}
              style={{
                width: logoWidth,
                objectFit: 'contain',
                filter: 'brightness(1.8) drop-shadow(0 0 3px rgba(255,255,255,0.5))',
              }}
              draggable={false}
            />
          </div>
        </div>
      </div>
    </>
  )
}
