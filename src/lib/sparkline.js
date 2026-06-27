/**
 * Convert a numeric time-series into a MiniLineChart `points` string
 * ("x,y x,y …") over the chart's 172×58 viewBox. Higher values map to a
 * smaller y (toward the top), matching the chart's coordinate system.
 *
 * Returns null when there aren't enough finite points to draw a meaningful
 * line, so callers can fall back to their static/mock decoration.
 */
export function seriesToPoints(values, { width = 172, top = 6, bottom = 52, minPoints = 3 } = {}) {
  const vals = (values ?? []).map(Number).filter(Number.isFinite)
  if (vals.length < minPoints) return null

  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = max - min || 1
  const n = vals.length

  return vals
    .map((v, i) => {
      const x = Math.round((i / (n - 1)) * width)
      const y = Math.round(bottom - ((v - min) / range) * (bottom - top))
      return `${x},${y}`
    })
    .join(' ')
}
