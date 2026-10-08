import React from 'react';
import {
  Activity,
  BarChart3,
  BookOpen,
  Briefcase,
  History,
  Settings,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'terminal' | 'report' | 'portfolio' | 'memory' | 'backtest';
  setActiveTab: (tab: 'terminal' | 'report' | 'portfolio' | 'memory' | 'backtest') => void;
  openSettings: () => void;
  hasActiveReport: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openSettings,
  hasActiveReport,
}) => {
  return (
    <header className="border-b border-[#263238] bg-[#131a1f]/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#14c290]/10 border border-[#14c290]/30 flex items-center justify-center text-[#14c290] font-mono font-bold text-lg">
              TA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-[#e4e8eb] flex items-center gap-1.5">
                  TradingAgents
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#14c290]/15 text-[#14c290] border border-[#14c290]/30">
                    v0.6.0
                  </span>
                </span>
              </div>
              <div className="text-[11px] text-[#9aa6af] font-mono flex items-center gap-1.5">
                <span>Tauric Research</span>
                <span>•</span>
                <span className="text-[#14c290]">Multi-Agent Graph Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#0f1418] p-1 rounded-lg border border-[#263238]">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'terminal'
                ? 'bg-[#182026] text-[#14c290] shadow-sm border border-[#14c290]/30'
                : 'text-[#9aa6af] hover:text-[#e4e8eb] hover:bg-[#182026]/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Agent Terminal</span>
          </button>

          {hasActiveReport && (
            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'report'
                  ? 'bg-[#182026] text-[#14c290] shadow-sm border border-[#14c290]/30'
                  : 'text-[#9aa6af] hover:text-[#e4e8eb] hover:bg-[#182026]/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Full Report</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'portfolio'
                ? 'bg-[#182026] text-[#14c290] shadow-sm border border-[#14c290]/30'
                : 'text-[#9aa6af] hover:text-[#e4e8eb] hover:bg-[#182026]/50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Trading Desk</span>
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'memory'
                ? 'bg-[#182026] text-[#14c290] shadow-sm border border-[#14c290]/30'
                : 'text-[#9aa6af] hover:text-[#e4e8eb] hover:bg-[#182026]/50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Memory Log</span>
          </button>

          <button
            onClick={() => setActiveTab('backtest')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'backtest'
                ? 'bg-[#182026] text-[#14c290] shadow-sm border border-[#14c290]/30'
                : 'text-[#9aa6af] hover:text-[#e4e8eb] hover:bg-[#182026]/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Backtesting</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={openSettings}
            className="p-2 rounded-lg text-[#9aa6af] hover:text-[#e4e8eb] hover:bg-[#182026] border border-transparent hover:border-[#263238] transition-colors"
            title="Configure LLM Providers and Agent Graph Parameters"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
