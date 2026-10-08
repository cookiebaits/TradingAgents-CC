export type PortfolioRating = 'Buy' | 'Overweight' | 'Hold' | 'Underweight' | 'Sell';
export type TraderAction = 'Buy' | 'Hold' | 'Sell';

export interface MarketData {
  symbol: string;
  name: string;
  assetType: 'stock' | 'crypto';
  price: number;
  change24h: number;
  change24hPercent: number;
  high52w: number;
  low52w: number;
  volume: string;
  marketCap: string;
  peRatio: number | null;
  forwardPe: number | null;
  rsi14: number;
  macd: { value: number; signal: number; histogram: number };
  ema20: number;
  sma50: number;
  sma200: number;
  supportLevel: number;
  resistanceLevel: number;
  beta: number;
  debtToEquity: number;
  grossMargin: number;
  revenueGrowthYoY: number;
}

export interface AnalystReport {
  analyst: 'market' | 'fundamentals' | 'news' | 'sentiment';
  title: string;
  score: number; // -100 to 100
  stance: 'Bullish' | 'Neutral' | 'Bearish';
  keyPoints: string[];
  detailedAnalysis: string;
  timestamp: string;
}

export interface DebateTurn {
  speaker: 'Bull Researcher' | 'Bear Researcher' | 'Research Manager';
  round: number;
  thesis: string;
  counterpoints: string[];
  conviction: number; // 1 to 10
}

export interface TraderProposal {
  action: TraderAction;
  targetPrice: number;
  stopLoss: number;
  entryPrice: number;
  allocationPercent: number;
  riskRewardRatio: number;
  timeframe: string;
  rationale: string;
  confidence: number;
}

export interface RiskDebateTurn {
  debator: 'Conservative Debator' | 'Aggressive Debator' | 'Neutral Debator';
  assessment: string;
  maxDrawdownRisk: string;
  sizingRecommendation: string;
  approved: boolean;
}

export interface PortfolioManagerVerdict {
  rating: PortfolioRating;
  approved: boolean;
  approvedAllocationPercent: number;
  approvedDollarAmount: number;
  executionNotes: string;
  targetHorizon: string;
  executiveSummary: string;
  confidenceScore: number;
}

export interface FullAnalysisReport {
  id: string;
  ticker: string;
  companyName: string;
  date: string;
  assetType: 'stock' | 'crypto';
  marketData: MarketData;
  analysts: AnalystReport[];
  researchDebate: DebateTurn[];
  traderProposal: TraderProposal;
  riskDebate: RiskDebateTurn[];
  portfolioVerdict: PortfolioManagerVerdict;
  fullMarkdown: string;
  generatedAt: string;
  modelConfig: {
    quickThinkProvider: string;
    quickThinkModel: string;
    deepThinkProvider: string;
    deepThinkModel: string;
    debateRounds: number;
  };
}

export interface PortfolioHolding {
  ticker: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  allocationPercent: number;
}

export interface PortfolioState {
  cash: number;
  totalValue: number;
  dailyPnL: number;
  dailyPnLPercent: number;
  holdings: PortfolioHolding[];
  recentTrades: {
    id: string;
    timestamp: string;
    ticker: string;
    action: 'BUY' | 'SELL';
    shares: number;
    price: number;
    total: number;
    rating: PortfolioRating;
  }[];
}

export interface MemoryLogEntry {
  id: string;
  date: string;
  ticker: string;
  rating: PortfolioRating;
  action: TraderAction;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  settledDate?: string;
  settledPrice?: number;
  realizedReturnPercent?: number;
  status: 'PENDING' | 'SETTLED' | 'STOPPED_OUT';
  notes: string;
}

export interface SystemConfig {
  deepThinkProvider: string;
  deepThinkModel: string;
  quickThinkProvider: string;
  quickThinkModel: string;
  maxDebateRounds: number;
  maxRiskRounds: number;
  temperature: number;
  benchmarkTicker: string;
  outputLanguage: string;
  checkpointEnabled: boolean;
}
