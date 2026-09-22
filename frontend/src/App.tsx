import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MetricsGrid } from './components/MetricsGrid';
import { TradingDesk } from './components/TradingDesk';
import { AgentDebateStream } from './components/AgentDebateStream';
import { RiskSeatbelt } from './components/RiskSeatbelt';
import { EventTerminal } from './components/EventTerminal';
import { BacktestView } from './components/BacktestView';
import { PaperLogsTable } from './components/PaperLogsTable';
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

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('desk');
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [market, setMarket] = useState<MarketData | null>(null);
  const [debates, setDebates] = useState<DebateRecord[]>([]);
  const [evaluations, setEvaluations] = useState<RiskEvaluation[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [paperLogs, setPaperLogs] = useState<PaperLogEntry[]>([]);
  const [backtestReport, setBacktestReport] = useState<BacktestReport | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NVDAUSDT');

  const fetchAllData = async () => {
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
      setDebates(debatesData.debates || []);
      setEvaluations(evalsData.evaluations || []);
      setPositions(positionsData.positions || []);
      setPaperLogs(logsData.logs || []);
      setBacktestReport(backtestData);
    } catch (e) {
      console.error("Data polling error:", e);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-bg-darkest text-slate-100 flex flex-col font-sans">
      <Header
        status={status}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Core Institutional Performance Metrics */}
        <MetricsGrid report={backtestReport} />

        {/* Tab 1: 24/7 Agent Desk */}
        {activeTab === 'desk' && (
          <div className="space-y-6">
            <EventTerminal onEventProcessed={fetchAllData} />
            <TradingDesk
              market={market}
              positions={positions}
              onSelectSymbol={setSelectedSymbol}
              selectedSymbol={selectedSymbol}
            />
          </div>
        )}

        {/* Tab 2: Agent Debate Swarm */}
        {activeTab === 'debate' && (
          <AgentDebateStream debates={debates} />
        )}

        {/* Tab 3: Risk Harness ("The Seatbelt") */}
        {activeTab === 'risk' && (
          <RiskSeatbelt evaluations={evaluations} />
        )}

        {/* Tab 4: 60d Backtest & Out of Sample */}
        {activeTab === 'backtest' && (
          <BacktestView report={backtestReport} />
        )}

        {/* Tab 5: Paper Trading Audit Logs */}
        {activeTab === 'paper' && (
          <PaperLogsTable logs={paperLogs} />
        )}
      </main>

      {/* Footer with Bitget Hackathon Credentials */}
      <footer className="border-t border-bg-border py-4 px-6 text-center text-xs font-mono text-slate-400">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2">
          <span>Aegis24 · Bitget AI Hackathon Season 2 (Track 2: Agentic Trading)</span>
          <span className="text-brand-cyan">#AgenticTrading #BuilderOS #BitgetHackathon</span>
        </div>
      </footer>
    </div>
  );
}
