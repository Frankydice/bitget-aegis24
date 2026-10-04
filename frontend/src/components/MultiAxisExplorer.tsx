import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { Layers, Clock, TrendingUp, BarChart3, Activity } from 'lucide-react';
import { MarketData } from '../services/api';
import { tokens } from '../styles/tokens';

interface MultiAxisExplorerProps {
  market: MarketData | null;
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

type ViewMode = 'PRICE_NAV' | 'SPREAD_CORRIDOR' | 'LIQUIDITY_DEPTH';
type TimeRange = '1H' | '4H' | '24H' | '7D' | '30D';

export const MultiAxisExplorer: React.FC<MultiAxisExplorerProps> = ({
  market,
  selectedSymbol,
  onSelectSymbol
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('PRICE_NAV');
  const [timeRange, setTimeRange] = useState<TimeRange>('24H');

  const symbols = ['NVDAUSDT', 'TSLAUSDT', 'AAPLUSDT', 'COINUSDT', 'MSTRUSDT', 'SPYUSDT'];
  const activeQuote = (market?.rtokens && market.rtokens[selectedSymbol]) || {
    price: 128.45,
    bid: 128.38,
    ask: 128.52,
    synthetic_nav: 128.40,
    volume_24h: 482910
  };

  // Generate deterministic synthetic time-series data grounded on the live active quote
  const chartData = useMemo(() => {
    const pointsCount = timeRange === '1H' ? 12 : timeRange === '4H' ? 16 : timeRange === '24H' ? 24 : timeRange === '7D' ? 28 : 30;
    const basePrice = activeQuote.price;
    const baseNav = activeQuote.synthetic_nav;
    const baseSpread = ((activeQuote.ask - activeQuote.bid) / basePrice) * 100;
    const baseVolume = (activeQuote.volume_24h * basePrice) / 1_000_000;

    return Array.from({ length: pointsCount }, (_, i) => {
      const progress = i / (pointsCount - 1);
      const wave = Math.sin(progress * Math.PI * 3);
      const noise = ((i * 17) % 7 - 3) * 0.15;
      
      const price = Number((basePrice * (0.97 + (wave * 0.03) + (noise * 0.01))).toFixed(2));
      const nav = Number((baseNav * (0.97 + (wave * 0.029))).toFixed(2));
      const spread = Number(Math.max(0.06, baseSpread + (Math.sin(i * 1.5) * 0.08) + 0.02).toFixed(2));
      const volume = Number((baseVolume * (0.7 + Math.abs(wave) * 0.5)).toFixed(2));

      let label = `T-${pointsCount - i}`;
      if (timeRange === '24H') label = `${i}:00 UTC`;
      else if (timeRange === '7D') label = `Day ${Math.floor(i / 4) + 1}`;
      else if (timeRange === '30D') label = `D${i + 1}`;

      return {
        label,
        price,
        nav,
        spread,
        volume,
        ceiling: tokens.thresholds.maxSpreadPct
      };
    });
  }, [selectedSymbol, viewMode, timeRange, activeQuote]);

  return (
    <section id="multi-axis-explorer" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight font-sans">
              Deep-Dive Multi-Axis Explorer
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
              INTERACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Cross-examine synthetic rToken pricing, orderbook spread corridors, and liquidity depth across timeframes
          </p>
        </div>

        {/* Desktop & Mobile Responsive Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mobile Selectors (Visible on small screens) */}
          <div className="sm:hidden flex items-center gap-2 w-full">
            <select
              value={selectedSymbol}
              onChange={(e) => onSelectSymbol(e.target.value)}
              className="flex-1 bg-[#0e1116] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
            >
              {symbols.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
              className="flex-1 bg-[#0e1116] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs font-mono text-brand-cyan"
            >
              <option value="PRICE_NAV">Price vs NAV</option>
              <option value="SPREAD_CORRIDOR">Spread Corridor</option>
              <option value="LIQUIDITY_DEPTH">Liquidity Depth</option>
            </select>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="bg-[#0e1116] border border-white/[0.1] rounded-lg px-2 py-1.5 text-xs font-mono text-slate-300"
            >
              {(['1H', '4H', '24H', '7D', '30D'] as TimeRange[]).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Desktop Metric Mode Toggle Group */}
          <div className="hidden sm:flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/5 text-xs font-sans">
            {[
              { id: 'PRICE_NAV', label: 'Price vs NAV', icon: TrendingUp },
              { id: 'SPREAD_CORRIDOR', label: 'Spread Corridor', icon: Activity },
              { id: 'LIQUIDITY_DEPTH', label: 'Volume Depth', icon: BarChart3 }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id as ViewMode)}
                  className={`px-3.5 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-semibold shadow-xs'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Timeframe Toggle Group */}
          <div className="hidden sm:flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/5 text-xs font-mono">
            {(['1H', '4H', '24H', '7D', '30D'] as TimeRange[]).map(t => {
              const isActive = timeRange === t;
              return (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-500 text-white font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="p-6 rounded-3xl bg-[#070707] border border-white/5 shadow-sm">
        {/* Chart Context Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/[0.06] text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-sm">{selectedSymbol}</span>
            <span className="text-slate-400">·</span>
            <span className="text-brand-cyan">
              {viewMode === 'PRICE_NAV' && '24/7 Price Action vs Synthetic Fair Value NAV'}
              {viewMode === 'SPREAD_CORRIDOR' && 'Bid-Ask Spread % vs Hardware Seatbelt Ceiling (0.35%)'}
              {viewMode === 'LIQUIDITY_DEPTH' && 'Synthetic Orderbook Volume Trajectory ($M USDT)'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            {viewMode === 'PRICE_NAV' && (
              <>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-brand-cyan"></span> rToken Price
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-brand-teal"></span> Synthetic NAV
                </span>
              </>
            )}
            {viewMode === 'SPREAD_CORRIDOR' && (
              <>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-brand-green"></span> Live Spread
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-brand-red"></span> Max Limit (0.35%)
                </span>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Recharts Canvas */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={tokens.colors.brand.cyan} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={tokens.colors.brand.cyan} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="spreadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={tokens.colors.brand.green} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={tokens.colors.brand.green} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e232d" />
              <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              
              {viewMode === 'PRICE_NAV' && (
                <>
                  <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0e1116', borderColor: '#1e232d', borderRadius: 8, fontSize: 11 }}
                    formatter={(val: number) => [`$${val.toFixed(2)}`, '']}
                  />
                  <Area type="monotone" dataKey="price" stroke={tokens.colors.brand.cyan} strokeWidth={2} fillOpacity={1} fill="url(#priceGradient)" />
                  <Line type="monotone" dataKey="nav" stroke={tokens.colors.brand.teal} strokeDasharray="4 4" strokeWidth={2} dot={false} />
                </>
              )}

              {viewMode === 'SPREAD_CORRIDOR' && (
                <>
                  <YAxis domain={[0, 0.6]} stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0e1116', borderColor: '#1e232d', borderRadius: 8, fontSize: 11 }}
                    formatter={(val: number) => [`${val.toFixed(2)}%`, 'Spread']}
                  />
                  <ReferenceLine y={0.35} stroke={tokens.colors.brand.red} strokeDasharray="3 3" label={{ value: 'Seatbelt Limit 0.35%', fill: '#f7647e', fontSize: 10 }} />
                  <Area type="monotone" dataKey="spread" stroke={tokens.colors.brand.green} strokeWidth={2} fillOpacity={1} fill="url(#spreadGradient)" />
                </>
              )}

              {viewMode === 'LIQUIDITY_DEPTH' && (
                <>
                  <YAxis stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0e1116', borderColor: '#1e232d', borderRadius: 8, fontSize: 11 }}
                    formatter={(val: number) => [`$${val.toFixed(2)}M USDT`, '24h Volume']}
                  />
                  <Bar dataKey="volume" fill={tokens.colors.brand.cyan} radius={[4, 4, 0, 0]} />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};
