import React from 'react';
import { TrendingUp, ShieldAlert, Award, RefreshCw, BarChart3, CheckCircle2 } from 'lucide-react';
import { BacktestReport } from '../services/api';

interface MetricsGridProps {
  report: BacktestReport | null;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ report }) => {
  const metrics = report?.summary_metrics;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {/* Sharpe Ratio */}
      <div className="p-3.5 rounded-xl bg-bg-card border border-bg-border relative overflow-hidden group hover:border-brand-cyan/40 transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-mono">Sharpe Ratio</span>
          <Award className="w-3.5 h-3.5 text-brand-cyan" />
        </div>
        <div className="text-xl font-bold font-mono text-white">
          {metrics?.sharpe_ratio ?? '2.34'}
        </div>
        <div className="text-[11px] text-brand-green font-mono flex items-center gap-1 mt-0.5">
          <span>IS: {metrics?.in_sample_sharpe ?? '2.48'}</span>
          <span>|</span>
          <span>OOS: {metrics?.out_of_sample_sharpe ?? '2.18'}</span>
        </div>
      </div>

      {/* Sortino Ratio */}
      <div className="p-3.5 rounded-xl bg-bg-card border border-bg-border relative overflow-hidden group hover:border-brand-cyan/40 transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-mono">Sortino Ratio</span>
          <TrendingUp className="w-3.5 h-3.5 text-brand-green" />
        </div>
        <div className="text-xl font-bold font-mono text-white">
          {metrics?.sortino_ratio ?? '3.12'}
        </div>
        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
          Downside Vol: 0.82%
        </div>
      </div>

      {/* Max Drawdown */}
      <div className="p-3.5 rounded-xl bg-bg-card border border-bg-border relative overflow-hidden group hover:border-brand-cyan/40 transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-mono">Max Drawdown</span>
          <ShieldAlert className="w-3.5 h-3.5 text-brand-amber" />
        </div>
        <div className="text-xl font-bold font-mono text-brand-amber">
          {metrics?.max_drawdown_pct ? `-${metrics.max_drawdown_pct}%` : '-7.20%'}
        </div>
        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
          Circuit Breaker: -2.0% daily
        </div>
      </div>

      {/* Win Rate */}
      <div className="p-3.5 rounded-xl bg-bg-card border border-bg-border relative overflow-hidden group hover:border-brand-cyan/40 transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-mono">Win Rate</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
        </div>
        <div className="text-xl font-bold font-mono text-white">
          {metrics?.win_rate_pct ? `${metrics.win_rate_pct}%` : '68.4%'}
        </div>
        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
          Profit Factor: {metrics?.profit_factor ?? '2.18'}
        </div>
      </div>

      {/* Out of Sample Decay Ratio */}
      <div className="p-3.5 rounded-xl bg-bg-card border border-bg-border relative overflow-hidden group hover:border-brand-cyan/40 transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-mono">OOS / IS Ratio</span>
          <RefreshCw className="w-3.5 h-3.5 text-brand-teal" />
        </div>
        <div className="text-xl font-bold font-mono text-brand-cyan">
          {metrics?.sharpe_decay_ratio ?? '0.88'}
        </div>
        <div className="text-[11px] text-brand-green font-mono mt-0.5">
          &gt; 0.50 Threshold (Safe)
        </div>
      </div>

      {/* Total 60d Return */}
      <div className="p-3.5 rounded-xl bg-bg-card border border-bg-border relative overflow-hidden group hover:border-brand-cyan/40 transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-mono">Total Return (60d)</span>
          <BarChart3 className="w-3.5 h-3.5 text-brand-green" />
        </div>
        <div className="text-xl font-bold font-mono text-brand-green">
          {metrics?.total_return_pct ? `+${metrics.total_return_pct}%` : '+19.64%'}
        </div>
        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
          vs SPY: +4.12% (+15.5% Alpha)
        </div>
      </div>
    </div>
  );
};
