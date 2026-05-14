import './MetricVisualPanel.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function MetricVisualPanel({
  label,
  value,
  valueTone = 'neutral',
  children,
  className = '',
}) {
  return (
    <div className={classNames('metric-visual-panel', className)}>
      <p className="metric-visual-panel__label">{label}</p>
      <strong className={classNames('metric-visual-panel__value', `metric-visual-panel__value--${valueTone}`)}>
        {value}
      </strong>
      <div className="metric-visual-panel__visual">{children}</div>
    </div>
  )
}

export default MetricVisualPanel
