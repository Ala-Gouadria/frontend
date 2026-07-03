import './NoraImageLoader.css'
import noraLogo from '../../assets/logo/Nora-img-Logo.svg'

export function NoraImageLoader({ className = '' }) {
  return (
    <div className={`nora-img-loader ${className}`}>
      <div className="nora-img-loader__ring">
        <svg
          className="nora-img-loader__arc"
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="noraArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5b9bf8" stopOpacity="1" />
              <stop offset="55%" stopColor="#9b88e8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#e8c0dc" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <circle
            cx="48"
            cy="48"
            r="43"
            stroke="url(#noraArcGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="168 102"
          />
        </svg>
        <div className="nora-img-loader__circle">
          <img src={noraLogo} alt="" className="nora-img-loader__logo" />
        </div>
      </div>
    </div>
  )
}

export default NoraImageLoader
