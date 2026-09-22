/**
 * Aegis24 API Service Layer
 * Typed communication with the FastAPI backend.
 */

export interface SystemStatus {
  status: string;
  app_name: string;
  version: string;
  account: {
    account_uid: string;
    account_type: string;
    trading_mode: string;
    cash_balance_usdt: number;
    open_positions_value_usdt: number;
    unrealized_pnl_usdt: number;
    total_equity_usdt: number;
    isolated_quota_limit_usdt: number;
    withdrawal_disabled: boolean;
    api_tier: string;
  };
  circuit_breaker: {
    tripped: boolean;
    current_drawdown_pct: number;
    max_limit_pct: number;
    day_start_equity: number;
    current_equity: number;
    trip_reason: string | null;
    status: string;
  };
  server_time_utc: string;
}

export interface rTokenQuote {
  price: number;
  bid: number;
  ask: number;
  synthetic_nav: number;
  change_24h: number;
  volume_24h: number;
}

export interface MarketData {
  rtokens: Record<string, rTokenQuote>;
  macro_signal: {
    fed_rate_posture: string;
    dxy_index: number;
    dxy_trend: string;
    us10y_yield: number;
    btc_nasdaq_90d_corr: number;
    macro_regime: string;
  };
  sentiment_signal: {
    fear_and_greed_index: number;
    sentiment_label: string;
    long_short_ratio: number;
    weighted_funding_rate_pct: number;
    actionable_bias: string;
  };
}

export interface SingleRiskCheck {
  name: string;
  status: "PASSED" | "REJECTED" | "WARNING";
  threshold: string;
  observed_value: string;
  reason: string;
}

export interface RiskEvaluation {
  evaluation_id: string;
  proposal_id: string;
  symbol: string;
  approved: boolean;
  checks: SingleRiskCheck[];
  approved_size_usdt: number;
  execution_price: number;
  risk_hash: string;
  timestamp: number;
}

export interface AgentThought {
  agent_name: string;
  role: string;
  observation: string;
  analysis: string;
  verdict: string;
  confidence: number;
  key_metrics: Record<string, any>;
}

export interface DebateRecord {
  proposal: {
    proposal_id: string;
    symbol: string;
    side: "BUY" | "SELL" | "HOLD";
    confidence: number;
    thesis: string;
    suggested_size_usdt: number;
    target_price: number;
    expected_hold_hours: number;
    source_agent: string;
  };
  agent_thoughts: AgentThought[];
  debate_summary: string;
  timestamp: number;
}

export interface Position {
  symbol: string;
  shares: number;
  entry_price: number;
  current_price: number;
  size_usdt: number;
  unrealized_pnl_usdt: number;
  unrealized_pnl_pct: number;
  entry_time: number;
  side: string;
}

export interface PaperLogEntry {
  timestamp: number;
  formatted_time: string;
  proposal_id: string;
  symbol: string;
  side: string;
  confidence: number;
  risk_approved: boolean;
  risk_hash: string;
  order_id: string | null;
  fill_price: number | null;
  size_usdt: number;
  slippage_pct: number;
  pnl_usdt: number;
  thesis_excerpt: string;
}

export interface BacktestReport {
  strategy_name: string;
  period: string;
  benchmark: string;
  summary_metrics: {
    total_return_pct: number;
    annualized_return_pct: number;
    sharpe_ratio: number;
    sortino_ratio: number;
    max_drawdown_pct: number;
    win_rate_pct: number;
    profit_factor: number;
    total_trades_count: number;
    in_sample_sharpe: number;
    out_of_sample_sharpe: number;
    sharpe_decay_ratio: number;
    decay_status: string;
  };
  rolling_30d_sharpe_stability: number[];
  equity_curve: number[];
}

const API_BASE = '/api';

export const api = {
  getStatus: async (): Promise<SystemStatus> => {
    const res = await fetch(`${API_BASE}/status`);
    return res.json();
  },
  getMarket: async (): Promise<MarketData> => {
    const res = await fetch(`${API_BASE}/market`);
    return res.json();
  },
  getDebates: async (): Promise<{ debates: DebateRecord[] }> => {
    const res = await fetch(`${API_BASE}/agent/debates`);
    return res.json();
  },
  getRiskEvaluations: async (): Promise<{ evaluations: RiskEvaluation[] }> => {
    const res = await fetch(`${API_BASE}/risk/evaluations`);
    return res.json();
  },
  getPositions: async (): Promise<{ positions: Position[]; account_summary: any }> => {
    const res = await fetch(`${API_BASE}/positions`);
    return res.json();
  },
  getPaperLogs: async (): Promise<{ logs: PaperLogEntry[] }> => {
    const res = await fetch(`${API_BASE}/paper-trading/logs`);
    return res.json();
  },
  getBacktest: async (): Promise<BacktestReport> => {
    const res = await fetch(`${API_BASE}/backtest`);
    return res.json();
  },
  getPresetEvents: async (): Promise<{ presets: any[] }> => {
    const res = await fetch(`${API_BASE}/events/presets`);
    return res.json();
  },
  injectEvent: async (params: {
    event_id?: string;
    custom_symbol?: string;
    custom_title?: string;
    custom_content?: string;
    custom_bias?: string;
    custom_target_move?: number;
  }) => {
    const res = await fetch(`${API_BASE}/events/inject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return res.json();
  },
  exportPlaybook: async (symbol: string): Promise<{ code: string; playbook_card_name: string }> => {
    const res = await fetch(`${API_BASE}/playbook/export?symbol=${symbol}`);
    return res.json();
  }
};
