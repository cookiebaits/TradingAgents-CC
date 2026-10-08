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
            Total Memory Log Decisions
          </span>
          <div className="text-2xl font-bold font-mono text-[#e4e8eb] mt-1">
            {logs.length} Logged Entries
          </div>
          <div className="text-xs text-[#9aa6af] font-mono mt-1">
            Point-in-time audit integrity
          </div>
        </div>

        <div className="bg-[#182026] rounded-xl border border-[#263238] p-5">
          <span className="text-xs font-mono text-[#9aa6af] uppercase">
            Settled Win Rate
          </span>
          <div className="text-2xl font-bold font-mono text-[#14c290] mt-1">
            {winRate}%
          </div>
          <div className="text-xs text-[#9aa6af] font-mono mt-1">
            {profitableCount} of {settledCount} resolved in green
          </div>
        </div>

        <div className="bg-[#182026] rounded-xl border border-[#263238] p-5">
          <span className="text-xs font-mono text-[#9aa6af] uppercase">
            Resolution Engine
          </span>
          <div className="text-2xl font-bold font-mono text-[#e4e8eb] mt-1">
            trading_memory.md
          </div>
          <div className="text-xs text-[#14c290] font-mono mt-1">
            Point-in-time reflection enabled
          </div>
        </div>
      </div>

      {/* Decision Table */}
      <div className="bg-[#182026] rounded-xl border border-[#263238] overflow-hidden">
        <div className="p-4 border-b border-[#263238] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#14c290]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#e4e8eb]">
              Decision Memory & Track Record Log
            </h3>
          </div>
          <span className="text-xs font-mono text-[#9aa6af]">
            Automatic recording on every analysis run
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#131a1f] text-[#9aa6af] uppercase border-b border-[#263238]">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Ticker</th>
                <th className="p-3.5">Rating</th>
                <th className="p-3.5">Entry Price</th>
                <th className="p-3.5">Target / Stop</th>
                <th className="p-3.5">Outcome</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Settlement</th>
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
                      ${log.targetPrice} / ${log.stopLoss}
                    </td>
                    <td className="p-3.5 font-bold">
                      {isSettled ? (
                        <span
                          className={
                            isProfitable ? 'text-[#14c290]' : 'text-[#ef6f63]'
                          }
                        >
                          {isProfitable ? '+' : ''}
                          {log.realizedReturnPercent}%
                        </span>
                      ) : (
                        <span className="text-[#5d6670]">Tracking...</span>
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
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {!isSettled ? (
                        <button
                          onClick={() => onSettle(log.id)}
                          className="px-2.5 py-1 text-[11px] rounded bg-[#14c290]/15 text-[#14c290] hover:bg-[#14c290]/25 border border-[#14c290]/30 transition-colors flex items-center gap-1 ml-auto"
                        >
                          <RotateCw className="w-3 h-3" />
                          <span>Settle Now</span>
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
                    No decisions recorded yet. Run an analysis in the Agent Terminal.
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
