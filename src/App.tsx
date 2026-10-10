import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { AgentGraphVisualizer } from './components/AgentGraphVisualizer';
import { AnalysisTerminal } from './components/AnalysisTerminal';
import { ReportViewer } from './components/ReportViewer';
import { PortfolioDesk } from './components/PortfolioDesk';
import { MemoryLogView } from './components/MemoryLogView';
import { BacktestLab } from './components/BacktestLab';
import { SettingsModal } from './components/SettingsModal';
import { LoginScreen } from './components/LoginScreen';
import { OnboardingWalkthrough } from './components/OnboardingWalkthrough';
import { listenToAuth, logoutGoogle } from './firebase';
import {
  FullAnalysisReport,
  MemoryLogEntry,
  PortfolioState,
  SystemConfig,
  UserPreferences,
  UserProfile,
} from './types';

const DEFAULT_WATCHLIST = ['NVDA', 'AAPL', 'MSFT', 'TSLA', 'BTC-USD', 'ETH-USD'];

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Watchlist & Onboarding Customization State
  const [watchlist, setWatchlist] = useState<string[]>(DEFAULT_WATCHLIST);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<
    'terminal' | 'report' | 'portfolio' | 'memory' | 'backtest'
  >('terminal');
  const [report, setReport] = useState<FullAnalysisReport | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const [memoryLogs, setMemoryLogs] = useState<MemoryLogEntry[]>([]);
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStage, setActiveStage] = useState(1);

  // Load preferences for user
  const loadUserPreferences = (user: UserProfile) => {
    try {
      const storageKey = `tauric_prefs_${user.email}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: UserPreferences = JSON.parse(saved);
        setPreferences(parsed);
        if (parsed.watchlist && parsed.watchlist.length > 0) {
          setWatchlist(parsed.watchlist);
        }
        if (!parsed.onboardingCompleted) {
          setIsWalkthroughOpen(true);
        }
      } else {
        // First-time Google user -> launch walkthrough
        setIsWalkthroughOpen(true);
      }
    } catch (e) {
      console.warn('Failed to load user preferences:', e);
      setIsWalkthroughOpen(true);
    }
  };

  // Initialize Auth listener
  useEffect(() => {
    const unsubscribe = listenToAuth((user) => {
      setCurrentUser(user);
      setAuthInitialized(true);
      if (user) {
        setIsLoginModalOpen(false);
        loadUserPreferences(user);
      }
    });
    return () => unsubscribe();
  }, []);

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
      .then((cfg) => {
        setConfig(cfg);
        setHasGeminiKey(!!cfg.hasGeminiKey);
      })
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
      setHasGeminiKey(!!data.hasGeminiKey);
    } catch (err) {
      console.error('Failed to save config:', err);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setCurrentUser(null);
    setIsGuestMode(false);
    setPreferences(null);
    setWatchlist(DEFAULT_WATCHLIST);
  };

  const handleAddToWatchlist = (ticker: string) => {
    const clean = ticker.toUpperCase().trim();
    if (!clean) return;
    setWatchlist((prev) => {
      if (prev.includes(clean)) return prev;
      const updated = [...prev, clean];
      if (currentUser) {
        const storageKey = `tauric_prefs_${currentUser.email}`;
        const currentPrefs = preferences || {
          investmentGoal: 'High-Growth & Momentum',
          riskTolerance: 'Balanced',
          selectedIndustries: ['ai_semis'],
          watchlist: updated,
          onboardingCompleted: true,
        };
        const updatedPrefs = { ...currentPrefs, watchlist: updated };
        setPreferences(updatedPrefs);
        try {
          localStorage.setItem(storageKey, JSON.stringify(updatedPrefs));
        } catch {}
      }
      return updated;
    });
  };

  const handleRemoveFromWatchlist = (ticker: string) => {
    setWatchlist((prev) => {
      const updated = prev.filter((t) => t !== ticker);
      if (currentUser) {
        const storageKey = `tauric_prefs_${currentUser.email}`;
        if (preferences) {
          const updatedPrefs = { ...preferences, watchlist: updated };
          setPreferences(updatedPrefs);
          try {
            localStorage.setItem(storageKey, JSON.stringify(updatedPrefs));
          } catch {}
        }
      }
      return updated;
    });
  };

  const handleWalkthroughComplete = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    setWatchlist(newPrefs.watchlist);
    setIsWalkthroughOpen(false);

    if (currentUser) {
      try {
        localStorage.setItem(
          `tauric_prefs_${currentUser.email}`,
          JSON.stringify(newPrefs)
        );
      } catch (e) {
        console.warn('Failed to save preferences to localStorage:', e);
      }
    }

    // Automatically analyze the first stock from their newly customized watchlist
    if (newPrefs.watchlist.length > 0) {
      handleRunAnalysis(
        newPrefs.watchlist[0],
        new Date().toISOString().split('T')[0]
      );
    }
  };

  // If not yet signed in and haven't opted for guest mode, show private login gate
  if (authInitialized && !currentUser && !isGuestMode) {
    return (
      <LoginScreen
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsGuestMode(false);
          loadUserPreferences(user);
        }}
        onContinueGuest={() => setIsGuestMode(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1418] text-[#e4e8eb] flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSettings={() => setIsSettingsOpen(true)}
        hasActiveReport={!!report}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        hasGeminiKey={hasGeminiKey}
        onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
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
              watchlist={watchlist}
              onAddToWatchlist={handleAddToWatchlist}
              onRemoveFromWatchlist={handleRemoveFromWatchlist}
              onOpenCustomizeWalkthrough={() => setIsWalkthroughOpen(true)}
            />
          </div>
        )}

        {activeTab === 'report' && <ReportViewer report={report} />}

        {activeTab === 'portfolio' && portfolio && (
          <PortfolioDesk portfolio={portfolio} onTrade={handleExecuteTrade} />
        )}

        {activeTab === 'memory' && (
          <MemoryLogView logs={memoryLogs} onSettle={handleSettleMemory} />
        )}

        {activeTab === 'backtest' && <BacktestLab />}
      </main>

      {/* Footer with Risk & AI Disclaimer */}
      <footer className="border-t border-[#263238] bg-[#131a1f] py-6 text-xs text-[#9aa6af]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="p-4 rounded-xl bg-[#182026] border border-[#263238] text-[11px] leading-relaxed text-[#9aa6af] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#e4e8eb] uppercase tracking-wider font-mono">
              <span className="text-[#e5a93b]">⚠️</span>
              <span>Important Risk & AI Educational Disclaimer</span>
            </div>
            <p>
              <strong>AI-Generated Information for Reference Only:</strong> Artificial intelligence (AI) and automated algorithms were used to pull, analyze, and synthesize the data, sentiments, ratings, and estimates shown on this platform. All outputs are provided strictly for <em>educational and reference purposes only</em>. There is no warranty, guarantee, or promise of profit or financial gain, express or implied.
            </p>
            <p>
              <strong>Risk of Loss & Market Changes:</strong> Stock, option, and cryptocurrency markets are volatile and subject to real-world risks. Prices, company financials, and market conditions change constantly. Trading and investing carry substantial financial risk—<strong>you can lose money</strong>. Past performance and backtests do not guarantee future results. This platform does not provide investment or financial advice. Always perform your own due diligence before risking real capital.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#5d6670] pt-2 border-t border-[#263238]/60">
            <div>
              TradingAgents Framework · Tauric Research · Educational Multi-Agent System
            </div>
            <div className="flex items-center gap-3">
              <span>
                {hasGeminiKey ? 'Gemini 3.8 Active' : 'Quantitative Engine'}
              </span>
              <span>•</span>
              <span>
                {currentUser ? `User: ${currentUser.email}` : 'Guest Mode'}
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Onboarding Customization Walkthrough Modal */}
      {isWalkthroughOpen && currentUser && (
        <OnboardingWalkthrough
          currentUser={currentUser}
          isOpen={isWalkthroughOpen}
          onClose={() => setIsWalkthroughOpen(false)}
          onComplete={handleWalkthroughComplete}
          initialPreferences={preferences}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && config && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          config={config}
          onSaveConfig={handleSaveConfig}
        />
      )}

      {/* Header Google Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative max-w-md w-full">
            <LoginScreen
              onLoginSuccess={(user) => {
                setCurrentUser(user);
                setIsLoginModalOpen(false);
                loadUserPreferences(user);
              }}
              onContinueGuest={() => {
                setIsLoginModalOpen(false);
                setIsGuestMode(true);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
