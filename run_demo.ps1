# Aegis24: 1-Click Launch Script for Windows PowerShell
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  AEGIS24 · 24/7 Autonomous rToken Agentic Trading Desk   " -ForegroundColor Cyan
Write-Host "  Bitget AI x Crypto Hackathon Season 2 (Track 2)         " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$ROOT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start Backend in separate process
Write-Host "`n[1/3] Starting Aegis24 FastAPI Backend..." -ForegroundColor Yellow
$backendJob = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$ROOT_DIR'; .\.venv\Scripts\python.exe -m uvicorn backend.main:app --port 8000 --reload" -PassThru

Start-Sleep -Seconds 2

# 2. Check Frontend Dependencies & Launch
Write-Host "[2/3] Checking and launching React + Vite Frontend..." -ForegroundColor Yellow
$frontendDir = Join-Path $ROOT_DIR "frontend"
if (-not (Test-Path (Join-Path $frontendDir "node_modules"))) {
    Write-Host "Installing frontend node_modules (first run)..." -ForegroundColor Gray
    Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm install; npm run dev" -PassThru
} else {
    Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm run dev" -PassThru
}

Start-Sleep -Seconds 3

# 3. Open Browser
Write-Host "[3/3] Opening Institutional Trading Desk..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host "`nSystem Online! Press Ctrl+C in terminal windows to stop." -ForegroundColor Cyan
