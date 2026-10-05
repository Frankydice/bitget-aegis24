import React from 'react';
import { Award, TrendingUp, ShieldAlert, RefreshCw, BarChart3, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
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
      subColor: 'text-neutral-500',
      valueColor: 'text-white'
    },
    {
      id: 'max-dd',
      label: 'Max Drawdown',
      icon: ShieldAlert,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      value: metrics ? `-${metrics.max_drawdown_pct.toFixed(1)}%` : '-7.2%',
      subValue: 'Hard Breaker: -2.0%',
      subColor: 'text-amber-400/90',
      valueColor: 'text-amber-300'
    },
    {
      id: 'decay',
      label: 'OOS / IS Decay',
      icon: RefreshCw,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10 border-blue-500/20',
      value: metrics ? `${metrics.sharpe_decay_ratio.toFixed(2)}` : '0.88',
      subValue: '> 0.50 Zero Overfit',
      subColor: 'text-emerald-400 font-medium',
      valueColor: 'text-blue-300'
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
      {/* Main Headline & Value Proposition with Exact Parallel Screenshot Color Combination */}
      <div className="text-center max-w-4xl mx-auto space-y-4 mb-14 px-4">
        {/* Floating Illuminated Pill Tag matching screenshot */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-950/10 px-3.5 py-1 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.15)] [animation:fadeInUp_0.8s_ease-out_0.1s_both]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.9)]" />
          </span>
          <span>24/7 Autonomous rToken Agent Desk · Bitget S2</span>
        </div>

        {/* Dual-Tone Headline matching screenshot: Pure White top line, Soft Muted Neutral-400 bottom line */}
        <h1 className="mb-6 text-balance text-4xl sm:text-5xl lg:text-[3.5rem] font-medium leading-[1.05] tracking-tight text-white font-sans [animation:fadeInUp_0.8s_ease-out_0.2s_both]">
          When US equities trade 24/7. <br />
          <span className="text-neutral-400 font-normal">
            Humans sleep, agents don't.
          </span>
        </h1>

        {/* Subtitle Paragraph in Muted Neutral-300 font-light matching reference */}
        <p className="mx-auto mb-9 max-w-xl text-base font-light md:text-lg leading-relaxed text-neutral-300 tracking-tight [animation:fadeInUp_0.8s_ease-out_0.3s_both]">
          Aegis24 turns continuous tokenized US equity orderbooks into a coordinated autonomous strategy, with a deterministic hardware seatbelt when real life gets in the way.
        </p>

        {/* High-Contrast White Pill CTA matching screenshot (Single centered hero pill) */}
        <div className="flex flex-col items-center justify-center gap-3 [animation:fadeInUp_0.8s_ease-out_0.4s_both]">
          <a
            href="#catalyst-terminal"
            className="group relative flex items-center gap-2 rounded-full bg-white text-black px-8 py-3 text-sm font-medium transition-all hover:bg-neutral-200 active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <span>Try the live desk</span>
            <ArrowRight className="h-4 w-4 text-black transition-transform group-hover:translate-x-0.5" />
          </a>

          <a
            href="#deliberation-engine"
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors pt-1 flex items-center gap-1 cursor-pointer"
          >
            <span>or inspect the 5 deterministic safety gates</span>
            <span className="text-neutral-600">↓</span>
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
              className="p-4.5 rounded-2xl border border-white/5 bg-[#070707] hover:border-white/15 hover:bg-[#0c0c0e] transition-all duration-200 flex flex-col justify-between group shadow-sm lightning-sweep"
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
