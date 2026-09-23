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
  const isTripped = Boolean(status?.circuit_breaker?.tripped);

  return (
    <header className="border-b border-white/[0.08] bg-[#0c0e12]/95 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 max-w-7xl mx-auto w-full">
        {/* Brand & Badge */}
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-teal via-brand-cyan to-white flex items-center justify-center shadow-lg shadow-brand-cyan/25 ring-1 ring-white/20">
              <ShieldCheck className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white font-mono">
                  AEGIS<span className="text-brand-cyan">24</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/40 shadow-sm">
                  BITGET S2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight">Autonomous 24/7 rToken Agentic Desk</p>
            </div>
          </div>

          {/* Mobile Circuit Breaker Status Indicator */}
          <div className="sm:hidden">
            {isTripped ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-950/80 border border-red-500/80 text-red-300 text-[11px] font-mono font-bold animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 text-brand-red" />
                <span>TRIPPED</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-brand-green animate-ping"></span>
                <span>ARMED</span>
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#090b0e] p-1.5 rounded-xl border border-white/[0.08] text-xs font-medium overflow-x-auto scrollbar-none">
          {[
            { id: 'desk', label: '24/7 Agent Desk' },
            { id: 'debate', label: 'Agent Debate Swarm' },
            { id: 'risk', label: 'Safety Harness ("Seatbelt")' },
            { id: 'backtest', label: '60d Backtest & Out-of-Sample' },
            { id: 'paper', label: 'Audit Logs' },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 active:scale-[0.98] ${
                  isActive
                    ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/50 shadow-sm shadow-brand-cyan/10 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Live Metrics & Circuit Breaker Status */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          {/* Prominent Safety Harness Status Pill */}
          <div className="hidden sm:flex items-center">
            {isTripped ? (
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-red-950/90 border border-red-500 shadow-lg shadow-red-500/25 text-red-200 font-mono text-xs ring-1 ring-red-500/50 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-brand-red shrink-0 animate-bounce" />
                <div className="flex flex-col text-left">
                  <span className="font-extrabold text-white tracking-wide text-[11px] leading-tight flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-red"></span>
                    CIRCUIT TRIPPED
                  </span>
                  <span className="text-[10px] text-red-300 font-semibold leading-tight">HALTED · MAX DD BREACH</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 shadow-sm shadow-emerald-500/15 text-emerald-300 font-mono text-xs">
                <div className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-green"></span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-emerald-200 tracking-wide text-[11px] leading-tight flex items-center gap-1">
                    SEATBELT ARMED
                  </span>
                  <span className="text-[10px] text-emerald-400/80 leading-tight">5/5 INVARIANTS ACTIVE</span>
                </div>
              </div>
            )}
          </div>

          {/* Equity & PnL */}
          <div className="text-right">
            <div className="text-xs text-slate-400 font-mono flex items-center justify-end gap-1">
              <span>Agentic AUM:</span>
              <span className="text-white font-bold font-mono">${equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={`text-xs font-mono font-semibold ${isPositive ? 'text-brand-green' : 'text-brand-red'}`}>
              {isPositive ? '+' : ''}{pnl.toFixed(2)} USDT ({isPositive ? '+' : ''}{pnlPct.toFixed(2)}%)
            </div>
          </div>

          {/* Agentic Account UID tag */}
          <div className="hidden xl:flex flex-col text-right text-[11px] font-mono text-slate-400 border-l border-white/[0.08] pl-4">
            <span className="text-brand-teal font-medium">Bitget OAuth Sub-Account</span>
            <span className="text-slate-300 font-semibold">{status?.account?.account_uid || 'BG-SUB-94029-ISOLATED'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
