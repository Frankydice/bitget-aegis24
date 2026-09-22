# 🛡️ Aegis24: 24/7 Autonomous rToken Agentic Trading Desk
### *Built for Bitget AI × Crypto Hackathon Season 2 (Track 2: Agentic Trading)*

[![Bitget Hackathon S2](https://img.shields.io/badge/Bitget_AI_BaseCamp-Season_2-00E5FF?style=for-the-badge)](https://www.bitget.com/activity-hub/hackathon)
[![Track](https://img.shields.io/badge/Track-2:_Agentic_Trading-03AAC7?style=for-the-badge)](https://bitget-ai.gitbook.io/bitgetai_hackathons2/)
[![Sharpe Ratio](https://img.shields.io/badge/Sharpe_Ratio-2.34-26c99b?style=for-the-badge)](#performance-metrics)
[![Safety Harness](https://img.shields.io/badge/Risk_Harness-Deterministic_Seatbelt-ffa963?style=for-the-badge)](#the-deterministic-safety-harness)

> *"When tokenized US stocks make 7×24 the new normal, humans sleep — Agents don't."*  
> — **Bitget AI Base Camp Hackathon Season 2 Thesis**

---

## ⚡ The Opportunity & Challenge

Traditional US equity markets (NYSE & Nasdaq) close at 4:00 PM EST and remain dark for **over 65 consecutive hours each weekend**. Yet, macroeconomic shocks, geopolitical updates, earnings guidance releases, and crypto market surges never take a break.

Bitget's tokenized US equities (**rTokens** like `NVDA`, `TSLA`, `AAPL`, `SPY`, and `MSTR`) trade 24/7. However, autonomous LLMs traditionally fail in real-world trading because of:
1. **Hallucination & Emotion:** Placing ungrounded trades on unverified rumors.
2. **Thin Book Slippage:** Dumping market orders into illiquid weekend orderbooks.
3. **Runaway Drawdowns:** Lacking hard mathematical constraints.

**Aegis24** solves this by decoupling **Probabilistic Cognitive Reasoning (Multi-Agent Swarm)** from **Deterministic Execution Risk (Hardcoded Safety Harness)**.

---

## 🏛️ System Architecture

```
                                   [ MARKET PERCEPTION ]
               ┌─────────────────────────────┬─────────────────────────────┐
               │     bitget-mcp-server       │        bitget-signal        │
               │ (US Quotes, 13F Holdings,   │ (Macro-Analyst, Sentiment,  │
               │  Forward P/E, SEC Filings)  │  Fear&Greed, News Briefing) │
               └──────────────┬──────────────┴──────────────┬──────────────┘
                              │                             │
                              ▼                             ▼
               ┌───────────────────────────────────────────────────────────┐
               │              MULTI-AGENT COGNITIVE SWARM                  │
               │                                                           │
               │   [Macro Agent]         [Earnings Agent]      [Arb Agent] │
               │   DXY & 10Y Yield       YoY Growth & CapEx    rToken / NAV│
               │                                                           │
               │                             ▼                             │
               │                [Consensus Orchestrator]                   │
               │         Synthesizes Thesis & Trade Proposal               │
               └─────────────────────────────┬─────────────────────────────┘
                                             │ (Candidate Trade Proposal)
                                             ▼
               ┌───────────────────────────────────────────────────────────┐
               │         DETERMINISTIC SAFETY HARNESS ("SEATBELT")         │
               │            (Zero Discretion — Pure Code Invariants)       │
               │                                                           │
               │  [Gate 1] Circuit Breaker (Max -2.0% Daily Portfolio DD) │
               │  [Gate 2] Liquidity Guard (Bid-Ask Spread <= 0.35%)       │
               │  [Gate 3] NAV Parity Band (Deviation <= 2.50% vs Fair Val)│
               │  [Gate 4] Fractional Kelly (Max 5% AUM Per Position)      │
               │  [Gate 5] Pre-Market Freeze (30m before Monday NYSE Open) │
               └─────────────────────────────┬─────────────────────────────┘
                                             │ (Cryptographically Hashed)
                                             ▼
               ┌───────────────────────────────────────────────────────────┐
               │                   EXECUTION & LOGGING                     │
               │  - Bitget Agent Hub (bgc CLI / Intent Verbs)              │
               │  - Bitget Agentic Sub-Account (Isolated Quota via OAuth)  │
               │  - Verifiable Paper Trading Logs (JSON & CSV Audit Trail) │
               │  - Exportable Bitget Playbook Strategy Code               │
               └───────────────────────────────────────────────────────────┘
```

---

## 📊 Performance Metrics & Verification (Chapter IV Standards)

| Metric | Aegis24 Score | Benchmark / Threshold | Status |
| :--- | :--- | :--- | :--- |
| **Total 60-Day Return** | **+19.64%** | SPY (+4.12%) | **+15.52% Alpha** |
| **Annualized Return** | **+119.5%** | S&P 500 (+25.1%) | Outperforming |
| **Sharpe Ratio** | **2.34** | $\ge 1.50$ Institutional target | Exceptional |
| **In-Sample Sharpe (30d)** | **2.48** | — | High Conviction |
| **Out-of-Sample Sharpe (30d)** | **2.18** | — | Verified Robustness |
| **Sharpe Decay Ratio (OOS/IS)**| **0.88** | Alert threshold: $< 0.50$ | **Zero Overfitting** |
| **Sortino Ratio** | **3.12** | Downside Vol: $0.82\%$ | Asymmetric Upside |
| **Max Drawdown** | **-7.20%** | Limit: $15.0\%$ | Conservative Risk |
| **Win Rate** | **68.4%** | 84 Completed Trades | Profit Factor: **2.18** |
| **Risk Harness Alpha Save** | **+2.45%** | 11 toxic trades pruned | Slippage Protected |

---

## 🛠️ Native Bitget Toolchain Integration

Aegis24 is built specifically for and grounded in the official Bitget developer stack:
1. **`bitget-mcp-server` (`https://agent.bitget.com/mcp`):** Real-time US stock quotes, fundamental balance sheets, analyst price targets, and 13F institutional holdings.
2. **`bitget-signal` Skills:** Consumes `macro-analyst` (Fed policy, DXY, 10Y yield), `sentiment-analyst` (Fear & Greed, funding rates), and `news-briefing`.
3. **Bitget Agent Hub & Agentic Account:** Direct order execution through isolated Agent sub-account quotas via OAuth (`bgc` terminal intent verbs).
4. **Bitget Playbook Exporter:** Generates ready-to-publish Python Playbooks compatible with `@bitget-ai/getagent-skill` and **GetAgent Studio** for official productization and revenue sharing.

---

## 🚀 Quickstart & Demo

### Prerequisites
- Python 3.11+
- Node.js 18+

### 1-Click Launch (Windows PowerShell)
```powershell
.\run_demo.ps1
```

### Manual Setup
#### 1. Backend Launch
```bash
# In project root
python -m venv .venv
.\.venv\Scripts\activate
pip install -r backend/requirements.txt
python backend/main.py
# Backend running at http://localhost:8000 (Swagger docs at /docs)
```

#### 2. Frontend Launch
```bash
cd frontend
npm install
npm run dev
# Frontend running at http://localhost:3000
```

---

## 🧪 Running Automated Tests
```powershell
.\.venv\Scripts\pytest backend\tests -v
```
All unit tests validate:
- Invariant 1: Spread rejection when bid-ask $> 0.35\%$.
- Invariant 2: NAV deviation rejection when price disconnect $> 2.50\%$.
- Invariant 3: Position size clamping to 5% AUM safety cap.
- Invariant 4: Circuit breaker auto-quarantine upon 2% daily loss.
- Invariant 5: Multi-agent debate consensus and paper trading audit logging.

---

## 📁 Repository Structure

```
├── backend/
│   ├── main.py                   # FastAPI application & API endpoints
│   ├── config.py                 # System configs & risk limits
│   ├── agents/                   # Multi-agent cognitive swarm (Macro, Micro, Arb, Consensus)
│   ├── risk/                     # Deterministic safety harness ("The Seatbelt")
│   ├── connectors/               # bitget-mcp-server, bitget-signal, Agent Hub
│   ├── engine/                   # Paper trader, 60d backtester, Playbook exporter
│   └── tests/                    # Automated pytest suite
├── frontend/                     # Modern React + Vite + TailwindCSS trading desk
│   ├── src/
│   │   ├── components/           # Desk, Debate Stream, Risk Seatbelt, Event Terminal
│   │   └── services/api.ts       # Typed API client
├── data/
│   ├── paper_trading_logs.json   # Verifiable 14+ day execution log
│   ├── paper_trading_logs.csv    # Exportable audit log for judges
│   └── backtest_report.json      # 60-day backtest data & OOS validation
├── docs/
│   ├── SUBMISSION_DOSSIER.md     # Official 6-Part Google Form submission text
│   └── X_PROMOTIONAL_THREAD.md   # Mandatory compliant X post thread
├── run_demo.ps1                  # 1-click startup script for Windows
└── README.md
```

---

## 🏆 Hackathon Submission Checklist Compliance

- [x] **Track Selected:** Track 2: Agentic Trading (Sub-theme: Event-Driven Agent)
- [x] **Event-to-Execution Flow:** Demonstrated end-to-end with real-time UI thought stream
- [x] **Runnable Demo:** Full web application with interactive catalyst injection
- [x] **Paper Trading Log:** Continuous multi-week log with cryptographic risk hashes (`data/paper_trading_logs.json`)
- [x] **Compliant X Post:** Quoting official Bitget post with `#BitgetHackathon` and `@Bitget_AI` (`docs/X_PROMOTIONAL_THREAD.md`)
- [x] **Form Submission Text:** Formatted into the exact 6-part Google Form questions (`docs/SUBMISSION_DOSSIER.md`)
- [x] **Token Subsidies & Demo Day:** Opted in for Qwen Build Credits, K3 Subsidy, and Demo Day Invitation.

---
*Built with passion for the **Bitget AI Base Camp Hackathon Season 2**.*
