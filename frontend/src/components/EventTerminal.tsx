import React, { useState } from 'react';
import { Zap, Play, Send, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface EventTerminalProps {
  onEventProcessed: () => void;
}

export const EventTerminal: React.FC<EventTerminalProps> = ({ onEventProcessed }) => {
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<any | null>(null);

  const presets = [
    {
      id: 'evt_weekend_fed_cut',
      title: 'Fed Weekend Emergency Statement',
      category: 'Macro / Rate Cut',
      symbol: 'SPYUSDT',
      bias: 'Dovish (+2.8%)'
    },
    {
      id: 'evt_nvda_hyperscaler',
      title: 'Hyperscalers $80B GPU CapEx Expansion',
      category: 'Earnings / Tech',
      symbol: 'NVDAUSDT',
      bias: 'Strong Bullish (+4.5%)'
    },
    {
      id: 'evt_tsla_robotaxi',
      title: 'TSLA Commercial Autonomous FSD Approval',
      category: 'Disruptive Tech',
      symbol: 'TSLAUSDT',
      bias: 'Bullish (+5.2%)'
    },
    {
      id: 'evt_geopolitical_shock',
      title: 'Red Sea Shipping Supply Disruption',
      category: 'Geopolitical Shock',
      symbol: 'SPYUSDT',
      bias: 'Risk-Off (-2.1%)'
    }
  ];

  const handleTriggerPreset = async (presetId: string) => {
    setLoading(true);
    try {
      const res = await api.injectEvent({ event_id: presetId });
      setLastResult(res);
      onEventProcessed();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-bg-card border border-bg-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-bg-border">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-brand-cyan" />
          <h2 className="text-base font-bold text-white tracking-tight">Interactive 24/7 Event Simulation Terminal</h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Simulate overnight / weekend information shocks to test the Agent Swarm & Seatbelt
        </span>
      </div>

      {/* Preset Catalyst Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {presets.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-xl bg-bg-darkest border border-bg-border hover:border-brand-cyan/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>{p.category}</span>
                <span className="text-brand-teal font-semibold">{p.symbol}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-200 mb-2">{p.title}</h4>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-brand-cyan/10 text-brand-cyan mb-3">
                {p.bias}
              </span>
            </div>

            <button
              disabled={loading}
              onClick={() => handleTriggerPreset(p.id)}
              className="w-full py-2 px-3 rounded-lg bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan/25 transition-all text-xs font-mono font-medium flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>Inject Catalyst</span>
            </button>
          </div>
        ))}
      </div>

      {/* Execution Feedback Notification */}
      {lastResult && (
        <div className="p-4 rounded-xl bg-bg-darkest border border-brand-teal/40">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-brand-green font-bold flex items-center gap-1.5">
              <span>● Catalyst Processed Successfully:</span>
              <span className="text-white">{lastResult.triggered_event.title}</span>
            </span>
            <span className="text-slate-400">
              Risk Decision: <strong className={lastResult.execution_result.risk_report.approved ? 'text-brand-green' : 'text-brand-red'}>
                {lastResult.execution_result.risk_report.approved ? 'APPROVED & EXECUTED' : 'REJECTED BY RISK GATES'}
              </strong>
            </span>
          </div>

          <p className="text-xs text-slate-300 font-mono mb-2">
            {lastResult.deliberation.debate_summary}
          </p>

          {lastResult.execution_result.executed_order && (
            <div className="text-[11px] font-mono text-slate-400 bg-bg-card p-2 rounded border border-bg-border flex flex-wrap gap-4">
              <span>Order ID: <strong className="text-white">{lastResult.execution_result.executed_order.order_id}</strong></span>
              <span>Symbol: <strong className="text-brand-cyan">{lastResult.execution_result.executed_order.symbol}</strong></span>
              <span>Fill Price: <strong className="text-white">${lastResult.execution_result.executed_order.fill_price}</strong></span>
              <span>Size: <strong className="text-white">${lastResult.execution_result.executed_order.size_usdt} USDT</strong></span>
              <span>Slippage: <strong className="text-brand-green">{lastResult.execution_result.executed_order.slippage_pct}%</strong></span>
              <span>Risk Hash: <strong className="text-brand-teal">{lastResult.execution_result.executed_order.risk_hash}</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
