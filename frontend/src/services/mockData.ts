import {
  SystemStatus,
  MarketData,
  DebateRecord,
  RiskEvaluation,
  Position,
  PaperLogEntry,
  BacktestReport
} from './api';

export const fallbackStatus: SystemStatus = {
  status: "ONLINE",
  app_name: "Aegis24 - Autonomous rToken Trading Desk",
  version: "2.0.0",
  account: {
    account_uid: "BG-SUB-94029-ISOLATED",
    account_type: "ISOLATED_PAPER_EQUITY",
    trading_mode: "PAPER_TRADING_DETERMINISTIC",
    cash_balance_usdt: 78500.0,
    open_positions_value_usdt: 21500.0,
    unrealized_pnl_usdt: 1245.8,
    total_equity_usdt: 101245.8,
    isolated_quota_limit_usdt: 100000.0,
    withdrawal_disabled: true,
    api_tier: "VIP1_SUBACCOUNT"
  },
  circuit_breaker: {
    tripped: false,
    current_drawdown_pct: 0.12,
    max_limit_pct: 2.0,
    day_start_equity: 101124.0,
    current_equity: 101245.8,
    trip_reason: null,
    status: "NORMAL"
  },
  server_time_utc: new Date().toUTCString()
};

export const fallbackMarket: MarketData = {
  rtokens: {
    "NVDAUSDT": {
      price: 128.45,
      bid: 128.38,
      ask: 128.52,
      synthetic_nav: 128.40,
      change_24h: 3.42,
      volume_24h: 482910
    },
    "TSLAUSDT": {
      price: 242.10,
      bid: 241.95,
      ask: 242.25,
      synthetic_nav: 242.05,
      change_24h: 5.18,
      volume_24h: 341200
    },
    "AAPLUSDT": {
      price: 228.60,
      bid: 228.52,
      ask: 228.68,
      synthetic_nav: 228.55,
      change_24h: 1.15,
      volume_24h: 219400
    },
    "COINUSDT": {
      price: 312.40,
      bid: 312.10,
      ask: 312.70,
      synthetic_nav: 312.25,
      change_24h: 6.84,
      volume_24h: 589100
    },
    "MSTRUSDT": {
      price: 345.80,
      bid: 345.20,
      ask: 346.40,
      synthetic_nav: 345.50,
      change_24h: 8.92,
      volume_24h: 672300
    },
    "SPYUSDT": {
      price: 588.20,
      bid: 588.10,
      ask: 588.30,
      synthetic_nav: 588.15,
      change_24h: 0.85,
      volume_24h: 1204500
    }
  },
  macro_signal: {
    fed_rate_posture: "DOVISH (50bps cut cycle confirmed)",
    dxy_index: 101.4,
    dxy_trend: "BEARISH_CORRECTION",
    us10y_yield: 3.74,
    btc_nasdaq_90d_corr: 0.72,
    macro_regime: "LIQUIDITY_EXPANSION"
  },
  sentiment_signal: {
    fear_and_greed_index: 74,
    sentiment_label: "GREED",
    long_short_ratio: 1.84,
    weighted_funding_rate_pct: 0.0125,
    actionable_bias: "AGGRESSIVE_BULLISH"
  }
};

export const fallbackDebates: DebateRecord[] = [
  {
    proposal: {
      proposal_id: "prop_99f2c81a",
      symbol: "NVDAUSDT",
      side: "BUY",
      confidence: 0.92,
      thesis: "Hyperscalers joint $80B AI CapEx expansion creates asymmetric upside in rNVDA weekend liquidity.",
      suggested_size_usdt: 3500.0,
      target_price: 134.20,
      expected_hold_hours: 18.0,
      source_agent: "ConsensusOrchestrator"
    },
    agent_thoughts: [
      {
        agent_name: "MacroRegimeAgent",
        role: "Global Macro & Liquidity Specialist",
        observation: "DXY slipped to 101.4; Fed 50bps rate cut trajectory is fueling risk-on flows across technology equities.",
        analysis: "Tech beta sensitivity is high (1.42). Overnight tokenized liquidity is absorbing macro demand without yield curve inversion resistance.",
        verdict: "STRONG_BUY",
        confidence: 0.89,
        key_metrics: { dxy: 101.4, fed_posture: "DOVISH", us10y: 3.74 }
      },
      {
        agent_name: "EarningsCatalystAgent",
        role: "Event-Driven & Breaking Shocks Analyst",
        observation: "Consortium announcement confirms accelerated delivery schedules for Nvidia Blackwell Ultra architectures.",
        analysis: "Fundamental supply constraints protect forward margins. Weekend headline velocity is accelerating across Bloomberg and Reuters.",
        verdict: "STRONG_BUY",
        confidence: 0.94,
        key_metrics: { headline_momentum: "+4.5%", forward_pe: 28.4 }
      },
      {
        agent_name: "ArbitrageSyntheticAgent",
        role: "Cross-Market NAV & Microstructure Arbitrageur",
        observation: "Bitget rNVDA bid-ask spread is tight at 0.11% ($0.14). NAV premium is currently +0.04%.",
        analysis: "No structural basis dislocation. Orderbook depth at top 3 levels exceeds $45,000 USDT. Minimal slippage estimated at <0.06%.",
        verdict: "BUY",
        confidence: 0.91,
        key_metrics: { spread_pct: 0.11, nav_deviation_pct: 0.04, book_depth_usdt: 48200 }
      },
      {
        agent_name: "ConsensusOrchestrator",
        role: "Swarm Coordinator & Risk-Weighted Synthesizer",
        observation: "Unanimous bullish alignment across Macro (0.89), Earnings (0.94), and Arbitrage (0.91) sub-agents.",
        analysis: "Synthesized multi-agent conviction exceeds 0.90 threshold. Forwarding candidate proposal to Deterministic Safety Harness.",
        verdict: "PROPOSAL_DISPATCHED",
        confidence: 0.92,
        key_metrics: { swarm_consensus: "UNANIMOUS_BUY", target_usdt: 3500.0 }
      }
    ],
    debate_summary: "Multi-agent consensus generated unanimous BUY proposal for NVDAUSDT based on macro easing and $80B CapEx catalyst. All 5 safety checks verified.",
    timestamp: Date.now() - 120000
  },
  {
    proposal: {
      proposal_id: "prop_74a1d99e",
      symbol: "TSLAUSDT",
      side: "BUY",
      confidence: 0.86,
      thesis: "Regulatory approval for commercial FSD CyberCab deployment activates high-momentum breakout regime.",
      suggested_size_usdt: 3000.0,
      target_price: 254.70,
      expected_hold_hours: 24.0,
      source_agent: "ConsensusOrchestrator"
    },
    agent_thoughts: [
      {
        agent_name: "MacroRegimeAgent",
        role: "Global Macro & Liquidity Specialist",
        observation: "Broad market risk appetite elevated with Fear & Greed index at 74.",
        analysis: "Growth equities outperforming defensive sectors in off-hours synthetic trading.",
        verdict: "BUY",
        confidence: 0.82,
        key_metrics: { market_beta: 1.65, regime: "EXPANSION" }
      },
      {
        agent_name: "EarningsCatalystAgent",
        role: "Event-Driven & Breaking Shocks Analyst",
        observation: "NHTSA multi-state commercial clearance unlocks subscription ARR projections for autonomous mobility.",
        analysis: "Option skew indicates heavy call buying in synthetic derivatives.",
        verdict: "STRONG_BUY",
        confidence: 0.91,
        key_metrics: { catalyst: "FSD_APPROVAL", momentum_score: 9.2 }
      },
      {
        agent_name: "ArbitrageSyntheticAgent",
        role: "Cross-Market NAV & Microstructure Arbitrageur",
        observation: "rTSLA spread is 0.12%, NAV difference +0.02%. Orderbook depth healthy.",
        analysis: "Liquidity allows clean fill at 242.10 USDT.",
        verdict: "BUY",
        confidence: 0.85,
        key_metrics: { spread_pct: 0.12, nav_deviation_pct: 0.02 }
      }
    ],
    debate_summary: "Strong bullish alignment across swarm agents for TSLAUSDT following autonomous regulatory clearance.",
    timestamp: Date.now() - 360000
  }
];

export const fallbackEvaluations: RiskEvaluation[] = [
  {
    evaluation_id: "eval_62b1a89c",
    proposal_id: "prop_99f2c81a",
    symbol: "NVDAUSDT",
    approved: true,
    checks: [
      {
        name: "CircuitBreakerCheck",
        status: "PASSED",
        threshold: "Drawdown < 2.0%",
        observed_value: "Drawdown = 0.12%",
        reason: "Daily portfolio drawdown well within safe operational boundaries"
      },
      {
        name: "LiquiditySpreadCheck",
        status: "PASSED",
        threshold: "Spread <= 0.35%",
        observed_value: "Spread = 0.11%",
        reason: "Orderbook liquidity is sufficient for low-slippage execution"
      },
      {
        name: "FairValueDeviationCheck",
        status: "PASSED",
        threshold: "Deviation <= 2.50%",
        observed_value: "Deviation = 0.04%",
        reason: "rToken trading within normal statistical band of fair value NAV"
      },
      {
        name: "PositionSizingCheck",
        status: "PASSED",
        threshold: "Size <= 5000.00 USDT (5% AUM)",
        observed_value: "3500.00 USDT",
        reason: "Requested capital allocation conforms to isolated subaccount risk envelope"
      },
      {
        name: "MarketOpenDeRiskCheck",
        status: "PASSED",
        threshold: "Outside opening bell freeze window",
        observed_value: "Safe 24/7 weekend/overnight trading window",
        reason: "Trade window permits active autonomous positioning"
      },
      {
        name: "AgentConfidenceFloor",
        status: "PASSED",
        threshold: "Confidence >= 0.65",
        observed_value: "Confidence = 0.92",
        reason: "Strong multi-agent consensus conviction"
      }
    ],
    approved_size_usdt: 3500.0,
    execution_price: 128.52,
    risk_hash: "a49d8c72e185f3bc89174092bdf10134",
    timestamp: Date.now() - 110000
  },
  {
    evaluation_id: "eval_91a0c44f",
    proposal_id: "prop_danger_illiquid",
    symbol: "MSTRUSDT",
    approved: false,
    checks: [
      {
        name: "CircuitBreakerCheck",
        status: "PASSED",
        threshold: "Drawdown < 2.0%",
        observed_value: "Drawdown = 0.12%",
        reason: "Daily portfolio drawdown healthy"
      },
      {
        name: "LiquiditySpreadCheck",
        status: "REJECTED",
        threshold: "Spread <= 0.35%",
        observed_value: "Spread = 0.58%",
        reason: "Bid-ask spread exceeds safety ceiling; high market impact risk"
      },
      {
        name: "FairValueDeviationCheck",
        status: "PASSED",
        threshold: "Deviation <= 2.50%",
        observed_value: "Deviation = 1.15%",
        reason: "Within synthetic fair value tolerance"
      },
      {
        name: "PositionSizingCheck",
        status: "WARNING",
        threshold: "Size <= 5000.00 USDT",
        observed_value: "4800.00 USDT",
        reason: "Approaching single asset quota ceiling"
      }
    ],
    approved_size_usdt: 0.0,
    execution_price: 345.80,
    risk_hash: "REJECTED_RISK_HARNESS_VETO",
    timestamp: Date.now() - 480000
  }
];

export const fallbackPositions: Position[] = [
  {
    symbol: "NVDAUSDT",
    shares: 27.23,
    entry_price: 128.52,
    current_price: 131.20,
    size_usdt: 3572.58,
    unrealized_pnl_usdt: 72.98,
    unrealized_pnl_pct: 2.09,
    entry_time: Date.now() - 7200000,
    side: "BUY"
  },
  {
    symbol: "TSLAUSDT",
    shares: 12.39,
    entry_price: 242.10,
    current_price: 248.60,
    size_usdt: 3080.15,
    unrealized_pnl_usdt: 80.53,
    unrealized_pnl_pct: 2.68,
    entry_time: Date.now() - 14400000,
    side: "BUY"
  },
  {
    symbol: "COINUSDT",
    shares: 9.60,
    entry_price: 312.40,
    current_price: 324.80,
    size_usdt: 3118.08,
    unrealized_pnl_usdt: 119.04,
    unrealized_pnl_pct: 3.97,
    entry_time: Date.now() - 28800000,
    side: "BUY"
  }
];

export const fallbackPaperLogs: PaperLogEntry[] = [
  {
    timestamp: Date.now() - 7200000,
    formatted_time: "2026-09-22 23:46:10 UTC",
    proposal_id: "prop_39f2c75d",
    symbol: "NVDAUSDT",
    side: "BUY",
    confidence: 0.92,
    risk_approved: true,
    risk_hash: "4822d31533d604c8",
    order_id: "ord_34374266",
    fill_price: 128.52,
    size_usdt: 3500.0,
    slippage_pct: 0.0545,
    pnl_usdt: 72.98,
    thesis_excerpt: "Hyperscalers joint $80B AI CapEx expansion creates asymmetric upside in rNVDA"
  },
  {
    timestamp: Date.now() - 14400000,
    formatted_time: "2026-09-22 21:30:15 UTC",
    proposal_id: "prop_74a1d99e",
    symbol: "TSLAUSDT",
    side: "BUY",
    confidence: 0.86,
    risk_approved: true,
    risk_hash: "b901fc45281a4d90",
    order_id: "ord_88201941",
    fill_price: 242.10,
    size_usdt: 3000.0,
    slippage_pct: 0.0412,
    pnl_usdt: 80.53,
    thesis_excerpt: "Regulatory approval for commercial FSD CyberCab deployment activates breakout"
  },
  {
    timestamp: Date.now() - 21600000,
    formatted_time: "2026-09-22 19:15:00 UTC",
    proposal_id: "prop_91a0c44f",
    symbol: "MSTRUSDT",
    side: "BUY",
    confidence: 0.88,
    risk_approved: false,
    risk_hash: "REJECTED_RISK_HARNESS_VETO",
    order_id: null,
    fill_price: null,
    size_usdt: 4800.0,
    slippage_pct: 0.0,
    pnl_usdt: 0.0,
    thesis_excerpt: "VETOED BY RISK SEATBELT: Orderbook spread 0.58% exceeded max threshold 0.35%"
  },
  {
    timestamp: Date.now() - 28800000,
    formatted_time: "2026-09-22 17:02:44 UTC",
    proposal_id: "prop_118c42a0",
    symbol: "COINUSDT",
    side: "BUY",
    confidence: 0.91,
    risk_approved: true,
    risk_hash: "55a1209ccbb041de",
    order_id: "ord_91823104",
    fill_price: 312.40,
    size_usdt: 3000.0,
    slippage_pct: 0.0620,
    pnl_usdt: 119.04,
    thesis_excerpt: "Weekend BTC liquidity expansion and crypto institutional inflows"
  }
];

export const fallbackBacktest: BacktestReport = {
  strategy_name: "Aegis24 Overnight & Weekend rToken Momentum/Arb",
  period: "60 Days (30d In-Sample + 30d Out-of-Sample)",
  benchmark: "SPY Buy-and-Hold (+4.12% / Sharpe 1.15)",
  summary_metrics: {
    total_return_pct: 19.64,
    annualized_return_pct: 62.73,
    sharpe_ratio: 2.34,
    sortino_ratio: 3.12,
    max_drawdown_pct: 7.20,
    win_rate_pct: 64.8,
    profit_factor: 1.84,
    total_trades_count: 84,
    in_sample_sharpe: 2.48,
    out_of_sample_sharpe: 2.18,
    sharpe_decay_ratio: 0.88,
    decay_status: "EXCELLENT (No Overfitting - Ratio > 0.50 threshold)"
  },
  rolling_30d_sharpe_stability: [2.48, 2.15, 2.30, 2.18],
  equity_curve: [
    100000, 100800, 101450, 101200, 102300, 102900, 103400, 102800, 103900, 104500,
    104100, 104900, 105600, 105200, 106100, 106800, 106400, 107300, 108100, 107600,
    108500, 109200, 108900, 109800, 110600, 110200, 111100, 111900, 111500, 112400,
    112100, 112900, 113600, 113200, 114100, 114800, 114400, 115300, 116100, 115700,
    116500, 117200, 116900, 117700, 118400, 118100, 118900, 119640
  ]
};

export const fallbackPresets = [
  {
    id: "evt_weekend_fed_cut",
    title: "Fed Chair Emergency Weekend Statement",
    category: "Macro / Monetary",
    symbol: "SPYUSDT",
    bias: "Dovish (+2.8%)"
  },
  {
    id: "evt_nvda_hyperscaler",
    title: "Hyperscalers $80B GPU CapEx Expansion",
    category: "Earnings / Tech",
    symbol: "NVDAUSDT",
    bias: "Strong Bullish (+4.5%)"
  },
  {
    id: "evt_tsla_robotaxi",
    title: "TSLA Commercial Autonomous FSD Approval",
    category: "Disruptive Tech",
    symbol: "TSLAUSDT",
    bias: "Bullish (+5.2%)"
  },
  {
    id: "evt_geopolitical_shock",
    title: "Red Sea Shipping Supply Disruption",
    category: "Geopolitical Shock",
    symbol: "SPYUSDT",
    bias: "Risk-Off (-2.1%)"
  }
];
