import './TaskAcceptanceBars.css'

export function TaskAcceptanceBars({ cells = [], className = '' }) {
  return (
    <div className={`task-acceptance-bars ${className}`} aria-hidden="true">
      {cells.map((cell, index) => (
        <span
          key={cell.id}
          className={`task-acceptance-bars__cell task-acceptance-bars__cell--${cell.tone}`}
          style={{ '--cell-index': index }}
          title={cell.label ?? (cell.tone === 'green' ? 'Accepted' : 'Declined')}
        />
      ))}
    </div>
  )
}

export default TaskAcceptanceBars