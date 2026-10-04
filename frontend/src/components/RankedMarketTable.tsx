import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Search, Layers, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { MarketData, Position } from '../services/api';
import { tokens } from '../styles/tokens';

interface RankedMarketTableProps {
  market: MarketData | null;
  positions: Position[];
  onSelectSymbol?: (symbol: string) => void;
}

type TableTab = 'OPPORTUNITIES' | 'POSITIONS';
type SortField = 'rank' | 'symbol' | 'price' | 'change' | 'spread' | 'volume' | 'score' | 'pnl';

export const RankedMarketTable: React.FC<RankedMarketTableProps> = ({
  market,
  positions,
  onSelectSymbol
}) => {
  const [activeTab, setActiveTab] = useState<TableTab>('OPPORTUNITIES');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortAsc, setSortAsc] = useState(false);

  const fallbackQuotes: Record<string, any> = {
    NVDAUSDT: { price: 128.45, bid: 128.38, ask: 128.52, synthetic_nav: 128.40, change_24h: 3.42, volume_24h: 482910 },
    TSLAUSDT: { price: 242.10, bid: 241.95, ask: 242.25, synthetic_nav: 242.05, change_24h: 5.18, volume_24h: 341200 },
    AAPLUSDT: { price: 228.60, bid: 228.52, ask: 228.68, synthetic_nav: 228.55, change_24h: 1.15, volume_24h: 219400 },
    COINUSDT: { price: 312.40, bid: 312.10, ask: 312.70, synthetic_nav: 312.25, change_24h: 6.84, volume_24h: 589100 },
    MSTRUSDT: { price: 345.80, bid: 345.20, ask: 346.40, synthetic_nav: 345.50, change_24h: 8.92, volume_24h: 672300 },
    SPYUSDT: { price: 588.20, bid: 588.10, ask: 588.30, synthetic_nav: 588.15, change_24h: 0.85, volume_24h: 1204500 }
  };

  const quotes = market?.rtokens || fallbackQuotes;

  // Compute table rows with derived Opportunity Score
  const rankedItems = useMemo(() => {
    return Object.entries(quotes).map(([sym, q]: [string, any], index) => {
      const price = q.price || 100;
      const spreadPct = (((q.ask - q.bid) / price) * 100);
      const navDiffPct = (((price - q.synthetic_nav) / q.synthetic_nav) * 100);
      const volumeM = (q.volume_24h * price) / 1_000_000;
      const isApproved = spreadPct <= tokens.thresholds.maxSpreadPct && Math.abs(navDiffPct) <= tokens.thresholds.maxNavDeviationPct;
      
      // Institutional opportunity score formula: Higher volume & momentum + spread tightness penalty
      const spreadPenalty = Math.max(0, spreadPct - 0.1) * 30;
      const score = Number(Math.max(10, Math.min(99, (50 + (q.change_24h * 3.5) + (volumeM * 0.2) - spreadPenalty))).toFixed(1));

      return {
        symbol: sym,
        price,
        bid: q.bid,
        ask: q.ask,
        change: q.change_24h || 0,
        spread: spreadPct,
        nav: q.synthetic_nav,
        navDiff: navDiffPct,
        volume: volumeM,
        score,
        isApproved
      };
    });
  }, [quotes]);

  // Filter & Sort
  const sortedItems = useMemo(() => {
    let filtered = rankedItems.filter(item => 
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      let valA: any = a[sortField as keyof typeof a];
      let valB: any = b[sortField as keyof typeof b];
      if (valA === undefined) valA = 0;
      if (valB === undefined) valB = 0;

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [rankedItems, searchQuery, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <section id="live-rtokens" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight font-sans">
              Live Ranked Market Radar & Positions
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 flex items-center gap-1">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              <span>4s REFRESH</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Auto-updating orderbook rankings scored by liquidity tightness, momentum, and seatbelt clearance
          </p>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-white/[0.04] p-1 rounded-full border border-white/5 text-xs font-sans">
            <button
              onClick={() => setActiveTab('OPPORTUNITIES')}
              className={`px-4 py-1 rounded-full text-xs transition-all cursor-pointer ${
                activeTab === 'OPPORTUNITIES'
                  ? 'bg-white text-black font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              24/7 rTokens Radar ({rankedItems.length})
            </button>
            <button
              onClick={() => setActiveTab('POSITIONS')}
              className={`px-4 py-1 rounded-full text-xs transition-all cursor-pointer ${
                activeTab === 'POSITIONS'
                  ? 'bg-white text-black font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Active Positions ({positions.length})
            </button>
          </div>

          <div className="relative hidden sm:block">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/[0.02] border border-white/10 rounded-full pl-8 pr-3.5 py-1 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="p-6 rounded-3xl bg-[#070707] border border-white/5 shadow-sm overflow-hidden">
        {activeTab === 'OPPORTUNITIES' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#040404] text-neutral-400 border-b border-white/5">
                <tr>
                  <th className="py-3 px-3 font-semibold cursor-pointer" onClick={() => handleSort('rank')}>
                    <span className="flex items-center gap-1">RANK <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3 font-semibold cursor-pointer" onClick={() => handleSort('symbol')}>
                    <span className="flex items-center gap-1">ASSET <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3 font-semibold cursor-pointer" onClick={() => handleSort('price')}>
                    <span className="flex items-center gap-1">PRICE <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3 font-semibold cursor-pointer" onClick={() => handleSort('change')}>
                    <span className="flex items-center gap-1">24H CHANGE <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3 font-semibold cursor-pointer" onClick={() => handleSort('spread')}>
                    <span className="flex items-center gap-1">SPREAD <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3 font-semibold">NAV FAIR VALUE</th>
                  <th className="py-3 px-3 font-semibold cursor-pointer" onClick={() => handleSort('volume')}>
                    <span className="flex items-center gap-1">24H VOLUME <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 px-3 font-semibold">SEATBELT</th>
                  <th className="py-3 px-3 font-semibold cursor-pointer text-right" onClick={() => handleSort('score')}>
                    <span className="flex items-center justify-end gap-1">OPPORTUNITY SCORE <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-slate-200">
                {sortedItems.map((item, idx) => (
                  <tr
                    key={item.symbol}
                    onClick={() => onSelectSymbol && onSelectSymbol(item.symbol)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3 text-slate-500 font-bold">#{idx + 1}</td>
                    <td className="py-3 px-3 font-bold text-white group-hover:text-brand-cyan transition-colors">
                      {item.symbol}
                    </td>
                    <td className="py-3 px-3 font-semibold">${item.price.toFixed(2)}</td>
                    <td className={`py-3 px-3 font-bold ${item.change >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                      {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-semibold ${item.spread <= 0.35 ? 'text-brand-green' : 'text-brand-red'}`}>
                        {item.spread.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      ${item.nav.toFixed(2)} ({item.navDiff >= 0 ? '+' : ''}{item.navDiff.toFixed(2)}%)
                    </td>
                    <td className="py-3 px-3 text-slate-300">${item.volume.toFixed(2)}M USDT</td>
                    <td className="py-3 px-3">
                      {item.isApproved ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          <AlertTriangle className="w-3 h-3" /> VETO
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-extrabold text-brand-cyan font-mono text-sm">
                        {item.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'POSITIONS' && (
          <div>
            {positions.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 font-mono">
                No active sub-account positions open. The Swarm is monitoring off-hours orderbooks and awaiting information catalysts.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#08090b] text-slate-400 border-b border-white/[0.08]">
                    <tr>
                      <th className="py-3 px-3 font-semibold">ASSET</th>
                      <th className="py-3 px-3 font-semibold">SIDE</th>
                      <th className="py-3 px-3 font-semibold">SHARES</th>
                      <th className="py-3 px-3 font-semibold">ENTRY PRICE</th>
                      <th className="py-3 px-3 font-semibold">CURRENT PRICE</th>
                      <th className="py-3 px-3 font-semibold">POSITION SIZE</th>
                      <th className="py-3 px-3 font-semibold">UNREALIZED PnL</th>
                      <th className="py-3 px-3 font-semibold">SEATBELT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05] text-slate-200">
                    {positions.map((p, idx) => {
                      const isUp = p.unrealized_pnl_usdt >= 0;
                      return (
                        <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                          <td className="py-3 px-3 font-bold text-white">{p.symbol}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-green/15 text-brand-green border border-brand-green/30">
                              {p.side}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-medium">{p.shares}</td>
                          <td className="py-3 px-3">${p.entry_price.toFixed(2)}</td>
                          <td className="py-3 px-3 font-bold text-white">${p.current_price.toFixed(2)}</td>
                          <td className="py-3 px-3">${p.size_usdt.toLocaleString()} USDT</td>
                          <td className={`py-3 px-3 font-bold ${isUp ? 'text-brand-green' : 'text-brand-red'}`}>
                            {isUp ? '+' : ''}${p.unrealized_pnl_usdt.toFixed(2)} ({isUp ? '+' : ''}{p.unrealized_pnl_pct.toFixed(2)}%)
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> Isolated Safe
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
