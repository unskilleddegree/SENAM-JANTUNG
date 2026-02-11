export enum SignalType {
  BUY = 'BUY',
  SELL = 'SELL',
  NEUTRAL = 'NEUTRAL',
  WAIT = 'WAIT'
}

export enum TradingStyle {
  SCALP = 'SCALP', // Short-term / Aggressive
  SWING = 'SWING'  // Long-term / Position
}

export interface TradeSignal {
  type: SignalType;
  entryPrice: string;
  stopLoss: string;
  takeProfit: string[];
  confidence: number;
  reasoning: string;
  timestamp: string;
  market: string;
  style: TradingStyle;
  accountBalance?: number;
}

export interface ActiveTrade extends TradeSignal {
  id: string;
  status: 'OPEN' | 'CLOSED_TP' | 'CLOSED_SL' | 'CLOSED_MANUAL';
  closePrice?: string;
  pnl?: string; // Simulated or calculated
}

export interface SignalHistoryItem {
  time: string;
  market: string;
  style: 'SCALP' | 'SWING';
  type: 'BUY' | 'SELL' | 'WAIT';
  entry: string;
  tp: string;
  status: 'RUNNING' | 'HIT TP' | 'HIT SL' | 'WAITING';
  pips: string;
}

export interface MarketData {
  price: number;
  change: number;
  high: number;
  low: number;
}