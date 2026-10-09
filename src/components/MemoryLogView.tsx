import React from 'react';
import {
  CheckCircle,
  Clock,
  ExternalLink,
  History,
  RotateCw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { MemoryLogEntry } from '../types';

interface MemoryLogViewProps {
  logs: MemoryLogEntry[];
  onSettle: (id: string) => void;
}

export const MemoryLogView: React.FC<MemoryLogViewProps> = ({ logs, onSettle }) => {
  const settledCount = logs.filter((l) => l.status !== 'PENDING').length;
  const profitableCount = logs.filter(
    (l) => (l.realizedReturnPercent || 0) > 0
  ).length;
  const winRate =
    settledCount > 0 ? ((profitableCount / settledCount) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#182026] rounded-xl border border-[#263238] p-5">
          <span className="text-xs font-mono text-[#9aa6af] uppercase">
            Total Logged Decisions
          </span>
          <div className="text-2xl font-bold font-mono text-[#e4e8eb] mt-1">
            {logs.length} Recorded
          </div>
          <div className="text-xs text-[#9aa6af] font-mono mt-1">
            Saved at the exact moment of analysis
          </div>
        </div>

        <div className="bg-[#182026] rounded-xl border border-[#263238] p-5">
          <span className="text-xs font-mono text-[#9aa6af] uppercase">
            Success Rate (Win %)
          </span>
          <div className="text-2xl font-bold font-mono text-[#14c290] mt-1">
            {winRate}%
          </div>
          <div className="text-xs text-[#9aa6af] font-mono mt-1">
            {profitableCount} of {settledCount} resolved in profit
          </div>
        </div>

        <div className="bg-[#182026] rounded-xl border border-[#263238] p-5">
          <span className="text-xs font-mono text-[#9aa6af] uppercase">
            Audit Guarantee
          </span>
          <div className="text-2xl font-bold font-mono text-[#e4e8eb] mt-1">
            No Cheating / No Lookahead
          </div>
          <div className="text-xs text-[#14c290] font-mono mt-1">
            Point-in-time accuracy tracking active
          </div>
        </div>
      </div>

      {/* Decision Table */}
      <div className="bg-[#182026] rounded-xl border border-[#263238] overflow-hidden">
        <div className="p-4 border-b border-[#263238] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#14c290]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#e4e8eb]">
              Decision History & Track Record
            </h3>
          </div>
          <span className="text-xs font-mono text-[#9aa6af]">
            Every call is automatically logged with date and price
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#131a1f] text-[#9aa6af] uppercase border-b border-[#263238]">
              <tr>
                <th className="p-3.5">Analysis Date</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Rating</th>
                <th className="p-3.5">Price at Decision</th>
                <th className="p-3.5">Profit Goal / Safety Stop</th>
                <th className="p-3.5">Actual Outcome</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263238]">
              {logs.map((log) => {
                const isSettled = log.status !== 'PENDING';
                const isProfitable = (log.realizedReturnPercent || 0) >= 0;

                return (
                  <tr key={log.id} className="hover:bg-[#131a1f]/50">
                    <td className="p-3.5 text-[#9aa6af]">{log.date}</td>
                    <td className="p-3.5 font-bold text-[#e4e8eb]">{log.ticker}</td>
                    <td className="p-3.5">
                      <span className="text-[#14c290] font-bold">
                        {log.rating}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#9aa6af]">${log.entryPrice}</td>
                    <td className="p-3.5 text-[#9aa6af]">
                      Goal: ${log.targetPrice} / Stop: ${log.stopLoss}
                    </td>
                    <td className="p-3.5 font-bold">
                      {isSettled ? (
                        <span
                          className={
                            isProfitable ? 'text-[#14c290]' : 'text-[#ef6f63]'
                          }
                        >
                          {isProfitable ? '+' : ''}
                          {log.realizedReturnPercent}% gain
                        </span>
                      ) : (
                        <span className="text-[#5d6670]">Tracking price...</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isSettled
                            ? 'bg-[#14c290]/15 text-[#14c290]'
                            : 'bg-[#9aa6af]/15 text-[#9aa6af]'
                        }`}
                      >
                        {isSettled ? 'COMPLETED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {!isSettled ? (
                        <button
                          onClick={() => onSettle(log.id)}
                          className="px-2.5 py-1 text-[11px] rounded bg-[#14c290]/15 text-[#14c290] hover:bg-[#14c290]/25 border border-[#14c290]/30 transition-colors flex items-center gap-1 ml-auto"
                        >
                          <RotateCw className="w-3 h-3" />
                          <span>Calculate Result</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#5d6670]">
                          Settled on {log.settledDate}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#9aa6af]">
                    No decisions logged yet. Analyze any stock to start tracking accuracy.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
