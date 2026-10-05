import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { HeroLighting } from './components/HeroLighting';
import { HeroSection } from './components/HeroSection';
import { PrimaryDashboard } from './components/PrimaryDashboard';
import { CatalystTerminal } from './components/CatalystTerminal';
import { DeliberationOutput } from './components/DeliberationOutput';
import { MultiAxisExplorer } from './components/MultiAxisExplorer';
import { DislocationMatrix } from './components/DislocationMatrix';
import { RankedMarketTable } from './components/RankedMarketTable';
import { WhatIfCalculator } from './components/WhatIfCalculator';
import { HistoricalTrendView } from './components/HistoricalTrendView';
import { RecommendationsSection } from './components/RecommendationsSection';
import { TrustSection } from './components/TrustSection';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MotionShowcase } from './components/MotionShowcase';
import {
  api,
  SystemStatus,
  MarketData,
  DebateRecord,
  RiskEvaluation,
  Position,
  PaperLogEntry,
  BacktestReport
} from './services/api';
import { storage } from './utils/storage';

export default function App() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [market, setMarket] = useState<MarketData | null>(null);
  const [debates, setDebates] = useState<DebateRecord[]>([]);
  const [evaluations, setEvaluations] = useState<RiskEvaluation[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [paperLogs, setPaperLogs] = useState<PaperLogEntry[]>([]);
  const [backtestReport, setBacktestReport] = useState<BacktestReport | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string>(() => storage.getActiveSymbol('NVDAUSDT'));
  const [lastExecutionResult, setLastExecutionResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Parallel-style navigation state
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isMotionOpen, setIsMotionOpen] = useState<boolean>(false);

  const sectionIds = useMemo(
    () => [
      'hero',
      'dashboard',
      'catalyst-terminal',
      'deliberation-engine',
      'multi-axis-explorer',
      'risk-matrix',
      'live-rtokens',
      'what-if-sandbox',
      'equity-trajectory',
      'recommendations',
      'trust',
      'footer'
    ],
    []
  );

  const handleSelectSymbol = (sym: string) => {
    setSelectedSymbol(sym);
    storage.setActiveSymbol(sym);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchAllData = useCallback(async () => {
    try {
      const [
        statusData,
        marketData,
        debatesData,
        evalsData,
        positionsData,
        logsData,
        backtestData
      ] = await Promise.all([
        api.getStatus(),
        api.getMarket(),
        api.getDebates(),
        api.getRiskEvaluations(),
        api.getPositions(),
        api.getPaperLogs(),
        api.getBacktest()
      ]);

      setStatus(statusData);
      setMarket(marketData);
      setDebates(debatesData?.debates || []);
      setEvaluations(evalsData?.evaluations || []);
      setPositions(positionsData?.positions || []);
      setPaperLogs(logsData?.logs || []);
      setBacktestReport(backtestData);
    } catch (e) {
      console.error("Data polling error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 4000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  // Sync scroll position with active sidebar section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  const handleEventProcessed = (res?: any) => {
    if (res) {
      setLastExecutionResult(res);
    }
    fetchAllData();
  };

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-200 flex font-sans selection:bg-blue-500/20 selection:text-blue-200 antialiased">
      {/* 1. Parallel Persistent Desktop Sidebar & Mobile Slide-Out Drawer */}
      <Sidebar
        status={status}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#020202]">
        {/* Sticky Top Utility Nav */}
        <TopNav
          status={status}
          activeSection={activeSection}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onSimulateClick={() => handleNavigate('catalyst-terminal')}
          onOpenMotionShowcase={() => setIsMotionOpen(true)}
        />

        {/* Parallel Signature Ambient Background Guide Lines & Animated Lighting Canvas */}
        <div className="relative flex-1">
          <HeroLighting />

          <main className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-7xl mx-auto w-full space-y-16">
            {/* 1. Hero Overview & 5 At-A-Glance Stat Cards */}
            <ErrorBoundary fallbackTitle="Hero Section Recovered">
              <HeroSection
                report={backtestReport}
                status={status}
                isLoading={isLoading}
                onOpenMotionShowcase={() => setIsMotionOpen(true)}
              />
            </ErrorBoundary>

            {/* 2. Primary Live Desk: Asset Ribbon, Quote Hero, Macro/Sentiment Radars */}
            <ErrorBoundary fallbackTitle="Live Dashboard Recovered">
              <PrimaryDashboard
                market={market}
                status={status}
                selectedSymbol={selectedSymbol}
                onSelectSymbol={handleSelectSymbol}
                isLoading={isLoading}
              />
            </ErrorBoundary>

            {/* 3. Catalyst Terminal: Preset Shocks & Custom Shock Simulation */}
            <ErrorBoundary fallbackTitle="Catalyst Terminal Recovered">
              <CatalystTerminal onEventProcessed={handleEventProcessed} />
            </ErrorBoundary>

            {/* 4. Deliberation Output: Swarm Conviction & 5 Deterministic Gates */}
            <ErrorBoundary fallbackTitle="Deliberation Output Recovered">
              <DeliberationOutput
                latestEvaluation={evaluations[0] || null}
                latestDebate={debates[0] || null}
                lastExecutionResult={lastExecutionResult}
              />
            </ErrorBoundary>

            {/* 5. Deep-Dive Interactive Tool: Multi-Axis Explorer */}
            <ErrorBoundary fallbackTitle="Multi-Axis Explorer Recovered">
              <MultiAxisExplorer
                market={market}
                selectedSymbol={selectedSymbol}
                onSelectSymbol={handleSelectSymbol}
              />
            </ErrorBoundary>

            {/* 6. Dislocation Matrix: Weekend Liquidity & Fair Value Bounds */}
            <ErrorBoundary fallbackTitle="Dislocation Matrix Recovered">
              <DislocationMatrix
                market={market}
                selectedSymbol={selectedSymbol}
                onSelectSymbol={handleSelectSymbol}
              />
            </ErrorBoundary>

            {/* 7. Ranked Market Table: 24/7 rToken Opportunities Radar */}
            <ErrorBoundary fallbackTitle="Market Table Recovered">
              <RankedMarketTable
                market={market}
                positions={positions}
                onSelectSymbol={handleSelectSymbol}
              />
            </ErrorBoundary>

            {/* 8. What-If Strategy Simulator: Single-Trade Sandbox */}
            <ErrorBoundary fallbackTitle="What-If Sandbox Recovered">
              <WhatIfCalculator />
            </ErrorBoundary>

            {/* 9. Historical Trend View: 60d Equity Trajectory (IS vs OOS) */}
            <ErrorBoundary fallbackTitle="Historical Trend View Recovered">
              <HistoricalTrendView report={backtestReport} />
            </ErrorBoundary>

            {/* 10. Recommendations: Telemetry-Derived Action Plan */}
            <ErrorBoundary fallbackTitle="Recommendations Recovered">
              <RecommendationsSection
                market={market}
                status={status}
              />
            </ErrorBoundary>

            {/* 11. Trust Section: 3-Column Problem / Solution / Proof */}
            <ErrorBoundary fallbackTitle="Trust Section Recovered">
              <TrustSection />
            </ErrorBoundary>
          </main>
        </div>

        {/* 12. Footer: Cryptographic Audit Logs, Disclaimer, JSON/CSV Export */}
        <ErrorBoundary fallbackTitle="Footer Recovered">
          <Footer logs={paperLogs} />
        </ErrorBoundary>
      </div>

      {/* 13. High-Definition Broadcast Motion Design Showcase Player */}
      <MotionShowcase
        isOpen={isMotionOpen}
        onClose={() => setIsMotionOpen(false)}
      />
    </div>
  );
}
