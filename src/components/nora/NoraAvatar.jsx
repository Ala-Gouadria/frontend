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
        /* All keyframes use only transform/opacity — fully GPU-composited, zero CPU rasterisation */
        @keyframes colorDrift {
          0%   { transform: translateX(-30%) scaleX(1.6); opacity: 0.75; }
          50%  { transform: translateX(30%)  scaleX(1.6); opacity: 1;    }
          100% { transform: translateX(-30%) scaleX(1.6); opacity: 0.75; }
        }
        @keyframes colorDriftReverse {
          0%   { transform: translateX(25%)  scaleX(1.5); opacity: 0.6; }
          50%  { transform: translateX(-25%) scaleX(1.5); opacity: 0.9; }
          100% { transform: translateX(25%)  scaleX(1.5); opacity: 0.6; }
        }
        @keyframes spherePulse {
          0%   { opacity: 0.82; }
          50%  { opacity: 1;    }
          100% { opacity: 0.82; }
        }
        .nora-color-1  { animation: colorDrift        4s   ease-in-out infinite; }
        .nora-color-2  { animation: colorDriftReverse  5.5s ease-in-out infinite; }
        .nora-sphere-pulse { animation: spherePulse   5s   ease-in-out infinite; }
      `}</style>

      {/*
        Outer wrapper: owns ONLY the scale transition.
        willChange promotes this to its own GPU layer so the transition
        never needs to touch any child's compositing layer.
      */}
      <div
        onClick={onClick}
        style={{
          position: 'relative',
          width: size,
          height: size,
          transform: active ? 'scale(1.14)' : 'scale(1)',
          transition: 'transform 420ms cubic-bezier(.22,1,.36,1)',
          willChange: 'transform',
          cursor: 'pointer',
        }}
      >
        {/* static ambient glow — never animates */}
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

        {/*
          Active glow ring — always in DOM, transitions opacity only.
          No filter change, no transform change → cheapest possible composite.
        */}
        <div
          style={{
            position: 'absolute',
            inset: '-10px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,150,255,0.55) 0%, transparent 70%)',
            filter: 'blur(10px)',
            pointerEvents: 'none',
            zIndex: 0,
            opacity: active ? 1 : 0,
            transition: 'opacity 420ms cubic-bezier(.22,1,.36,1)',
          }}
        />

        {/*
          Sphere shell — no animation, no transition, no filter.
          Static element = no compositing cost when parent transitions.
        */}
        <div
          className="nora-sphere-pulse"
          style={{
            position: 'relative',
            width: size,
            height: size,
            borderRadius: '50%',
            overflow: 'hidden',
            background: 'linear-gradient(97.07deg, #1877F2 6.35%, #6DA3FF 42.96%, #FFDFEA 94.89%)',
            boxShadow: `
              inset 6px 6px 15px rgba(255,255,255,0.4),
              inset -8px -8px 20px rgba(255,255,255,0.8),
              0 12px 30px rgba(37,99,235,0.15)
            `,
            zIndex: 1,
          }}
        >

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
