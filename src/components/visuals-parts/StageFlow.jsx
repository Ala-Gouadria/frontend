import './StageFlow.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function StageFlow({
  stages = ['Leads', 'Qualified', 'Proposal', 'Closed'],
  activeIndex = 2,
  className = '',
}) {
  return (
    <div className={classNames('stage-flow', className)}>
      {stages.map((stage, index) => (
        <div key={stage} className="stage-flow__step">
          <span className={classNames('stage-flow__pill', index === activeIndex && 'stage-flow__pill--active')} title={`${stage}${index === activeIndex ? ' active' : ''}`}>
            {index === activeIndex ? (
              <span className="stage-flow__status-icon" aria-hidden="true">
                <span>!</span>
              </span>
            ) : null}
            {stage}
          </span>
          {index < stages.length - 1 ? <span className="stage-flow__arrow">&gt;</span> : null}
        </div>
      ))}
    </div>
  )
}

export default StageFlow
