import React from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  DollarSign,
  Flame,
  MessageSquare,
  Shield,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { FullAnalysisReport } from '../types';

interface AgentGraphVisualizerProps {
  report: FullAnalysisReport | null;
  isAnalyzing: boolean;
  activeStage: number; // 1 to 5
}

export const AgentGraphVisualizer: React.FC<AgentGraphVisualizerProps> = ({
  report,
  isAnalyzing,
  activeStage,
}) => {
  const stages = [
    { id: 1, name: 'Analyst Team', role: 'Data Mining & Multi-Modal Screening' },
    { id: 2, name: 'Bull vs Bear Debate', role: 'Structured Adversarial Argumentation' },
    { id: 3, name: 'Trader Desk', role: 'Concrete Order Strategy Formulation' },
    { id: 4, name: 'Risk Management', role: 'Drawdown & Volatility Guardrails' },
    { id: 5, name: 'Portfolio Manager', role: '5-Tier Rating & Capital Allocation' },
  ];

  return (
    <div className="bg-[#182026] rounded-xl border border-[#263238] p-5 shadow-lg">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#263238]">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-[#e4e8eb] uppercase flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#14c290]" />
            Multi-Agent Architecture Graph
          </h2>
          <p className="text-xs text-[#9aa6af] mt-0.5 font-mono">
            LangGraph Agent State Machine Execution Pipeline
          </p>
        </div>

        {isAnalyzing && (
          <div className="flex items-center gap-2 px-3 py-1 bg-[#14c290]/10 border border-[#14c290]/30 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#14c290] animate-ping" />
            <span className="text-xs font-mono text-[#14c290] font-medium">
              Graph Processing Stage {activeStage}/5...
            </span>
          </div>
        )}
      </div>

      {/* Stage Flow Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {stages.map((stage) => {
          const isDone = !isAnalyzing && report !== null;
          const isCurrent = isAnalyzing && activeStage === stage.id;
          const isPast = isAnalyzing && activeStage > stage.id;

          return (
            <div
              key={stage.id}
              className={`relative rounded-lg p-3.5 border transition-all ${
                isCurrent
                  ? 'bg-[#14c290]/10 border-[#14c290] shadow-md shadow-[#14c290]/10 ring-1 ring-[#14c290]'
                  : isPast || isDone
                  ? 'bg-[#131a1f] border-[#263238]'
                  : 'bg-[#131a1f]/40 border-[#263238]/40 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] uppercase font-bold text-[#9aa6af]">
                  Stage {stage.id}
                </span>
                {isCurrent && (
                  <span className="w-2 h-2 rounded-full bg-[#14c290] animate-pulse" />
                )}
                {(isPast || isDone) && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#14c290]" />
                )}
              </div>
              <h3 className="text-xs font-bold text-[#e4e8eb] mb-1">{stage.name}</h3>
              <p className="text-[11px] text-[#9aa6af] line-clamp-2 leading-relaxed">
                {stage.role}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Stage Detail Cards */}
      {report && (
        <div className="mt-6 pt-5 border-t border-[#263238] grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Quick Metrics */}
          <div className="bg-[#131a1f] rounded-lg p-4 border border-[#263238]">
            <div className="text-xs font-mono text-[#9aa6af] mb-1 uppercase">Trader Proposal</div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className={`text-xl font-bold font-mono ${
                report.traderProposal.action === 'Buy' ? 'text-[#14c290]' : 'text-[#ef6f63]'
              }`}>
                {report.traderProposal.action.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-[#9aa6af]">
                at ${report.traderProposal.entryPrice}
              </span>
            </div>
            <div className="space-y-1 text-xs text-[#9aa6af]">
              <div className="flex justify-between">
                <span>Target Price:</span>
                <span className="text-[#14c290] font-mono font-medium">${report.traderProposal.targetPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Stop Loss:</span>
                <span className="text-[#ef6f63] font-mono font-medium">${report.traderProposal.stopLoss}</span>
              </div>
              <div className="flex justify-between">
                <span>Risk / Reward:</span>
                <span className="text-[#e4e8eb] font-mono font-medium">{report.traderProposal.riskRewardRatio}:1</span>
              </div>
            </div>
          </div>

          {/* Bull vs Bear Conviction */}
          <div className="bg-[#131a1f] rounded-lg p-4 border border-[#263238]">
            <div className="text-xs font-mono text-[#9aa6af] mb-2 uppercase">Researcher Debate Balance</div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#14c290] font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Bull Researcher
                  </span>
                  <span className="font-mono text-[#14c290]">9/10</span>
                </div>
                <div className="w-full bg-[#182026] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#14c290] h-full rounded-full" style={{ width: '90%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#ef6f63] font-medium flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" /> Bear Researcher
                  </span>
                  <span className="font-mono text-[#ef6f63]">6/10</span>
                </div>
                <div className="w-full bg-[#182026] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#ef6f63] h-full rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Manager Verdict */}
          <div className="bg-[#131a1f] rounded-lg p-4 border border-[#263238]">
            <div className="text-xs font-mono text-[#9aa6af] mb-1 uppercase">Portfolio Manager Verdict</div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded text-sm font-bold font-mono ${
                report.portfolioVerdict.rating === 'Buy' || report.portfolioVerdict.rating === 'Overweight'
                  ? 'bg-[#14c290]/20 text-[#14c290] border border-[#14c290]/40'
                  : 'bg-[#ef6f63]/20 text-[#ef6f63] border border-[#ef6f63]/40'
              }`}>
                {report.portfolioVerdict.rating.toUpperCase()}
              </span>
              <span className="text-xs text-[#9aa6af]">
                Alloc: {report.portfolioVerdict.approvedAllocationPercent}%
              </span>
            </div>
            <p className="text-[11px] text-[#9aa6af] line-clamp-2">
              {report.portfolioVerdict.executionNotes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
