import './WebsiteStagePath.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function WebsiteStagePath({ stages = ['Visit', 'Engage', 'Convert'], className = '' }) {
  return (
    <div className={classNames('website-stage-path', className)}>
      {stages.map((stage, index) => (
        <div key={stage} className="website-stage-path__step">
          <span className={classNames('website-stage-path__pill', index === stages.length - 1 && 'website-stage-path__pill--final')}>
            {index === stages.length - 1 ? <span className="website-stage-path__icon">◇</span> : null}
            {stage}
          </span>
          {index < stages.length - 1 ? <span className="website-stage-path__arrow">&gt;</span> : null}
        </div>
      ))}
    </div>
  )
}

export default WebsiteStagePath
