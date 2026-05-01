export function getPercent(value, fallback = 0) {
  const percent = Number.parseFloat(String(value).replace('%', ''))

  return Number.isFinite(percent) ? percent : fallback
}
