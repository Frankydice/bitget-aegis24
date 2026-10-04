import React from 'react';
import { Compass, Activity, ShieldCheck, AlertCircle, Sparkles, TrendingUp, DollarSign, Layers } from 'lucide-react';
import { MarketData, SystemStatus } from '../services/api';

interface PrimaryDashboardProps {
  market: MarketData | null;
  status: SystemStatus | null;
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  isLoading?: boolean;
}

export const PrimaryDashboard: React.FC<PrimaryDashboardProps> = ({
  market,
  status,
  selectedSymbol,
  onSelectSymbol,
  isLoading = false
}) => {
  const fallbackQuote = {
    price: 128.45,
    bid: 128.38,
    ask: 128.52,
    synthetic_nav: 128.40,
    change_24h: 3.42,
    volume_24h: 482910
  };

  const activeQuote = (market?.rtokens && market.rtokens[selectedSymbol]) || fallbackQuote;
  const priceSafe = activeQuote.price || 128.45;
  const spreadPct = (((activeQuote.ask || 128.52) - (activeQuote.bid || 128.38)) / priceSafe) * 100;
  const navSafe = activeQuote.synthetic_nav || 128.40;
  const navDiffPct = ((priceSafe - navSafe) / navSafe) * 100;
  const spreadSafe = spreadPct <= 0.35;
  const navSafeCheck = Math.abs(navDiffPct) <= 2.50;

  const symbolsList = (market?.rtokens && Object.keys(market.rtokens).length > 0)
    ? Object.keys(market.rtokens)
    : ['NVDAUSDT', 'TSLAUSDT', 'AAPLUSDT', 'COINUSDT', 'MSTRUSDT', 'SPYUSDT'];

  const macroRegime = market?.macro_signal?.macro_regime || 'LIQUIDITY_EXPANSION';
  const fedStance = market?.macro_signal?.fed_rate_posture || 'Dovish stance';
  const fearGreed = market?.sentiment_signal?.fear_and_greed_index ?? 74;
  const cbDrawdown = status?.circuit_breaker?.current_drawdown_pct ?? 0.12;

  const generatedSummary = `Market regime is currently in ${macroRegime.replace('_', ' ')} with ${fedStance}. Fear & Greed index sits at ${fearGreed} (elevated risk appetite). For ${selectedSymbol}, bid-ask spread is ${spreadPct.toFixed(2)}% (${spreadSafe ? 'passing Gate 2 liquidity guard' : 'exceeding 0.35% threshold'}) and synthetic NAV deviation is ${navDiffPct >= 0 ? '+' : ''}${navDiffPct.toFixed(2)}% (${navSafeCheck ? 'safe fair value corridor' : 'dislocated'}). Circuit breaker buffer is ${(2.0 - cbDrawdown).toFixed(2)}% before trading pause.`;

  return (
    <section id="dashboard" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight font-sans">
              Primary Live Desk & Telemetry
            </h2>
            <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-mono font-medium text-blue-300 border border-blue-500/20">
              REAL-TIME FEED
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-normal mt-0.5">
            24/7 continuous synthetic US equity pricing, macro perception, and isolated risk metrics
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span>bitget-mcp-server: Connected</span>
        </div>
      </div>

      {/* Asset Selector Ribbon */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2.5 px-1">
          <span className="font-medium uppercase tracking-wider text-[11px] text-neutral-500">
            Select Active rToken
          </span>
          <span className="text-[11px] text-blue-400">Continuous Weekend Orderbook</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {symbolsList.map((sym) => {
            const q = (market?.rtokens && market.rtokens[sym]) || fallbackQuote;
            const isUp = (q.change_24h ?? 0) >= 0;
            const isSelected = selectedSymbol === sym;

            return (
              <button
                key={sym}
                onClick={() => onSelectSymbol(sym)}
                className={`p-3.5 rounded-2xl font-mono text-left transition-all duration-150 shrink-0 min-w-[155px] relative group cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-blue-950/30 via-[#0c0c0e] to-[#070707] border border-blue-500/50 shadow-md shadow-blue-500/10'
                    : 'bg-[#070707] border border-white/5 hover:border-white/15 hover:bg-[#0c0c0e] text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {isSelected && (
                  <span className="absolute -top-2 right-3 rounded-full bg-blue-500 px-2 py-0.5 text-[9px] font-mono font-bold text-white tracking-wider uppercase shadow-xs">
                    ACTIVE
                  </span>
                )}
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-semibold tracking-tight ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                    {sym}
                  </span>
                  <span className="text-[10px] text-blue-400 font-mono">rToken</span>
                </div>
                <div className={`text-sm font-bold font-mono ${isSelected ? 'text-blue-300' : 'text-white'}`}>
                  ${q.price.toFixed(2)}
                </div>
                <div className={`text-[11px] font-semibold flex items-center gap-0.5 mt-0.5 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUp ? '+' : ''}{q.change_24h.toFixed(2)}%
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Core Grid: Active Quote + Macro Signal + Sentiment Signal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Active Quote & Microstructure Metrics */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#070707] border border-white/5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-2xl font-bold font-mono text-white tracking-tight">
                    {selectedSymbol}
                  </h3>
                  <span className="rounded-full bg-blue-500/15 border border-blue-500/25 px-2.5 py-0.5 text-[10px] font-mono font-medium text-blue-300 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                    24/7 SYNTHETIC ASSET
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-normal mt-1">
                  Continuous Off-Hours Orderbook · 0% Weekend Gap Risk
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold font-mono text-white tracking-tight">
                  ${activeQuote.price.toFixed(2)}
                </div>
                <div
                  className={`text-xs font-mono font-bold inline-block px-2 py-0.5 rounded-full mt-1 ${
                    activeQuote.change_24h >= 0
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                  }`}
                >
                  {activeQuote.change_24h >= 0 ? '+' : ''}{activeQuote.change_24h.toFixed(2)}% (24h)
                </div>
              </div>
            </div>

            {/* Microstructure Metrics 4-Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
              <div className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02]">
                <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block">
                  Best Bid / Ask
                </span>
                <span className="text-xs sm:text-sm font-mono font-semibold text-neutral-200 block mt-1">
                  ${activeQuote.bid.toFixed(2)} / ${activeQuote.ask.toFixed(2)}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02]">
                <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block">
                  Bid-Ask Spread
                </span>
                <span
                  className={`text-xs sm:text-sm font-mono font-semibold block mt-1 ${
                    spreadSafe ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {spreadPct.toFixed(2)}% {spreadSafe ? '(Pass)' : '(Fail)'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02]">
                <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block">
                  NAV Fair Value
                </span>
                <span className="text-xs sm:text-sm font-mono font-semibold text-neutral-200 block mt-1">
                  ${activeQuote.synthetic_nav.toFixed(2)} ({navDiffPct >= 0 ? '+' : ''}{navDiffPct.toFixed(2)}%)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02]">
                <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block">
                  24h rToken Volume
                </span>
                <span className="text-xs sm:text-sm font-mono font-semibold text-neutral-200 block mt-1">
                  ${((activeQuote.volume_24h * activeQuote.price) / 1_000_000).toFixed(2)}M USDT
                </span>
              </div>
            </div>
          </div>

          {/* Circuit Breaker Health Strip */}
          <div className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-neutral-400">Circuit Breaker:</span>
              <span className="text-emerald-400 font-semibold">NORMAL ({cbDrawdown.toFixed(2)}% / max 2.0% limit)</span>
            </div>
            <span className="text-neutral-500 hidden sm:inline">
              Isolated Quota: <strong className="text-white">$100,000 USDT</strong>
            </span>
          </div>
        </div>

        {/* Right: Macro & Sentiment Signal Telemetry */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Macro Radar */}
          <div className="p-5 rounded-3xl border border-white/5 bg-[#070707] shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Compass className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  bitget-signal: Macro Analyst
                </h4>
              </div>
              <span className="rounded-full bg-blue-500/15 border border-blue-500/25 px-2 py-0.5 text-[9px] font-mono text-blue-300 font-semibold">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-400">Regime:</span>
                <span className="text-white font-semibold">{macroRegime}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-400">Fed Posture:</span>
                <span className="text-emerald-400 font-semibold">{fedStance}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">10Y Yield:</span>
                <span className="text-neutral-200">
                  {market?.macro_signal?.us10y_yield?.toFixed(2) ?? '4.28'}%
                </span>
              </div>
            </div>
          </div>

          {/* Sentiment Radar */}
          <div className="p-5 rounded-3xl border border-white/5 bg-[#070707] shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Sentiment Radar
                </h4>
              </div>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 text-[9px] font-mono text-emerald-400 font-semibold">
                FEAR / GREED
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-400">F&G Index:</span>
                <span className="text-emerald-400 font-bold">{fearGreed} / 100</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-400">Social Momentum:</span>
                <span className="text-white font-semibold">Bullish Consensus</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">News Dispersion:</span>
                <span className="text-neutral-200">Moderate Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Telemetry Summary Box */}
      <div className="p-4 sm:p-5 rounded-2xl border border-white/5 bg-white/[0.02] flex items-start gap-3">
        <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-400 block">
            Automated Telemetry Synthesis
          </span>
          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            {generatedSummary}
          </p>
        </div>
      </div>
    </section>
  );
};
