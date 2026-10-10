import React, { useState, useMemo } from 'react';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  TrendingUp,
  Shield,
  Layers,
  Cpu,
  Cloud,
  Zap,
  Coins,
  HeartPulse,
  Radar,
  CreditCard,
  Smartphone,
  Star,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Target,
} from 'lucide-react';
import { UserPreferences, UserProfile } from '../types';

interface OnboardingWalkthroughProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (prefs: UserPreferences) => void;
  initialPreferences?: UserPreferences | null;
}

interface IndustryOption {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  defaultStocks: { ticker: string; name: string; type: 'stock' | 'crypto' }[];
}

const AVAILABLE_INDUSTRIES: IndustryOption[] = [
  {
    id: 'ai_semis',
    name: 'AI & Semiconductors',
    icon: Cpu,
    description: 'Foundries, GPU architectures, datacenter acceleration',
    defaultStocks: [
      { ticker: 'NVDA', name: 'NVIDIA Corp', type: 'stock' },
      { ticker: 'TSM', name: 'Taiwan Semiconductor', type: 'stock' },
      { ticker: 'AVGO', name: 'Broadcom Inc', type: 'stock' },
      { ticker: 'AMD', name: 'Advanced Micro Devices', type: 'stock' },
    ],
  },
  {
    id: 'cloud_software',
    name: 'Cloud Software & Tech',
    icon: Cloud,
    description: 'Enterprise software, generative platforms, hyperscalers',
    defaultStocks: [
      { ticker: 'MSFT', name: 'Microsoft Corp', type: 'stock' },
      { ticker: 'GOOGL', name: 'Alphabet Inc', type: 'stock' },
      { ticker: 'AMZN', name: 'Amazon.com Inc', type: 'stock' },
      { ticker: 'PLTR', name: 'Palantir Technologies', type: 'stock' },
    ],
  },
  {
    id: 'clean_energy',
    name: 'Clean Energy & EV',
    icon: Zap,
    description: 'Electric mobility, battery tech, renewable infrastructure',
    defaultStocks: [
      { ticker: 'TSLA', name: 'Tesla Inc', type: 'stock' },
      { ticker: 'ENPH', name: 'Enphase Energy', type: 'stock' },
      { ticker: 'RIVN', name: 'Rivian Automotive', type: 'stock' },
      { ticker: 'FSLR', name: 'First Solar Inc', type: 'stock' },
    ],
  },
  {
    id: 'crypto_digital',
    name: 'Crypto & Digital Assets',
    icon: Coins,
    description: 'Decentralized assets, sovereign reserves, crypto rails',
    defaultStocks: [
      { ticker: 'BTC-USD', name: 'Bitcoin USD', type: 'crypto' },
      { ticker: 'ETH-USD', name: 'Ethereum USD', type: 'crypto' },
      { ticker: 'SOL-USD', name: 'Solana USD', type: 'crypto' },
      { ticker: 'COIN', name: 'Coinbase Global', type: 'stock' },
    ],
  },
  {
    id: 'biotech_health',
    name: 'Biotechnology & Health',
    icon: HeartPulse,
    description: 'GLP-1 therapeutics, clinical pipeline, medical robotics',
    defaultStocks: [
      { ticker: 'LLY', name: 'Eli Lilly & Co', type: 'stock' },
      { ticker: 'NVO', name: 'Novo Nordisk', type: 'stock' },
      { ticker: 'VRTX', name: 'Vertex Pharmaceuticals', type: 'stock' },
      { ticker: 'UNH', name: 'UnitedHealth Group', type: 'stock' },
    ],
  },
  {
    id: 'defense_aero',
    name: 'Defense & Aerospace',
    icon: Radar,
    description: 'Aerospace primes, autonomous systems, defense logistics',
    defaultStocks: [
      { ticker: 'LMT', name: 'Lockheed Martin', type: 'stock' },
      { ticker: 'RTX', name: 'RTX Corporation', type: 'stock' },
      { ticker: 'BA', name: 'Boeing Co', type: 'stock' },
    ],
  },
  {
    id: 'fintech_payments',
    name: 'FinTech & Payments',
    icon: CreditCard,
    description: 'Payment networks, digital brokerages, financial infra',
    defaultStocks: [
      { ticker: 'V', name: 'Visa Inc', type: 'stock' },
      { ticker: 'MA', name: 'Mastercard Inc', type: 'stock' },
      { ticker: 'PYPL', name: 'PayPal Holdings', type: 'stock' },
      { ticker: 'HOOD', name: 'Robinhood Markets', type: 'stock' },
    ],
  },
  {
    id: 'consumer_tech',
    name: 'Consumer Tech & Hardware',
    icon: Smartphone,
    description: 'Global ecosystem hardware, digital consumer services',
    defaultStocks: [
      { ticker: 'AAPL', name: 'Apple Inc', type: 'stock' },
      { ticker: 'META', name: 'Meta Platforms', type: 'stock' },
      { ticker: 'NFLX', name: 'Netflix Inc', type: 'stock' },
    ],
  },
];

const STRATEGY_GOALS = [
  {
    id: 'growth',
    title: 'High-Growth & Momentum',
    desc: 'Targeting rapidly compounding tech leaders with secular market share expansion.',
    badge: 'High Alpha',
  },
  {
    id: 'compounders',
    title: 'Core Quality Compounders',
    desc: 'Resilient balance sheets with wide Morningstar moats and strong cash flows.',
    badge: 'Wide Moat',
  },
  {
    id: 'swing',
    title: 'Quantitative Swing & Breakouts',
    desc: 'Algorithmic signals across 14-day RSI momentum, EMA crossovers, and options Greeks.',
    badge: 'Active Desk',
  },
  {
    id: 'value',
    title: 'Value & Capital Defense',
    desc: 'Lower beta, dividend growth yield, and strict downside margin-of-safety.',
    badge: 'Low Volatility',
  },
];

export const OnboardingWalkthrough: React.FC<OnboardingWalkthroughProps> = ({
  currentUser,
  isOpen,
  onClose,
  onComplete,
  initialPreferences,
}) => {
  const [step, setStep] = useState(1);
  const [investmentGoal, setInvestmentGoal] = useState(
    initialPreferences?.investmentGoal || 'High-Growth & Momentum'
  );
  const [riskTolerance, setRiskTolerance] = useState<'Conservative' | 'Balanced' | 'Aggressive'>(
    initialPreferences?.riskTolerance || 'Balanced'
  );
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(
    initialPreferences?.selectedIndustries || ['ai_semis', 'cloud_software']
  );
  const [watchlist, setWatchlist] = useState<string[]>(
    initialPreferences?.watchlist || ['NVDA', 'AAPL', 'MSFT', 'TSLA']
  );
  const [customTickerInput, setCustomTickerInput] = useState('');

  if (!isOpen) return null;

  // Toggle industry selection
  const handleToggleIndustry = (id: string) => {
    let updated: string[];
    if (selectedIndustries.includes(id)) {
      if (selectedIndustries.length === 1) return; // Keep at least one
      updated = selectedIndustries.filter((i) => i !== id);
    } else {
      updated = [...selectedIndustries, id];
    }
    setSelectedIndustries(updated);

    // Automatically seed recommended stocks from added industry if not already in watchlist
    const targetIndustry = AVAILABLE_INDUSTRIES.find((ind) => ind.id === id);
    if (targetIndustry && !selectedIndustries.includes(id)) {
      const newTickers = targetIndustry.defaultStocks
        .map((s) => s.ticker)
        .filter((t) => !watchlist.includes(t));
      if (newTickers.length > 0) {
        setWatchlist((prev) => [...prev, ...newTickers.slice(0, 2)]);
      }
    }
  };

  // Toggle stock in watchlist
  const handleToggleStock = (ticker: string) => {
    if (watchlist.includes(ticker)) {
      if (watchlist.length <= 1) return; // Keep at least one stock
      setWatchlist((prev) => prev.filter((t) => t !== ticker));
    } else {
      setWatchlist((prev) => [...prev, ticker]);
    }
  };

  const handleAddCustomTicker = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customTickerInput.toUpperCase().trim();
    if (!clean) return;
    if (!watchlist.includes(clean)) {
      setWatchlist((prev) => [...prev, clean]);
    }
    setCustomTickerInput('');
  };

  const handleFinish = () => {
    const finalPrefs: UserPreferences = {
      investmentGoal,
      riskTolerance,
      selectedIndustries,
      watchlist,
      onboardingCompleted: true,
    };
    onComplete(finalPrefs);
  };

  // Pool of candidate stocks based on selected industries
  const candidateStocks = useMemo(() => {
    const map = new Map<string, { ticker: string; name: string; type: string; industry: string }>();
    for (const indId of selectedIndustries) {
      const ind = AVAILABLE_INDUSTRIES.find((i) => i.id === indId);
      if (ind) {
        for (const s of ind.defaultStocks) {
          if (!map.has(s.ticker)) {
            map.set(s.ticker, { ...s, industry: ind.name });
          }
        }
      }
    }
    // Also include any custom stocks already in watchlist
    for (const w of watchlist) {
      if (!map.has(w)) {
        map.set(w, {
          ticker: w,
          name: `${w} Asset`,
          type: w.includes('USD') ? 'crypto' : 'stock',
          industry: 'Custom Watchlist',
        });
      }
    }
    return Array.from(map.values());
  }, [selectedIndustries, watchlist]);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-[#182026] border border-[#263238] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh] flex flex-col justify-between">
        {/* Top Header */}
        <div className="space-y-3 pb-4 border-b border-[#263238]">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14c290]/10 border border-[#14c290]/30 text-[#14c290] text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Trading Desk Setup</span>
            </div>
            {/* Close button allows exiting walkthrough */}
            <button
              onClick={onClose}
              className="text-[#9aa6af] hover:text-[#e4e8eb] p-1.5 rounded-lg hover:bg-[#131a1f] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#e4e8eb] tracking-tight">
                {step === 1 && 'Step 1: Your Investment Style'}
                {step === 2 && 'Step 2: Choose Your Focus Industries'}
                {step === 3 && 'Step 3: Curate Your Starter Watchlist'}
                {step === 4 && 'Step 4: Launch Your Custom Desk'}
              </h2>
              <p className="text-xs text-[#9aa6af] mt-1">
                Customizing research committee parameters for{' '}
                <span className="text-[#14c290] font-semibold">{currentUser.email}</span>
              </p>
            </div>

            {/* Step Counter Indicator */}
            <div className="flex items-center gap-1 font-mono text-xs text-[#9aa6af]">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] transition-all ${
                    step === s
                      ? 'bg-[#14c290] text-[#0f1418]'
                      : step > s
                      ? 'bg-[#14c290]/20 text-[#14c290] border border-[#14c290]/40'
                      : 'bg-[#131a1f] text-[#5d6670] border border-[#263238]'
                  }`}
                >
                  {step > s ? '✓' : s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Body Content */}
        <div className="py-6 flex-1">
          {/* STEP 1: Investment Goals & Risk */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-[#e4e8eb] uppercase tracking-wider font-mono block mb-2">
                  1. What is your primary investment goal?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STRATEGY_GOALS.map((g) => {
                    const isSelected = investmentGoal === g.title;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setInvestmentGoal(g.title)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#14c290]/10 border-[#14c290] shadow-md'
                            : 'bg-[#131a1f] border-[#263238] hover:border-[#37474f]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-sm text-[#e4e8eb]">
                            {g.title}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                              isSelected
                                ? 'bg-[#14c290] text-[#0f1418]'
                                : 'bg-[#182026] text-[#9aa6af]'
                            }`}
                          >
                            {g.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[#9aa6af] leading-relaxed">
                          {g.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#e4e8eb] uppercase tracking-wider font-mono block mb-2">
                  2. Desk Risk Tolerance
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      {
                        level: 'Conservative',
                        tag: 'Tight 5-8% Stop Losses',
                        color: 'text-[#14c290]',
                      },
                      {
                        level: 'Balanced',
                        tag: 'Standard 2:1 R/R Ratio',
                        color: 'text-[#e5a93b]',
                      },
                      {
                        level: 'Aggressive',
                        tag: 'High Conviction & Volatility',
                        color: 'text-[#ef6f63]',
                      },
                    ] as const
                  ).map((r) => {
                    const isSelected = riskTolerance === r.level;
                    return (
                      <button
                        key={r.level}
                        type="button"
                        onClick={() => setRiskTolerance(r.level)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#14c290]/15 border-[#14c290] font-bold'
                            : 'bg-[#131a1f] border-[#263238] hover:border-[#37474f]'
                        }`}
                      >
                        <div className={`text-sm font-bold ${r.color}`}>
                          {r.level}
                        </div>
                        <div className="text-[10px] text-[#9aa6af] mt-1 leading-snug">
                          {r.tag}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Industry Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9aa6af]">
                  Select the sectors you want to monitor and trade ({selectedIndustries.length} chosen):
                </span>
                <span className="text-xs text-[#14c290] font-mono">
                  Multi-select enabled
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {AVAILABLE_INDUSTRIES.map((ind) => {
                  const isSelected = selectedIndustries.includes(ind.id);
                  const Icon = ind.icon;
                  return (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => handleToggleIndustry(ind.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[#14c290]/10 border-[#14c290]'
                          : 'bg-[#131a1f] border-[#263238] hover:border-[#37474f]'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#14c290] text-[#0f1418]'
                            : 'bg-[#182026] text-[#9aa6af]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#e4e8eb] truncate">
                            {ind.name}
                          </span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-[#14c290] shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#9aa6af] line-clamp-1 mt-0.5">
                          {ind.description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {ind.defaultStocks.map((s) => (
                            <span
                              key={s.ticker}
                              className="text-[10px] font-mono bg-[#182026] px-1.5 py-0.5 rounded text-[#9aa6af] border border-[#263238]"
                            >
                              {s.ticker}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Curate Starter Watchlist */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs text-[#9aa6af]">
                  We curated these stocks based on your selected sectors. Toggle or add custom symbols:
                </span>
                <span className="text-xs text-[#14c290] font-mono font-bold">
                  {watchlist.length} stocks in your watchlist
                </span>
              </div>

              {/* Add Custom Symbol Input */}
              <form
                onSubmit={handleAddCustomTicker}
                className="flex items-center gap-2 bg-[#131a1f] p-2 rounded-xl border border-[#263238]"
              >
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={customTickerInput}
                    onChange={(e) => setCustomTickerInput(e.target.value.toUpperCase())}
                    placeholder="Add custom stock or crypto symbol (e.g. AMD, SMCI, SOL-USD)..."
                    className="w-full px-3 py-1.5 bg-[#182026] border border-[#263238] rounded-lg text-xs font-mono text-[#e4e8eb] placeholder-[#5d6670] focus:outline-none focus:border-[#14c290]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!customTickerInput.trim()}
                  className="px-3 py-1.5 rounded-lg bg-[#14c290] hover:bg-[#14c290]/90 text-[#0f1418] text-xs font-bold font-mono flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Ticker</span>
                </button>
              </form>

              {/* Watchlist Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                {candidateStocks.map((stock) => {
                  const inWatchlist = watchlist.includes(stock.ticker);
                  return (
                    <button
                      key={stock.ticker}
                      type="button"
                      onClick={() => handleToggleStock(stock.ticker)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        inWatchlist
                          ? 'bg-[#14c290]/15 border-[#14c290] text-[#e4e8eb]'
                          : 'bg-[#131a1f] border-[#263238] text-[#9aa6af] hover:text-[#e4e8eb]'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-[#e4e8eb]">
                            {stock.ticker}
                          </span>
                          <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-[#182026] text-[#9aa6af] border border-[#263238]">
                            {stock.type}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#9aa6af] truncate mt-0.5">
                          {stock.name}
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                          inWatchlist
                            ? 'bg-[#14c290] text-[#0f1418]'
                            : 'border border-[#263238] bg-[#182026]'
                        }`}
                      >
                        {inWatchlist && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Review & Desk Confirmation */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#131a1f] border border-[#263238] space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#263238]">
                  <span className="text-xs text-[#9aa6af] font-mono">Google Account</span>
                  <span className="text-xs text-[#14c290] font-bold font-mono">
                    {currentUser.email}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[#263238]">
                  <span className="text-xs text-[#9aa6af] font-mono">Strategy & Risk</span>
                  <span className="text-xs text-[#e4e8eb] font-semibold">
                    {investmentGoal} • {riskTolerance} Risk
                  </span>
                </div>

                <div className="space-y-1.5 pb-3 border-b border-[#263238]">
                  <span className="text-xs text-[#9aa6af] font-mono block">
                    Focus Industries ({selectedIndustries.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedIndustries.map((indId) => {
                      const ind = AVAILABLE_INDUSTRIES.find((i) => i.id === indId);
                      return (
                        <span
                          key={indId}
                          className="text-[11px] px-2.5 py-1 rounded-md bg-[#182026] text-[#14c290] border border-[#14c290]/30 font-medium"
                        >
                          {ind?.name || indId}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#9aa6af] font-mono">
                      Your Starter Watchlist
                    </span>
                    <span className="text-xs text-[#14c290] font-mono font-bold">
                      {watchlist.length} Assets
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {watchlist.map((t) => (
                      <span
                        key={t}
                        className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#14c290]/20 text-[#14c290] border border-[#14c290]/40 flex items-center gap-1"
                      >
                        <Star className="w-3 h-3 fill-[#14c290]" />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#14c290]/10 rounded-xl border border-[#14c290]/30 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#14c290] shrink-0 mt-0.5" />
                <div className="text-xs text-[#e4e8eb] leading-relaxed">
                  <strong>Desk Ready:</strong> The multi-agent analysts (Market, Fundamentals, News, Sentiment) and Researcher debate teams will prioritize your curated watchlist.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="pt-4 border-t border-[#263238] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 rounded-xl bg-[#131a1f] hover:bg-[#182026] text-[#9aa6af] hover:text-[#e4e8eb] text-xs font-bold font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-5 py-2.5 rounded-xl bg-[#14c290] hover:bg-[#14c290]/90 text-[#0f1418] text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-[#14c290] hover:bg-[#14c290]/90 text-[#0f1418] text-xs font-extrabold font-mono flex items-center gap-2 transition-all shadow-lg hover:scale-102 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Customized Trading Desk</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
