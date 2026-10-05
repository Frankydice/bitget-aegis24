import React from 'react';
import { Menu, Zap, Download, ShieldCheck, Activity, Terminal, ArrowUpRight, Play } from 'lucide-react';
import { SystemStatus } from '../services/api';

interface TopNavProps {
  status: SystemStatus | null;
  activeSection: string;
  onOpenMobileMenu: () => void;
  onSimulateClick: () => void;
  onExportClick?: () => void;
  onOpenMotionShowcase?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  status,
  activeSection,
  onOpenMobileMenu,
  onSimulateClick,
  onExportClick,
  onOpenMotionShowcase
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
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-[#020202]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 transition-colors">
      {/* Left: Brand Icon + Aegis24 Logo & Mobile Menu */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 -ml-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-600 via-brand-cyan to-white flex items-center justify-center shadow-sm shadow-blue-500/20 ring-1 ring-white/10">
            <ShieldCheck className="h-4 w-4 text-black stroke-[2.5]" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white font-sans group-hover:text-neutral-200 transition-colors">
            Aegis<span className="text-brand-cyan">24</span>
          </span>
        </a>
      </div>

      {/* Center: Parallel Signature Muted Navigation Links */}
      <nav className="hidden md:flex items-center gap-7 text-xs font-normal text-neutral-400">
        <a
          href="#dashboard"
          className="hover:text-white transition-colors cursor-pointer"
        >
          How it works
        </a>
        <a
          href="#catalyst-terminal"
          className="hover:text-white transition-colors cursor-pointer"
        >
          Shock Terminal
        </a>
        <a
          href="#deliberation-engine"
          className="hover:text-white transition-colors cursor-pointer"
        >
          Deliberation Swarm
        </a>
        <a
          href="#risk-matrix"
          className="hover:text-white transition-colors cursor-pointer"
        >
          Safety Corridor
        </a>
      </nav>

      {/* Right: Actions matching screenshot "Open the board ↗" pill */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Motion Showcase Reel Button */}
        {onOpenMotionShowcase && (
          <button
            onClick={onOpenMotionShowcase}
            className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-950/25 hover:bg-blue-900/40 px-3.5 py-1.5 text-xs font-semibold text-blue-300 hover:text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] active:scale-[0.98] cursor-pointer"
          >
            <Play className="h-3 w-3 fill-blue-400 text-blue-400" />
            <span>Motion Reel</span>
          </button>
        )}

        {/* Telemetry pill */}
        <div className="hidden xl:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-mono text-neutral-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span>bitget-mcp: 12ms</span>
        </div>

        {/* Primary Action Button (Parallel signature capsule pill) */}
        <a
          href="#dashboard"
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] hover:bg-white/10 hover:border-white/20 active:scale-[0.98] px-4 py-1.5 text-xs font-medium text-neutral-200 hover:text-white transition-all duration-150 shadow-sm cursor-pointer"
        >
          <span>Open the desk</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-white" />
        </a>
      </div>
    </header>
  );
};
