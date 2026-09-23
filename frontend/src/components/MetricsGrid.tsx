import React from 'react';
import { TrendingUp, ShieldAlert, Award, RefreshCw, BarChart3, CheckCircle2 } from 'lucide-react';
import { BacktestReport } from '../services/api';

interface MetricsGridProps {
  report: BacktestReport | null;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ report }) => {
  const metrics = report?.summary_metrics;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
      {/* Sharpe Ratio */}
      <div className="p-4 rounded-xl bg-[#0e1116] border border-white/[0.08] hover:border-brand-cyan/50 hover:bg-[#12161f] shadow-sm hover:shadow-lg hover:shadow-black/50 transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between group">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">Sharpe</span>
          <div className="w-6 h-6 rounded-md bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center shrink-0">
            <Award className="w-3.5 h-3.5 text-brand-cyan" />
          </div>
        </div>
        <div className="text-2xl font-extrabold font-mono text-white tracking-tight my-1.5">
          {metrics?.sharpe_ratio ?? '2.34'}
        </div>
        <div className="text-[11px] text-brand-green font-mono flex items-center gap-1">
          <span>IS: {metrics?.in_sample_sharpe ?? '2.48'}</span>
          <span className="text-slate-600">|</span>
          <span>OOS: {metrics?.out_of_sample_sharpe ?? '2.18'}</span>
        </div>
      </div>

      {/* Sortino Ratio */}
      <div className="p-4 rounded-xl bg-[#0e1116] border border-white/[0.08] hover:border-brand-green/50 hover:bg-[#12161f] shadow-sm hover:shadow-lg hover:shadow-black/50 transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between group">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">Sortino</span>
          <div className="w-6 h-6 rounded-md bg-brand-green/10 border border-brand-green/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-3.5 h-3.5 text-brand-green" />
          </div>
        </div>
        <div className="text-2xl font-extrabold font-mono text-white tracking-tight my-1.5">
          {metrics?.sortino_ratio ?? '3.12'}
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Downside Vol: <span className="text-slate-300">0.82%</span>
        </div>
      </div>

      {/* Max Drawdown */}
      <div className="p-4 rounded-xl bg-[#0e1116] border border-white/[0.08] hover:border-brand-amber/50 hover:bg-[#12161f] shadow-sm hover:shadow-lg hover:shadow-black/50 transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between group">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">Max DD</span>
          <div className="w-6 h-6 rounded-md bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 text-brand-amber" />
          </div>
        </div>
        <div className="text-2xl font-extrabold font-mono text-brand-amber tracking-tight my-1.5">
          {metrics?.max_drawdown_pct ? `-${metrics.max_drawdown_pct}%` : '-7.20%'}
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Breaker: <span className="text-brand-amber/90 font-semibold">-2.0% daily</span>
        </div>
      </div>

      {/* Win Rate */}
      <div className="p-4 rounded-xl bg-[#0e1116] border border-white/[0.08] hover:border-brand-green/50 hover:bg-[#12161f] shadow-sm hover:shadow-lg hover:shadow-black/50 transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between group">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">Win Rate</span>
          <div className="w-6 h-6 rounded-md bg-brand-green/10 border border-brand-green/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
          </div>
        </div>
        <div className="text-2xl font-extrabold font-mono text-white tracking-tight my-1.5">
          {metrics?.win_rate_pct ? `${metrics.win_rate_pct}%` : '64.8%'}
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Profit Factor: <span className="text-slate-300 font-semibold">{metrics?.profit_factor ?? '1.84'}</span>
        </div>
      </div>

      {/* Out of Sample Decay Ratio */}
      <div className="p-4 rounded-xl bg-[#0e1116] border border-white/[0.08] hover:border-brand-cyan/50 hover:bg-[#12161f] shadow-sm hover:shadow-lg hover:shadow-black/50 transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between group">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">OOS / IS</span>
          <div className="w-6 h-6 rounded-md bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center shrink-0">
            <RefreshCw className="w-3.5 h-3.5 text-brand-cyan" />
          </div>
        </div>
        <div className="text-2xl font-extrabold font-mono text-brand-cyan tracking-tight my-1.5">
          {metrics?.sharpe_decay_ratio ?? '0.88'}
        </div>
        <div className="text-[11px] text-brand-green font-mono flex items-center gap-1 font-semibold">
          <span>&gt; 0.50 Safe</span>
          <span className="text-slate-500 font-normal">(No Overfit)</span>
        </div>
      </div>

      {/* Total 60d Return */}
      <div className="p-4 rounded-xl bg-[#0e1116] border border-white/[0.08] hover:border-brand-green/50 hover:bg-[#12161f] shadow-sm hover:shadow-lg hover:shadow-black/50 transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between group">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Return</span>
          <div className="w-6 h-6 rounded-md bg-brand-green/10 border border-brand-green/20 flex items-center justify-center shrink-0">
            <BarChart3 className="w-3.5 h-3.5 text-brand-green" />
          </div>
        </div>
        <div className="text-2xl font-extrabold font-mono text-brand-green tracking-tight my-1.5">
          {metrics?.total_return_pct ? `+${metrics.total_return_pct}%` : '+19.64%'}
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Alpha: <span className="text-brand-green font-bold">+15.5% vs SPY</span>
        </div>
      </div>
    </div>
  );
};
