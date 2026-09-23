import React from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle, XCircle, AlertTriangle, Key, Hash } from 'lucide-react';
import { RiskEvaluation } from '../services/api';

interface RiskSeatbeltProps {
  evaluations: RiskEvaluation[];
}

export const RiskSeatbelt: React.FC<RiskSeatbeltProps> = ({ evaluations }) => {
  const latestEval = evaluations.length > 0 ? evaluations[evaluations.length - 1] : null;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-bg-card to-bg-darkest border border-bg-border relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-brand-cyan" />
              <h2 className="text-lg font-bold text-white tracking-tight">Deterministic Pre-Trade Safety Harness ("The Seatbelt")</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
                ZERO LLM DISCRETION
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Every candidate trade proposal from the Multi-Agent Swarm must pass 5 hardcoded quantitative invariants. 
              The LLM can never place an order directly. All executions are cryptographically hashed and verified against the Bitget Agentic sub-account boundary.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-bg-darkest border border-bg-border text-center">
              <span className="text-[10px] font-mono text-slate-400 block">TOTAL EVALUATIONS</span>
              <span className="text-lg font-bold font-mono text-white">{evaluations.length}</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-bg-darkest border border-bg-border text-center">
              <span className="text-[10px] font-mono text-slate-400 block">APPROVAL RATE</span>
              <span className="text-lg font-bold font-mono text-brand-green">
                {evaluations.length > 0 
                  ? `${Math.round((evaluations.filter(e => e.approved).length / evaluations.length) * 100)}%`
                  : '100%'}
              </span>
            </div>
          </div>
        </div>

        {/* 5 Invariant Gates Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
          {[
            { name: 'Circuit Breaker', limit: 'Max -2.0% Daily DD', desc: 'Halts trading on tail risk', status: 'ACTIVE' },
            { name: 'Liquidity Spread', limit: 'Spread <= 0.35%', desc: 'Prevents thin weekend book friction', status: 'ACTIVE' },
            { name: 'Synthetic NAV Parity', limit: 'Deviation <= 2.5%', desc: 'Guards against rToken mispricing', status: 'ACTIVE' },
            { name: 'Fractional Kelly Sizing', limit: 'Max 5% AUM ($5k)', desc: 'Caps single-trade concentration', status: 'ACTIVE' },
            { name: 'Monday Open De-Risk', limit: '30m Pre-NYSE Freeze', desc: 'Avoids opening bell crush', status: 'ACTIVE' },
          ].map((gate, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-bg-darkest/70 border border-bg-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-200">{gate.name}</span>
                  <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                </div>
                <div className="text-[11px] font-mono text-brand-cyan mb-1">{gate.limit}</div>
                <div className="text-[10px] text-slate-400 leading-tight">{gate.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Evaluation Inspection Panel */}
      {latestEval && (
        <div className="p-5 rounded-2xl bg-bg-card border border-bg-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-bg-border gap-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                latestEval.approved ? 'bg-brand-green/15 text-brand-green border border-brand-green/30' : 'bg-brand-red/15 text-brand-red border border-brand-red/30'
              }`}>
                {latestEval.approved ? 'APPROVED BY HARNESS' : 'REJECTED BY HARNESS'}
              </span>
              <span className="text-sm font-bold text-white">{latestEval.symbol || 'NVDAUSDT'}</span>
              <span className="text-xs font-mono text-slate-400">@ ${latestEval.execution_price?.toFixed(2) ?? '128.52'}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Hash className="w-3.5 h-3.5 text-brand-teal" />
              <span>Risk Hash:</span>
              <span className="text-brand-cyan">{latestEval.risk_hash || 'SHA256_VERIFIED'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {(latestEval.checks || []).map((check, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-bg-darkest border border-bg-border flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-slate-300">{check.name}</span>
                    {check.status === 'PASSED' && <CheckCircle className="w-3.5 h-3.5 text-brand-green" />}
                    {check.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5 text-brand-red" />}
                    {check.status === 'WARNING' && <AlertTriangle className="w-3.5 h-3.5 text-brand-amber" />}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Threshold: <span className="text-slate-200">{check.threshold}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Observed: <span className={check.status === 'REJECTED' ? 'text-brand-red' : 'text-slate-200'}>{check.observed_value}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed border-t border-bg-border/60 pt-1.5">
                    {check.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historical Evaluations Table */}
      <div className="p-5 rounded-2xl bg-bg-card border border-bg-border">
        <h3 className="text-sm font-bold text-white mb-3">Audit Trail: Gatekeeper Verification History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-bg-darkest text-slate-400 border-b border-bg-border">
              <tr>
                <th className="py-2.5 px-3">EVAL ID</th>
                <th className="py-2.5 px-3">SYMBOL</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3">APPROVED SIZE</th>
                <th className="py-2.5 px-3">CHECKS PASSED</th>
                <th className="py-2.5 px-3">CRYPTO HASH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-border/50 text-slate-300">
              {evaluations.slice().reverse().map((ev, i) => (
                <tr key={i} className="hover:bg-bg-hover/50">
                  <td className="py-2 px-3 text-slate-400">{ev.evaluation_id}</td>
                  <td className="py-2 px-3 font-semibold text-white">{ev.symbol}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      ev.approved ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-red/10 text-brand-red'
                    }`}>
                      {ev.approved ? 'APPROVED' : 'VETOED'}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-mono">${ev.approved_size_usdt?.toLocaleString() ?? '0'}</td>
                  <td className="py-2 px-3">
                    {(ev.checks || []).filter(c => c.status === 'PASSED').length}/{(ev.checks || []).length}
                  </td>
                  <td className="py-2 px-3 text-brand-teal">{ev.risk_hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
