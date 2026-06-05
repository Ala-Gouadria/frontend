import './StatusPill.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function StatusPill({ children = 'Active', className = '' }) {
  return <span className={classNames('status-pill', className)}>{children}</span>
}

export default StatusPill
