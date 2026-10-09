import React, { useState } from 'react';
import {
  Award,
  Compass,
  HelpCircle,
  Info,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { MorningstarRating, OptionGreeks } from '../types';

interface GreeksAndRatingProps {
  morningstar?: MorningstarRating;
  greeks?: OptionGreeks;
  currentPrice: number;
  symbol: string;
}

export const GreeksAndRating: React.FC<GreeksAndRatingProps> = ({
  morningstar,
  greeks,
  currentPrice,
  symbol,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Greek Definitions written in simple, plain English
  const greekExplanations: Record<
    string,
    { title: string; symbol: string; whatItMeans: string; simpleExample: string }
  > = {
    delta: {
      title: 'Delta',
      symbol: 'Δ',
      whatItMeans:
        'Measures how much the option price moves for every $1 change in the stock. It also acts like an approximate percentage chance (probability) that the option finishes in-the-money.',
      simpleExample:
        `With a Delta of ${greeks?.delta || 0.62}, if ${symbol} goes UP by $1.00, your option contract value goes UP by ~$${greeks?.delta || 0.62}.`,
    },
    gamma: {
      title: 'Gamma',
      symbol: 'Γ',
      whatItMeans:
        'The speed accelerator of Delta. It measures how much your Delta will increase or decrease for every $1 move in the stock. High Gamma means profits or losses accelerate quickly as the stock surges.',
      simpleExample:
        `With Gamma at ${greeks?.gamma || 0.038}, a $1 rise in ${symbol} increases your Delta from ${greeks?.delta || 0.62} to ${(
          (greeks?.delta || 0.62) + (greeks?.gamma || 0.038)
        ).toFixed(3)}.`,
    },
    theta: {
      title: 'Theta (Time Decay)',
      symbol: 'Θ',
      whatItMeans:
        'The daily time decay clock. Options have an expiration date, and Theta tells you how much money the contract loses each single day just from time passing by.',
      simpleExample:
        `With Theta at ${greeks?.theta || -0.14}, your option contract loses $${Math.abs(
          greeks?.theta || 0.14
        ).toFixed(2)} in value every 24 hours if the stock price does not move.`,
    },
    vega: {
      title: 'Vega (Volatility Impact)',
      symbol: 'ν',
      whatItMeans:
        'Measures how much the option price changes when overall market expectation of price swings (Implied Volatility) rises or falls by 1%. When fear or anticipation surges, options get more expensive.',
      simpleExample:
        `With Vega at ${greeks?.vega || 0.22}, if market volatility jumps by 1%, your option contract gains +$${greeks?.vega || 0.22} in value.`,
    },
    rho: {
      title: 'Rho (Interest Rate Sensitivity)',
      symbol: 'ρ',
      whatItMeans:
        'Measures how much the option price moves if the Federal Reserve raises or cuts benchmark interest rates by 1%. Usually has a minor effect on short-term trades, but matters for long-term LEAPS.',
      simpleExample:
        `With Rho at ${greeks?.rho || 0.04}, a 1% rate hike by the Fed adds +$${greeks?.rho || 0.04} to this call option.`,
    },
    iv: {
      title: 'Implied Volatility (IV)',
      symbol: 'IV',
      whatItMeans:
        'The market\'s forecast of how wildly the stock price might fluctuate over the next month. High IV means the crowd expects big surprises (expensive options); low IV means calm, predictable price action.',
      simpleExample:
        `At ${greeks?.impliedVolatility || 35}%, the market expects ${symbol} to fluctuate within a ±${((greeks?.impliedVolatility || 35) / Math.sqrt(12)).toFixed(1)}% range over the coming month.`,
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Morningstar Trusted Rating Card */}
      {morningstar && (
        <div className="bg-[#182026] rounded-xl border border-[#263238] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#263238] pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#e5a93b]" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#e4e8eb] flex items-center gap-2">
                  Morningstar Trusted Rating
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e5a93b]/15 text-[#e5a93b] border border-[#e5a93b]/30">
                    Independent Research
                  </span>
                </h3>
              </div>
            </div>
            {/* Visual Gold Stars */}
            <div className="flex items-center gap-0.5 text-[#e5a93b]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= morningstar.stars
                      ? 'fill-[#e5a93b] text-[#e5a93b]'
                      : 'text-[#3d4c55]'
                  }`}
                />
              ))}
              <span className="ml-1 text-xs font-mono font-bold text-[#e4e8eb]">
                {morningstar.stars} / 5 Stars
              </span>
            </div>
          </div>

          {/* Core Morningstar Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-[#131a1f] p-3 rounded-lg border border-[#263238]">
              <span className="text-[10px] text-[#9aa6af] uppercase block">
                Economic Moat
              </span>
              <span className="text-[#14c290] font-bold text-sm">
                {morningstar.economicMoat} Moat
              </span>
              <span className="text-[10px] text-[#5d6670] block mt-0.5">
                {morningstar.economicMoat === 'Wide'
                  ? 'Strong protection against rivals'
                  : 'Moderate competitive barrier'}
              </span>
            </div>

            <div className="bg-[#131a1f] p-3 rounded-lg border border-[#263238]">
              <span className="text-[10px] text-[#9aa6af] uppercase block">
                Fair Value Price
              </span>
              <span className="text-[#e4e8eb] font-bold text-sm">
                ${morningstar.fairValueEstimate.toFixed(2)}
              </span>
              <span className="text-[10px] text-[#9aa6af] block mt-0.5">
                Target worth
              </span>
            </div>

            <div className="bg-[#131a1f] p-3 rounded-lg border border-[#263238]">
              <span className="text-[10px] text-[#9aa6af] uppercase block">
                Price vs Value
              </span>
              <span
                className={`font-bold text-sm ${
                  morningstar.priceToFairValue < 1.0
                    ? 'text-[#14c290]'
                    : 'text-[#ef6f63]'
                }`}
              >
                {morningstar.priceToFairValue}x ({morningstar.valuationStance})
              </span>
              <span className="text-[10px] text-[#5d6670] block mt-0.5">
                {morningstar.priceToFairValue < 1.0
                  ? 'Selling at a discount'
                  : 'Trading at fair market price'}
              </span>
            </div>

            <div className="bg-[#131a1f] p-3 rounded-lg border border-[#263238]">
              <span className="text-[10px] text-[#9aa6af] uppercase block">
                Management
              </span>
              <span className="text-[#e4e8eb] font-bold text-sm">
                {morningstar.capitalAllocation}
              </span>
              <span className="text-[10px] text-[#5d6670] block mt-0.5">
                Capital allocation score
              </span>
            </div>
          </div>

          <p className="text-xs text-[#c5cdd3] leading-relaxed bg-[#131a1f] p-3 rounded-lg border border-[#263238]">
            <strong className="text-[#e5a93b]">Analyst View: </strong>
            {morningstar.analystSummary}
          </p>
        </div>
      )}

      {/* 2. Options Greeks Card with Interactive Explanations */}
      {greeks && (
        <div className="bg-[#182026] rounded-xl border border-[#263238] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#263238] pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#14c290]" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#e4e8eb] flex items-center gap-2">
                  Options Greeks & Volatility
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#14c290]/15 text-[#14c290] border border-[#14c290]/30">
                    Hover for Plain-English Meaning
                  </span>
                </h3>
              </div>
            </div>
            <span className="text-[11px] font-mono text-[#9aa6af]">
              30-Day Contract (${greeks.strikePrice} Strike)
            </span>
          </div>

          {/* Interactive Greek Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Delta */}
            <div
              onMouseEnter={() => setActiveTooltip('delta')}
              onMouseLeave={() => setActiveTooltip(null)}
              className="bg-[#131a1f] hover:bg-[#1f2933] cursor-pointer p-3 rounded-lg border border-[#263238] transition-all relative group"
            >
              <div className="flex items-center justify-between text-[11px] text-[#9aa6af] mb-1">
                <span className="font-bold flex items-center gap-1 text-[#e4e8eb]">
                  Delta (Δ)
                  <Info className="w-3 h-3 text-[#14c290]" />
                </span>
                <span className="text-[10px] text-[#5d6670]">Price Speed</span>
              </div>
              <div className="text-lg font-bold font-mono text-[#14c290]">
                {greeks.delta}
              </div>
              <span className="text-[10px] text-[#9aa6af] block mt-0.5">
                +$1 stock = +${greeks.delta} option
              </span>
            </div>

            {/* Gamma */}
            <div
              onMouseEnter={() => setActiveTooltip('gamma')}
              onMouseLeave={() => setActiveTooltip(null)}
              className="bg-[#131a1f] hover:bg-[#1f2933] cursor-pointer p-3 rounded-lg border border-[#263238] transition-all relative group"
            >
              <div className="flex items-center justify-between text-[11px] text-[#9aa6af] mb-1">
                <span className="font-bold flex items-center gap-1 text-[#e4e8eb]">
                  Gamma (Γ)
                  <Info className="w-3 h-3 text-[#14c290]" />
                </span>
                <span className="text-[10px] text-[#5d6670]">Acceleration</span>
              </div>
              <div className="text-lg font-bold font-mono text-[#e4e8eb]">
                {greeks.gamma}
              </div>
              <span className="text-[10px] text-[#9aa6af] block mt-0.5">
                Delta boost per $1 move
              </span>
            </div>

            {/* Theta */}
            <div
              onMouseEnter={() => setActiveTooltip('theta')}
              onMouseLeave={() => setActiveTooltip(null)}
              className="bg-[#131a1f] hover:bg-[#1f2933] cursor-pointer p-3 rounded-lg border border-[#263238] transition-all relative group"
            >
              <div className="flex items-center justify-between text-[11px] text-[#9aa6af] mb-1">
                <span className="font-bold flex items-center gap-1 text-[#e4e8eb]">
                  Theta (Θ)
                  <Info className="w-3 h-3 text-[#ef6f63]" />
                </span>
                <span className="text-[10px] text-[#ef6f63]">Daily Decay</span>
              </div>
              <div className="text-lg font-bold font-mono text-[#ef6f63]">
                ${greeks.theta}
              </div>
              <span className="text-[10px] text-[#9aa6af] block mt-0.5">
                Value lost per 24 hours
              </span>
            </div>

            {/* Vega */}
            <div
              onMouseEnter={() => setActiveTooltip('vega')}
              onMouseLeave={() => setActiveTooltip(null)}
              className="bg-[#131a1f] hover:bg-[#1f2933] cursor-pointer p-3 rounded-lg border border-[#263238] transition-all relative group"
            >
              <div className="flex items-center justify-between text-[11px] text-[#9aa6af] mb-1">
                <span className="font-bold flex items-center gap-1 text-[#e4e8eb]">
                  Vega (ν)
                  <Info className="w-3 h-3 text-[#14c290]" />
                </span>
                <span className="text-[10px] text-[#5d6670]">Volatility</span>
              </div>
              <div className="text-lg font-bold font-mono text-[#e4e8eb]">
                {greeks.vega}
              </div>
              <span className="text-[10px] text-[#9aa6af] block mt-0.5">
                Gain per 1% jump in swings
              </span>
            </div>

            {/* Rho */}
            <div
              onMouseEnter={() => setActiveTooltip('rho')}
              onMouseLeave={() => setActiveTooltip(null)}
              className="bg-[#131a1f] hover:bg-[#1f2933] cursor-pointer p-3 rounded-lg border border-[#263238] transition-all relative group"
            >
              <div className="flex items-center justify-between text-[11px] text-[#9aa6af] mb-1">
                <span className="font-bold flex items-center gap-1 text-[#e4e8eb]">
                  Rho (ρ)
                  <Info className="w-3 h-3 text-[#14c290]" />
                </span>
                <span className="text-[10px] text-[#5d6670]">Interest Rates</span>
              </div>
              <div className="text-lg font-bold font-mono text-[#e4e8eb]">
                {greeks.rho}
              </div>
              <span className="text-[10px] text-[#9aa6af] block mt-0.5">
                Sensitivity to Fed rates
              </span>
            </div>

            {/* Implied Volatility */}
            <div
              onMouseEnter={() => setActiveTooltip('iv')}
              onMouseLeave={() => setActiveTooltip(null)}
              className="bg-[#131a1f] hover:bg-[#1f2933] cursor-pointer p-3 rounded-lg border border-[#263238] transition-all relative group"
            >
              <div className="flex items-center justify-between text-[11px] text-[#9aa6af] mb-1">
                <span className="font-bold flex items-center gap-1 text-[#e4e8eb]">
                  Volatility (IV)
                  <Info className="w-3 h-3 text-[#14c290]" />
                </span>
                <span className="text-[10px] text-[#14c290]">Expected Move</span>
              </div>
              <div className="text-lg font-bold font-mono text-[#14c290]">
                {greeks.impliedVolatility}%
              </div>
              <span className="text-[10px] text-[#9aa6af] block mt-0.5">
                Predicted 30-day swing
              </span>
            </div>
          </div>

          {/* Active Explanation Tooltip Box */}
          <div className="p-3.5 bg-[#131a1f] rounded-lg border border-[#14c290]/40 text-xs text-[#c5cdd3] leading-relaxed transition-all">
            {activeTooltip && greekExplanations[activeTooltip] ? (
              <div className="space-y-1">
                <div className="font-bold text-[#14c290] flex items-center gap-1.5">
                  <span>{greekExplanations[activeTooltip].title}</span>
                  <span className="text-[#9aa6af] font-mono">
                    ({greekExplanations[activeTooltip].symbol})
                  </span>
                </div>
                <p>{greekExplanations[activeTooltip].whatItMeans}</p>
                <div className="text-[11px] text-[#e4e8eb] bg-[#182026] p-2 rounded border border-[#263238] mt-1 font-mono">
                  💡 <strong>Real Example: </strong>
                  {greekExplanations[activeTooltip].simpleExample}
                </div>
              </div>
            ) : (
              <div className="text-[#9aa6af] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#14c290] shrink-0" />
                <span>
                  Hover over any Greek box above (Delta, Gamma, Theta, Vega, Rho, or
                  IV) to see an instant beginner-friendly explanation and numerical
                  example.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
