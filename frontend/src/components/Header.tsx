import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, Menu, X, Shield, Activity, TrendingUp, Layers } from 'lucide-react';
import { SystemStatus } from '../services/api';

interface HeaderProps {
  status: SystemStatus | null;
}

export const Header: React.FC<HeaderProps> = ({ status }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  const equity = status?.account.total_equity_usdt ?? 101245.8;
  const initial = 100000;
  const pnl = equity - initial;
  const pnlPct = (pnl / initial) * 100;
  const isPositive = pnl >= 0;
  const isTripped = Boolean(status?.circuit_breaker?.tripped);

  const navLinks = [
    { href: '#hero', label: 'Overview' },
    { href: '#dashboard', label: 'Live Desk' },
    { href: '#catalyst-terminal', label: 'Shock Terminal' },
    { href: '#deliberation-engine', label: 'Deliberation & Gates' },
    { href: '#multi-axis-explorer', label: 'Asset Explorer' },
    { href: '#risk-matrix', label: 'Dislocation Matrix' },
    { href: '#live-rtokens', label: 'Market Radar' },
    { href: '#what-if-sandbox', label: 'What-If Tool' },
    { href: '#equity-trajectory', label: '60d Trajectory' },
    { href: '#recommendations', label: 'Action Plan' },
    { href: '#trust', label: 'Trust & Edge' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sections = navLinks.map(link => link.href.substring(1));
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="border-b border-white/[0.08] bg-[#08090b]/95 backdrop-blur-xl sticky top-0 z-50 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Wordmark & Hackathon Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#hero" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-teal via-brand-cyan to-white flex items-center justify-center shadow-lg shadow-brand-cyan/20 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4.5 h-4.5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-white font-mono">
                  AEGIS<span className="text-brand-cyan">24</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/40">
                  BITGET S2
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
                Autonomous 24/7 rToken Desk
              </p>
            </div>
          </a>
        </div>

        {/* Desktop Anchor Navigation Links */}
        <nav
          className="hidden xl:flex items-center gap-1 bg-[#0e1116] px-2 py-1 rounded-xl border border-white/[0.08] text-xs font-medium"
          aria-label="Section Navigation"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <button
                key={link.href}
                onClick={() => handleLinkClick(link.href)}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-brand-cyan/15 text-brand-cyan font-bold border border-brand-cyan/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Live Metrics & Seatbelt Pill */}
        <div className="flex items-center gap-3">
          {/* Seatbelt Armed/Tripped Status Pill */}
          {isTripped ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-950/80 border border-red-500/80 text-red-200 text-xs font-mono font-bold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-brand-red" />
              <span className="hidden sm:inline">CIRCUIT TRIPPED</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
              </span>
              <span className="hidden sm:inline">SEATBELT ARMED</span>
              <span className="sm:hidden">ARMED</span>
            </div>
          )}

          {/* Equity & PnL */}
          <div className="text-right hidden sm:block">
            <div className="text-[11px] text-slate-400 font-mono">
              AUM: <strong className="text-white font-mono">${equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </div>
            <div className={`text-[10px] font-mono font-bold ${isPositive ? 'text-brand-green' : 'text-brand-red'}`}>
              {isPositive ? '+' : ''}${pnl.toFixed(2)} ({isPositive ? '+' : ''}{pnlPct.toFixed(2)}%)
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-[#0e1116] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-brand-cyan" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-white/[0.08] bg-[#0c0e13]/98 px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto backdrop-blur-2xl">
          <div className="flex items-center justify-between px-2 py-1 mb-2 text-xs font-mono text-slate-400 border-b border-white/[0.06]">
            <span>Bitget OAuth Sub-Account:</span>
            <span className="text-brand-cyan">{status?.account?.account_uid || 'BG-SUB-94029-ISOLATED'}</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <button
                  key={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className={`px-3 py-2 rounded-lg text-left text-xs font-mono transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-brand-cyan/20 text-brand-cyan font-bold border border-brand-cyan/40'
                      : 'text-slate-300 hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
