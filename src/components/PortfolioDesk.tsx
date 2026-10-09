import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  DollarSign,
  PlusCircle,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { PortfolioState } from '../types';

interface PortfolioDeskProps {
  portfolio: PortfolioState;
  onTrade: (trade: {
    ticker: string;
    action: 'BUY' | 'SELL';
    shares: number;
    price: number;
    rating: string;
  }) => void;
}

export const PortfolioDesk: React.FC<PortfolioDeskProps> = ({
  portfolio,
  onTrade,
}) => {
  const [tradeModal, setTradeModal] = useState<{
    ticker: string;
    action: 'BUY' | 'SELL';
    shares: number;
    price: number;
  } | null>(null);

  const handleQuickSell = (ticker: string, price: number, shares: number) => {
    onTrade({
      ticker,
      action: 'SELL',
      shares,
      price,
      rating: 'Sell',
    });
  };

  const handleManualTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tradeModal) return;
    onTrade({
      ticker: tradeModal.ticker.toUpperCase(),
      action: tradeModal.action,
      shares: tradeModal.shares,
      price: tradeModal.price,
      rating: tradeModal.action === 'BUY' ? 'Buy' : 'Sell',
    });
    setTradeModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#182026] rounded-xl border border-[#263238] p-5">
          <span className="text-xs font-mono text-[#9aa6af] uppercase">
            Total Portfolio Value
          </span>
          <div className="text-2xl font-bold font-mono text-[#e4e8eb] mt-1">
            ${portfolio.totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="flex items-center gap-1 text-xs text-[#14c290] font-mono mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>
              +${portfolio.dailyPnL.toFixed(2)} (+{portfolio.dailyPnLPercent}%) today
            </span>
          </div>
        </div>

        <div className="bg-[#182026] rounded-xl border border-[#263238] p-5">
          <span className="text-xs font-mono text-[#9aa6af] uppercase">
            Ready Cash Reserve
          </span>
          <div className="text-2xl font-bold font-mono text-[#14c290] mt-1">
            ${portfolio.cash.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="text-xs text-[#9aa6af] font-mono mt-1">
            {((portfolio.cash / portfolio.totalValue) * 100).toFixed(1)}% cash in reserve
          </div>
        </div>

        <div className="bg-[#182026] rounded-xl border border-[#263238] p-5">
          <span className="text-xs font-mono text-[#9aa6af] uppercase">
            Invested in Stocks
          </span>
          <div className="text-2xl font-bold font-mono text-[#e4e8eb] mt-1">
            ${(portfolio.totalValue - portfolio.cash).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="text-xs text-[#9aa6af] font-mono mt-1">
            {portfolio.holdings.length} Active Stock Positions
          </div>
        </div>

        <div className="bg-[#182026] rounded-xl border border-[#263238] p-5 flex flex-col justify-between">
          <span className="text-xs font-mono text-[#9aa6af] uppercase">
            Trade Actions
          </span>
          <button
            onClick={() =>
              setTradeModal({
                ticker: 'NVDA',
                action: 'BUY',
                shares: 10,
                price: 138.25,
              })
            }
            className="w-full mt-2 py-2 bg-[#14c290] hover:bg-[#14c290]/90 text-[#0f1418] text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Make Custom Trade</span>
          </button>
        </div>
      </div>

      {/* Active Holdings Table */}
      <div className="bg-[#182026] rounded-xl border border-[#263238] overflow-hidden">
        <div className="p-4 border-b border-[#263238] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#14c290]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#e4e8eb]">
              Stocks You Currently Own
            </h3>
          </div>
          <span className="text-xs font-mono text-[#9aa6af]">
            Live Market Value & Sizing
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#131a1f] text-[#9aa6af] uppercase border-b border-[#263238]">
              <tr>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Shares</th>
                <th className="p-3.5">Your Cost</th>
                <th className="p-3.5">Current Price</th>
                <th className="p-3.5">Total Value</th>
                <th className="p-3.5">Profit / Loss</th>
                <th className="p-3.5">Portfolio Share</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263238]">
              {portfolio.holdings.map((h) => {
                const isPositive = h.unrealizedPnL >= 0;
                return (
                  <tr
                    key={h.ticker}
                    className="hover:bg-[#131a1f]/50 transition-colors"
                  >
                    <td className="p-3.5 font-bold text-[#e4e8eb]">{h.ticker}</td>
                    <td className="p-3.5 text-[#9aa6af]">{h.shares}</td>
                    <td className="p-3.5 text-[#9aa6af]">${h.avgCost.toFixed(2)}</td>
                    <td className="p-3.5 text-[#e4e8eb]">${h.currentPrice.toFixed(2)}</td>
                    <td className="p-3.5 text-[#e4e8eb] font-semibold">
                      ${h.marketValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td
                      className={`p-3.5 font-semibold ${
                        isPositive ? 'text-[#14c290]' : 'text-[#ef6f63]'
                      }`}
                    >
                      {isPositive ? '+' : ''}${h.unrealizedPnL.toFixed(2)} (
                      {isPositive ? '+' : ''}
                      {h.unrealizedPnLPercent.toFixed(2)}%)
                    </td>
                    <td className="p-3.5 text-[#9aa6af]">
                      {h.allocationPercent.toFixed(1)}%
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() =>
                          handleQuickSell(h.ticker, h.currentPrice, h.shares)
                        }
                        className="px-2.5 py-1 text-[11px] rounded bg-[#ef6f63]/15 text-[#ef6f63] hover:bg-[#ef6f63]/25 border border-[#ef6f63]/30 transition-colors"
                      >
                        Sell Shares
                      </button>
                    </td>
                  </tr>
                );
              })}
              {portfolio.holdings.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#9aa6af]">
                    You do not own any stocks yet. Analyze a stock in the AI Committee tab to place an order.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-[#182026] rounded-xl border border-[#263238] overflow-hidden">
        <div className="p-4 border-b border-[#263238]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#e4e8eb]">
            Recent Trades Record
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#131a1f] text-[#9aa6af] uppercase border-b border-[#263238]">
              <tr>
                <th className="p-3.5">Time</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Shares</th>
                <th className="p-3.5">Price Paid</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Committee Stance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263238]">
              {portfolio.recentTrades.map((t) => (
                <tr key={t.id} className="hover:bg-[#131a1f]/50">
                  <td className="p-3.5 text-[#9aa6af]">
                    {new Date(t.timestamp).toLocaleDateString()}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.action === 'BUY'
                          ? 'bg-[#14c290]/15 text-[#14c290]'
                          : 'bg-[#ef6f63]/15 text-[#ef6f63]'
                      }`}
                    >
                      {t.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-[#e4e8eb]">{t.ticker}</td>
                  <td className="p-3.5 text-[#9aa6af]">{t.shares}</td>
                  <td className="p-3.5 text-[#e4e8eb]">${t.price.toFixed(2)}</td>
                  <td className="p-3.5 text-[#e4e8eb]">${t.total.toLocaleString()}</td>
                  <td className="p-3.5 text-[#14c290]">{t.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Order Modal */}
      {tradeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#182026] border border-[#263238] rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-[#e4e8eb] mb-4">
              Enter Custom Trade
            </h3>
            <form
              onSubmit={handleManualTradeSubmit}
              className="space-y-4 text-xs font-mono"
            >
              <div>
                <label className="block text-[#9aa6af] mb-1">Stock Ticker</label>
                <input
                  type="text"
                  value={tradeModal.ticker}
                  onChange={(e) =>
                    setTradeModal({ ...tradeModal, ticker: e.target.value })
                  }
                  className="w-full bg-[#131a1f] border border-[#263238] rounded px-3 py-1.5 text-[#e4e8eb]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTradeModal({ ...tradeModal, action: 'BUY' })}
                  className={`py-2 rounded font-bold cursor-pointer ${
                    tradeModal.action === 'BUY'
                      ? 'bg-[#14c290] text-[#0f1418]'
                      : 'bg-[#131a1f] text-[#9aa6af]'
                  }`}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setTradeModal({ ...tradeModal, action: 'SELL' })}
                  className={`py-2 rounded font-bold cursor-pointer ${
                    tradeModal.action === 'SELL'
                      ? 'bg-[#ef6f63] text-[#0f1418]'
                      : 'bg-[#131a1f] text-[#9aa6af]'
                  }`}
                >
                  SELL
                </button>
              </div>

              <div>
                <label className="block text-[#9aa6af] mb-1">Number of Shares</label>
                <input
                  type="number"
                  min="1"
                  value={tradeModal.shares}
                  onChange={(e) =>
                    setTradeModal({
                      ...tradeModal,
                      shares: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full bg-[#131a1f] border border-[#263238] rounded px-3 py-1.5 text-[#e4e8eb]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#9aa6af] mb-1">Price per Share ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={tradeModal.price}
                  onChange={(e) =>
                    setTradeModal({
                      ...tradeModal,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#131a1f] border border-[#263238] rounded px-3 py-1.5 text-[#e4e8eb]"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTradeModal(null)}
                  className="px-3 py-1.5 rounded bg-[#131a1f] text-[#9aa6af]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#14c290] text-[#0f1418] font-bold"
                >
                  Confirm Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
