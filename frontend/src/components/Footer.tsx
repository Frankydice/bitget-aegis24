import React from 'react';
import { ArrowUp, Download, ShieldCheck, Github } from 'lucide-react';
import { PaperLogEntry } from '../services/api';

interface FooterProps {
  logs?: PaperLogEntry[];
}

export const Footer: React.FC<FooterProps> = ({ logs = [] }) => {
  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "aegis24_paper_trading_audit_logs.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="border-t border-white/5 bg-[#050505] py-10 px-4 sm:px-6 lg:px-8 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold font-sans text-white">
                Aegis<span className="text-brand-cyan">24</span>
              </span>
              <span className="text-xs text-neutral-500 font-mono">· Autonomous 24/7 rToken Trading Desk</span>
            </div>
            <p className="text-xs text-neutral-400 font-normal">
              Bitget AI &times; Crypto Hackathon Season 2 (Track 2: Agentic Trading) · BuilderOS Standard
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={downloadJSON}
              className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export Audit Logs (JSON)</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Back to Top"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Regulatory & Toolchain One-Line Disclaimer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-neutral-500">
          <span>
            Data feeds powered by Bitget MCP (<code className="text-blue-400">agent.bitget.com/mcp</code>) & Bitget Signal. Paper trading audit trail is cryptographically verified under Chapter IV standards.
          </span>
          <span className="text-neutral-400 shrink-0">
            #AgenticTrading #BitgetHackathonS2 #BuilderOS
          </span>
        </div>
      </div>
    </footer>
  );
};
