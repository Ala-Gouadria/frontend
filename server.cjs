// Production server: serves the built SPA from dist/ and reverse-proxies
// /api/* and /health* to the backend on the same VPS. Single origin →
// no CORS preflights, no token leak across hosts, one public URL.
//
// Run on the VPS via PM2; expose to the internet via cloudflared.

const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = Number(process.env.PORT || 8080)
const BACKEND = process.env.BACKEND_URL || 'http://localhost:3000'
const DIST = path.join(__dirname, 'dist')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
}

const backendUrl = new URL(BACKEND)

function proxyToBackend(req, res) {
  const opts = {
    hostname: backendUrl.hostname,
    port: backendUrl.port || 80,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `${backendUrl.hostname}:${backendUrl.port || 80}` },
  }
  const proxyReq = http.request(opts, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
    proxyRes.pipe(res)
  })
  proxyReq.on('error', (err) => {
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ success: false, error: { code: 'PROXY_ERROR', message: err.message } }))
    } else {
      res.destroy()
    }
  })
  req.pipe(proxyReq)
}

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase()
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html' ? 'no-store' : 'public, max-age=31536000, immutable',
  })
  fs.createReadStream(filePath).pipe(res)
}

const server = http.createServer((req, res) => {
  // Reverse-proxy API + health
  if (req.url.startsWith('/api/') || req.url.startsWith('/health')) {
    return proxyToBackend(req, res)
  }

  // Static assets — block path traversal
  const requestPath = decodeURIComponent(req.url.split('?')[0])
  let filePath = path.normalize(path.join(DIST, requestPath === '/' ? '/index.html' : requestPath))
  if (!filePath.startsWith(DIST)) filePath = path.join(DIST, 'index.html')

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      return serveFile(filePath, res)
    }
    // SPA fallback — every unknown route gets index.html
    serveFile(path.join(DIST, 'index.html'), res)
  })
})

server.listen(PORT, () => {
  console.log(`[nora-frontend] serving ${DIST} on :${PORT}, proxying /api → ${BACKEND}`)
})
