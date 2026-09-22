import React from 'react';
import { FileText, Download, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { PaperLogEntry } from '../services/api';

interface PaperLogsTableProps {
  logs: PaperLogEntry[];
}

export const PaperLogsTable: React.FC<PaperLogsTableProps> = ({ logs }) => {
  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "aegis24_paper_trading_logs.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-6 rounded-2xl bg-bg-card border border-bg-border space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-bg-border">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-cyan" />
            <h2 className="text-base font-bold text-white tracking-tight">Verifiable Paper Trading Execution Logs</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-green/10 text-brand-green border border-brand-green/30">
              BITGET CHAPTER IV AUDIT STANDARD
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Continuous 24/7 paper trading audit trail. Each order is tied to a deterministic risk hash and consensus thesis.
          </p>
        </div>

        <button
          onClick={downloadJSON}
          className="px-3 py-2 rounded-xl bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan/25 transition-all text-xs font-mono flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-bg-darkest text-slate-400 border-b border-bg-border">
            <tr>
              <th className="py-2.5 px-3">TIMESTAMP</th>
              <th className="py-2.5 px-3">SYMBOL</th>
              <th className="py-2.5 px-3">ACTION</th>
              <th className="py-2.5 px-3">CONVICTION</th>
              <th className="py-2.5 px-3">SEATBELT</th>
              <th className="py-2.5 px-3">FILL PRICE</th>
              <th className="py-2.5 px-3">SIZE</th>
              <th className="py-2.5 px-3">SLIPPAGE</th>
              <th className="py-2.5 px-3">CRYPTO HASH</th>
              <th className="py-2.5 px-3">THESIS EXCERPT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-border/50 text-slate-200">
            {logs.slice().reverse().map((log, idx) => (
              <tr key={idx} className="hover:bg-bg-hover/50">
                <td className="py-2 px-3 text-slate-400 whitespace-nowrap">{log.formatted_time}</td>
                <td className="py-2 px-3 font-bold text-white">{log.symbol}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.side === 'BUY' ? 'bg-brand-green/15 text-brand-green' :
                    log.side === 'SELL' ? 'bg-brand-red/15 text-brand-red' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {log.side}
                  </span>
                </td>
                <td className="py-2 px-3">{(log.confidence * 100).toFixed(0)}%</td>
                <td className="py-2 px-3">
                  {log.risk_approved ? (
                    <span className="text-brand-green flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Approved
                    </span>
                  ) : (
                    <span className="text-brand-red flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Blocked
                    </span>
                  )}
                </td>
                <td className="py-2 px-3 font-semibold">
                  {log.fill_price ? `$${log.fill_price.toFixed(2)}` : '—'}
                </td>
                <td className="py-2 px-3">
                  {log.size_usdt > 0 ? `$${log.size_usdt.toLocaleString()}` : '—'}
                </td>
                <td className="py-2 px-3 text-slate-400">
                  {log.slippage_pct > 0 ? `${log.slippage_pct.toFixed(2)}%` : '—'}
                </td>
                <td className="py-2 px-3 text-brand-teal">{log.risk_hash || '—'}</td>
                <td className="py-2 px-3 text-slate-400 max-w-xs truncate">{log.thesis_excerpt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
