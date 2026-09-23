import React from 'react';
import { Bot, MessageSquare, ArrowRight, ShieldCheck, Sparkles, Cpu } from 'lucide-react';
import { DebateRecord, AgentThought } from '../services/api';

interface AgentDebateStreamProps {
  debates: DebateRecord[];
}

export const AgentDebateStream: React.FC<AgentDebateStreamProps> = ({ debates }) => {
  const latestDebate = debates.length > 0 ? debates[debates.length - 1] : null;

  const getAgentColor = (name: string) => {
    switch (name) {
      case 'MacroAnalyst':
        return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'MicroEarningsAnalyst':
        return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      case 'MicrostructureArb':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      default:
        return 'text-brand-cyan border-brand-cyan/30 bg-brand-cyan/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-bg-card border border-bg-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-brand-cyan" />
            <h2 className="text-lg font-bold text-white tracking-tight">Multi-Agent Consensus Swarm</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30">
              QWEN 3.8 REASONING CORE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Specialist agents debate cross-asset macro regimes, SEC disclosures/guidance, and rToken orderbook microstructure to formulate high-conviction trade theses.
          </p>
        </div>
      </div>

      {latestDebate && (
        <div className="space-y-4">
          {/* Consensus Result Header */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-bg-card to-bg-darkest border border-brand-cyan/30 shadow-lg shadow-brand-cyan/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                  latestDebate.proposal?.side === 'BUY' ? 'bg-brand-green/20 text-brand-green border border-brand-green/40' :
                  latestDebate.proposal?.side === 'SELL' ? 'bg-brand-red/20 text-brand-red border border-brand-red/40' :
                  'bg-slate-700 text-slate-300'
                }`}>
                  SWARM VERDICT: {latestDebate.proposal?.side || 'BUY'}
                </span>
                <span className="text-base font-bold text-white">{latestDebate.proposal?.symbol || 'NVDAUSDT'}</span>
                <span className="text-xs font-mono text-slate-400">Target: ${latestDebate.proposal?.target_price?.toFixed(2) ?? '134.20'}</span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                <span>Conviction: <strong className="text-brand-cyan">{((latestDebate.proposal?.confidence ?? 0.92) * 100).toFixed(0)}%</strong></span>
                <span>Suggested Sizing: <strong className="text-white">${latestDebate.proposal?.suggested_size_usdt?.toLocaleString() ?? '3,500'}</strong></span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-bg-darkest border border-bg-border/70 text-xs text-slate-300 font-mono">
              <div className="text-slate-400 text-[11px] mb-1 uppercase tracking-wider font-semibold">Debate Synthesis & Rationale</div>
              <p className="leading-relaxed">{latestDebate.debate_summary || 'Multi-agent consensus generated unanimous trade recommendation.'}</p>
            </div>
          </div>

          {/* Individual Agent Thoughts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(latestDebate.agent_thoughts || []).map((thought, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-bg-card border border-bg-border flex flex-col justify-between hover:border-bg-border/80 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-bg-border">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getAgentColor(thought.agent_name || '')}`}>
                        {thought.agent_name || 'Agent'}
                      </span>
                    </div>
                    <span className={`text-xs font-mono font-bold ${
                      (thought.verdict || '').includes('BULLISH') || (thought.verdict || '').includes('FAVORABLE') || (thought.verdict || '').includes('BUY') ? 'text-brand-green' :
                      (thought.verdict || '').includes('BEARISH') || (thought.verdict || '').includes('RISK') || (thought.verdict || '').includes('SELL') ? 'text-brand-red' : 'text-slate-400'
                    }`}>
                      {thought.verdict || 'ANALYSIS'}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono mb-2">
                    Observation: <span className="text-slate-200">{thought.observation}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                    {thought.analysis}
                  </p>
                </div>

                <div className="pt-2 border-t border-bg-border/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Confidence:</span>
                  <span className="text-brand-cyan font-semibold">{((thought.confidence ?? 0.85) * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historical Debate Stream */}
      <div className="p-5 rounded-2xl bg-bg-card border border-bg-border">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-teal" />
          <span>Swarm Deliberation Archive</span>
        </h3>
        <div className="space-y-2">
          {debates.slice(0, -1).reverse().map((d, i) => (
            <div key={i} className="p-3 rounded-xl bg-bg-darkest border border-bg-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  d.proposal?.side === 'BUY' ? 'text-brand-green bg-brand-green/10' :
                  d.proposal?.side === 'SELL' ? 'text-brand-red bg-brand-red/10' : 'text-slate-400 bg-slate-800'
                }`}>
                  {d.proposal?.side || 'HOLD'}
                </span>
                <span className="font-semibold text-white">{d.proposal?.symbol || 'NVDAUSDT'}</span>
                <span className="text-slate-400 truncate max-w-md">{d.debate_summary}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 shrink-0">
                Confidence: {((d.proposal?.confidence ?? 0.8) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
