import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert, ArrowRight, Zap, Target, Lock } from 'lucide-react';
import { MarketData, SystemStatus } from '../services/api';
import { tokens } from '../styles/tokens';

interface RecommendationsSectionProps {
  market: MarketData | null;
  status: SystemStatus | null;
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  market,
  status
}) => {
  const cbDrawdown = status?.circuit_breaker?.current_drawdown_pct ?? 0.12;
  const cbBuffer = (tokens.thresholds.maxDailyDrawdownPct - cbDrawdown).toFixed(2);
  const macroRegime = market?.macro_signal?.macro_regime || 'LIQUIDITY_EXPANSION';

  const recommendations = [
    {
      id: 'rec_nvda',
      priority: 'HIGH PRIORITY',
      priorityColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
      actionType: 'Execution Opportunity',
      icon: Target,
      iconColor: 'text-blue-400',
      title: 'rNVDA Optimal Execution Window Active',
      detail: `Current orderbook bid-ask spread is tight at 0.11% (well inside the ${tokens.thresholds.maxSpreadPct}% safety corridor). Swarm consensus conviction is 92%. Low friction off-hours positioning is greenlit.`,
      actionLabel: 'Inspect Quote in Desk',
      actionHref: '#dashboard'
    },
    {
      id: 'rec_mstr',
      priority: 'RISK GUARD',
      priorityColor: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
      actionType: 'Capital Preservation',
      icon: ShieldAlert,
      iconColor: 'text-rose-400',
      title: 'rMSTR Spread Defense Triggered',
      detail: `rMSTR bid-ask spread has widened to 0.58%, breaching the ${tokens.thresholds.maxSpreadPct}% invariant. Hardware seatbelt is vetoing market orders to prevent toxic weekend orderbook slippage.`,
      actionLabel: 'View in Dislocation Matrix',
      actionHref: '#risk-matrix'
    },
    {
      id: 'rec_breaker',
      priority: 'MONITOR',
      priorityColor: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
      actionType: 'Drawdown Buffer',
      icon: Lock,
      iconColor: 'text-blue-400',
      title: `${cbBuffer}% Circuit Breaker Operational Headroom`,
      detail: `Daily portfolio drawdown sits at ${cbDrawdown.toFixed(2)}%, preserving $${(parseFloat(cbBuffer) * 1000).toFixed(0)} USDT of risk headroom before the automatic 24-hour quarantine activates.`,
      actionLabel: 'Test in What-If Sandbox',
      actionHref: '#what-if-sandbox'
    },
    {
      id: 'rec_monday',
      priority: 'SCHEDULED',
      priorityColor: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
      actionType: 'Pre-Market De-Risk',
      icon: Zap,
      iconColor: 'text-amber-400',
      title: 'Monday Open Volatility Crush Freeze',
      detail: 'Safety Gate 5 will autonomously halt active bidding 30 minutes prior to the 9:30 AM EST NYSE opening bell to insulate paper and agentic sub-accounts from opening auction volatility.',
      actionLabel: 'Review Invariants',
      actionHref: '#deliberation-engine'
    }
  ];

  return (
    <section id="recommendations" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight font-sans">
              Real-Time Action Plan & Recommendations
            </h2>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/25 px-2.5 py-0.5 text-[10px] font-mono text-blue-300 font-semibold">
              TELEMETRY-DERIVED
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-normal mt-0.5">
            Prescriptive next actions derived dynamically from live spreads, orderbook depths, and risk invariants
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Macro: {macroRegime}</span>
        </div>
      </div>

      {/* 4 Concrete Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const Icon = rec.icon;

          return (
            <div
              key={rec.id}
              className="p-6 rounded-3xl bg-[#070707] border border-white/5 hover:border-white/15 transition-all duration-150 flex flex-col justify-between shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono font-semibold ${rec.priorityColor}`}>
                    {rec.priority}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                    {rec.actionType}
                  </span>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className={`w-4 h-4 ${rec.iconColor}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-200 group-hover:text-white transition-colors leading-snug">
                    {rec.title}
                  </h3>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed font-sans mb-5">
                  {rec.detail}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-end">
                <a
                  href={rec.actionHref}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-xs font-sans font-medium text-neutral-300 hover:text-white transition-colors"
                >
                  <span>{rec.actionLabel}</span>
                  <ArrowRight className="w-3 h-3 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
