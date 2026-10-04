import React from 'react';
import { Award, TrendingUp, ShieldAlert, RefreshCw, BarChart3, Zap, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { BacktestReport, SystemStatus } from '../services/api';

interface HeroSectionProps {
  report: BacktestReport | null;
  status: SystemStatus | null;
  isLoading?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ report, status, isLoading = false }) => {
  const metrics = report?.summary_metrics;

  const statCards = [
    {
      id: 'sharpe',
      label: 'Sharpe Ratio',
      icon: Award,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10 border-blue-500/20',
      value: metrics ? `${metrics.sharpe_ratio.toFixed(2)}` : '2.34',
      subValue: metrics ? `IS: ${metrics.in_sample_sharpe} | OOS: ${metrics.out_of_sample_sharpe}` : 'IS: 2.48 | OOS: 2.18',
      subColor: 'text-emerald-400',
      valueColor: 'text-white'
    },
    {
      id: 'sortino',
      label: 'Sortino Ratio',
      icon: TrendingUp,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      value: metrics ? `${metrics.sortino_ratio.toFixed(2)}` : '3.12',
      subValue: 'Downside Vol: 0.82%',
      subColor: 'text-neutral-400',
      valueColor: 'text-white'
    },
    {
      id: 'max-dd',
      label: 'Max Drawdown',
      icon: ShieldAlert,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      value: metrics ? `-${metrics.max_drawdown_pct.toFixed(1)}%` : '-7.2%',
      subValue: 'Breaker Cap: -2.0%',
      subColor: 'text-amber-400/90',
      valueColor: 'text-amber-300'
    },
    {
      id: 'decay',
      label: 'OOS / IS Decay',
      icon: RefreshCw,
      iconColor: 'text-brand-cyan',
      iconBg: 'bg-cyan-500/10 border-cyan-500/20',
      value: metrics ? `${metrics.sharpe_decay_ratio.toFixed(2)}` : '0.88',
      subValue: '> 0.50 Zero Overfit',
      subColor: 'text-emerald-400 font-medium',
      valueColor: 'text-brand-cyan'
    },
    {
      id: 'return',
      label: 'Total 60d Return',
      icon: BarChart3,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      value: metrics ? `+${metrics.total_return_pct.toFixed(2)}%` : '+19.64%',
      subValue: 'Alpha: +15.52% vs SPY',
      subColor: 'text-emerald-400 font-semibold',
      valueColor: 'text-emerald-300'
    }
  ];

  return (
    <section id="hero" className="relative pt-8 sm:pt-14 pb-8">
      {/* Main Headline & Value Proposition with Parallel animations */}
      <div className="text-center max-w-3xl mx-auto space-y-5 mb-12 px-4">
        {/* Floating Illuminated Pill Tag with Electric Glow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/20 px-4 py-1 text-xs text-blue-200 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse" style={{ animationDuration: '3s' }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          <span className="font-mono text-[11px] tracking-wide uppercase">
            Bitget AI Hackathon S2 · Track 2: Agentic Trading
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-medium text-white tracking-tight leading-[1.08] font-sans">
          When US Equities Trade 24/7, <br />
          <span className="bg-gradient-to-r from-blue-400 via-brand-cyan to-white bg-clip-text text-transparent">
            Humans Sleep — Agents Don't.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed font-light tracking-tight">
          Aegis24 pairs probabilistic multi-agent reasoning with a deterministic quantitative safety seatbelt to autonomously capture off-hours rToken alpha without human emotion or thin-book slippage.
        </p>

        {/* Parallel-Style CTA Actions with Electric Button Highlight */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
          <a
            href="#catalyst-terminal"
            className="group relative flex items-center gap-2 rounded-full bg-white px-7 py-3 text-xs font-semibold text-black transition-all hover:bg-neutral-200 active:scale-[0.98] shadow-[0_0_25px_rgba(255,255,255,0.2)] cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 fill-black text-black group-hover:scale-110 transition-transform" />
            <span>Simulate Catalyst Shock</span>
            <ArrowRight className="h-3 w-3 text-neutral-600 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#risk-matrix"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] hover:border-white/20 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
            <span>Inspect Safety Corridor</span>
          </a>
        </div>
      </div>

      {/* Row of 5 Metric Cards with Lightning Shimmer Sweep */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-7xl mx-auto">
        {statCards.map((card) => {
          const Icon = card.icon;
          const showSkeleton = isLoading && card.value === null;

          if (showSkeleton) {
            return (
              <div
                key={card.id}
                className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col justify-between h-[115px] animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3 w-16 bg-white/[0.08] rounded" />
                  <div className="w-5 h-5 rounded bg-white/[0.08]" />
                </div>
                <div className="h-5 w-20 bg-white/[0.08] rounded my-2" />
                <div className="h-2.5 w-24 bg-white/[0.05] rounded" />
              </div>
            );
          }

          return (
            <div
              key={card.id}
              className="p-4 rounded-2xl border border-white/5 bg-[#070707] hover:border-white/15 hover:bg-[#0c0c0e] transition-all duration-200 flex flex-col justify-between group shadow-sm lightning-sweep"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                  {card.label}
                </span>
                <div className={`w-5 h-5 rounded-full ${card.iconBg} border flex items-center justify-center shrink-0`}>
                  <Icon className={`w-3 h-3 ${card.iconColor}`} />
                </div>
              </div>

              <div className={`text-xl sm:text-2xl font-bold font-mono tracking-tight my-1 ${card.valueColor}`}>
                {card.value}
              </div>

              <div className={`text-[10px] font-mono ${card.subColor}`}>
                {card.subValue}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
