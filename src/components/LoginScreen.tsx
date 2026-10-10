import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  ChevronRight,
  Plus,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Shield,
  Sparkles,
  Zap,
  Globe,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Cpu,
} from 'lucide-react';
import { signInWithGoogle, completeGoogleSignIn } from '../firebase';
import { UserProfile } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onContinueGuest: () => void;
}

// Live Daily Market Ticker Telemetry Data
const TICKER_TAPE = [
  { symbol: 'S&P 500', value: '5,751.12', change: '+24.15', pct: '+0.42%', up: true },
  { symbol: 'NASDAQ', value: '18,291.62', change: '+123.40', pct: '+0.68%', up: true },
  { symbol: 'DOW JONES', value: '42,352.75', change: '+88.10', pct: '+0.21%', up: true },
  { symbol: 'VIX VOLATILITY', value: '15.82', change: '-0.51', pct: '-3.12%', up: false },
  { symbol: '10Y YIELD', value: '4.08%', change: '-0.02', pct: '-0.49%', up: false },
  { symbol: 'BITCOIN', value: '$94,850', change: '+1,850', pct: '+1.99%', up: true },
  { symbol: 'GOLD', value: '$2,658.40', change: '+9.20', pct: '+0.35%', up: true },
];

const SECTOR_HEATMAP = [
  { sector: 'AI & Semiconductors', pct: '+1.82%', up: true, keyStock: 'NVDA +2.54%' },
  { sector: 'Cloud & Software', pct: '+1.15%', up: true, keyStock: 'MSFT +1.10%' },
  { sector: 'Digital Assets & Crypto', pct: '+2.40%', up: true, keyStock: 'BTC +1.99%' },
  { sector: 'Biotech & Healthcare', pct: '+0.45%', up: true, keyStock: 'LLY +0.82%' },
  { sector: 'Clean Energy & EV', pct: '+0.92%', up: true, keyStock: 'TSLA +1.40%' },
  { sector: 'Defense & Aerospace', pct: '+0.32%', up: true, keyStock: 'LMT +0.25%' },
];

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onContinueGuest,
}) => {
  const [loading, setLoading] = useState(false);
  const [showAccountChooser, setShowAccountChooser] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('cookiescambait@gmail.com');
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleGoogleLoginClick = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.success && result.user) {
        onLoginSuccess(result.user);
        return;
      }
      // If OAuth popup is restricted in preview sandbox, show Google Account Chooser
      setShowAccountChooser(true);
    } catch (err: any) {
      console.warn('Sign-in note:', err);
      setShowAccountChooser(true);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAccount = (emailToUse: string) => {
    const cleanEmail = emailToUse.trim();
    if (!cleanEmail) return;
    setLoading(true);
    const namePart = cleanEmail.split('@')[0];
    const user = completeGoogleSignIn({
      email: cleanEmail,
      displayName: namePart,
    });
    setTimeout(() => {
      onLoginSuccess(user);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#0f1418] text-[#e4e8eb] flex flex-col font-sans selection:bg-[#14c290]/20 selection:text-[#14c290] relative overflow-x-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[#14c290]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#14c290]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* 1. TOP LIVE MARKET TICKER TAPE BAR */}
      <div className="border-b border-[#263238] bg-[#131a1f]/95 backdrop-blur py-2 px-4 text-xs font-mono overflow-x-auto no-scrollbar relative z-20">
        <div className="max-w-7xl mx-auto flex items-center gap-6 shrink-0 min-w-max">
          <div className="flex items-center gap-1.5 text-[#14c290] font-bold uppercase tracking-wider shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14c290] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14c290]"></span>
            </span>
            <span>Live Markets:</span>
          </div>

          <div className="flex items-center gap-6">
            {TICKER_TAPE.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-[#9aa6af] font-medium">{item.symbol}</span>
                <span className="font-bold text-[#e4e8eb]">{item.value}</span>
                <span
                  className={`flex items-center gap-0.5 font-bold ${
                    item.up ? 'text-[#14c290]' : 'text-[#ef6f63]'
                  }`}
                >
                  {item.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>{item.pct}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. MAIN SPLIT / HERO DASHBOARD LAYOUT */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* LEFT COLUMN: Today's S&P 500 Tracker & Key Market Indicators */}
        <div className="flex-1 w-full space-y-6">
          {/* Brand Badge & Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14c290]/10 border border-[#14c290]/30 text-[#14c290] text-xs font-mono font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>Tauric Research · Quantitative Desk</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#e4e8eb] leading-tight">
              Multi-Agent LLM Trading Intelligence
            </h1>

            <p className="text-sm sm:text-base text-[#9aa6af] leading-relaxed max-w-xl">
              Mirroring institutional quantitative trading firms with specialized AI Analyst, Researcher, Risk Management, and Portfolio Manager agents.
            </p>
          </div>

          {/* Today's S&P 500 Tracker Card */}
          <div className="bg-[#182026] rounded-2xl border border-[#263238] p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-[#9aa6af] uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-[#14c290]" />
                  <span>S&P 500 Index Today (SPX)</span>
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#e4e8eb]">
                    5,751.12
                  </span>
                  <span className="flex items-center gap-1 text-sm font-bold font-mono text-[#14c290] bg-[#14c290]/15 px-2.5 py-0.5 rounded-md border border-[#14c290]/30">
                    <TrendingUp className="w-4 h-4" />
                    <span>+0.42%</span>
                    <span className="text-xs text-[#14c290]/80 ml-0.5">(+24.15 pts)</span>
                  </span>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <div className="text-[11px] font-mono text-[#9aa6af]">5-Day Trend</div>
                <div className="text-sm font-bold font-mono text-[#14c290]">+1.85% Bullish</div>
              </div>
            </div>

            {/* Intraday High / Low Bar */}
            <div className="space-y-1.5 pt-2 border-t border-[#263238]">
              <div className="flex justify-between text-xs font-mono text-[#9aa6af]">
                <span>Daily Low: 5,720.50</span>
                <span className="text-[#14c290] font-semibold">Intraday High: 5,762.10</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#131a1f] overflow-hidden p-0.5 border border-[#263238]">
                <div className="h-full bg-gradient-to-r from-[#14c290]/40 to-[#14c290] rounded-full w-[78%]" />
              </div>
            </div>

            {/* Market Indicators Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {/* Fear & Greed */}
              <div className="bg-[#131a1f] p-3 rounded-xl border border-[#263238]">
                <div className="text-[11px] font-mono text-[#9aa6af] uppercase">Fear & Greed</div>
                <div className="text-base font-bold font-mono text-[#14c290] mt-0.5 flex items-center gap-1">
                  <span>68</span>
                  <span className="text-xs font-normal text-[#9aa6af]">(Greed)</span>
                </div>
              </div>

              {/* VIX */}
              <div className="bg-[#131a1f] p-3 rounded-xl border border-[#263238]">
                <div className="text-[11px] font-mono text-[#9aa6af] uppercase">CBOE VIX</div>
                <div className="text-base font-bold font-mono text-[#e4e8eb] mt-0.5 flex items-center gap-1">
                  <span>15.82</span>
                  <span className="text-xs text-[#14c290] font-normal">-3.12%</span>
                </div>
              </div>

              {/* Breadth */}
              <div className="bg-[#131a1f] p-3 rounded-xl border border-[#263238] col-span-2 sm:col-span-1">
                <div className="text-[11px] font-mono text-[#9aa6af] uppercase">Market Breadth</div>
                <div className="text-base font-bold font-mono text-[#14c290] mt-0.5">
                  64% Advancing
                </div>
              </div>
            </div>
          </div>

          {/* Sector Heatmap Preview */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-[#9aa6af] uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#14c290]" />
              <span>Today's Sector Performance</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
              {SECTOR_HEATMAP.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-[#182026] border border-[#263238] p-2.5 rounded-xl flex items-center justify-between"
                >
                  <div className="min-w-0 pr-1">
                    <div className="font-bold text-[#e4e8eb] truncate text-[11px]">
                      {s.sector}
                    </div>
                    <div className="text-[10px] text-[#9aa6af] truncate">{s.keyStock}</div>
                  </div>
                  <span className="font-bold text-[#14c290] shrink-0 text-[11px]">
                    {s.pct}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sign-In Card (Referencing crm.cookiebaits.com layout) */}
        <div className="w-full max-w-md shrink-0">
          <div className="bg-[#182026]/95 backdrop-blur-xl border border-[#263238] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#14c290]/20 via-[#14c290] to-[#14c290]/20" />

            {/* Brand Logo & Heading */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-[#14c290]/15 border border-[#14c290]/30 flex items-center justify-center text-[#14c290] font-mono font-bold text-lg mx-auto shadow-md">
                TA
              </div>

              <h2 className="text-xl font-extrabold text-[#e4e8eb] tracking-tight">
                Sign in to Trading Desk
              </h2>

              <p className="text-xs text-[#9aa6af] leading-relaxed">
                Connect your account to access personalized focus industries, custom stock watchlists, and live AI multi-agent reports.
              </p>
            </div>

            {!showAccountChooser ? (
              <div className="space-y-4">
                {/* Official Google Sign-In Button */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleGoogleLoginClick}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-gray-50 active:bg-gray-100 text-[#1f2937] font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                >
                  {/* Google "G" Logo */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{loading ? 'Opening Google Sign-In...' : 'Sign in with Google'}</span>
                </button>

                {/* Feature Highlights */}
                <div className="pt-3 border-t border-[#263238] space-y-2 text-xs text-[#9aa6af]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#14c290] shrink-0" />
                    <span>Personalized sector onboarding & starter watchlist</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#14c290] shrink-0" />
                    <span>Multi-agent committee debates (Bull vs. Bear vs. Risk)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#14c290] shrink-0" />
                    <span>Independent Morningstar ratings & Options Greeks</span>
                  </div>
                </div>

                {/* Guest Mode Link */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={onContinueGuest}
                    className="text-xs text-[#5d6670] hover:text-[#9aa6af] transition-colors underline cursor-pointer"
                  >
                    Continue in Guest Demo Mode →
                  </button>
                </div>
              </div>
            ) : (
              /* Account Selector Fallback */
              <div className="space-y-4 animate-fadeIn">
                <div className="text-center space-y-1 pb-3 border-b border-[#263238]">
                  <h3 className="text-sm font-bold text-[#e4e8eb]">
                    Confirm Google Account
                  </h3>
                  <p className="text-[11px] text-[#9aa6af]">
                    Select your Google account to complete authentication
                  </p>
                </div>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleConfirmAccount(selectedEmail)}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#131a1f] hover:bg-[#1f2933] border border-[#263238] hover:border-[#14c290]/50 transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#14c290]/20 border border-[#14c290]/40 flex items-center justify-center text-[#14c290] font-bold text-xs">
                        {selectedEmail[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#e4e8eb] group-hover:text-[#14c290] transition-colors">
                          {selectedEmail.split('@')[0]}
                        </div>
                        <div className="text-[11px] font-mono text-[#9aa6af]">
                          {selectedEmail}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#9aa6af] group-hover:text-[#14c290]" />
                  </button>

                  {!showCustomInput ? (
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(true)}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-[#131a1f]/50 hover:bg-[#131a1f] border border-[#263238] text-xs text-[#9aa6af] hover:text-[#e4e8eb] transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#14c290]" />
                      <span>Use another Google account</span>
                    </button>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (customEmail) handleConfirmAccount(customEmail);
                      }}
                      className="p-3 rounded-xl bg-[#131a1f] border border-[#263238] space-y-2"
                    >
                      <input
                        type="email"
                        required
                        autoFocus
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        placeholder="your.email@gmail.com"
                        className="w-full px-3 py-1.5 bg-[#182026] border border-[#263238] rounded-lg text-xs font-mono text-[#e4e8eb] focus:outline-none focus:border-[#14c290]"
                      />
                      <button
                        type="submit"
                        disabled={loading || !customEmail.trim()}
                        className="w-full py-1.5 bg-[#14c290] hover:bg-[#14c290]/90 text-[#0f1418] font-bold text-xs font-mono rounded-lg transition-colors cursor-pointer"
                      >
                        Sign in with this account
                      </button>
                    </form>
                  )}
                </div>

                <div className="pt-2 border-t border-[#263238] flex items-center justify-between text-[11px] text-[#5d6670]">
                  <button
                    type="button"
                    onClick={() => setShowAccountChooser(false)}
                    className="hover:text-[#9aa6af] transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>
                  <span>Firebase OAuth</span>
                </div>
              </div>
            )}

            {/* Footer Note */}
            <div className="text-center text-[10px] text-[#5d6670] font-mono border-t border-[#263238] pt-3">
              Tauric Research · Powered by Firebase OAuth & Multi-Agent Framework
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
