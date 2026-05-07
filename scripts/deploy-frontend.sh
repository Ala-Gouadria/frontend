#!/usr/bin/env bash
# Frontend deploy script — runs on the VPS as the 'dev' user
# Usage: bash scripts/deploy-frontend.sh
set -euo pipefail

FRONTEND_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$FRONTEND_DIR"

echo "[1/4] Pulling latest code..."
git pull --ff-only origin dev

echo "[2/4] Installing dependencies..."
npm ci

echo "[3/4] Writing .env..."
if [ ! -f .env ]; then
  cp .env.example .env
fi
# Always set the prod API URL (idempotent)
sed -i 's|VITE_API_BASE_URL=.*|VITE_API_BASE_URL=http://85.137.249.238:3000|' .env

echo "[4/4] Building..."
npm run build

echo "Build complete. Reloading PM2..."
if pm2 list | grep -q "nora-frontend"; then
  pm2 reload nora-frontend
else
  echo "Starting PM2 process for the first time..."
  echo "Run: pm2 start serve -- -s dist -l 8080 --name nora-frontend --no-clipboard"
  echo "Then: pm2 save"
fi

echo "Done. Frontend available at http://85.137.249.238:8080"
