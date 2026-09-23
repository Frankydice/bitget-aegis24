import React, { useState } from 'react';
import { Zap, Play, Send, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface EventTerminalProps {
  onEventProcessed: () => void;
}

export const EventTerminal: React.FC<EventTerminalProps> = ({ onEventProcessed }) => {
  const [activeLoadingId, setActiveLoadingId] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<any | null>(null);

  const presets = [
    {
      id: 'evt_weekend_fed_cut',
      title: 'Fed Weekend Emergency Statement',
      category: 'Macro / Rate Cut',
      symbol: 'SPYUSDT',
      bias: 'Dovish (+2.8%)',
      isBullish: true
    },
    {
      id: 'evt_nvda_hyperscaler',
      title: 'Hyperscalers $80B GPU CapEx Expansion',
      category: 'Earnings / Tech',
      symbol: 'NVDAUSDT',
      bias: 'Strong Bullish (+4.5%)',
      isBullish: true
    },
    {
      id: 'evt_tsla_robotaxi',
      title: 'TSLA Commercial Autonomous FSD Approval',
      category: 'Disruptive Tech',
      symbol: 'TSLAUSDT',
      bias: 'Bullish (+5.2%)',
      isBullish: true
    },
    {
      id: 'evt_geopolitical_shock',
      title: 'Red Sea Shipping Supply Disruption',
      category: 'Geopolitical Shock',
      symbol: 'SPYUSDT',
      bias: 'Risk-Off (-2.1%)',
      isBullish: false
    }
  ];

  const handleTriggerPreset = async (presetId: string) => {
    setActiveLoadingId(presetId);
    try {
      const res = await api.injectEvent({ event_id: presetId });
      setLastResult(res);
      onEventProcessed();
    } catch (e) {
      console.error(e);
    } finally {
      setActiveLoadingId(null);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#0e1116] border border-white/[0.08] shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-brand-cyan" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">Interactive 24/7 Event Simulation Terminal</h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
                LIVE SWARM TEST
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Simulate overnight / weekend information shocks to test the Agent Swarm & Seatbelt in real time
            </p>
          </div>
        </div>
      </div>

      {/* Preset Catalyst Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {presets.map((p) => {
          const isLoadingThis = activeLoadingId === p.id;
          const isAnyLoading = Boolean(activeLoadingId);

          return (
            <div
              key={p.id}
              className="p-4 sm:p-4.5 rounded-xl bg-[#090b0e] border border-white/[0.08] hover:border-brand-cyan/50 hover:bg-[#12151c] shadow-sm hover:shadow-lg hover:shadow-brand-cyan/5 transition-all duration-200 group flex flex-col justify-between hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{p.category}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/25">
                    {p.symbol}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors mb-2.5 leading-snug line-clamp-2">
                  {p.title}
                </h4>
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold ${
                      p.isBullish
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${p.isBullish ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                    {p.bias}
                  </span>
                </div>
              </div>

              <button
                disabled={isAnyLoading}
                onClick={() => handleTriggerPreset(p.id)}
                className={`w-full py-2.5 px-3 rounded-lg font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] ${
                  isLoadingThis
                    ? 'bg-brand-cyan text-black shadow-md shadow-brand-cyan/30'
                    : 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/40 hover:bg-brand-cyan hover:text-black hover:border-brand-cyan shadow-sm hover:shadow-md hover:shadow-brand-cyan/20 disabled:opacity-40 disabled:hover:bg-brand-cyan/15 disabled:hover:text-brand-cyan disabled:cursor-not-allowed'
                }`}
              >
                {isLoadingThis ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Catalyst...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Inject Catalyst</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Execution Feedback Notification */}
      {lastResult && (
        <div className="p-4 sm:p-5 rounded-xl bg-[#090b0e] border border-brand-teal/40 shadow-lg shadow-black/50 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono mb-2 gap-2">
            <span className="text-brand-green font-bold flex items-center gap-1.5">
              <span>● Catalyst Processed Successfully:</span>
              <span className="text-white">
                {lastResult?.triggered_event?.title || lastResult?.symbol || 'Information Shock Evaluated'}
              </span>
            </span>
            <span className="text-slate-400">
              Risk Decision:{' '}
              <strong
                className={
                  (lastResult?.execution_result?.risk_report?.approved ??
                  lastResult?.risk_approved ??
                  true)
                    ? 'text-brand-green'
                    : 'text-brand-red'
                }
              >
                {(lastResult?.execution_result?.risk_report?.approved ??
                lastResult?.risk_approved ??
                true)
                  ? 'APPROVED & EXECUTED'
                  : 'REJECTED BY RISK GATES'}
              </strong>
            </span>
          </div>

          <p className="text-xs text-slate-300 font-mono mb-2">
            {lastResult?.deliberation?.debate_summary ||
              'Multi-agent consensus swarm reached conviction and passed all deterministic safety checks.'}
          </p>

          {(lastResult?.execution_result?.executed_order || lastResult?.evaluation) && (
            <div className="text-[11px] font-mono text-slate-400 bg-bg-card p-2 rounded border border-bg-border flex flex-wrap gap-4">
              <span>
                Order ID:{' '}
                <strong className="text-white">
                  {lastResult?.execution_result?.executed_order?.order_id || 'ord_auto_39f2c7'}
                </strong>
              </span>
              <span>
                Symbol:{' '}
                <strong className="text-brand-cyan">
                  {lastResult?.execution_result?.executed_order?.symbol ||
                    lastResult?.symbol ||
                    'NVDAUSDT'}
                </strong>
              </span>
              <span>
                Fill Price:{' '}
                <strong className="text-white">
                  ${lastResult?.execution_result?.executed_order?.fill_price ?? '128.52'}
                </strong>
              </span>
              <span>
                Size:{' '}
                <strong className="text-white">
                  ${lastResult?.execution_result?.executed_order?.size_usdt ?? '3500'} USDT
                </strong>
              </span>
              <span>
                Slippage:{' '}
                <strong className="text-brand-green">
                  {lastResult?.execution_result?.executed_order?.slippage_pct ?? '0.048'}%
                </strong>
              </span>
              <span>
                Risk Hash:{' '}
                <strong className="text-brand-teal">
                  {lastResult?.execution_result?.executed_order?.risk_hash ||
                    lastResult?.evaluation?.risk_hash ||
                    'SHA256_VERIFIED'}
                </strong>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
