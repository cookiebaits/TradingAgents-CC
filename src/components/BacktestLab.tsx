import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle,
  Play,
  RotateCcw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

export const BacktestLab: React.FC = () => {
  const [ticker, setTicker] = useState('NVDA');
  const [benchmark, setBenchmark] = useState('SPY');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-09-30');
  const [isRunning, setIsRunning] = useState(false);
  const [backtestResult, setBacktestResult] = useState<any>(null);

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    try {
      const res = await fetch('/api/backtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, benchmark, startDate, endDate }),
      });
      const data = await res.json();
      setBacktestResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  // Run initial backtest on load
  React.useEffect(() => {
    handleRun({ preventDefault: () => {} } as any);
  }, []);

  return (
    <div className="space-y-6">
      {/* Parameter Control Bar */}
      <div className="bg-[#182026] rounded-xl border border-[#263238] p-5">
        <form onSubmit={handleRun} className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div>
            <label className="block text-[#9aa6af] mb-1">Target Asset</label>
            <select
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="bg-[#131a1f] border border-[#263238] rounded px-3 py-1.5 text-[#e4e8eb]"
            >
              <option value="NVDA">NVDA (NVIDIA)</option>
              <option value="AAPL">AAPL (Apple)</option>
              <option value="MSFT">MSFT (Microsoft)</option>
              <option value="TSLA">TSLA (Tesla)</option>
              <option value="BTC-USD">BTC-USD (Bitcoin)</option>
            </select>
          </div>

          <div>
            <label className="block text-[#9aa6af] mb-1">Benchmark</label>
            <select
              value={benchmark}
              onChange={(e) => setBenchmark(e.target.value)}
              className="bg-[#131a1f] border border-[#263238] rounded px-3 py-1.5 text-[#e4e8eb]"
            >
              <option value="SPY">SPY (S&P 500 ETF)</option>
              <option value="QQQ">QQQ (Nasdaq 100 ETF)</option>
              <option value="HOLD">Buy & Hold Ticker</option>
            </select>
          </div>

          <div>
            <label className="block text-[#9aa6af] mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-[#131a1f] border border-[#263238] rounded px-2.5 py-1.5 text-[#e4e8eb]"
            />
          </div>

          <div>
            <label className="block text-[#9aa6af] mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-[#131a1f] border border-[#263238] rounded px-2.5 py-1.5 text-[#e4e8eb]"
            />
          </div>

          <div className="self-end">
            <button
              type="submit"
              disabled={isRunning}
              className="px-5 py-2 rounded-lg bg-[#14c290] hover:bg-[#14c290]/90 text-[#0f1418] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
            >
              {isRunning ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Backtest</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {backtestResult && (
        <div className="space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#182026] rounded-xl border border-[#263238] p-5">
              <span className="text-xs font-mono text-[#9aa6af] uppercase">
                Strategy Return
              </span>
              <div className="text-2xl font-bold font-mono text-[#14c290] mt-1">
                +{backtestResult.metrics.strategyTotalReturn}%
              </div>
              <div className="text-xs text-[#9aa6af] font-mono mt-1">
                Benchmark: +{backtestResult.metrics.benchmarkTotalReturn}%
              </div>
            </div>

            <div className="bg-[#182026] rounded-xl border border-[#263238] p-5">
              <span className="text-xs font-mono text-[#9aa6af] uppercase">
                Generated Alpha
              </span>
              <div className="text-2xl font-bold font-mono text-[#e4e8eb] mt-1">
                +{backtestResult.metrics.alpha}%
              </div>
              <div className="text-xs text-[#14c290] font-mono mt-1">
                Multi-agent excess return
              </div>
            </div>

            <div className="bg-[#182026] rounded-xl border border-[#263238] p-5">
              <span className="text-xs font-mono text-[#9aa6af] uppercase">
                Sharpe Ratio
              </span>
              <div className="text-2xl font-bold font-mono text-[#e4e8eb] mt-1">
                {backtestResult.metrics.sharpeRatio}
              </div>
              <div className="text-xs text-[#9aa6af] font-mono mt-1">
                Sortino: {backtestResult.metrics.sortinoRatio}
              </div>
            </div>

            <div className="bg-[#182026] rounded-xl border border-[#263238] p-5">
              <span className="text-xs font-mono text-[#9aa6af] uppercase">
                Max Drawdown
              </span>
              <div className="text-2xl font-bold font-mono text-[#ef6f63] mt-1">
                {backtestResult.metrics.maxDrawdown}%
              </div>
              <div className="text-xs text-[#9aa6af] font-mono mt-1">
                Win Rate: {backtestResult.metrics.winRate}% ({backtestResult.metrics.totalTrades} Trades)
              </div>
            </div>
          </div>

          {/* Equity Curve Progression Table / Chart */}
          <div className="bg-[#182026] rounded-xl border border-[#263238] p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#e4e8eb] mb-4">
              Monthly Cumulative Equity Simulation ($100k Base)
            </h3>

            <div className="space-y-3">
              {backtestResult.equityCurve.map((point: any, idx: number) => {
                const stratPct = ((point.strategyValue - 100000) / 100000) * 100;
                const benchPct = ((point.benchmarkValue - 100000) / 100000) * 100;

                return (
                  <div key={idx} className="bg-[#131a1f] p-3 rounded-lg border border-[#263238]">
                    <div className="flex justify-between items-center text-xs font-mono mb-2">
                      <span className="text-[#e4e8eb] font-bold">{point.date}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-[#14c290]">
                          Agents: ${point.strategyValue.toLocaleString()} ({stratPct >= 0 ? '+' : ''}{stratPct.toFixed(1)}%)
                        </span>
                        <span className="text-[#9aa6af]">
                          {benchmark}: ${point.benchmarkValue.toLocaleString()} ({benchPct >= 0 ? '+' : ''}{benchPct.toFixed(1)}%)
                        </span>
                      </div>
                    </div>

                    {/* Comparative Visual Bars */}
                    <div className="space-y-1">
                      <div className="w-full bg-[#182026] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#14c290] h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, Math.max(10, (point.strategyValue / 140000) * 100))}%`,
                          }}
                        />
                      </div>
                      <div className="w-full bg-[#182026] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#5d6670] h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, Math.max(10, (point.benchmarkValue / 140000) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
