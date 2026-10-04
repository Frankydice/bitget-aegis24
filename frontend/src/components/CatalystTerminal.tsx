import React, { useState, useEffect } from 'react';
import { Zap, Play, Plus, Trash2, RotateCcw, Sparkles, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { storage, CustomShockDraft } from '../utils/storage';

interface CatalystTerminalProps {
  onEventProcessed: (result?: any) => void;
}

export const CatalystTerminal: React.FC<CatalystTerminalProps> = ({ onEventProcessed }) => {
  const [activeLoadingId, setActiveLoadingId] = useState<string | null>(null);
  const [isCustomLoading, setIsCustomLoading] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Preset Shocks
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

  // Dynamic Custom Shock State with persistence
  const defaultDraft: CustomShockDraft = {
    symbol: 'NVDAUSDT',
    title: 'TSMC Weekend Wafer Yield Breakthrough',
    content: 'TSMC discloses unexpected 18% yield improvement on 3nm Blackwell fabrication nodes during Sunday Taipei press briefing.',
    bias: 'STRONG_BULLISH',
    targetMove: 4.2,
    customParameters: [
      { key: 'Headline Momentum', value: '+4.8%' },
      { key: 'Forward P/E Multiple', value: '26.8x' }
    ]
  };

  const [formDraft, setFormDraft] = useState<CustomShockDraft>(() => storage.getCustomShockDraft(defaultDraft));

  useEffect(() => {
    storage.saveCustomShockDraft(formDraft);
  }, [formDraft]);

  const handleTriggerPreset = async (presetId: string) => {
    setActiveLoadingId(presetId);
    try {
      const res = await api.injectEvent({ event_id: presetId });
      storage.addRecentSimulation({
        id: presetId,
        time: new Date().toLocaleTimeString(),
        result: res
      });
      onEventProcessed(res);
    } catch (e) {
      console.error(e);
    } finally {
      setActiveLoadingId(null);
    }
  };

  const handleExecuteCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCustomLoading(true);
    try {
      const res = await api.injectEvent({
        custom_symbol: formDraft.symbol,
        custom_title: formDraft.title,
        custom_content: formDraft.content,
        custom_bias: formDraft.bias,
        custom_target_move: formDraft.targetMove
      });
      storage.addRecentSimulation({
        id: `custom_${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        result: res
      });
      onEventProcessed(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCustomLoading(false);
    }
  };

  const handleLoadExample = () => {
    const examples: CustomShockDraft[] = [
      {
        symbol: 'NVDAUSDT',
        title: 'OpenAI Stargate 5GW Cluster Procurement',
        content: 'Joint infrastructure filing confirms dedicated $100B GPU delivery schedule spanning 2026-2028 with Tier-1 hyperscaler guarantees.',
        bias: 'STRONG_BULLISH',
        targetMove: 5.5,
        customParameters: [
          { key: 'Orderbook Depth', value: '$65,000 USDT' },
          { key: 'Spread Penalty', value: '0.08%' }
        ]
      },
      {
        symbol: 'COINUSDT',
        title: 'SEC Tokenized Securities Safe Harbor Framework',
        content: 'Sunday regulatory circular outlines expedited listing and 24/7 clearing corridors for tokenized equities.',
        bias: 'BULLISH',
        targetMove: 6.8,
        customParameters: [
          { key: 'Crypto Beta', value: '1.92' },
          { key: 'Funding Arbitrage', value: '+0.035%' }
        ]
      },
      {
        symbol: 'SPYUSDT',
        title: 'Sunday Night Crude Supply Interruption',
        content: 'Unplanned pipeline maintenance in Rotterdam sparks energy shock and inflationary bond yield spike.',
        bias: 'BEARISH',
        targetMove: -2.4,
        customParameters: [
          { key: '10Y Yield Delta', value: '+14 bps' },
          { key: 'DXY Surge', value: '+0.8%' }
        ]
      }
    ];

    const pick = examples[Math.floor(Math.random() * examples.length)];
    setFormDraft(pick);
    setShowCustomForm(true);
  };

  const handleAddParamRow = () => {
    setFormDraft({
      ...formDraft,
      customParameters: [...formDraft.customParameters, { key: '', value: '' }]
    });
  };

  const handleRemoveParamRow = (index: number) => {
    setFormDraft({
      ...formDraft,
      customParameters: formDraft.customParameters.filter((_, i) => i !== index)
    });
  };

  const handleParamChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...formDraft.customParameters];
    updated[index][field] = val;
    setFormDraft({ ...formDraft, customParameters: updated });
  };

  return (
    <section id="catalyst-terminal" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-brand-cyan" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight font-sans">
                Interactive Catalyst Simulation Terminal
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Simulate off-hours market shocks to trigger Perception $\rightarrow$ Multi-Agent Deliberation $\rightarrow$ Deterministic Seatbelt Execution
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadExample}
            className="px-3 py-1.5 rounded-lg bg-[#0e1116] border border-white/[0.1] hover:border-brand-cyan/40 hover:bg-[#141822] text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Load Example Scenario</span>
          </button>

          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="px-3 py-1.5 rounded-lg bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan text-xs font-mono font-semibold hover:bg-brand-cyan hover:text-black transition-all cursor-pointer"
          >
            {showCustomForm ? 'Collapse Custom Builder' : 'Custom Catalyst Builder'}
          </button>
        </div>
      </div>

      {/* Preset Catalysts 4-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {presets.map((p) => {
          const isLoadingThis = activeLoadingId === p.id;
          const isAnyLoading = Boolean(activeLoadingId) || isCustomLoading;

          return (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-[#070707] border border-white/5 hover:border-white/15 hover:bg-[#0c0c0e] shadow-sm transition-all duration-150 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-2.5">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">{p.category}</span>
                  <span className="rounded-full bg-white/[0.06] border border-white/5 px-2 py-0.5 text-[10px] font-mono text-neutral-300">
                    {p.symbol}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-neutral-200 group-hover:text-white transition-colors mb-2.5 leading-snug line-clamp-2">
                  {p.title}
                </h4>

                <div className="mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                      p.isBullish
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
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
                className={`w-full py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isLoadingThis
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-black hover:bg-neutral-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm'
                }`}
              >
                {isLoadingThis ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Swarm...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Inject Catalyst</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Expandable Dynamic Custom Catalyst Form */}
      {showCustomForm && (
        <form
          onSubmit={handleExecuteCustom}
          className="p-5 sm:p-6 rounded-2xl bg-[#0e1116] border border-brand-cyan/40 shadow-xl space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-cyan" />
              <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                Dynamic Custom Catalyst Builder
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Auto-persisted to LocalStorage
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Target rToken Asset</label>
              <select
                value={formDraft.symbol}
                onChange={(e) => setFormDraft({ ...formDraft, symbol: e.target.value })}
                className="w-full bg-[#08090b] border border-white/[0.1] rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-brand-cyan focus:outline-none"
              >
                {['NVDAUSDT', 'TSLAUSDT', 'AAPLUSDT', 'COINUSDT', 'MSTRUSDT', 'SPYUSDT'].map((sym) => (
                  <option key={sym} value={sym}>{sym}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Market Sentiment Bias</label>
              <select
                value={formDraft.bias}
                onChange={(e) => setFormDraft({ ...formDraft, bias: e.target.value })}
                className="w-full bg-[#08090b] border border-white/[0.1] rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-brand-cyan focus:outline-none"
              >
                <option value="STRONG_BULLISH">Strong Bullish (+4.5% to +6.0%)</option>
                <option value="BULLISH">Bullish (+2.0% to +4.0%)</option>
                <option value="NEUTRAL">Neutral / Choppy (0% to +1.0%)</option>
                <option value="BEARISH">Bearish (-2.0% to -4.0%)</option>
                <option value="RISK_OFF">Risk-Off Panic (-4.5% to -7.0%)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Target Move Expectation ({formDraft.targetMove}%)
              </label>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.5"
                value={formDraft.targetMove}
                onChange={(e) => setFormDraft({ ...formDraft, targetMove: parseFloat(e.target.value) })}
                className="w-full accent-brand-cyan mt-2"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Catalyst Headline / Title</label>
            <input
              type="text"
              required
              value={formDraft.title}
              onChange={(e) => setFormDraft({ ...formDraft, title: e.target.value })}
              placeholder="e.g., TSMC Weekend Yield Breakthrough"
              className="w-full bg-[#08090b] border border-white/[0.1] rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-brand-cyan focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Catalyst Information Detail</label>
            <textarea
              rows={2}
              required
              value={formDraft.content}
              onChange={(e) => setFormDraft({ ...formDraft, content: e.target.value })}
              placeholder="Provide event details, macro context, or earnings guidance..."
              className="w-full bg-[#08090b] border border-white/[0.1] rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-brand-cyan focus:outline-none"
            />
          </div>

          {/* Dynamic Key-Value Parameter Rows */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Dynamic Market Conditioning Parameters:</span>
              <button
                type="button"
                onClick={handleAddParamRow}
                className="text-brand-cyan hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Row</span>
              </button>
            </div>

            {formDraft.customParameters.map((param, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Parameter Name (e.g. Orderbook Depth)"
                  value={param.key}
                  onChange={(e) => handleParamChange(index, 'key', e.target.value)}
                  className="flex-1 bg-[#08090b] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:border-brand-cyan focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. $45,000 USDT)"
                  value={param.value}
                  onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                  className="flex-1 bg-[#08090b] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:border-brand-cyan focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveParamRow(index)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-brand-red transition-colors cursor-pointer"
                  title="Remove parameter"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => setFormDraft(defaultDraft)}
              className="px-3 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Reset to Default
            </button>

            <button
              type="submit"
              disabled={isCustomLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-teal text-black font-mono font-bold text-xs flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-brand-cyan/20 cursor-pointer disabled:opacity-50"
            >
              {isCustomLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Deliberating Across Swarm...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>Simulate & Execute Swarm Deliberation</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};
