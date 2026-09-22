# Aegis24: Technical Architecture & Design Document

## 1. System Overview
Aegis24 is an autonomous multi-agent quantitative trading system designed for the Bitget AI Base Camp Hackathon Season 2 (Track 2: Agentic Trading). It operates across 24/7 continuous crypto markets to price information shocks in tokenized US equities (rTokens).

---

## 2. Decoupled Cognitive Architecture
Conventional trading bots conflate analysis with execution. Aegis24 enforces a strict architectural boundary:

```
[ Unstructured World ]
        │
        ▼
[ Perception Layer ] ─────────► [ Multi-Agent Cognitive Swarm ]
(Bitget MCP & Signal)                     │
                                          ▼ (Trade Proposal)
                              [ Deterministic Risk Harness ]
                              (Zero Discretion - Hard Invariants)
                                          │
                                          ▼ (Approved Order)
                              [ Execution & Audit Engine ]
                              (Bitget Agentic Sub-Account)
```

### 2.1 Perception Layer
- **`bitget-mcp-server` (`https://agent.bitget.com/mcp`):** Real-time US equity prices, orderbook depth, balance sheets, forward valuation ratios (P/E, EV/EBITDA), analyst consensus, and 13F institutional ownership.
- **`bitget-signal` Skills:**
  - `macro-analyst`: Fed funds trajectory, DXY trends, 10Y Treasury yield, and cross-asset beta.
  - `sentiment-analyst`: Fear & Greed index, retail positioning, weighted funding rates.
  - `news-briefing`: Breaking overnight and weekend news aggregation.
  - `technical-analysis`: Multi-timeframe trend and momentum indicators.

### 2.2 Multi-Agent Consensus Swarm
1. **MacroAnalystAgent:** Models monetary transmission channels and global liquidity tides.
2. **MicroEarningsAnalystAgent:** Analyzes company-specific filings, CapEx commitments, and analyst revisions.
3. **MicrostructureArbAgent:** Analyzes the rToken spread vs synthetic NAV and assesses orderbook depth.
4. **ConsensusOrchestrator:** Moderates a structured debate to calculate an aggregate consensus score:
   $$\text{Score}_{\text{consensus}} = w_{\text{macro}} C_{\text{macro}} + w_{\text{micro}} C_{\text{micro}} + w_{\text{arb}} C_{\text{arb}} + \Delta_{\text{TA}}$$
   Only proposals meeting $\text{Score} \ge 0.65$ generate a formal candidate trade.

### 2.3 Deterministic Risk Harness ("The Seatbelt")
The non-bypassable pre-trade gatekeeper enforcing 5 quantitative invariants:
1. **Liquidity & Spread Invariant:**
   $$\text{Spread} = \frac{\text{Ask} - \text{Bid}}{\text{Mid}} \le 0.35\%$$
   Protects against thin weekend orderbook traps.
2. **Synthetic NAV Parity Invariant:**
   $$\left|\frac{\text{Price} - \text{NAV}_{\text{synthetic}}}{\text{NAV}_{\text{synthetic}}}\right| \le 2.50\%$$
   Rejects pricing anomalies and stale feeds.
3. **Fractional Kelly Capital Allocation:**
   $$\text{Allocation} \le \min\left(S_{\text{suggested}}, 5\% \times \text{AUM}\right)$$
   Caps individual position exposure to prevent ruin.
4. **Intraday Drawdown Circuit Breaker:**
   $$\text{Drawdown}_{\text{daily}} = \frac{\text{Equity}_{\text{start}} - \text{Equity}_{\text{current}}}{\text{Equity}_{\text{start}}} < 2.0\%$$
   Immediately freezes trading upon breach.
5. **Pre-Market Opening Bell Freeze:**
   Halts new position initiation within 30 minutes of the Monday 9:30 AM EST NYSE opening bell to avoid opening volatility crush.

---

## 3. Cryptographic Auditability
Each risk check evaluation produces an immutable SHA-256 hash:
$$\text{Hash} = \text{SHA256}(\text{EvaluationID} \,\|\, \text{ProposalID} \,\|\, \text{Approved} \,\|\, \text{Size} \,\|\, \text{Timestamp})$$
This ensures complete non-repudiation and transparency during judge review.
