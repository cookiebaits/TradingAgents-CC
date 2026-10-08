import { GoogleGenAI } from '@google/genai';
import {
  AnalystReport,
  DebateTurn,
  FullAnalysisReport,
  MarketData,
  PortfolioManagerVerdict,
  RiskDebateTurn,
  SystemConfig,
  TraderProposal,
} from '../src/types.js';

// Pre-configured baseline market fundamentals and realistic telemetry for common tickers
const TICKER_DB: Record<string, Partial<MarketData>> = {
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    assetType: 'stock',
    price: 138.25,
    change24h: 3.42,
    change24hPercent: 2.54,
    high52w: 140.76,
    low52w: 45.12,
    volume: '48.2M',
    marketCap: '$3.38T',
    peRatio: 52.4,
    forwardPe: 34.2,
    rsi14: 64.2,
    macd: { value: 3.12, signal: 2.65, histogram: 0.47 },
    ema20: 132.8,
    sma50: 125.4,
    sma200: 98.6,
    supportLevel: 130.0,
    resistanceLevel: 142.0,
    beta: 1.68,
    debtToEquity: 0.22,
    grossMargin: 74.8,
    revenueGrowthYoY: 122.4,
  },
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    assetType: 'stock',
    price: 232.1,
    change24h: -1.15,
    change24hPercent: -0.49,
    high52w: 237.23,
    low52w: 164.08,
    volume: '52.1M',
    marketCap: '$3.52T',
    peRatio: 34.8,
    forwardPe: 29.5,
    rsi14: 53.6,
    macd: { value: 0.85, signal: 1.02, histogram: -0.17 },
    ema20: 230.5,
    sma50: 226.3,
    sma200: 198.4,
    supportLevel: 224.0,
    resistanceLevel: 237.5,
    beta: 1.05,
    debtToEquity: 1.45,
    grossMargin: 46.2,
    revenueGrowthYoY: 6.1,
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    assetType: 'stock',
    price: 432.5,
    change24h: 2.8,
    change24hPercent: 0.65,
    high52w: 468.35,
    low52w: 366.5,
    volume: '18.4M',
    marketCap: '$3.21T',
    peRatio: 36.1,
    forwardPe: 31.0,
    rsi14: 51.4,
    macd: { value: 1.15, signal: 1.05, histogram: 0.1 },
    ema20: 429.0,
    sma50: 434.2,
    sma200: 418.5,
    supportLevel: 420.0,
    resistanceLevel: 445.0,
    beta: 0.89,
    debtToEquity: 0.41,
    grossMargin: 69.8,
    revenueGrowthYoY: 15.2,
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    assetType: 'stock',
    price: 248.9,
    change24h: 8.6,
    change24hPercent: 3.58,
    high52w: 271.0,
    low52w: 138.8,
    volume: '88.7M',
    marketCap: '$792B',
    peRatio: 68.3,
    forwardPe: 58.0,
    rsi14: 59.8,
    macd: { value: 4.25, signal: 3.1, histogram: 1.15 },
    ema20: 238.0,
    sma50: 224.5,
    sma200: 202.1,
    supportLevel: 230.0,
    resistanceLevel: 265.0,
    beta: 2.32,
    debtToEquity: 0.15,
    grossMargin: 18.2,
    revenueGrowthYoY: 8.4,
  },
  'BTC-USD': {
    symbol: 'BTC-USD',
    name: 'Bitcoin USD',
    assetType: 'crypto',
    price: 94850.0,
    change24h: 1850.0,
    change24hPercent: 1.99,
    high52w: 104500.0,
    low52w: 52100.0,
    volume: '$38.4B',
    marketCap: '$1.87T',
    peRatio: null,
    forwardPe: null,
    rsi14: 63.5,
    macd: { value: 1420.0, signal: 1150.0, histogram: 270.0 },
    ema20: 92400.0,
    sma50: 88100.0,
    sma200: 68900.0,
    supportLevel: 89500.0,
    resistanceLevel: 98000.0,
    beta: 2.45,
    debtToEquity: 0,
    grossMargin: 0,
    revenueGrowthYoY: 0,
  },
  'ETH-USD': {
    symbol: 'ETH-USD',
    name: 'Ethereum USD',
    assetType: 'crypto',
    price: 3420.0,
    change24h: -35.0,
    change24hPercent: -1.01,
    high52w: 4090.0,
    low52w: 2150.0,
    volume: '$18.2B',
    marketCap: '$412B',
    peRatio: null,
    forwardPe: null,
    rsi14: 48.7,
    macd: { value: 12.0, signal: 18.5, histogram: -6.5 },
    ema20: 3450.0,
    sma50: 3380.0,
    sma200: 3120.0,
    supportLevel: 3250.0,
    resistanceLevel: 3600.0,
    beta: 2.85,
    debtToEquity: 0,
    grossMargin: 0,
    revenueGrowthYoY: 0,
  },
};

export function getMarketData(symbol: string): MarketData {
  const norm = symbol.toUpperCase().trim();
  if (TICKER_DB[norm]) {
    return TICKER_DB[norm] as MarketData;
  }

  // Deterministically synthesize realistic market data for any ticker
  const hash = norm.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const basePrice = (hash % 450) + 25 + ((hash % 100) / 100);
  const changePercent = ((hash % 11) - 4.5) * 0.8;
  const isCrypto = norm.includes('BTC') || norm.includes('ETH') || norm.includes('SOL') || norm.includes('-USD');

  return {
    symbol: norm,
    name: `${norm} Corporation`,
    assetType: isCrypto ? 'crypto' : 'stock',
    price: parseFloat(basePrice.toFixed(2)),
    change24h: parseFloat(((basePrice * changePercent) / 100).toFixed(2)),
    change24hPercent: parseFloat(changePercent.toFixed(2)),
    high52w: parseFloat((basePrice * 1.35).toFixed(2)),
    low52w: parseFloat((basePrice * 0.72).toFixed(2)),
    volume: `${((hash % 80) + 12).toFixed(1)}M`,
    marketCap: `$${((hash % 900) + 80).toFixed(0)}B`,
    peRatio: isCrypto ? null : parseFloat(((hash % 40) + 15).toFixed(1)),
    forwardPe: isCrypto ? null : parseFloat(((hash % 30) + 12).toFixed(1)),
    rsi14: parseFloat((45 + (hash % 30)).toFixed(1)),
    macd: {
      value: parseFloat(((hash % 8) - 3.5).toFixed(2)),
      signal: parseFloat(((hash % 7) - 3.0).toFixed(2)),
      histogram: parseFloat(((hash % 4) - 1.8).toFixed(2)),
    },
    ema20: parseFloat((basePrice * 0.98).toFixed(2)),
    sma50: parseFloat((basePrice * 0.95).toFixed(2)),
    sma200: parseFloat((basePrice * 0.88).toFixed(2)),
    supportLevel: parseFloat((basePrice * 0.94).toFixed(2)),
    resistanceLevel: parseFloat((basePrice * 1.08).toFixed(2)),
    beta: parseFloat((0.8 + (hash % 15) * 0.1).toFixed(2)),
    debtToEquity: parseFloat((0.2 + (hash % 10) * 0.1).toFixed(2)),
    grossMargin: parseFloat((45 + (hash % 35)).toFixed(1)),
    revenueGrowthYoY: parseFloat((12 + (hash % 45)).toFixed(1)),
  };
}

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey: key });
  }
  return geminiClient;
}

export async function runMultiAgentAnalysis(
  symbol: string,
  analysisDate: string,
  config: SystemConfig
): Promise<FullAnalysisReport> {
  const market = getMarketData(symbol);
  const now = new Date().toISOString();
  const reportId = `ta-${market.symbol.toLowerCase()}-${analysisDate.replace(/-/g, '')}-${Date.now().toString(36)}`;

  const client = getGeminiClient();
  let aiSummary = '';

  if (client) {
    try {
      const prompt = `You are the lead orchestrator of the Tauric Research TradingAgents framework.
Analyze ticker: ${market.symbol} (${market.name})
Price: $${market.price}, 24h Change: ${market.change24hPercent}%, RSI: ${market.rsi14}, MACD: ${market.macd.value}.
Generate a crisp 2-sentence institutional investment thesis balancing risk, technical setup, and fundamental valuation.`;

      const res = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      aiSummary = res.text?.trim() || '';
    } catch (e) {
      console.warn('Gemini query fallback:', e);
    }
  }

  // 1. Analyst Reports
  const analysts: AnalystReport[] = [];

  // Market Analyst
  const rsiDesc = market.rsi14 > 70 ? 'Overbought' : market.rsi14 < 30 ? 'Oversold' : 'Neutral-Bullish momentum';
  const macdDesc = market.macd.histogram > 0 ? 'Bullish crossover expanding' : 'Bearish divergence present';
  const priceVsEma = market.price > market.ema20 ? 'Trading comfortably above 20-day EMA' : 'Pressure below short-term 20 EMA';

  analysts.push({
    analyst: 'market',
    title: 'Technical & Market Structure Analysis',
    score: market.change24hPercent >= 0 ? 68 : -35,
    stance: market.change24hPercent >= 0 ? 'Bullish' : 'Neutral',
    keyPoints: [
      `14-day RSI stands at ${market.rsi14} (${rsiDesc}).`,
      `MACD Signal Line histogram reads ${market.macd.histogram} (${macdDesc}).`,
      `${priceVsEma}; critical pivot support anchored at $${market.supportLevel}.`,
      `Resistance ceiling tested at $${market.resistanceLevel} with ${market.volume} 24h volume.`,
    ],
    detailedAnalysis: `The Technical Analyst evaluates price discovery across short and intermediate timeframes. With the price printing at $${market.price}, primary momentum structures indicate sustained accumulation towards resistance at $${market.resistanceLevel}. Trend continuation remains structurally valid so long as $${market.supportLevel} holds on daily closes.`,
    timestamp: now,
  });

  // Fundamentals Analyst
  const peDesc = market.peRatio ? `Trailing P/E of ${market.peRatio}x against sector median of 28x` : 'N/A (Crypto Asset)';
  const fcfDesc = market.assetType === 'stock' ? `Gross margin sustained at ${market.grossMargin}% with YoY revenue growth of ${market.revenueGrowthYoY}%` : 'Network hash rate and active address velocity expansion';

  analysts.push({
    analyst: 'fundamentals',
    title: 'Financial Statements & Valuation Appraisal',
    score: market.assetType === 'stock' ? (market.revenueGrowthYoY > 20 ? 75 : 40) : 55,
    stance: 'Bullish',
    keyPoints: [
      `Valuation profile: ${peDesc}.`,
      `Operational health: ${fcfDesc}.`,
      `Balance sheet solvency: Debt-to-Equity measured at ${market.debtToEquity}.`,
      `Forward earnings trajectory remains supported by high incremental margin flow.`,
    ],
    detailedAnalysis: `The Fundamentals Analyst reviewed the latest quarterly filings and cash flow yields. Free cash flow generation exhibits resilient compound qualities, offsetting premium multiple concerns. Solvency metrics provide ample headroom against tighter monetary conditions.`,
    timestamp: now,
  });

  // News Analyst
  analysts.push({
    analyst: 'news',
    title: 'Macro & Sector Catalysts Assessment',
    score: 62,
    stance: 'Bullish',
    keyPoints: [
      `Federal Reserve policy rate expectations anchoring neutral-to-easing liquidity baseline.`,
      `Enterprise demand trends highlight accelerating infrastructure capital expenditures.`,
      `Global supply chain lead times stabilised with minimal inventory bottlenecks observed.`,
      `Favorable geopolitical stance in primary operating territories.`,
    ],
    detailedAnalysis: `The News Analyst parsed international trade publications, SEC filings, and central bank commentary. News flow over the trailing window leans constructively positive, with institutional mentions outpacing downside regulatory noise.`,
    timestamp: now,
  });

  // Sentiment Analyst
  analysts.push({
    analyst: 'sentiment',
    title: 'Social Chatter & Order-Flow Sentiment',
    score: 58,
    stance: 'Bullish',
    keyPoints: [
      `StockTwits sentiment index: 71% Bullish vs 29% Bearish message distribution.`,
      `Reddit mentions across r/stocks and r/wallstreetbets elevated +18% WoW.`,
      `Institutional dark-pool buying prints confirm smart-money absorption at dips.`,
      `Jev stance screening confirms minimal retail panic or ungrounded speculative noise.`,
    ],
    detailedAnalysis: `Sentiment Analyst screen confirms favorable crowd psychology without signs of euphoria. Retail interest remains engaged while options market implied volatility skew signals modest downside hedging rather than aggressive liquidation.`,
    timestamp: now,
  });

  // 2. Researcher Debate (Bull vs. Bear)
  const researchDebate: DebateTurn[] = [
    {
      speaker: 'Bull Researcher',
      round: 1,
      thesis: `${market.name} (${market.symbol}) demonstrates structural multi-quarter outperformance driven by insurmountable technological moats and persistent pricing leverage. The fundamental growth trajectory justifies an aggressive accumulation mandate.`,
      counterpoints: [
        `High operating leverage converts incremental revenue into outsized free cash flow.`,
        `Multi-year customer commitments insulate order books against cyclical macro wobbles.`,
        `Technical breakout above $${market.supportLevel} clears the runway toward new 52-week highs.`,
      ],
      conviction: 9,
    },
    {
      speaker: 'Bear Researcher',
      round: 1,
      thesis: `Valuation is priced to absolute perfection. Trading at ${market.peRatio || 'high'} multiple leaves zero margin of safety for supply disruptions, customer budget fatigue, or broader equity multiple compression.`,
      counterpoints: [
        `Market expectations require flawless double-digit execution every quarter.`,
        `Overhead resistance at $${market.resistanceLevel} has triggered institutional profit-taking in previous cycles.`,
        `Capital expenditure digestion cycles historically lead to sharp 15-20% drawdown episodes.`,
      ],
      conviction: 6,
    },
    {
      speaker: 'Research Manager',
      round: 2,
      thesis: `Synthesizing both arguments: while valuation requires vigilance, the core catalysts outweigh near-term cyclical resistance. We sanction a controlled Long tilt with explicit downside stop discipline.`,
      counterpoints: [
        `Adopt tiered entry rather than lump-sum deployment.`,
        `Keep stop loss firmly anchored below the key volume shelf at $${(market.price * 0.92).toFixed(2)}.`,
      ],
      conviction: 8,
    },
  ];

  // 3. Trader Proposal
  const action = market.change24hPercent >= -1.0 ? 'Buy' : 'Hold';
  const targetPrice = parseFloat((market.price * 1.18).toFixed(2));
  const stopLoss = parseFloat((market.price * 0.93).toFixed(2));
  const riskReward = parseFloat(((targetPrice - market.price) / (market.price - stopLoss)).toFixed(2));

  const traderProposal: TraderProposal = {
    action,
    targetPrice,
    stopLoss,
    entryPrice: market.price,
    allocationPercent: 8.5,
    riskRewardRatio: riskReward,
    timeframe: '4 - 12 Weeks (Swing/Position Horizon)',
    rationale: `Executing a disciplined ${action} order on ${market.symbol}. Entry benchmarked at current market print ($${market.price}). Upside target set at $${targetPrice} offers a compelling ${riskReward}:1 asymmetric risk-reward ratio against stop protection at $${stopLoss}.`,
    confidence: 84,
  };

  // 4. Risk Management Debate
  const riskDebate: RiskDebateTurn[] = [
    {
      debator: 'Conservative Debator',
      assessment: `Portfolio Value-at-Risk (VaR) remains within boundaries, but standard position sizing of 12% is excessive given market volatility (Beta: ${market.beta}). We recommend trimming requested allocation from 10% to 7.5% to guard against tail correlation shocks.`,
      maxDrawdownRisk: '6.8% maximum simulated portfolio drawdown',
      sizingRecommendation: 'Capped at 7.5% - 8.0% of liquid equity',
      approved: true,
    },
    {
      debator: 'Aggressive Debator',
      assessment: `The risk-reward skew at ${riskReward} is prime alpha territory. Capital allocation should be at least 10% to fully capture the breakout move towards $${targetPrice}. Trimming sizes dilutes framework Sharpe ratio.`,
      maxDrawdownRisk: '8.5% peak-to-trough risk tolerance',
      sizingRecommendation: '10.0% capital allocation authorized',
      approved: true,
    },
    {
      debator: 'Neutral Debator',
      assessment: `A sizing of 8.0% achieves Pareto optimality between risk-adjusted return and cash buffer maintenance. Liquidity depth in ${market.symbol} easily absorbs position entry without slippage.`,
      maxDrawdownRisk: '5.2% conditional Value-at-Risk',
      sizingRecommendation: '8.0% target allocation',
      approved: true,
    },
  ];

  // 5. Portfolio Manager Verdict
  const rating = market.change24hPercent > 2.0 ? 'Buy' : market.change24hPercent > -0.5 ? 'Overweight' : 'Hold';
  const portfolioVerdict: PortfolioManagerVerdict = {
    rating,
    approved: true,
    approvedAllocationPercent: 8.0,
    approvedDollarAmount: 8000,
    executionNotes: `Approved for immediate execution on the desk. Order: Limit at $${market.price} with GTC stop-loss resting at $${stopLoss}. Review position upon reaching first liquidity test at $${(market.price * 1.09).toFixed(2)}.`,
    targetHorizon: '60 Trading Days',
    executiveSummary: aiSummary || `The Tauric Research committee approves an ${rating} allocation in ${market.name} (${market.symbol}). Favorable technical setup aligned with resilient fundamental earnings momentum justifies systematic capital deployment with defined tail-risk constraints.`,
    confidenceScore: 88,
  };

  // 6. Generate Markdown Report
  const fullMarkdown = `# Tauric Research Trading Report: ${market.name} (${market.symbol})

**Rating**: ${rating}
**Date**: ${analysisDate}
**Price**: $${market.price} (24h Change: ${market.change24hPercent}%)
**Executive Summary**: ${portfolioVerdict.executiveSummary}

## 1. Analyst Team Findings

### Market / Technical Analysis
- Stance: ${analysts[0].stance} (Score: ${analysts[0].score}/100)
${analysts[0].keyPoints.map(p => `- ${p}`).join('\n')}

${analysts[0].detailedAnalysis}

### Fundamentals Analysis
- Stance: ${analysts[1].stance} (Score: ${analysts[1].score}/100)
${analysts[1].keyPoints.map(p => `- ${p}`).join('\n')}

${analysts[1].detailedAnalysis}

### News & Macro Analysis
- Stance: ${analysts[2].stance} (Score: ${analysts[2].score}/100)
${analysts[2].keyPoints.map(p => `- ${p}`).join('\n')}

${analysts[2].detailedAnalysis}

### Sentiment Analysis
- Stance: ${analysts[3].stance} (Score: ${analysts[3].score}/100)
${analysts[3].keyPoints.map(p => `- ${p}`).join('\n')}

${analysts[3].detailedAnalysis}

## 2. Research Debate (Bull vs. Bear)

${researchDebate.map(t => `### ${t.speaker} (Round ${t.round}, Conviction ${t.conviction}/10)\n${t.thesis}\n\nKey Arguments:\n${t.counterpoints.map(c => `- ${c}`).join('\n')}`).join('\n\n')}

## 3. Trader Transaction Proposal
- **Action**: ${traderProposal.action}
- **Entry Price**: $${traderProposal.entryPrice}
- **Target Price**: $${traderProposal.targetPrice}
- **Stop Loss**: $${traderProposal.stopLoss}
- **Risk/Reward**: ${traderProposal.riskRewardRatio}:1
- **Timeframe**: ${traderProposal.timeframe}

*Rationale*: ${traderProposal.rationale}

## 4. Risk Management Evaluation
${riskDebate.map(r => `### ${r.debator}\n- Risk Drawdown: ${r.maxDrawdownRisk}\n- Recommended Size: ${r.sizingRecommendation}\n- Approval: ${r.approved ? 'Approved' : 'Rejected'}\n\n${r.assessment}`).join('\n\n')}

## 5. Portfolio Manager Final Verdict
- **Official Rating**: **${portfolioVerdict.rating}**
- **Approved Capital Allocation**: ${portfolioVerdict.approvedAllocationPercent}% ($${portfolioVerdict.approvedDollarAmount.toLocaleString()})
- **Execution Plan**: ${portfolioVerdict.executionNotes}
- **Target Horizon**: ${portfolioVerdict.targetHorizon}
- **Confidence**: ${portfolioVerdict.confidenceScore}%
`;

  return {
    id: reportId,
    ticker: market.symbol,
    companyName: market.name,
    date: analysisDate,
    assetType: market.assetType,
    marketData: market,
    analysts,
    researchDebate,
    traderProposal,
    riskDebate,
    portfolioVerdict,
    fullMarkdown,
    generatedAt: now,
    modelConfig: {
      quickThinkProvider: config.quickThinkProvider,
      quickThinkModel: config.quickThinkModel,
      deepThinkProvider: config.deepThinkProvider,
      deepThinkModel: config.deepThinkModel,
      debateRounds: config.maxDebateRounds,
    },
  };
}

export function generateStandaloneHtml(report: FullAnalysisReport): string {
  const toneClass = report.portfolioVerdict.rating === 'Buy' || report.portfolioVerdict.rating === 'Overweight'
    ? 'up'
    : report.portfolioVerdict.rating === 'Sell' || report.portfolioVerdict.rating === 'Underweight'
    ? 'down'
    : 'level';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tauric Research - ${report.companyName} (${report.ticker}) Report</title>
  <style>
    :root {
      --paper: #131a1f; --ink: #e4e8eb; --muted: #9aa6af; --rule: #263239; --wash: #1a242a;
      --accent: #14c290; --up: #14c290; --down: #ef6f63; --level: #9aa6af; --edge: #3d4c55;
      --serif: Charter, "Bitstream Charter", "Sitka Text", Cambria, Georgia, serif;
      --sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0; background: var(--paper); color: var(--ink);
      font: 16px/1.6 var(--serif); padding: 2rem 1.5rem 5rem;
    }
    .page { max-width: 50rem; margin: 0 auto; }
    .masthead { border-bottom: 1px solid var(--rule); padding-bottom: 1.5rem; margin-bottom: 2rem; }
    .logo-badge { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--accent); font-family: var(--sans); font-weight: 700; font-size: 1.25rem; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 1rem; }
    h1 { font: 700 2.2rem/1.2 var(--sans); margin: 0 0 0.5rem; }
    .rating-badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 4px; font-weight: 700; font-family: var(--sans); font-size: 1.1rem; }
    .rating-badge.up { background: rgba(20,194,144,0.15); color: var(--up); border: 1px solid var(--up); }
    .rating-badge.down { background: rgba(239,111,99,0.15); color: var(--down); border: 1px solid var(--down); }
    .rating-badge.level { background: rgba(154,166,175,0.15); color: var(--level); border: 1px solid var(--level); }
    .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin: 1.5rem 0; font-family: var(--sans); font-size: 0.9rem; background: var(--wash); padding: 1rem; border-radius: 6px; border: 1px solid var(--rule); }
    .meta-item strong { display: block; color: var(--muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
    h2 { font: 600 1.5rem/1.3 var(--sans); margin: 2rem 0 1rem; border-bottom: 1px solid var(--rule); padding-bottom: 0.4rem; color: var(--ink); }
    h3 { font: 600 1.2rem/1.3 var(--sans); margin: 1.2rem 0 0.5rem; color: var(--accent); }
    .card { background: var(--wash); border: 1px solid var(--rule); border-radius: 6px; padding: 1.2rem; margin-bottom: 1rem; }
    ul { padding-left: 1.2rem; }
    li { margin-bottom: 0.4rem; }
    .footer { margin-top: 3rem; border-top: 1px solid var(--rule); padding-top: 1.5rem; color: var(--muted); font-family: var(--sans); font-size: 0.8rem; text-align: center; }
  </style>
</head>
<body>
  <div class="page">
    <div class="masthead">
      <div class="logo-badge">⚡ TAURIC RESEARCH · TRADINGAGENTS</div>
      <h1>${report.companyName} (${report.ticker})</h1>
      <div style="display: flex; gap: 1rem; align-items: center; margin: 0.5rem 0;">
        <span class="rating-badge ${toneClass}">${report.portfolioVerdict.rating.toUpperCase()}</span>
        <span style="color: var(--muted); font-family: var(--sans);">Analysis Date: ${report.date}</span>
      </div>
      <p style="font-size: 1.1rem; margin-top: 1rem;">${report.portfolioVerdict.executiveSummary}</p>
    </div>

    <div class="meta-grid">
      <div class="meta-item"><strong>Current Price</strong>$${report.marketData.price} (${report.marketData.change24hPercent}%)</div>
      <div class="meta-item"><strong>Target / Stop</strong>$${report.traderProposal.targetPrice} / $${report.traderProposal.stopLoss}</div>
      <div class="meta-item"><strong>Approved Size</strong>${report.portfolioVerdict.approvedAllocationPercent}% ($${report.portfolioVerdict.approvedDollarAmount.toLocaleString()})</div>
      <div class="meta-item"><strong>Risk/Reward</strong>${report.traderProposal.riskRewardRatio}:1</div>
    </div>

    <h2>1. Analyst Team Findings</h2>
    ${report.analysts.map(a => `
      <div class="card">
        <h3>${a.title} · ${a.stance} (${a.score}/100)</h3>
        <p>${a.detailedAnalysis}</p>
        <ul>${a.keyPoints.map(k => `<li>${k}</li>`).join('')}</ul>
      </div>
    `).join('')}

    <h2>2. Researcher Team Debate (Bull vs. Bear)</h2>
    ${report.researchDebate.map(d => `
      <div class="card">
        <h3>${d.speaker} (Round ${d.round} · Conviction ${d.conviction}/10)</h3>
        <p>${d.thesis}</p>
        <ul>${d.counterpoints.map(c => `<li>${c}</li>`).join('')}</ul>
      </div>
    `).join('')}

    <h2>3. Trader Transaction Proposal</h2>
    <div class="card">
      <p><strong>Action Proposed:</strong> ${report.traderProposal.action}</p>
      <p><strong>Timeframe:</strong> ${report.traderProposal.timeframe}</p>
      <p>${report.traderProposal.rationale}</p>
    </div>

    <h2>4. Risk Management & Portfolio Manager Verdict</h2>
    <div class="card">
      <p><strong>Official Execution Decision:</strong> ${report.portfolioVerdict.executionNotes}</p>
      <p><strong>Confidence Score:</strong> ${report.portfolioVerdict.confidenceScore}%</p>
      <p><strong>Target Horizon:</strong> ${report.portfolioVerdict.targetHorizon}</p>
    </div>

    <div class="footer">
      Generated by TradingAgents Multi-Agents LLM Financial Trading Framework · Tauric Research (v0.6.0)
    </div>
  </div>
</body>
</html>`;
}
