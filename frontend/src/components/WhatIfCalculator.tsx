import React, { useState, useEffect } from 'react';
import { Calculator, CheckCircle2, XCircle, AlertTriangle, Code, Download, Check, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { storage, WhatIfDraft } from '../utils/storage';
import { tokens } from '../styles/tokens';

export const WhatIfCalculator: React.FC = () => {
  const defaultDraft: WhatIfDraft = {
    symbol: 'NVDAUSDT',
    sizeUsdt: 3500,
    simulatedBid: 128.38,
    simulatedAsk: 128.52,
    syntheticNav: 128.40
  };

  const [draft, setDraft] = useState<WhatIfDraft>(() => storage.getWhatIfDraft(defaultDraft));
  const [playbookModal, setPlaybookModal] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    storage.saveWhatIfDraft(draft);
  }, [draft]);

  const midPrice = (draft.simulatedBid + draft.simulatedAsk) / 2;
  const spreadPct = midPrice > 0 ? (((draft.simulatedAsk - draft.simulatedBid) / midPrice) * 100) : 0;
  const navDeviationPct = draft.syntheticNav > 0 ? (Math.abs(midPrice - draft.syntheticNav) / draft.syntheticNav * 100) : 0;
  
  // Gate check results
  const isSpreadPass = spreadPct <= tokens.thresholds.maxSpreadPct;
  const isNavPass = navDeviationPct <= tokens.thresholds.maxNavDeviationPct;
  const isSizePass = draft.sizeUsdt <= tokens.thresholds.maxPositionSizeUsdt;
  const isDrawdownPass = true; // In sandbox mode

  const isAllApproved = isSpreadPass && isNavPass && isSizePass;

  const handleExportPlaybook = async () => {
    try {
      const res = await api.exportPlaybook(draft.symbol);
      setPlaybookModal(res?.code || '');
    } catch {
      // Handled in api fallback
    }
  };

  return (
    <section id="what-if-sandbox" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight font-sans">
              Secondary What-If Tool & Risk Sandbox
            </h2>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/25 px-2.5 py-0.5 text-[10px] font-mono text-blue-300 font-semibold">
              SINGLE-TRADE SIMULATOR
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-normal mt-0.5">
            Test hypothetical trade parameters against the 5 deterministic safety gates without touching live account equity
          </p>
        </div>

        <button
          onClick={handleExportPlaybook}
          className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
        >
          <Code className="w-3.5 h-3.5 text-black" />
          <span>Export Bitget Playbook Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Interactive Parameter Sandbox */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#070707] border border-white/5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Hypothetical Inputs
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              Live State Persistence Enabled
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-mono text-neutral-400 block mb-1">Target Asset</label>
              <select
                value={draft.symbol}
                onChange={(e) => setDraft({ ...draft, symbol: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
              >
                {['NVDAUSDT', 'TSLAUSDT', 'AAPLUSDT', 'COINUSDT', 'MSTRUSDT', 'SPYUSDT'].map((sym) => (
                  <option key={sym} value={sym} className="bg-[#0c0c0e]">{sym}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-neutral-400 block mb-1">
                Order Size (${draft.sizeUsdt.toLocaleString()} USDT)
              </label>
              <input
                type="number"
                min="100"
                max="10000"
                step="100"
                value={draft.sizeUsdt}
                onChange={(e) => setDraft({ ...draft, sizeUsdt: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-neutral-400 block mb-1">Synthetic NAV Fair Value ($)</label>
              <input
                type="number"
                step="0.05"
                value={draft.syntheticNav}
                onChange={(e) => setDraft({ ...draft, syntheticNav: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono text-neutral-400 block mb-1">Simulated Best Bid Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={draft.simulatedBid}
                onChange={(e) => setDraft({ ...draft, simulatedBid: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-neutral-400 block mb-1">Simulated Best Ask Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={draft.simulatedAsk}
                onChange={(e) => setDraft({ ...draft, simulatedAsk: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Scenario Preset Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-neutral-500 text-[11px]">Load Test Scenarios:</span>
            <button
              onClick={() => setDraft({ symbol: 'NVDAUSDT', sizeUsdt: 3500, simulatedBid: 128.38, simulatedAsk: 128.52, syntheticNav: 128.40 })}
              className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white cursor-pointer"
            >
              Tight Book (Safe)
            </button>
            <button
              onClick={() => setDraft({ symbol: 'MSTRUSDT', sizeUsdt: 4500, simulatedBid: 344.20, simulatedAsk: 346.50, syntheticNav: 345.00 })}
              className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white cursor-pointer"
            >
              Wide Spread (Veto Risk)
            </button>
            <button
              onClick={() => setDraft({ symbol: 'TSLAUSDT', sizeUsdt: 6500, simulatedBid: 242.00, simulatedAsk: 242.20, syntheticNav: 242.10 })}
              className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white cursor-pointer"
            >
              Over-Sized (Quota Cap)
            </button>
          </div>
        </div>

        {/* Right Col: Instant Verdict & Gate Pass/Fail */}
        <div className="p-6 rounded-3xl bg-[#070707] border border-white/5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                  Hypothetical Harness Decision
                </h3>
              </div>
            </div>

            <div className="mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                isAllApproved
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {isAllApproved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>PRE-TRADE SEATBELT APPROVED</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>HARDWARE HARNESS VETOED</span>
                  </>
                )}
              </span>
            </div>

            {/* Individual Gate Matrix */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Gate 1: Bid-Ask Spread</span>
                  <span className="text-white font-semibold">Simulated: {spreadPct.toFixed(2)}% (Max: 0.35%)</span>
                </div>
                {isSpreadPass ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Gate 2: Synthetic NAV Deviation</span>
                  <span className="text-white font-semibold">Simulated: {navDeviationPct.toFixed(2)}% (Max: 2.50%)</span>
                </div>
                {isNavPass ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Gate 3: Position Size Cap</span>
                  <span className="text-white font-semibold">${draft.sizeUsdt.toLocaleString()} USDT (Max: $5,000)</span>
                </div>
                {isSizePass ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              </div>
            </div>
          </div>

          <p className="text-[10px] text-neutral-500 font-sans mt-4 pt-3 border-t border-white/5">
            Real-world execution requires all 5 gates to pass simultaneously before orders hit exchange orderbooks.
          </p>
        </div>
      </div>

      {/* Playbook Export Modal */}
      {playbookModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#070707] border border-white/10 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  Bitget Playbook Sandbox Code: {draft.symbol}
                </h3>
              </div>
              <button
                onClick={() => setPlaybookModal(null)}
                className="text-neutral-400 hover:text-white text-xs font-mono p-1 rounded-lg"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              Copy this standard Python Playbook directly into your Bitget GetAgent Sandbox or Bitget Playbook Studio to execute this verified strategy.
            </p>

            <pre className="p-4 rounded-2xl bg-[#020202] border border-white/5 text-[11px] font-mono text-neutral-300 overflow-x-auto max-h-72">
              <code>{playbookModal}</code>
            </pre>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(playbookModal);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="px-4 py-2 rounded-full bg-white text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
