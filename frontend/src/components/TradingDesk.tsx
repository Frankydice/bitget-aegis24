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
    <div className="space-y-8">
      {/* Symbol Selector Bar */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2 px-1">
          <span className="font-semibold uppercase tracking-wider text-[11px]">Select Active rToken Feed</span>
          <span className="text-[11px] text-brand-cyan">24/7 Deep Liquidity</span>
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
                className={`p-3.5 rounded-xl font-mono text-left transition-all duration-200 shrink-0 min-w-[155px] relative group cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#182433] via-[#101824] to-[#0c121b] border-2 border-brand-cyan shadow-xl shadow-brand-cyan/25 ring-1 ring-brand-cyan/50 -translate-y-1'
                    : 'bg-[#0e1116] border border-white/[0.08] hover:border-white/20 hover:bg-[#141820] text-slate-400 hover:text-slate-200 hover:-translate-y-0.5'
                }`}
              >
                {isSelected && (
                  <span className="absolute -top-2 right-3 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-brand-cyan text-black tracking-wider uppercase shadow-sm shadow-brand-cyan/40">
                    ACTIVE
                  </span>
                )}
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className={`font-extrabold tracking-wide ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {sym}
                  </span>
                  <span className="text-[10px] text-brand-teal font-semibold">rToken</span>
                </div>
                <div className={`text-sm font-bold font-mono ${isSelected ? 'text-brand-cyan' : 'text-slate-100'}`}>
                  ${q.price.toFixed(2)}
                </div>
                <div className={`text-[11px] font-semibold flex items-center gap-0.5 mt-0.5 ${isUp ? 'text-brand-green' : 'text-brand-red'}`}>
                  {isUp ? '+' : ''}{q.change_24h.toFixed(2)}%
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Trading & Microstructure Card (Hero Focus) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Quote & Parity Radar (Primary Focus) */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#121620] via-[#0f1218] to-[#090b0e] border border-brand-cyan/40 shadow-2xl shadow-black/80 relative overflow-hidden flex flex-col justify-between">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/[0.04] rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

          <div>
            {/* Asset Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08] relative z-10">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                    {selectedSymbol}
                  </h2>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/40 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping"></span>
                    24/7 TOKENIZED US EQUITY
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-1.5">
                  Bitget rToken Contract · Deep Synthetic Liquidity Pool · 0% Weekend Gap Risk
                </p>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 self-start sm:self-auto">
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                    ${activeQuote.price.toFixed(2)}
                  </div>
                  <div
                    className={`text-xs font-mono font-bold inline-block px-2 py-0.5 rounded ${
                      activeQuote.change_24h >= 0
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {activeQuote.change_24h >= 0 ? '+' : ''}{activeQuote.change_24h.toFixed(2)}% (24h)
                  </div>
                </div>

                <button
                  onClick={handleExportPlaybook}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-cyan/20 to-brand-teal/20 text-brand-cyan border border-brand-cyan/40 hover:bg-brand-cyan hover:text-black hover:border-brand-cyan transition-all duration-150 font-mono text-xs font-bold flex items-center gap-2 shadow-sm hover:shadow-md hover:shadow-brand-cyan/20 active:scale-95 cursor-pointer shrink-0"
                  title="Export code for Bitget Playbook sandbox"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Playbook Code</span>
                </button>
              </div>
            </div>

            {/* Microstructure Metrics 4-Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
              <div className="p-3.5 rounded-xl bg-[#090b0e]/90 border border-white/[0.08] hover:border-white/[0.15] transition-colors">
                <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider block">
                  BEST BID / ASK
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-slate-100 block mt-1">
                  ${activeQuote.bid.toFixed(2)} / ${activeQuote.ask.toFixed(2)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#090b0e]/90 border border-white/[0.08] hover:border-white/[0.15] transition-colors">
                <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider block">
                  BID-ASK SPREAD
                </span>
                <span
                  className={`text-xs sm:text-sm font-mono font-bold block mt-1 ${
                    spreadPct <= 0.35 ? 'text-brand-green' : 'text-brand-red'
                  }`}
                >
                  {spreadPct.toFixed(2)}% {spreadPct <= 0.35 ? '(Passes Gate)' : '(Gate Block)'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#090b0e]/90 border border-white/[0.08] hover:border-white/[0.15] transition-colors">
                <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider block">
                  NAV PARITY
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-slate-100 block mt-1">
                  ${activeQuote.synthetic_nav.toFixed(2)} ({navDiffPct >= 0 ? '+' : ''}{navDiffPct.toFixed(2)}%)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#090b0e]/90 border border-white/[0.08] hover:border-white/[0.15] transition-colors">
                <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider block">
                  24H rTOKEN VOLUME
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-slate-100 block mt-1">
                  ${((activeQuote.volume_24h * activeQuote.price) / 1_000_000).toFixed(2)}M USDT
                </span>
              </div>
            </div>

            {/* Synthetic Candlestick / Price Ribbon */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#090b0e]/90 border border-white/[0.08]">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-3">
                <span className="font-semibold text-slate-300">Continuous 24/7 Overnight Price Ribbon</span>
                <span className="text-brand-cyan font-semibold">Resolution: 1-Hour Windows</span>
              </div>

              <div className="h-28 w-full flex items-end gap-1.5 pt-4">
                {[42, 45, 48, 44, 49, 53, 58, 62, 59, 64, 69, 72, 75, 71, 79, 84, 88, 92, 89, 95].map(
                  (val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div
                        style={{ height: `${val}%` }}
                        className="w-full bg-gradient-to-t from-brand-teal/40 via-brand-cyan/70 to-brand-cyan rounded-t-sm group-hover:brightness-125 transition-all"
                      ></div>
                      <span className="text-[9px] text-slate-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 bg-black/90 px-1.5 py-0.5 rounded border border-white/20 whitespace-nowrap z-20">
                        ${(activeQuote.price * (0.95 + val / 500)).toFixed(1)}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Macro & Sentiment Signal Telemetry */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Macro Radar Card */}
          <div className="p-5 rounded-2xl bg-[#0e1116] border border-white/[0.08] shadow-sm flex flex-col justify-between hover:border-white/[0.15] transition-all">
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center">
                  <Compass className="w-3.5 h-3.5 text-brand-cyan" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">bitget-signal: Macro Analyst</h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                {market?.macro_signal?.macro_regime || 'LIQUIDITY_EXPANSION'}
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono text-slate-300">
              <div className="flex justify-between py-1 border-b border-white/[0.05]">
                <span className="text-slate-400">Fed Rate Stance:</span>
                <span className="text-brand-green font-semibold">
                  {market?.macro_signal?.fed_rate_posture || 'DOVISH (50bps cut cycle confirmed)'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.05]">
                <span className="text-slate-400">Dollar Index (DXY):</span>
                <span className="text-white font-medium">
                  {market?.macro_signal?.dxy_index ?? 101.4} ({market?.macro_signal?.dxy_trend || 'BEARISH_CORRECTION'})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.05]">
                <span className="text-slate-400">US 10-Year Yield:</span>
                <span className="text-white font-medium">{market?.macro_signal?.us10y_yield ?? 3.74}%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">BTC / Nasdaq 90d Corr:</span>
                <span className="text-brand-cyan font-bold">{market?.macro_signal?.btc_nasdaq_90d_corr ?? 0.72}</span>
              </div>
            </div>
          </div>

          {/* Sentiment Radar Card */}
          <div className="p-5 rounded-2xl bg-[#0e1116] border border-white/[0.08] shadow-sm flex flex-col justify-between hover:border-white/[0.15] transition-all">
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-brand-green/10 border border-brand-green/20 flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5 text-brand-green" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">bitget-signal: Sentiment</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-green/15 text-brand-green font-bold border border-brand-green/30">
                {market?.sentiment_signal?.sentiment_label || 'GREED'} ({market?.sentiment_signal?.fear_and_greed_index ?? 74})
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono text-slate-300">
              <div className="flex justify-between py-1 border-b border-white/[0.05]">
                <span className="text-slate-400">Long/Short Ratio:</span>
                <span className="font-semibold text-white">{market?.sentiment_signal?.long_short_ratio ?? 1.84}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.05]">
                <span className="text-slate-400">Funding Rate:</span>
                <span className="text-brand-green font-semibold">
                  {market?.sentiment_signal?.weighted_funding_rate_pct ?? 0.0125}%
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Actionable Bias:</span>
                <span className="text-brand-cyan text-[11px] font-bold truncate max-w-[170px]">
                  {market?.sentiment_signal?.actionable_bias || 'BULLISH'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0e1116] border border-white/[0.08] shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-brand-cyan" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">Active Agentic Sub-Account Positions</h3>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-[#090b0e] px-2.5 py-1 rounded-md border border-white/[0.06]">
            Isolated Fund Allocation: <strong className="text-brand-cyan">{positions.length} Active Positions</strong>
          </span>
        </div>

        {positions.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 font-mono">
            No active positions open. Swarm is monitoring 24/7 orderbook and awaiting event catalysts.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#090b0e] text-slate-400 border-b border-white/[0.08]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">SYMBOL</th>
                  <th className="py-2.5 px-3 font-semibold">SIDE</th>
                  <th className="py-2.5 px-3 font-semibold">SHARES</th>
                  <th className="py-2.5 px-3 font-semibold">ENTRY PRICE</th>
                  <th className="py-2.5 px-3 font-semibold">CURRENT PRICE</th>
                  <th className="py-2.5 px-3 font-semibold">POSITION SIZE</th>
                  <th className="py-2.5 px-3 font-semibold">UNREALIZED PnL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-slate-200">
                {positions.map((p, idx) => {
                  const isUp = p.unrealized_pnl_usdt >= 0;
                  return (
                    <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-2.5 px-3 font-bold text-white">{p.symbol}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-green/15 text-brand-green border border-brand-green/30">
                          {p.side}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium">{p.shares}</td>
                      <td className="py-2.5 px-3">${p.entry_price.toFixed(2)}</td>
                      <td className="py-2.5 px-3 font-bold text-white">${p.current_price.toFixed(2)}</td>
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#101319] border border-white/[0.12] rounded-2xl max-w-3xl w-full p-6 max-h-[85vh] flex flex-col shadow-2xl shadow-black">
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] mb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Generated Bitget Playbook Code</h3>
                <p className="text-xs text-slate-400 font-mono">Compatible with @bitget-ai/getagent-skill & GetAgent Studio</p>
              </div>
              <button
                onClick={() => setPlaybookModal(null)}
                className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center text-sm font-mono transition-colors"
              >
                ✕
              </button>
            </div>

            <pre className="flex-1 overflow-y-auto bg-[#090a0d] p-4 rounded-xl text-xs font-mono text-brand-cyan/95 border border-white/[0.06] mb-4 leading-relaxed">
              {playbookModal}
            </pre>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(playbookModal);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="px-4 py-2.5 rounded-xl bg-brand-cyan text-black font-bold text-xs font-mono flex items-center gap-2 hover:bg-white transition-all shadow-md shadow-brand-cyan/20 active:scale-95 cursor-pointer"
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
