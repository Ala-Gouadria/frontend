import './MiniBarChart.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function MiniBarChart({
  bars = [22, 66, 34, 80, 26, 54, 72, 38, 58, 46, 24, 28, 64, 18],
  tone = 'ink',
  className = '',
}) {
  return (
    <svg className={classNames('mini-bar-chart', `mini-bar-chart--${tone}`, className)} viewBox="0 0 120 52" aria-hidden="true">
      {bars.map((bar, index) => (
        <rect
          key={`${bar}-${index}`}
          x={index * 8.4}
          y={50 - bar / 1.55}
          width="2.4"
          height={bar / 1.55}
          rx="1.2"
          className="mini-bar-chart__bar"
          style={{ '--bar-index': index }}
        >
          <title>{`Bar ${index + 1}: ${bar}`}</title>
        </rect>
      ))}
    </svg>
  )
}

export default MiniBarChart
