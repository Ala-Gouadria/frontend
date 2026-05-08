import { useEffect, useRef } from 'react'
import './StackedBars.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function StackedBars({
  segments = [
    { label: 'Strong Hook', value: 25, tone: 'blue' },
    { label: 'Content', value: 35, tone: 'green' },
    { label: 'Add Resource', value: 40, tone: 'orange' },
  ],
  className = '',
}) {
  const containerRef = useRef(null)
  const refs = useRef([])
  const animated = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true

          // Reset first
          refs.current.forEach(el => {
            if (el) {
              el.style.transition = 'none'
              el.style.width = '0%'
              el.style.opacity = '0'
            }
          })

          // Animate after reset paints
          setTimeout(() => {
            segments.forEach((segment, index) => {
              setTimeout(() => {
                const el = refs.current[index]
                if (el) {
                  el.style.transition = 'width 720ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms ease'
                  el.style.width = `${segment.value}%`
                  el.style.opacity = '1'
                }
              }, index * 80)
            })
          }, 50)

          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [segments])

  return (
    <div ref={containerRef} className={classNames('stacked-bars', className)}>
      {segments.map((segment, index) => (
        <span
          key={`${segment.label}-${index}`}
          ref={el => refs.current[index] = el}
          className={classNames('stacked-bars__segment', `stacked-bars__segment--${segment.tone ?? 'green'}`)}
          style={{ width: '0%', opacity: 0 }}
          title={segment.label}
        />
      ))}
    </div>
  )
}

export default StackedBars