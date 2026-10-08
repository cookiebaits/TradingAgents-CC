import React from 'react';
import {
  Download,
  ExternalLink,
  FileText,
  Printer,
  Share2,
} from 'lucide-react';
import { FullAnalysisReport } from '../types';

interface ReportViewerProps {
  report: FullAnalysisReport | null;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ report }) => {
  if (!report) {
    return (
      <div className="bg-[#182026] rounded-xl border border-[#263238] p-12 text-center text-[#9aa6af]">
        <FileText className="w-12 h-12 mx-auto mb-3 text-[#5d6670]" />
        <h3 className="text-base font-semibold text-[#e4e8eb] mb-1">
          No Report Selected
        </h3>
        <p className="text-xs">
          Run an analysis in the Agent Terminal to generate a Tauric Research HTML
          report.
        </p>
      </div>
    );
  }

  const handleDownloadHtml = () => {
    window.location.href = `/api/reports/${report.id}/html`;
  };

  const handleOpenNewTab = () => {
    window.open(`/api/reports/${report.id}/html`, '_blank');
  };

  const ratingClass =
    report.portfolioVerdict.rating === 'Buy' ||
    report.portfolioVerdict.rating === 'Overweight'
      ? 'text-[#14c290] border-[#14c290]/40 bg-[#14c290]/10'
      : report.portfolioVerdict.rating === 'Sell' ||
        report.portfolioVerdict.rating === 'Underweight'
      ? 'text-[#ef6f63] border-[#ef6f63]/40 bg-[#ef6f63]/10'
      : 'text-[#9aa6af] border-[#9aa6af]/40 bg-[#9aa6af]/10';

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex items-center justify-between bg-[#182026] p-4 rounded-xl border border-[#263238]">
        <div>
          <span className="text-xs font-mono text-[#9aa6af]">Report Document:</span>
          <span className="text-xs font-bold text-[#e4e8eb] ml-2">
            complete_report.html ({report.ticker})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenNewTab}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131a1f] hover:bg-[#1f2933] border border-[#263238] text-xs font-medium text-[#e4e8eb] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#14c290]" />
            <span>Open Standalone Page</span>
          </button>
          <button
            onClick={handleDownloadHtml}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14c290] hover:bg-[#14c290]/90 text-[#0f1418] text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download complete_report.html</span>
          </button>
        </div>
      </div>

      {/* Styled Tauric Research Paper Card */}
      <div className="bg-[#131a1f] rounded-xl border border-[#263238] p-8 md:p-12 shadow-2xl max-w-4xl mx-auto font-serif text-[#e4e8eb]">
        {/* Masthead */}
        <div className="border-b border-[#263238] pb-6 mb-8 font-sans">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#14c290] font-mono">
              <span>TAURIC RESEARCH</span>
              <span>•</span>
              <span>TRADINGAGENTS FRAMEWORK</span>
            </div>
            <div className="text-xs font-mono text-[#9aa6af]">
              Generated {report.date}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#e4e8eb] mb-3">
            {report.companyName} ({report.ticker})
          </h1>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded text-base font-bold font-mono border ${ratingClass}`}
            >
              {report.portfolioVerdict.rating.toUpperCase()}
            </span>
            <span className="text-xs text-[#9aa6af] font-mono">
              Horizon: {report.portfolioVerdict.targetHorizon}
            </span>
          </div>

          <p className="mt-4 text-base font-serif text-[#c5cdd3] leading-relaxed italic">
            "{report.portfolioVerdict.executiveSummary}"
          </p>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-[#182026] border border-[#263238] mb-8 font-sans text-xs">
          <div>
            <span className="block text-[10px] font-mono uppercase text-[#9aa6af]">
              Current Print
            </span>
            <span className="font-mono text-base font-bold text-[#e4e8eb]">
              ${report.marketData.price}
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-mono uppercase text-[#9aa6af]">
              Target / Stop
            </span>
            <span className="font-mono text-base font-bold text-[#14c290]">
              ${report.traderProposal.targetPrice} / ${report.traderProposal.stopLoss}
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-mono uppercase text-[#9aa6af]">
              Approved Capital
            </span>
            <span className="font-mono text-base font-bold text-[#e4e8eb]">
              {report.portfolioVerdict.approvedAllocationPercent}% ($
              {report.portfolioVerdict.approvedDollarAmount.toLocaleString()})
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-mono uppercase text-[#9aa6af]">
              Risk / Reward
            </span>
            <span className="font-mono text-base font-bold text-[#e4e8eb]">
              {report.traderProposal.riskRewardRatio}:1
            </span>
          </div>
        </div>

        {/* Section 1 */}
        <div className="mb-8 font-sans">
          <h2 className="text-lg font-bold text-[#e4e8eb] border-b border-[#263238] pb-2 mb-4">
            1. Analyst Team Reports
          </h2>
          <div className="space-y-4">
            {report.analysts.map((a, i) => (
              <div key={i} className="bg-[#182026] p-4 rounded-lg border border-[#263238]">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-[#14c290]">{a.title}</h3>
                  <span className="text-xs font-mono text-[#9aa6af]">
                    Score: {a.score}/100
                  </span>
                </div>
                <p className="text-xs text-[#c5cdd3] leading-relaxed mb-3">
                  {a.detailedAnalysis}
                </p>
                <ul className="list-disc list-inside text-xs text-[#9aa6af] space-y-1">
                  {a.keyPoints.map((k, ki) => (
                    <li key={ki}>{k}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2 */}
        <div className="mb-8 font-sans">
          <h2 className="text-lg font-bold text-[#e4e8eb] border-b border-[#263238] pb-2 mb-4">
            2. Structured Bull/Bear Debate
          </h2>
          <div className="space-y-3">
            {report.researchDebate.map((d, i) => (
              <div key={i} className="bg-[#182026] p-4 rounded-lg border border-[#263238]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-[#e4e8eb]">
                    {d.speaker} (Round {d.round})
                  </span>
                  <span className="text-xs font-mono text-[#9aa6af]">
                    Conviction: {d.conviction}/10
                  </span>
                </div>
                <p className="text-xs text-[#c5cdd3] mb-2">{d.thesis}</p>
                <ul className="list-disc list-inside text-[11px] text-[#9aa6af] space-y-0.5">
                  {d.counterpoints.map((c, ci) => (
                    <li key={ci}>{c}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3 & 4 */}
        <div className="font-sans border-t border-[#263238] pt-6">
          <h2 className="text-lg font-bold text-[#e4e8eb] mb-2">
            3. Trader Execution & Portfolio Sizing
          </h2>
          <p className="text-xs text-[#c5cdd3] mb-4">
            {report.portfolioVerdict.executionNotes}
          </p>

          <div className="text-center pt-8 border-t border-[#263238] text-[11px] text-[#5d6670] font-mono">
            Tauric Research · Multi-Agents LLM Financial Trading Framework
            (TradingAgents v0.6.0)
          </div>
        </div>
      </div>
    </div>
  );
};
