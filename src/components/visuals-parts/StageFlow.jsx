import alertDiamondIconUrl from '../../assets/icons/Sales-component-icon/alert-diamond-icon.svg'
import arrowIconUrl from '../../assets/icons/Sales-component-icon/spear-cion.svg'
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
          <span
            className={classNames('stage-flow__pill', index === activeIndex && 'stage-flow__pill--active')}
            title={`${stage}${index === activeIndex ? ' active' : ''}`}
          >
            {index === activeIndex ? (
              <img
                src={alertDiamondIconUrl}
                alt=""
                aria-hidden="true"
                className="stage-flow__status-icon"
              />
            ) : null}
            <span className="stage-flow__pill-label">{stage}</span>
          </span>
          {index < stages.length - 1 ? (
            <img src={arrowIconUrl} alt="" aria-hidden="true" className="stage-flow__arrow" />
          ) : null}
        </div>
      ))}
    </div>
  )
}

export default StageFlow
