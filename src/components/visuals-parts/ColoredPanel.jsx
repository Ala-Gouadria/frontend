import './ColoredPanel.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function ColoredPanel({
  title,
  tone = 'orange',
  className = '',
  bodyClassName = '',
  children,
}) {
  return (
    <section className={classNames('colored-panel', `colored-panel--${tone}`, className)}>
      {title ? <div className="colored-panel__title">{title}</div> : null}
      <div className={classNames('colored-panel__body', bodyClassName)}>
        {children}
      </div>
    </section>
  )
}

export default ColoredPanel
