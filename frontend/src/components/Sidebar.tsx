import React from 'react';
import {
  ShieldCheck,
  Activity,
  Layers,
  Zap,
  Cpu,
  BarChart2,
  TrendingUp,
  FileText,
  AlertTriangle,
  Github,
  Sliders,
  ExternalLink,
  Lock,
  ChevronRight,
  Compass
} from 'lucide-react';
import { SystemStatus } from '../services/api';

interface SidebarProps {
  status: SystemStatus | null;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavGroup {
  title: string;
  items: {
    id: string;
    label: string;
    icon: React.ElementType;
    subItems?: { id: string; label: string }[];
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  status,
  activeSection,
  onNavigate,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const equity = status?.account.total_equity_usdt ?? 101245.8;
  const isTripped = Boolean(status?.circuit_breaker?.tripped);

  const navGroups: NavGroup[] = [
    {
      title: 'Trading Desk',
      items: [
        {
          id: 'hero',
          label: 'Overview',
          icon: Compass,
          subItems: [
            { id: 'dashboard', label: 'Live Desk & Telemetry' },
            { id: 'live-rtokens', label: 'Ranked Market Radar' }
          ]
        }
      ]
    },
    {
      title: 'Cognitive Swarm',
      items: [
        {
          id: 'catalyst-terminal',
          label: 'Shock Terminal',
          icon: Zap,
          subItems: [
            { id: 'deliberation-engine', label: 'Deliberation & 5 Gates' },
            { id: 'risk-matrix', label: 'Dislocation Matrix' }
          ]
        }
      ]
    },
    {
      title: 'Quantitative Lab',
      items: [
        {
          id: 'multi-axis-explorer',
          label: 'Asset Explorer',
          icon: BarChart2,
          subItems: [
            { id: 'what-if-sandbox', label: 'What-If Simulator' },
            { id: 'equity-trajectory', label: '60d Trajectory (IS/OOS)' }
          ]
        }
      ]
    },
    {
      title: 'Verification & Audit',
      items: [
        {
          id: 'recommendations',
          label: 'Action Plan',
          icon: TrendingUp,
          subItems: [
            { id: 'trust', label: 'Trust & Mathematical Edge' },
            { id: 'footer', label: 'Audit Logs & Playbook' }
          ]
        }
      ]
    }
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    if (onCloseMobile) onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-[#070707] text-neutral-300 font-sans select-none">
      {/* Brand Header */}
      <div className="p-6 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 via-brand-cyan to-white flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-white/10">
              <ShieldCheck className="h-4.5 w-4.5 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-semibold tracking-tight text-white font-sans">
                  Aegis<span className="text-brand-cyan">24</span>
                </span>
                <span className="rounded-full bg-white/[0.06] border border-white/5 px-2 py-0.5 font-mono text-[9px] text-neutral-400">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 font-mono tracking-tight">
                24/7 Autonomous rToken Desk
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tree */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <div className="px-2 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-medium">
              {group.title}
            </div>

            {group.items.map((item) => {
              const Icon = item.icon;
              const isItemActive =
                activeSection === item.id ||
                item.subItems?.some((sub) => sub.id === activeSection);

              return (
                <div key={item.id} className="space-y-1">
                  {/* Parent Item */}
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      isItemActive
                        ? 'bg-white/[0.06] text-white font-semibold'
                        : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`h-4 w-4 ${
                          isItemActive ? 'text-blue-400' : 'text-neutral-500'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.subItems && (
                      <ChevronRight
                        className={`h-3.5 w-3.5 text-neutral-500 transition-transform ${
                          isItemActive ? 'rotate-90 text-neutral-400' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* Sub-Items with Parallel Tree Connectors */}
                  {item.subItems && (
                    <div className="relative ml-4 pl-4 pt-0.5 pb-1 space-y-1">
                      {/* Vertical line */}
                      <div className="absolute left-[3px] top-0 bottom-3 w-px bg-white/10" />

                      {item.subItems.map((sub) => {
                        const isSubActive = activeSection === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleItemClick(sub.id)}
                            className={`relative w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] transition-colors cursor-pointer text-left ${
                              isSubActive
                                ? 'text-white font-medium bg-white/[0.04]'
                                : 'text-neutral-400 hover:text-white hover:bg-white/[0.02]'
                            }`}
                          >
                            {/* Curved connector */}
                            <div className="w-3 border-white/10 rounded-bl-lg border-b border-l absolute left-[-13px] top-3 h-2" />
                            {isSubActive && (
                              <span className="h-1 w-1 rounded-full bg-blue-400 shrink-0" />
                            )}
                            <span className="truncate">{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Safety & Portfolio Telemetry Card */}
      <div className="p-4 border-t border-white/5 space-y-3 bg-[#050505]">
        {/* Safety Seatbelt State Pill */}
        <div
          className={`p-3 rounded-xl border flex flex-col gap-1.5 transition-all ${
            isTripped
              ? 'border-red-500/50 bg-red-950/20 text-red-200'
              : 'border-white/5 bg-white/[0.02] text-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-mono text-neutral-400 text-[10px] uppercase">
              Safety Harness
            </span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isTripped ? 'bg-red-400' : 'bg-emerald-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isTripped ? 'bg-red-500' : 'bg-emerald-400'
                  }`}
                />
              </span>
              <span
                className={`font-mono font-bold text-[10px] ${
                  isTripped ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {isTripped ? 'CIRCUIT TRIPPED' : 'SEATBELT ARMED'}
              </span>
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-1 border-t border-white/5 text-xs font-mono">
            <span className="text-[10px] text-neutral-500">Portfolio AUM</span>
            <span className="text-white font-semibold tabular-nums">
              ${equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Hackathon Attribution & External Links */}
        <div className="flex items-center justify-between px-1 text-[11px] text-neutral-500 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
            Bitget S2 · Track 2
          </span>
          <a
            href="https://github.com/Frankydice/bitget-aegis24"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 h-screen sticky top-0 border-r border-white/5 z-30">
        {content}
      </aside>

      {/* Mobile Slide-out Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full shadow-2xl z-10 border-r border-white/10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
