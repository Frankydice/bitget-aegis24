import React from 'react';
import { Menu, Zap, Download, ShieldCheck, Activity, Terminal, ArrowUpRight } from 'lucide-react';
import { SystemStatus } from '../services/api';

interface TopNavProps {
  status: SystemStatus | null;
  activeSection: string;
  onOpenMobileMenu: () => void;
  onSimulateClick: () => void;
  onExportClick?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  status,
  activeSection,
  onOpenMobileMenu,
  onSimulateClick,
  onExportClick
}) => {
  const isTripped = Boolean(status?.circuit_breaker?.tripped);

  const getSectionTitle = (id: string) => {
    switch (id) {
      case 'hero':
        return 'Overview & Performance';
      case 'dashboard':
        return 'Live Desk & Telemetry';
      case 'catalyst-terminal':
        return 'Shock Injection Terminal';
      case 'deliberation-engine':
        return 'Deliberation Swarm & Gates';
      case 'multi-axis-explorer':
        return 'Asset Microstructure Explorer';
      case 'risk-matrix':
        return 'Parity & Spread Dislocation';
      case 'live-rtokens':
        return 'Ranked Market Radar';
      case 'what-if-sandbox':
        return 'What-If Strategy Simulator';
      case 'equity-trajectory':
        return '60d Trajectory (IS vs OOS)';
      case 'recommendations':
        return 'Real-Time Action Plan';
      case 'trust':
        return 'Trust & Mathematical Edge';
      case 'footer':
        return 'Cryptographic Audit Trail';
      default:
        return 'Trading Desk';
    }
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-[#020202]/90 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors">
      {/* Left: Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-neutral-500 hidden sm:inline">Aegis24</span>
          <span className="text-neutral-600 hidden sm:inline">/</span>
          <span className="text-white font-medium truncate max-w-[180px] sm:max-w-none">
            {getSectionTitle(activeSection)}
          </span>
        </div>
      </div>

      {/* Center/Right: Live Telemetry & Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Fast Telemetry Pills */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-mono text-neutral-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span>bitget-mcp-server: 12ms</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.02] px-2.5 py-1 text-[11px] font-mono text-neutral-400">
            <Activity className="h-3 w-3 text-brand-cyan" />
            <span>24/7 Engine Active</span>
          </div>
        </div>

        {/* Primary Action Button (Parallel signature white pill) */}
        <button
          onClick={onSimulateClick}
          className="flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black hover:bg-neutral-200 active:scale-[0.98] transition-all duration-150 shadow-sm cursor-pointer"
        >
          <Zap className="h-3.5 w-3.5 fill-black" />
          <span>Simulate Shock</span>
        </button>

        {/* Quick Anchor to Risk Corridor */}
        <a
          href="#deliberation-engine"
          className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-brand-cyan" />
          <span>Inspect 5 Gates</span>
        </a>
      </div>
    </header>
  );
};
