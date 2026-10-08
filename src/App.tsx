import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { AgentGraphVisualizer } from './components/AgentGraphVisualizer';
import { AnalysisTerminal } from './components/AnalysisTerminal';
import { ReportViewer } from './components/ReportViewer';
import { PortfolioDesk } from './components/PortfolioDesk';
import { MemoryLogView } from './components/MemoryLogView';
import { BacktestLab } from './components/BacktestLab';
import { SettingsModal } from './components/SettingsModal';
import { FullAnalysisReport, MemoryLogEntry, PortfolioState, SystemConfig } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'terminal' | 'report' | 'portfolio' | 'memory' | 'backtest'
  >('terminal');
  const [report, setReport] = useState<FullAnalysisReport | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const [memoryLogs, setMemoryLogs] = useState<MemoryLogEntry[]>([]);
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStage, setActiveStage] = useState(1);

  // Initial Data Fetch
  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then(setPortfolio)
      .catch(console.error);

    fetch('/api/memory')
      .then((r) => r.json())
      .then(setMemoryLogs)
      .catch(console.error);

    fetch('/api/config')
      .then((r) => r.json())
      .then(setConfig)
      .catch(console.error);

    // Fetch latest seeded report if available
    fetch('/api/reports')
      .then((r) => r.json())
      .then((reports) => {
        if (reports && reports.length > 0) {
          fetch(`/api/reports/${reports[0].id}`)
            .then((r) => r.json())
            .then(setReport)
            .catch(console.error);
        }
      })
      .catch(console.error);
  }, []);

  const handleRunAnalysis = async (ticker: string, date: string) => {
    setIsAnalyzing(true);
    setActiveStage(1);

    // Staged progression animation through LangGraph nodes
    const stageTimer1 = setTimeout(() => setActiveStage(2), 700);
    const stageTimer2 = setTimeout(() => setActiveStage(3), 1400);
    const stageTimer3 = setTimeout(() => setActiveStage(4), 2100);
    const stageTimer4 = setTimeout(() => setActiveStage(5), 2800);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: ticker, date }),
      });
      const data = await res.json();
      setReport(data);

      // Refresh memory logs after new analysis
      const memRes = await fetch('/api/memory');
      const memData = await memRes.json();
      setMemoryLogs(memData);
    } catch (err) {
      console.error('Failed to run analysis:', err);
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      clearTimeout(stageTimer4);
      setIsAnalyzing(false);
    }
  };

  const handleExecuteTrade = async (trade: {
    ticker: string;
    action: 'BUY' | 'SELL';
    shares: number;
    price: number;
    rating: string;
  }) => {
    try {
      const res = await fetch('/api/portfolio/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trade),
      });
      const data = await res.json();
      if (data.portfolio) {
        setPortfolio(data.portfolio);
      }
    } catch (err) {
      console.error('Failed to execute trade:', err);
    }
  };

  const handleSettleMemory = async (id: string) => {
    try {
      const res = await fetch('/api/memory/settle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.entry) {
        setMemoryLogs((prev) =>
          prev.map((item) => (item.id === id ? data.entry : item))
        );
      }
    } catch (err) {
      console.error('Failed to settle memory entry:', err);
    }
  };

  const handleSaveConfig = async (newCfg: SystemConfig) => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCfg),
      });
      const data = await res.json();
      setConfig(data);
    } catch (err) {
      console.error('Failed to save config:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1418] text-[#e4e8eb] flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSettings={() => setIsSettingsOpen(true)}
        hasActiveReport={!!report}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'terminal' && (
          <div className="space-y-6">
            <AgentGraphVisualizer
              report={report}
              isAnalyzing={isAnalyzing}
              activeStage={activeStage}
            />

            <AnalysisTerminal
              report={report}
              isAnalyzing={isAnalyzing}
              onRunAnalysis={handleRunAnalysis}
              onExecuteTrade={handleExecuteTrade}
              onViewReport={() => setActiveTab('report')}
            />
          </div>
        )}

        {activeTab === 'report' && <ReportViewer report={report} />}

        {activeTab === 'portfolio' && portfolio && (
          <PortfolioDesk
            portfolio={portfolio}
            onTrade={handleExecuteTrade}
          />
        )}

        {activeTab === 'memory' && (
          <MemoryLogView logs={memoryLogs} onSettle={handleSettleMemory} />
        )}

        {activeTab === 'backtest' && <BacktestLab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#263238] bg-[#131a1f] py-4 text-center text-xs font-mono text-[#5d6670]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            TradingAgents Framework · Tauric Research · Quantitative LLM Trading System
          </div>
          <div className="flex items-center gap-3">
            <span>Model Tiers: {config?.deepThinkModel || 'gemini-2.5-pro'}</span>
            <span>•</span>
            <span className="text-[#14c290]">Port 3000 Active</span>
          </div>
        </div>
      </footer>

      {config && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          config={config}
          onSaveConfig={handleSaveConfig}
        />
      )}
    </div>
  );
};
