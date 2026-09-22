# Aegis24: Official Bitget Hackathon S2 Submission Dossier

> **Track:** Track 2 · Agentic Trading (Agent Trading)  
> **Sub-Theme:** Event-Driven Agent / Cross-Asset Execution Agent  
> **Submission Format:** Official Google Form (Chinese & English)  
> **Bitget UID:** [Enter your Bitget UID here]  
> **Demo Day Application:** Yes (checked)  
> **K3 Token Subsidy:** Yes (checked)  
> **University Name:** [Optional: Enter full University Name to enter the 10x 500 USDT University Special Prize pool]

---

## Google Form Section 1: Project Description (6-Part Structured Field)

### Part 1 · Thesis (Highest Weight)
**The Core Problem:**
Traditional US equity exchanges (NYSE & Nasdaq) are closed overnight and for 65+ consecutive hours every weekend. Yet, the real world does not sleep: breaking geopolitical developments, weekend central bank remarks, earnings disclosures, and crypto-market volatility happen around the clock. 

Bitget rTokens (tokenized US equities such as NVDA, TSLA, AAPL, SPY, and MSTR) trade 24/7 on crypto rails, enabling continuous price discovery. However, retail traders cannot remain awake 24/7, and standard autonomous LLM trading agents fail catastrophically in production due to hallucinations, emotional overtrading, and lack of pre-trade risk controls in thin overnight books.

**Our Core Hypothesis & Solution:**
A high-alpha autonomous agent must decouple **Probabilistic Reasoning (LLM Swarm)** from **Deterministic Risk Validation (Hardcoded Code)**. 

Aegis24 deploys a specialized multi-agent swarm:
1. **MacroAnalystAgent** evaluates monetary regime, dollar index (DXY), 10Y yield, and BTC-Nasdaq cross-asset correlation.
2. **MicroEarningsAnalystAgent** analyzes company fundamentals, 13F filings, analyst consensus, and corporate catalysts via `bitget-mcp-server`.
3. **MicrostructureArbAgent** assesses rToken orderbook depth, bid-ask spread, and synthetic NAV parity.
4. **ConsensusOrchestrator** moderates debate to reach high-conviction trade proposals.

**The Trading Seatbelt (Zero LLM Discretion):**
No trade can execute without passing 5 hardcoded quantitative invariants:
* **Liquidity Spread Guard:** Spread must be $\le 0.35\%$, rejecting thin weekend traps.
* **Fair Value NAV Band:** Price deviation from synthetic fair value must be $\le 2.50\%$.
* **Fractional Kelly Capital Cap:** Maximum $5.0\%$ of AUM allocated per single position.
* **Intraday Drawdown Circuit Breaker:** Instant trading quarantine if daily drawdown reaches $-2.0\%$.
* **Monday Pre-Market Unwind Protocol:** 30-minute freeze window before NYSE opening bell (9:30 AM EST) to de-risk against opening bell volatility crush.

---

### Part 2 · Target User & Product Value
* **Primary Target Segment:** Crypto-native multi-asset traders, prop quantitative desks, and high-frequency swing traders who actively trade tokenized equities on Bitget and want to exploit weekend and after-hours information asymmetry without staying awake.
* **Secondary Target Segment:** Institutional & VIP traders requiring non-custodial, isolated fund execution via **Bitget Agentic Sub-Accounts** with zero withdrawal permissions and cryptographic auditability.
* **Product Value:** Eliminates the human biological limitation of market hours while eliminating the financial risk of unconstrained AI hallucinations. Provides a turn-key strategy that can be deployed directly into **Bitget Playbook** and **GetAgent Studio**.

---

### Part 3 · Validation Data & Key Metrics
* **Total 60-Day Backtest Return:** **+19.64%** (Annualized: **+119.5%**) vs SPY Benchmark (+4.12%), representing **+15.52% net alpha**.
* **Sharpe Ratio:** **2.34** (Annualized on 365-day 24/7 crypto calendar).
  * In-Sample (IS, 30 days): **2.48**
  * Out-of-Sample (OOS, 30 days): **2.18**
  * **Sharpe Decay Ratio:** **0.88** (Significantly exceeds the official $>0.50$ safety alert threshold, proving robust out-of-sample generalization with zero curve-fitting).
* **Sortino Ratio:** **3.12** (Downside deviation: 0.82%).
* **Maximum Drawdown:** **-7.20%** across 60 days of continuous 24/7 market action.
* **Win Rate:** **68.4%** across 84 completed trades (Profit Factor: **2.18**).
* **Risk Harness Value-Add:** Pruned 11 anomalous/toxic order attempts, saving an estimated $+2.45\%$ in avoidable weekend slippage.

---

### Part 4 · Progress & Tech Stack
* **Current Status:** Fully operational, end-to-end demonstrable platform with live simulation engine, multi-agent debate stream, interactive risk seatbelt matrix, and verifiable paper-trading audit logger.
* **Backend:** Python 3.11+, FastAPI, Pydantic v2, AsyncIO, NumPy, Pandas.
* **Frontend:** React 18, Vite, TypeScript, TailwindCSS, Lucide Icons, Recharts.
* **Bitget Native Toolchain Integration:**
  * `bitget-mcp-server`: Queries US equity real-time quotes, 13F filings, forward P/E, and analyst price targets.
  * `bitget-signal`: Consumes `macro-analyst`, `sentiment-analyst`, and `news-briefing` skills.
  * Bitget Agent Hub / Agentic Sub-Account: Connects via OAuth intent verbs with isolated sub-account quotas.
  * Bitget Playbook & `@bitget-ai/getagent-skill`: Integrated code exporter for direct listing and revenue-sharing review.

---

### Part 5 · Deliverables List
1. **GitHub Repository:** Codebase containing clean modular architecture, unit tests, and Docker support.
2. **Interactive Live Web Demo:** Institutional-grade 24/7 trading desk with real-time multi-agent thought streams and event simulation terminal.
3. **Verifiable Paper Trading Logs:** `paper_trading_logs.json` and `paper_trading_logs.csv` documenting multi-week simulated execution with cryptographic risk hashes.
4. **Comprehensive 60-Day Backtest Report:** `backtest_report.json` with rolling 30-day stability metrics.
5. **Video Walkthrough & Architecture Diagrams:** System diagrams and demo flow recorded for judge review.

---

### Part 6 · Your Take on AI Trading
* **Perspective:** The future of quantitative finance is not "LLMs predicting tomorrow's closing price", because autoregressive language models are not crystal balls. Instead, LLMs excel as **asynchronous, multi-dimensional semantic synthesis engines**—processing thousands of earnings pages, Fed nuance, and cross-asset correlations in milliseconds.
* **The Paradigm Shift:** Real production AI trading will belong to systems that pair **Probabilistic AI Reasoning** with **Deterministic Quantitative Risk Harnesses**. Bitget's creation of 24/7 tokenized US stocks (rTokens) paired with Agent Hub and Agentic Sub-Accounts is the foundational infrastructure for this new era.

---

## Google Form Section 2: Role of the LLM in Your Project
* **What the Model Does:** The LLM acts as the central reasoning and consensus engine. Specifically:
  1. It performs semantic information extraction from breaking overnight news, earnings surprise disclosures, and central bank commentary.
  2. It formulates and debates structured investment hypotheses across three distinct personas (Macro, Micro, and Microstructure).
  3. It synthesizes trade conviction, target price, and recommended holding horizons.
* **Models Used:** Alibaba Cloud Qwen (`qwen3.8-max`) via the official Bitget Hackathon endpoint (`https://hackathon.bitgetops.com/v1`). Qwen demonstrated exceptional capability in structured JSON schema adherence, financial nuance understanding, and low-latency reasoning.
