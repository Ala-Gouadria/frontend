#!/usr/bin/env bash
# Frontend deploy script — runs on the VPS as the 'dev' user.
# Builds the SPA and (re)starts a Node proxy that serves dist/ and
# forwards /api/* to the backend on localhost:3000. The proxy listens
# on :8080 inside the VPS and is exposed publicly via cloudflared.
set -euo pipefail

FRONTEND_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$FRONTEND_DIR"

echo "[1/4] Pulling latest code..."
git pull --ff-only

echo "[2/4] Installing dependencies..."
npm ci

echo "[3/4] Writing .env (empty API base = same-origin via cloudflared + proxy)..."
# Empty VITE_API_BASE_URL → axios uses relative paths → requests go to
# the same origin (the cloudflared URL), where server.cjs proxies /api/*
# to the backend on localhost:3000.
cat > .env <<'EOF'
VITE_API_BASE_URL=
EOF

echo "[4/4] Building..."
npm run build

echo "(Re)starting nora-frontend PM2 process..."
if pm2 list | grep -q "nora-frontend"; then
  pm2 reload nora-frontend
else
  pm2 start "$FRONTEND_DIR/server.cjs" --name nora-frontend
  pm2 save
fi

echo "Done. Internal:  http://localhost:8080"
echo "Public URL:      check 'pm2 logs nora-tunnel --nostream' for the cloudflared URL"
