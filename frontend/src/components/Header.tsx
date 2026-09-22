import React from 'react';
import { ShieldCheck, Activity, AlertTriangle, Zap, Server } from 'lucide-react';
import { SystemStatus } from '../services/api';

interface HeaderProps {
  status: SystemStatus | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ status, activeTab, setActiveTab }) => {
  const equity = status?.account.total_equity_usdt ?? 100000;
  const initial = 100000;
  const pnl = equity - initial;
  const pnlPct = (pnl / initial) * 100;
  const isPositive = pnl >= 0;

  return (
    <header className="border-b border-bg-border bg-bg-card/90 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-teal to-brand-cyan flex items-center justify-center shadow-lg shadow-brand-cyan/20">
            <ShieldCheck className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">AEGIS<span className="text-brand-cyan">24</span></span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
                BITGET S2
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Autonomous 24/7 rToken Agentic Desk</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-bg-darkest p-1 rounded-xl border border-bg-border text-xs font-medium">
          {[
            { id: 'desk', label: '24/7 Agent Desk' },
            { id: 'debate', label: 'Agent Debate Swarm' },
            { id: 'risk', label: 'Safety Harness ("Seatbelt")' },
            { id: 'backtest', label: '60d Backtest & Out-of-Sample' },
            { id: 'paper', label: 'Audit Logs' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-bg-hover'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Live Metrics & Bitget Account Badge */}
        <div className="flex items-center gap-4">
          {/* Circuit Breaker Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-bg-darkest border border-bg-border">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
            </span>
            <span className="text-xs font-mono text-slate-300">
              {status?.circuit_breaker.status === 'NORMAL' ? 'SEATBELT ARMED' : 'CIRCUIT TRIPPED'}
            </span>
          </div>

          {/* Equity & PnL */}
          <div className="text-right">
            <div className="text-xs text-slate-400 font-mono flex items-center justify-end gap-1">
              <span>Agentic AUM:</span>
              <span className="text-white font-semibold">${equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={`text-xs font-mono font-medium ${isPositive ? 'text-brand-green' : 'text-brand-red'}`}>
              {isPositive ? '+' : ''}{pnl.toFixed(2)} USDT ({isPositive ? '+' : ''}{pnlPct.toFixed(2)}%)
            </div>
          </div>

          {/* Agentic Account UID tag */}
          <div className="hidden lg:flex flex-col text-right text-[11px] font-mono text-slate-400 border-l border-bg-border pl-4">
            <span className="text-brand-teal font-medium">Bitget OAuth Sub-Account</span>
            <span className="text-slate-300">{status?.account.account_uid || 'DEMO_AGENTIC_SUB_88921'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
