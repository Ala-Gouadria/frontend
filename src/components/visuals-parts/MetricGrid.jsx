import './MetricGrid.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function MetricItem({ label, value, children, className = '' }) {
  return (
    <div className={classNames('metric-item', className)}>
      <span className="metric-item__label">{label}</span>
      <strong className="metric-item__value">{value}</strong>
      {children ? <div className="metric-item__visual">{children}</div> : null}
    </div>
  )
}

export function MetricGrid({ children, columns = 5, className = '' }) {
  return (
    <div className={classNames('metric-grid', className)} style={{ '--metric-grid-columns': columns }}>
      {children}
    </div>
  )
}

export default MetricGrid
