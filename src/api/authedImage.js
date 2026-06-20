import { get } from './client.js'

// Backend image/asset routes (e.g. /api/v1/brand/assets/file/...) require a
// Bearer token, so a plain <img src> can't load them. Fetch the bytes through
// the authenticated axios client and return an object URL the browser can
// render directly. data: URLs and absolute http(s) URLs are returned as-is.
export async function resolveAuthedImageUrl(rawUrl) {
  if (!rawUrl) return ''
  if (rawUrl.startsWith('data:')) return rawUrl
  if (/^https?:\/\//i.test(rawUrl)) return rawUrl
  const res = await get(rawUrl, { responseType: 'blob' })
  const blob = res instanceof Blob ? res : new Blob([res])
  return URL.createObjectURL(blob)
}

// Trigger a browser download for a (possibly object-) URL.
export function downloadUrl(url, filename = 'image.png') {
  if (!url) return
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}
