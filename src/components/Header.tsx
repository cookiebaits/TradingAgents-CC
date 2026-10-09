import React from 'react';
import {
  Activity,
  BarChart3,
  BookOpen,
  Briefcase,
  History,
  KeyRound,
  LogOut,
  Settings,
  Shield,
  Sparkles,
  User,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'terminal' | 'report' | 'portfolio' | 'memory' | 'backtest';
  setActiveTab: (tab: 'terminal' | 'report' | 'portfolio' | 'memory' | 'backtest') => void;
  openSettings: () => void;
  hasActiveReport: boolean;
  currentUser: any;
  onLogout: () => void;
  onOpenLogin: () => void;
  hasGeminiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openSettings,
  hasActiveReport,
  currentUser,
  onLogout,
  onOpenLogin,
  hasGeminiKey,
}) => {
  return (
    <header className="border-b border-[#263238] bg-[#131a1f]/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#14c290]/10 border border-[#14c290]/30 flex items-center justify-center text-[#14c290] font-mono font-bold text-sm">
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
              <span className="text-[#14c290]">AI Multi-Agent Desk</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Simplified Plain-English Wording */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0f1418] p-1 rounded-lg border border-[#263238]">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'terminal'
                ? 'bg-[#182026] text-[#14c290] shadow-sm border border-[#14c290]/30'
                : 'text-[#9aa6af] hover:text-[#e4e8eb] hover:bg-[#182026]/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>AI Committee</span>
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
            <span>Decision History</span>
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
            <span>Past Testing</span>
          </button>
        </nav>

        {/* Right Section: Key Status, User Profile & Settings */}
        <div className="flex items-center gap-3">
          {/* GEMINI_API_KEY Indicator */}
          <button
            onClick={openSettings}
            title="Click to view Dokploy & Gemini API Key Settings"
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border transition-all ${
              hasGeminiKey
                ? 'bg-[#14c290]/10 border-[#14c290]/30 text-[#14c290]'
                : 'bg-[#e5a93b]/10 border-[#e5a93b]/30 text-[#e5a93b]'
            }`}
          >
            <KeyRound className="w-3 h-3" />
            <span>
              {hasGeminiKey ? 'GEMINI_API_KEY Connected' : 'Using Quantitative Engine'}
            </span>
          </button>

          {/* User Account / Google Login Profile */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-[#182026] pl-2 pr-1 py-1 rounded-full border border-[#263238]">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-6 h-6 rounded-full border border-[#14c290]/50"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#14c290]/20 text-[#14c290] flex items-center justify-center text-[10px] font-bold font-mono">
                  {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                </div>
              )}
              <span className="text-xs text-[#e4e8eb] font-medium max-w-[120px] truncate hidden sm:inline">
                {currentUser.displayName || currentUser.email}
              </span>
              <button
                onClick={onLogout}
                title="Sign out of Google"
                className="p-1 rounded-full text-[#9aa6af] hover:text-[#ef6f63] hover:bg-[#131a1f] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#14c290] hover:bg-[#14c290]/90 text-[#0f1418] transition-all shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>Google Sign-In</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={openSettings}
            className="p-2 rounded-lg text-[#9aa6af] hover:text-[#e4e8eb] hover:bg-[#182026] border border-transparent hover:border-[#263238] transition-colors"
            title="Configure Dokploy Settings, LLM Providers and Agent Parameters"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
