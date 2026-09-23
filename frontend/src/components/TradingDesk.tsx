import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, Compass, Layers, Download, Check, Code } from 'lucide-react';
import { MarketData, Position, api } from '../services/api';

interface TradingDeskProps {
  market: MarketData | null;
  positions: Position[];
  onSelectSymbol: (symbol: string) => void;
  selectedSymbol: string;
}

export const TradingDesk: React.FC<TradingDeskProps> = ({
  market,
  positions,
  onSelectSymbol,
  selectedSymbol
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [playbookModal, setPlaybookModal] = useState<string | null>(null);

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

  const handleExportPlaybook = async () => {
    try {
      const res = await api.exportPlaybook(selectedSymbol);
      setPlaybookModal(res?.code || '');
    } catch {
      // Handled in api fallback
    }
  };

  const symbolsList = (market?.rtokens && Object.keys(market.rtokens).length > 0)
    ? Object.keys(market.rtokens)
    : ['NVDAUSDT', 'TSLAUSDT', 'AAPLUSDT', 'COINUSDT', 'MSTRUSDT', 'SPYUSDT'];

  return (
    <div className="space-y-6">
      {/* Symbol Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {symbolsList.map((sym) => {
          const q = (market?.rtokens && market.rtokens[sym]) || fallbackQuote;
          const isUp = (q.change_24h ?? 0) >= 0;
          const isSelected = selectedSymbol === sym;

          return (
            <button
              key={sym}
              onClick={() => onSelectSymbol(sym)}
              className={`p-3 rounded-xl border font-mono text-left transition-all shrink-0 min-w-[140px] ${
                isSelected
                  ? 'bg-bg-card border-brand-cyan shadow-lg shadow-brand-cyan/10'
                  : 'bg-bg-darkest border-bg-border hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-bold text-white">{sym}</span>
                <span className="text-[10px] text-brand-teal">rToken</span>
              </div>
              <div className="text-sm font-bold text-slate-100">${q.price.toFixed(2)}</div>
              <div className={`text-[11px] font-semibold flex items-center gap-0.5 ${isUp ? 'text-brand-green' : 'text-brand-red'}`}>
                {isUp ? '+' : ''}{q.change_24h.toFixed(2)}%
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Trading & Microstructure Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Quote & Parity Radar */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-bg-card border border-bg-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-bg-border">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold font-mono text-white">{selectedSymbol}</h2>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                  24/7 TOKENIZED US EQUITY
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">Bitget rToken Contract · Deep Liquidity Pool</p>
            </div>

            <div className="text-right flex items-center gap-3">
              <div>
                <div className="text-2xl font-bold font-mono text-white">${activeQuote.price.toFixed(2)}</div>
                <div className={`text-xs font-mono font-medium ${activeQuote.change_24h >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                  {activeQuote.change_24h >= 0 ? '+' : ''}{activeQuote.change_24h.toFixed(2)}% (24h)
                </div>
              </div>

              <button
                onClick={handleExportPlaybook}
                className="px-3 py-2 rounded-xl bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan/25 transition-all text-xs font-mono flex items-center gap-1.5"
                title="Export code for Bitget Playbook sandbox"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Playbook Code</span>
              </button>
            </div>
          </div>

          {/* Microstructure Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
            <div className="p-3 rounded-xl bg-bg-darkest border border-bg-border">
              <span className="text-[10px] text-slate-400 font-mono block">BEST BID / ASK</span>
              <span className="text-xs font-mono text-slate-200 block mt-0.5">
                ${activeQuote.bid.toFixed(2)} / ${activeQuote.ask.toFixed(2)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-bg-darkest border border-bg-border">
              <span className="text-[10px] text-slate-400 font-mono block">BID-ASK SPREAD</span>
              <span className={`text-xs font-mono font-bold block mt-0.5 ${spreadPct <= 0.35 ? 'text-brand-green' : 'text-brand-red'}`}>
                {spreadPct.toFixed(2)}% {spreadPct <= 0.35 ? '(Passes Gate)' : '(Gate Block)'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-bg-darkest border border-bg-border">
              <span className="text-[10px] text-slate-400 font-mono block">SYNTHETIC NAV PARITY</span>
              <span className="text-xs font-mono text-slate-200 block mt-0.5">
                ${activeQuote.synthetic_nav.toFixed(2)} ({navDiffPct >= 0 ? '+' : ''}{navDiffPct.toFixed(2)}%)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-bg-darkest border border-bg-border">
              <span className="text-[10px] text-slate-400 font-mono block">24H rTOKEN VOLUME</span>
              <span className="text-xs font-mono text-slate-200 block mt-0.5">
                ${(activeQuote.volume_24h * activeQuote.price / 1_000_000).toFixed(2)}M USDT
              </span>
            </div>
          </div>

          {/* Synthetic Candlestick / Price Ribbon */}
          <div className="p-4 rounded-xl bg-bg-darkest border border-bg-border/60">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-3">
              <span>Continuous 24/7 Overnight Price Ribbon</span>
              <span className="text-brand-cyan">Resolution: 1-Hour Windows</span>
            </div>
            
            <div className="h-28 w-full flex items-end gap-1.5 pt-4">
              {[42, 45, 48, 44, 49, 53, 58, 62, 59, 64, 69, 72, 75, 71, 79, 84, 88, 92, 89, 95].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    style={{ height: `${val}%` }}
                    className="w-full bg-gradient-to-t from-brand-teal/30 to-brand-cyan/80 rounded-t-sm group-hover:to-brand-cyan transition-all"
                  ></div>
                  <span className="text-[9px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                    ${(activeQuote.price * (0.95 + val/500)).toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Macro & Sentiment Signal Telemetry */}
        <div className="space-y-4">
          {/* Macro Radar Card */}
          <div className="p-5 rounded-2xl bg-bg-card border border-bg-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-brand-cyan" />
                <h3 className="text-sm font-bold text-white">bitget-signal: Macro Analyst</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan">
                {market?.macro_signal?.macro_regime || 'LIQUIDITY_EXPANSION'}
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono text-slate-300">
              <div className="flex justify-between py-1 border-b border-bg-border/50">
                <span className="text-slate-400">Fed Rate Stance:</span>
                <span className="text-brand-green font-semibold">{market?.macro_signal?.fed_rate_posture || 'DOVISH (50bps cut cycle confirmed)'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-bg-border/50">
                <span className="text-slate-400">Dollar Index (DXY):</span>
                <span>{market?.macro_signal?.dxy_index ?? 101.4} ({market?.macro_signal?.dxy_trend || 'BEARISH_CORRECTION'})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-bg-border/50">
                <span className="text-slate-400">US 10-Year Yield:</span>
                <span>{market?.macro_signal?.us10y_yield ?? 3.74}%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">BTC / Nasdaq 90d Corr:</span>
                <span className="text-brand-cyan font-semibold">{market?.macro_signal?.btc_nasdaq_90d_corr ?? 0.72}</span>
              </div>
            </div>
          </div>

            {/* Sentiment Radar Card */}
          <div className="p-5 rounded-2xl bg-bg-card border border-bg-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-teal" />
                <h3 className="text-sm font-bold text-white">bitget-signal: Sentiment</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-green/10 text-brand-green font-semibold">
                {market?.sentiment_signal?.sentiment_label || 'GREED'} ({market?.sentiment_signal?.fear_and_greed_index ?? 74})
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono text-slate-300">
              <div className="flex justify-between py-1 border-b border-bg-border/50">
                <span className="text-slate-400">Long/Short Ratio:</span>
                <span className="font-semibold text-white">{market?.sentiment_signal?.long_short_ratio ?? 1.84}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-bg-border/50">
                <span className="text-slate-400">Funding Rate:</span>
                <span className="text-brand-green">{market?.sentiment_signal?.weighted_funding_rate_pct ?? 0.0125}%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Actionable Bias:</span>
                <span className="text-brand-cyan text-[11px] truncate max-w-[170px]">
                  {market?.sentiment_signal?.actionable_bias || 'BULLISH'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions Table */}
      <div className="p-6 rounded-2xl bg-bg-card border border-bg-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-cyan" />
            <h3 className="text-sm font-bold text-white">Active Agentic Sub-Account Positions</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Isolated Fund Allocation: {positions.length} Active Positions
          </span>
        </div>

        {positions.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 font-mono">
            No active positions open. Swarm is monitoring 24/7 orderbook and awaiting event catalysts.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-bg-darkest text-slate-400 border-b border-bg-border">
                <tr>
                  <th className="py-2.5 px-3">SYMBOL</th>
                  <th className="py-2.5 px-3">SIDE</th>
                  <th className="py-2.5 px-3">SHARES</th>
                  <th className="py-2.5 px-3">ENTRY PRICE</th>
                  <th className="py-2.5 px-3">CURRENT PRICE</th>
                  <th className="py-2.5 px-3">POSITION SIZE</th>
                  <th className="py-2.5 px-3">UNREALIZED PnL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-border/50 text-slate-200">
                {positions.map((p, idx) => {
                  const isUp = p.unrealized_pnl_usdt >= 0;
                  return (
                    <tr key={idx} className="hover:bg-bg-hover/50">
                      <td className="py-2.5 px-3 font-bold text-white">{p.symbol}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-green/15 text-brand-green">
                          {p.side}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">{p.shares}</td>
                      <td className="py-2.5 px-3">${p.entry_price.toFixed(2)}</td>
                      <td className="py-2.5 px-3 font-semibold">${p.current_price.toFixed(2)}</td>
                      <td className="py-2.5 px-3">${p.size_usdt.toLocaleString()} USDT</td>
                      <td className={`py-2.5 px-3 font-bold ${isUp ? 'text-brand-green' : 'text-brand-red'}`}>
                        {isUp ? '+' : ''}${p.unrealized_pnl_usdt.toFixed(2)} ({isUp ? '+' : ''}{p.unrealized_pnl_pct.toFixed(2)}%)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Playbook Code Modal */}
      {playbookModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-bg-card border border-bg-border rounded-2xl max-w-3xl w-full p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-bg-border mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Generated Bitget Playbook Code</h3>
                <p className="text-xs text-slate-400 font-mono">Compatible with @bitget-ai/getagent-skill & GetAgent Studio</p>
              </div>
              <button
                onClick={() => setPlaybookModal(null)}
                className="text-slate-400 hover:text-white text-sm font-mono"
              >
                Close ✕
              </button>
            </div>

            <pre className="flex-1 overflow-y-auto bg-bg-darkest p-4 rounded-xl text-xs font-mono text-brand-cyan/90 border border-bg-border mb-4">
              {playbookModal}
            </pre>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(playbookModal);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="px-4 py-2 rounded-xl bg-brand-cyan text-black font-semibold text-xs font-mono flex items-center gap-1.5"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                {copiedCode ? 'Copied to Clipboard!' : 'Copy Playbook Strategy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
