import React from 'react';
import { ShieldAlert, Cpu, Award, ShieldCheck, Terminal, FileCode2, Lock, CheckCircle2 } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section id="trust" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight font-sans">
              Why Aegis24 Matters: Institutional Architecture
            </h2>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/25 px-2.5 py-0.5 text-[10px] font-mono text-blue-300 font-semibold">
              TRUST & COMPLIANCE
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-normal mt-0.5">
            Engineered specifically to solve the fatal flaws of autonomous LLM trading in 24/7 off-hours synthetic markets
          </p>
        </div>
      </div>

      {/* 3-Column Problem / Solution / Result Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: The Problem */}
        <div className="p-6 rounded-3xl bg-[#070707] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between shadow-sm">
          <div>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
              <ShieldAlert className="w-4.5 h-4.5 text-rose-400" />
            </div>

            <div className="text-[10px] font-mono font-semibold text-rose-400 uppercase tracking-wider mb-1">
              The Off-Hours Problem
            </div>
            <h3 className="text-base font-bold text-white font-sans mb-3">
              65 Hours of Market Darkness & LLM Hallucinations
            </h3>

            <p className="text-xs text-neutral-300 leading-relaxed space-y-2">
              <span>
                Traditional US equity markets close every Friday at 4:00 PM EST and remain dark for over 65 consecutive hours. Yet breaking macro guidance, geopolitical shocks, and crypto moves never stop.
              </span>
              <br /><br />
              <span>
                When traditional autonomous agents trade tokenized stocks, they fail catastrophically: placing market orders into illiquid weekend books, hallucinating ungrounded trade theses, and suffering runaway drawdowns without hard risk caps.
              </span>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-neutral-500">
            Friction: Illiquid Spreads &gt; 0.50% & Zero Mathematical Guardrails
          </div>
        </div>

        {/* Column 2: The Solution */}
        <div className="p-6 rounded-3xl bg-[#070707] border border-blue-500/30 shadow-md shadow-blue-500/5 flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mb-4">
              <Cpu className="w-4.5 h-4.5 text-blue-400" />
            </div>

            <div className="text-[10px] font-mono font-semibold text-blue-400 uppercase tracking-wider mb-1">
              The Aegis24 Solution
            </div>
            <h3 className="text-base font-bold text-white font-sans mb-3">
              Decoupled Swarm Reasoning + Hardware Seatbelt
            </h3>

            <p className="text-xs text-neutral-300 leading-relaxed space-y-2">
              <span>
                Aegis24 separates <strong className="text-white">Probabilistic Reasoning</strong> (Qwen Consensus Swarm) from <strong className="text-white">Deterministic Execution</strong>.
              </span>
              <br /><br />
              <span>
                The LLM proposes hypotheses, but <strong className="text-blue-400 font-semibold">never holds order execution discretion</strong>. Every trade must pass 5 hard mathematical invariants: spread limits, NAV parity corridors, Kelly capital sizing, daily drawdown circuit breakers, and pre-market opening freezes.
              </span>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-blue-400">
            Guarantee: Deterministic Code Controls the API Keys
          </div>
        </div>

        {/* Column 3: The Result */}
        <div className="p-6 rounded-3xl bg-[#070707] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between shadow-sm">
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
              <Award className="w-4.5 h-4.5 text-emerald-400" />
            </div>

            <div className="text-[10px] font-mono font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              Verifiable Alpha & Safety
            </div>
            <h3 className="text-base font-bold text-white font-sans mb-3">
              Institutional Returns With Out-of-Sample Proof
            </h3>

            <p className="text-xs text-neutral-300 leading-relaxed space-y-2">
              <span>
                Over 60 days of continuous 24/7 simulation across 84 completed trades, Aegis24 generated:
              </span>
              <br />
              <span className="block mt-2 font-mono text-xs space-y-1">
                <span className="text-emerald-400 block">• +19.64% Total Return (+15.52% net alpha vs SPY)</span>
                <span className="text-white block">• 2.34 Sharpe Ratio (IS: 2.48 / OOS: 2.18)</span>
                <span className="text-blue-300 block">• 0.88 Sharpe Decay Ratio (Zero Curve-Fitting)</span>
                <span className="text-neutral-300 block">• 11 toxic weekend orders pruned by the seatbelt</span>
              </span>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-emerald-400">
            Result: Asymmetric Edge on Continuous Crypto Rails
          </div>
        </div>
      </div>
    </section>
  );
};
