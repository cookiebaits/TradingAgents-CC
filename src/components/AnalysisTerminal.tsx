import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Flame,
  Globe,
  LineChart,
  MessageSquare,
  Play,
  RotateCcw,
  Search,
  Send,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { FullAnalysisReport } from '../types';

interface AnalysisTerminalProps {
  report: FullAnalysisReport | null;
  isAnalyzing: boolean;
  onRunAnalysis: (ticker: string, date: string) => void;
  onExecuteTrade: (trade: {
    ticker: string;
    action: 'BUY' | 'SELL';
    shares: number;
    price: number;
    rating: string;
  }) => void;
  onViewReport: () => void;
}

export const AnalysisTerminal: React.FC<AnalysisTerminalProps> = ({
  report,
  isAnalyzing,
  onRunAnalysis,
  onExecuteTrade,
  onViewReport,
}) => {
  const [selectedTicker, setSelectedTicker] = useState('NVDA');
  const [customInput, setCustomInput] = useState('');
  const [analysisDate, setAnalysisDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [activeAnalystTab, setActiveAnalystTab] = useState<
    'market' | 'fundamentals' | 'news' | 'sentiment'
  >('market');
  const [tradeSuccessMsg, setTradeSuccessMsg] = useState('');

  const quickTickers = ['NVDA', 'AAPL', 'MSFT', 'TSLA', 'BTC-USD', 'ETH-USD'];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const symbol = (customInput || selectedTicker).toUpperCase().trim();
    if (!symbol) return;
    onRunAnalysis(symbol, analysisDate);
  };

  const handleExecute = () => {
    if (!report) return;
    const price = report.marketData.price;
    // Calculate shares for ~approvedDollarAmount
    const shares = Math.max(
      1,
      Math.round(report.portfolioVerdict.approvedDollarAmount / price)
    );
    onExecuteTrade({
      ticker: report.ticker,
      action: report.traderProposal.action === 'Sell' ? 'SELL' : 'BUY',
      shares,
      price,
      rating: report.portfolioVerdict.rating,
    });
    setTradeSuccessMsg(
      `Order executed! ${shares} shares of ${report.ticker} added to portfolio.`
    );
    setTimeout(() => setTradeSuccessMsg(''), 4500);
  };

  const currentAnalyst = report?.analysts.find(
    (a) => a.analyst === activeAnalystTab
  );

  return (
    <div className="space-y-6">
      {/* Search & Configuration Bar */}
      <div className="bg-[#182026] rounded-xl border border-[#263238] p-5 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-4">
          {/* Quick Select Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-mono text-[#9aa6af] mr-1">Presets:</span>
            {quickTickers.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setSelectedTicker(t);
                  setCustomInput('');
                }}
                className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-colors ${
                  selectedTicker === t && !customInput
                    ? 'bg-[#14c290]/15 text-[#14c290] border-[#14c290]/40 font-bold'
                    : 'bg-[#131a1f] text-[#9aa6af] border-[#263238] hover:text-[#e4e8eb]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-[#263238] hidden sm:block" />

          {/* Custom Input */}
          <div className="flex-1 min-w-[180px] relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa6af]" />
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value.toUpperCase())}
              placeholder="Or enter custom ticker (e.g. AMD, GOOGL, AMZN)..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#131a1f] border border-[#263238] rounded-lg text-xs text-[#e4e8eb] placeholder-[#5d6670] font-mono focus:outline-none focus:border-[#14c290]"
            />
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#9aa6af]" />
            <input
              type="date"
              value={analysisDate}
              onChange={(e) => setAnalysisDate(e.target.value)}
              className="bg-[#131a1f] border border-[#263238] rounded-lg px-2.5 py-1.5 text-xs text-[#e4e8eb] font-mono focus:outline-none focus:border-[#14c290]"
            />
          </div>

          {/* Run Button */}
          <button
            type="submit"
            disabled={isAnalyzing}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
              isAnalyzing
                ? 'bg-[#263238] text-[#9aa6af] cursor-not-allowed'
                : 'bg-[#14c290] text-[#0f1418] hover:bg-[#14c290]/90 active:scale-95 shadow-[#14c290]/20'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Multi-Agent Graph...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Multi-Agent Committee</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Main Analysis Results */}
      {report && (
        <div className="space-y-6">
          {/* Header Banner & Live Quote */}
          <div className="bg-[#182026] rounded-xl border border-[#263238] p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#14c290]/15 border border-[#14c290]/30 flex items-center justify-center text-lg font-bold font-mono text-[#14c290]">
                  {report.ticker.slice(0, 4)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-[#e4e8eb]">
                      {report.companyName}
                    </h1>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#131a1f] border border-[#263238] text-[#9aa6af]">
                      {report.ticker}
                    </span>
                    <span className="text-xs text-[#9aa6af] font-mono">
                      {report.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-2xl font-bold font-mono text-[#e4e8eb]">
                      ${report.marketData.price.toLocaleString()}
                    </span>
                    <span
                      className={`flex items-center gap-1 font-mono text-sm font-semibold ${
                        report.marketData.change24hPercent >= 0
                          ? 'text-[#14c290]'
                          : 'text-[#ef6f63]'
                      }`}
                    >
                      {report.marketData.change24hPercent >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {report.marketData.change24h >= 0 ? '+' : ''}
                      {report.marketData.change24h} (
                      {report.marketData.change24hPercent}%)
                    </span>
                    <span className="text-xs text-[#9aa6af] font-mono">
                      Vol: {report.marketData.volume}
                    </span>
                    <span className="text-xs text-[#9aa6af] font-mono">
                      Cap: {report.marketData.marketCap}
                    </span>
                  </div>
                </div>
              </div>

              {/* Committee Decision Badge & Actions */}
              <div className="flex items-center gap-3 self-end md:self-center">
                <div className="text-right">
                  <div className="text-[11px] font-mono text-[#9aa6af] uppercase">
                    Official Committee Verdict
                  </div>
                  <div className="text-lg font-bold font-mono text-[#14c290]">
                    {report.portfolioVerdict.rating.toUpperCase()}
                  </div>
                </div>

                <button
                  onClick={onViewReport}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#131a1f] hover:bg-[#1f2933] border border-[#263238] text-xs font-medium text-[#e4e8eb] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#14c290]" />
                  <span>View HTML Report</span>
                </button>

                <button
                  onClick={handleExecute}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#14c290] hover:bg-[#14c290]/90 text-[#0f1418] text-xs font-bold transition-all shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Trade</span>
                </button>
              </div>
            </div>

            {tradeSuccessMsg && (
              <div className="mt-4 p-3 rounded-lg bg-[#14c290]/15 border border-[#14c290]/40 text-[#14c290] text-xs font-mono flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {tradeSuccessMsg}
              </div>
            )}
          </div>

          {/* Section 1: Analyst Team Tabs */}
          <div className="bg-[#182026] rounded-xl border border-[#263238] overflow-hidden">
            <div className="p-4 border-b border-[#263238] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#14c290]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#e4e8eb]">
                  Specialized Analyst Team Findings
                </h3>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-1 bg-[#131a1f] p-1 rounded-lg border border-[#263238]">
                <button
                  onClick={() => setActiveAnalystTab('market')}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                    activeAnalystTab === 'market'
                      ? 'bg-[#182026] text-[#14c290] border border-[#14c290]/30'
                      : 'text-[#9aa6af] hover:text-[#e4e8eb]'
                  }`}
                >
                  Technical
                </button>
                <button
                  onClick={() => setActiveAnalystTab('fundamentals')}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                    activeAnalystTab === 'fundamentals'
                      ? 'bg-[#182026] text-[#14c290] border border-[#14c290]/30'
                      : 'text-[#9aa6af] hover:text-[#e4e8eb]'
                  }`}
                >
                  Fundamentals
                </button>
                <button
                  onClick={() => setActiveAnalystTab('news')}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                    activeAnalystTab === 'news'
                      ? 'bg-[#182026] text-[#14c290] border border-[#14c290]/30'
                      : 'text-[#9aa6af] hover:text-[#e4e8eb]'
                  }`}
                >
                  Macro & News
                </button>
                <button
                  onClick={() => setActiveAnalystTab('sentiment')}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                    activeAnalystTab === 'sentiment'
                      ? 'bg-[#182026] text-[#14c290] border border-[#14c290]/30'
                      : 'text-[#9aa6af] hover:text-[#e4e8eb]'
                  }`}
                >
                  Sentiment
                </button>
              </div>
            </div>

            {currentAnalyst && (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#e4e8eb]">
                      {currentAnalyst.title}
                    </h4>
                    <span className="text-xs text-[#9aa6af]">
                      Stance:{' '}
                      <strong className="text-[#14c290]">
                        {currentAnalyst.stance}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#9aa6af]">
                      Conviction Score:
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#14c290]/15 text-[#14c290] border border-[#14c290]/30 font-mono text-xs font-bold">
                      {currentAnalyst.score}/100
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#c5cdd3] leading-relaxed bg-[#131a1f] p-3.5 rounded-lg border border-[#263238]">
                  {currentAnalyst.detailedAnalysis}
                </p>

                <div>
                  <div className="text-xs font-mono text-[#9aa6af] uppercase mb-2">
                    Key Quantitative Evidence
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {currentAnalyst.keyPoints.map((pt, i) => (
                      <div
                        key={i}
                        className="text-xs text-[#9aa6af] bg-[#131a1f] px-3 py-2 rounded border border-[#263238] flex items-start gap-2"
                      >
                        <span className="text-[#14c290] font-mono">•</span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Researcher Debate Transcript */}
          <div className="bg-[#182026] rounded-xl border border-[#263238] p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#263238]">
              <MessageSquare className="w-4 h-4 text-[#14c290]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#e4e8eb]">
                Adversarial Research Debate (Bull vs. Bear)
              </h3>
            </div>

            <div className="space-y-4">
              {report.researchDebate.map((turn, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    turn.speaker === 'Bull Researcher'
                      ? 'bg-[#14c290]/5 border-[#14c290]/30'
                      : turn.speaker === 'Bear Researcher'
                      ? 'bg-[#ef6f63]/5 border-[#ef6f63]/30'
                      : 'bg-[#131a1f] border-[#263238]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold flex items-center gap-1.5 ${
                        turn.speaker === 'Bull Researcher'
                          ? 'text-[#14c290]'
                          : turn.speaker === 'Bear Researcher'
                          ? 'text-[#ef6f63]'
                          : 'text-[#e4e8eb]'
                      }`}
                    >
                      {turn.speaker === 'Bull Researcher' ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : turn.speaker === 'Bear Researcher' ? (
                        <TrendingDown className="w-3.5 h-3.5" />
                      ) : (
                        <Bot className="w-3.5 h-3.5" />
                      )}
                      {turn.speaker} (Round {turn.round})
                    </span>
                    <span className="text-xs font-mono text-[#9aa6af]">
                      Conviction: {turn.conviction}/10
                    </span>
                  </div>

                  <p className="text-xs text-[#c5cdd3] leading-relaxed mb-3">
                    {turn.thesis}
                  </p>

                  <div className="space-y-1">
                    {turn.counterpoints.map((c, ci) => (
                      <div
                        key={ci}
                        className="text-[11px] text-[#9aa6af] flex items-center gap-1.5"
                      >
                        <span className="text-[#9aa6af] font-mono">›</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Risk Management Deliberation */}
          <div className="bg-[#182026] rounded-xl border border-[#263238] p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#263238]">
              <Shield className="w-4 h-4 text-[#14c290]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#e4e8eb]">
                Risk Management Board Deliberation
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {report.riskDebate.map((r, ri) => (
                <div
                  key={ri}
                  className="bg-[#131a1f] rounded-lg p-4 border border-[#263238] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#e4e8eb]">
                        {r.debator}
                      </span>
                      <span className="text-[10px] font-mono text-[#14c290] bg-[#14c290]/10 px-2 py-0.5 rounded border border-[#14c290]/20">
                        {r.approved ? 'Passed' : 'Flagged'}
                      </span>
                    </div>
                    <p className="text-xs text-[#9aa6af] mb-3 leading-relaxed">
                      {r.assessment}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#263238] text-[11px] text-[#9aa6af] space-y-1">
                    <div className="flex justify-between">
                      <span>Max Drawdown:</span>
                      <span className="text-[#e4e8eb] font-mono">
                        {r.maxDrawdownRisk}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Allocation:</span>
                      <span className="text-[#14c290] font-mono font-medium">
                        {r.sizingRecommendation}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
