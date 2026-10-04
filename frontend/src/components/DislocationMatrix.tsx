import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Crosshair, CheckCircle2, XCircle } from 'lucide-react';
import { MarketData } from '../services/api';
import { tokens } from '../styles/tokens';

interface DislocationMatrixProps {
  market: MarketData | null;
  onSelectSymbol?: (symbol: string) => void;
  selectedSymbol: string;
}

export const DislocationMatrix: React.FC<DislocationMatrixProps> = ({
  market,
  onSelectSymbol,
  selectedSymbol
}) => {
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

  const fallbackQuotes: Record<string, any> = {
    NVDAUSDT: { price: 128.45, bid: 128.38, ask: 128.52, synthetic_nav: 128.40 },
    TSLAUSDT: { price: 242.10, bid: 241.95, ask: 242.25, synthetic_nav: 242.05 },
    AAPLUSDT: { price: 228.60, bid: 228.52, ask: 228.68, synthetic_nav: 228.55 },
    COINUSDT: { price: 312.40, bid: 312.10, ask: 312.70, synthetic_nav: 312.25 },
    MSTRUSDT: { price: 345.80, bid: 345.20, ask: 346.40, synthetic_nav: 345.50 },
    SPYUSDT: { price: 588.20, bid: 588.10, ask: 588.30, synthetic_nav: 588.15 }
  };

  const quotes = market?.rtokens || fallbackQuotes;

  // Compute 2D coordinates for each asset: X = NAV Dislocation %, Y = Bid-Ask Spread %
  const matrixPoints = Object.entries(quotes).map(([sym, q]: [string, any]) => {
    const price = q.price || 100;
    const spreadPct = (((q.ask - q.bid) / price) * 100);
    const navDiffPct = (((price - q.synthetic_nav) / q.synthetic_nav) * 100);

    const isSpreadPassed = spreadPct <= tokens.thresholds.maxSpreadPct;
    const isNavPassed = Math.abs(navDiffPct) <= tokens.thresholds.maxNavDeviationPct;
    const isApproved = isSpreadPassed && isNavPassed;

    return {
      symbol: sym,
      price,
      bid: q.bid,
      ask: q.ask,
      spreadPct,
      navDiffPct,
      isApproved,
      isSpreadPassed,
      isNavPassed
    };
  });

  const activePoint = matrixPoints.find(p => p.symbol === (hoveredSymbol || selectedSymbol)) || matrixPoints[0];

  return (
    <section id="risk-matrix" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight font-sans">
              Weekend Liquidity & Parity Dislocation Matrix
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
              HIGH-SIGNAL RADAR
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            2D risk-reward space mapping Bid-Ask Spread % against Synthetic Fair Value NAV Dislocation %
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-brand-green">
            <span className="w-2 h-2 rounded-full bg-brand-green"></span>
            Safe Corridor (&le; 0.20%)
          </span>
          <span className="flex items-center gap-1.5 text-brand-amber">
            <span className="w-2 h-2 rounded-full bg-brand-amber"></span>
            Monitor (&le; 0.35%)
          </span>
          <span className="flex items-center gap-1.5 text-brand-red">
            <span className="w-2 h-2 rounded-full bg-brand-red"></span>
            Seatbelt Veto (&gt; 0.35%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: 2D Matrix Canvas */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#070707] border border-white/5 shadow-sm relative flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-3">
            <span>&uarr; Y-Axis: Orderbook Spread % (Hardware Limit: 0.35%)</span>
            <span>X-Axis: Fair Value NAV Dislocation % &rarr;</span>
          </div>

          {/* Matrix Container */}
          <div className="relative w-full h-80 bg-[#020202] rounded-2xl border border-white/5 overflow-hidden p-4">
            {/* Background Corridor Zones */}
            {/* Safe Zone Box */}
            <div
              className="absolute left-[30%] right-[30%] bottom-0 top-[50%] bg-emerald-500/[0.04] border-t border-dashed border-emerald-500/20 pointer-events-none"
              title="Safe Arbitrage Corridor"
            >
              <span className="absolute bottom-2 left-2 text-[9px] font-mono text-emerald-400/50 uppercase tracking-wider">
                Safe Execution Corridor
              </span>
            </div>

            {/* Veto Line for Spread at 0.35% */}
            <div className="absolute left-0 right-0 top-[40%] border-t-2 border-dashed border-rose-500/50 pointer-events-none z-0">
              <span className="absolute right-2 -top-4 text-[9px] font-mono text-rose-400 bg-black/80 px-1 rounded">
                Seatbelt Ceiling: 0.35%
              </span>
            </div>

            {/* Center Axis (0% NAV Dislocation) */}
            <div className="absolute top-0 bottom-0 left-1/2 border-l border-white/[0.1] pointer-events-none"></div>

            {/* Plotted Asset Nodes */}
            {matrixPoints.map((pt) => {
              // Map NAV Dislocation from -2.5%..+2.5% to 5%..95% of container width
              const leftPct = Math.max(8, Math.min(92, 50 + (pt.navDiffPct / 2.5) * 40));
              // Map Spread from 0.0%..0.7% to bottom (0%) to top (100%) -> invert for CSS top
              const topPct = Math.max(10, Math.min(90, 95 - (pt.spreadPct / 0.6) * 80));
              const isSelected = pt.symbol === (hoveredSymbol || selectedSymbol);

              return (
                <button
                  key={pt.symbol}
                  onClick={() => onSelectSymbol && onSelectSymbol(pt.symbol)}
                  onMouseEnter={() => setHoveredSymbol(pt.symbol)}
                  onMouseLeave={() => setHoveredSymbol(null)}
                  style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 cursor-pointer group z-10 ${
                    isSelected ? 'scale-125 z-20' : 'hover:scale-115'
                  }`}
                >
                  <div
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-md ${
                      pt.isApproved
                        ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-emerald-500/10'
                        : 'bg-rose-950/90 text-rose-300 border border-rose-500/80 shadow-rose-500/20 animate-pulse'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${pt.isApproved ? 'bg-brand-green' : 'bg-brand-red'}`}></span>
                    <span>{pt.symbol.replace('USDT', '')}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Matrix Footnote */}
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
            <span>-2.5% Undervalued NAV</span>
            <span className="text-slate-400">0.00% Parity Axis</span>
            <span>+2.5% Overvalued NAV</span>
          </div>
        </div>

        {/* Right Col: Deep Inspection of Selected Asset Position in Matrix */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0e1116] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-brand-cyan" />
                <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                  Corridor Inspection: {activePoint.symbol}
                </h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                activePoint.isApproved
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}>
                {activePoint.isApproved ? 'PASSES SEATBELT' : 'QUARANTINED'}
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#08090b] border border-white/[0.06]">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Orderbook Spread:</span>
                  <span className={activePoint.isSpreadPassed ? 'text-brand-green font-bold' : 'text-brand-red font-bold'}>
                    {activePoint.spreadPct.toFixed(2)}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Hardware Ceiling: &le; 0.35% · Margin: {(0.35 - activePoint.spreadPct).toFixed(2)}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#08090b] border border-white/[0.06]">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>NAV Parity Deviation:</span>
                  <span className={activePoint.isNavPassed ? 'text-white font-bold' : 'text-brand-red font-bold'}>
                    {activePoint.navDiffPct >= 0 ? '+' : ''}{activePoint.navDiffPct.toFixed(2)}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Statistical Corridor: &plusmn;2.50% vs synthetic NAV
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#08090b] border border-white/[0.06]">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Current Best Quote:</span>
                  <span className="text-white font-bold">${activePoint.price.toFixed(2)}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Bid ${activePoint.bid.toFixed(2)} / Ask ${activePoint.ask.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-slate-400 leading-relaxed">
            {activePoint.isApproved ? (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Asset satisfies both liquidity depth and fair value parity invariants.</span>
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Thin orderbook spread exceeds safe limits. LLM market orders are hardware-blocked.</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
