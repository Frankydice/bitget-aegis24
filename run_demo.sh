#!/usr/bin/env bash
# Aegis24: 1-Click Launch Script for Linux / macOS

echo -e "\033[36m==========================================================\033[0m"
echo -e "\033[36m  AEGIS24 · 24/7 Autonomous rToken Agentic Trading Desk   \033[0m"
echo -e "\033[36m  Bitget AI x Crypto Hackathon Season 2 (Track 2)         \033[0m"
echo -e "\033[36m==========================================================\033[0m"

# 1. Start Backend
echo -e "\n\033[33m[1/3] Starting Aegis24 FastAPI Backend...\033[0m"
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r backend/requirements.txt
else
    source .venv/bin/activate
fi

python3 -m uvicorn backend.main:app --port 8000 --reload &
BACKEND_PID=$!

sleep 2

# 2. Start Frontend
echo -e "\033[33m[2/3] Checking and launching React + Vite Frontend...\033[0m"
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run dev &
FRONTEND_PID=$!

sleep 3

# 3. Open Browser
echo -e "\033[32m[3/3] Opening Institutional Trading Desk at http://localhost:3000\033[0m"
if which xdg-open > /dev/null; then
  xdg-open http://localhost:3000
elif which open > /dev/null; then
  open http://localhost:3000
fi

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
