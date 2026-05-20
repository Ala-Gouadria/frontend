import logoMark from '../../assets/logo/Nora_Componennts_Logo.png'
import './AiInsight.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function AiInsight({ children, title = 'AI Insight', className = '' }) {
  return (
    <div className={classNames('ai-insight', className)}>
      <div className="ai-insight__head">
        <img src={logoMark} alt="" aria-hidden="true" className="ai-insight__logo" />
        <span>{title}</span>
      </div>
      <p>{children}</p>
    </div>
  )
}

export function AiActionButton({ children = 'Ask or assign Anything', className = '' }) {
  return (
    <button type="button" className={classNames('ai-action-button', className)}>
      {children}
    </button>
  )
}

export default AiInsight
