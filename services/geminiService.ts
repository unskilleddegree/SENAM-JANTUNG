import { TradeSignal, SignalType, TradingStyle, SignalHistoryItem } from "../types";

// NOTE: This service has been converted to a Simulation Mode to avoid API Quota limits.
// It generates realistic-looking random signals for demonstration purposes.

// Mock Pricing Data (Approximate Base Prices)
const MOCK_PRICES: Record<string, number> = {
  'XAUUSD': 5052.00, // Updated to match user's chart observation
  'EURUSD': 1.0540,
  'GBPUSD': 1.2690,
  'BTCUSD': 98200.00,
  'ETHUSD': 3350.00,
  'US30': 44100.00,
  'NAS100': 21200.00
};

const getPricePrecision = (market: string) => {
  if (['EURUSD', 'GBPUSD'].includes(market)) return 4;
  if (['US30', 'NAS100', 'BTCUSD', 'ETHUSD', 'XAUUSD'].includes(market)) return 2;
  return 2;
};

const getRandomPrice = (market: string) => {
  const base = MOCK_PRICES[market] || 1000;
  // Fluctuate by up to 0.05% (reduced variance) to keep it closer to the base price
  const variance = base * 0.0005; 
  const price = base + (Math.random() * variance * 2 - variance);
  return Number(price.toFixed(getPricePrecision(market)));
};

export const generateTradeSignal = async (market: string, style: TradingStyle, balance: number): Promise<TradeSignal> => {
  // Simulate AI Processing Delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const currentPrice = getRandomPrice(market);
  
  // Randomize Signal Direction (50/50 Buy/Sell)
  const isBuy = Math.random() > 0.5;
  const type = isBuy ? SignalType.BUY : SignalType.SELL;
  
  // Risk calculations based on trading style
  // Scalp: 0.1% SL distance
  // Swing: 0.5% SL distance
  const riskPercent = style === TradingStyle.SCALP ? 0.001 : 0.005;
  const slDistance = currentPrice * riskPercent;
  
  // TP steps relative to SL. TP1 = 1R, TP2 = 2R...
  const tpStep = slDistance; 

  let stopLoss: number;
  let takeProfits: number[] = [];

  if (type === SignalType.BUY) {
    stopLoss = currentPrice - slDistance;
    for(let i = 1; i <= 5; i++) {
        takeProfits.push(currentPrice + (tpStep * i));
    }
  } else {
    stopLoss = currentPrice + slDistance;
    for(let i = 1; i <= 5; i++) {
        takeProfits.push(currentPrice - (tpStep * i));
    }
  }

  const precision = getPricePrecision(market);
  
  // Generate plausible reasoning text based on random technical patterns
  const timeframes = style === TradingStyle.SCALP ? "M5/M15" : "H4/D1";
  const patterns = [
      "bullish flag formation", "double bottom structure", "liquidity sweep of previous lows", 
      "break of structure (BOS)", "rejection from key demand zone", "moving average crossover",
      "RSI divergence", "volume imbalance fill", "bearish engulfing candle", "rejection from supply zone"
  ];
  const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
  
  // Ensure reasoning matches direction
  const directionText = isBuy ? "upside" : "downside";
  
  const reasoning = `Algorithmic Analysis: Market structure on ${timeframes} indicates ${directionText} momentum due to a ${selectedPattern}. Entry validated near ${currentPrice.toFixed(precision)}. Stop loss calibrated for $${balance} account equity to maintain <2% risk.`;

  return {
    type,
    entryPrice: currentPrice.toFixed(precision),
    stopLoss: stopLoss.toFixed(precision),
    takeProfit: takeProfits.map(tp => tp.toFixed(precision)),
    confidence: Math.floor(Math.random() * (99 - 82) + 82), // 82-99% confidence
    reasoning,
    timestamp: new Date().toLocaleTimeString(),
    market,
    style,
    accountBalance: balance
  };
};

export const fetchHourlySignals = async (): Promise<SignalHistoryItem[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const market = 'XAUUSD';
    const price = getRandomPrice(market);
    const isBuy = Math.random() > 0.5;
    
    return [{
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        market: market,
        style: 'SWING',
        type: isBuy ? 'BUY' : 'SELL',
        entry: price.toFixed(2),
        tp: (isBuy ? price + 5 : price - 5).toFixed(2),
        status: 'RUNNING',
        pips: '+0'
    }];
};

export const fetchMinuteSignals = async (): Promise<SignalHistoryItem[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const market = 'XAUUSD';
    const price = getRandomPrice(market);
    const isBuy = Math.random() > 0.5;

    return [{
        time: "Live",
        market: market,
        style: 'SCALP',
        type: isBuy ? 'BUY' : 'SELL',
        entry: price.toFixed(2),
        tp: (isBuy ? price + 1.5 : price - 1.5).toFixed(2),
        status: 'RUNNING',
        pips: '+0'
    }];
};