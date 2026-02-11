import React, { useState } from 'react';
import { TradeSignal, SignalType, TradingStyle } from '../types';
import { ArrowUpCircle, ArrowDownCircle, MinusCircle, AlertCircle, TrendingUp, Shield, Target, Crosshair, Settings2, RefreshCw, PlayCircle, DollarSign, AlertTriangle } from 'lucide-react';

interface SignalCardProps {
  signal: TradeSignal | null;
  loading: boolean;
  onGenerate: (balance: number) => void;
  onOpenTrade: (signal: TradeSignal) => void;
  selectedMarket: string;
  selectedStyle: TradingStyle;
  onMarketChange: (market: string) => void;
  onStyleChange: (style: TradingStyle) => void;
}

const MARKETS = ['XAUUSD', 'EURUSD', 'GBPUSD', 'BTCUSD', 'ETHUSD', 'US30', 'NAS100'];

export const SignalCard: React.FC<SignalCardProps> = ({ 
  signal, 
  loading, 
  onGenerate,
  onOpenTrade,
  selectedMarket,
  selectedStyle,
  onMarketChange,
  onStyleChange
}) => {
  const [balance, setBalance] = useState<string>('100');

  const getSignalColor = (type: SignalType) => {
    switch (type) {
      case SignalType.BUY: return 'text-trading-buy border-trading-buy bg-trading-buy/10';
      case SignalType.SELL: return 'text-trading-sell border-trading-sell bg-trading-sell/10';
      default: return 'text-slate-400 border-slate-600 bg-slate-800/50';
    }
  };

  const getSignalIcon = (type: SignalType) => {
    switch (type) {
      case SignalType.BUY: return <ArrowUpCircle className="w-12 h-12 mb-2" />;
      case SignalType.SELL: return <ArrowDownCircle className="w-12 h-12 mb-2" />;
      default: return <MinusCircle className="w-12 h-12 mb-2" />;
    }
  };

  const handleGenerateClick = () => {
    const balanceNum = parseFloat(balance);
    if (!isNaN(balanceNum) && balanceNum > 0) {
        onGenerate(balanceNum);
    } else {
        // Fallback or error handling could go here, for now default to 100
        onGenerate(100);
    }
  };

  // Check if signal contains error message
  const isErrorSignal = signal?.reasoning.includes('RATE LIMIT') || signal?.reasoning.includes('QUOTA');

  // If we have a signal, we show the result. 
  // If not, we show the configuration form.
  const showConfig = !signal && !loading;

  return (
    <div className="glass-panel rounded-2xl p-6 w-full max-w-md mx-auto flex flex-col gap-6 shadow-2xl shadow-black/50 relative overflow-hidden">
      
      {/* Header Area */}
      <div className="flex justify-between items-center border-b border-slate-700/50 pb-4">
        <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Signal Master</h2>
            <p className="text-slate-400 text-xs uppercase tracking-wider">AI Strategy Generator</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center border border-gold-500/50">
            <TrendingUp className="text-gold-500 w-5 h-5" />
        </div>
      </div>

      {/* Loading State Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 rounded-2xl">
            <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="flex flex-col items-center animate-pulse">
                <span className="text-gold-500 font-mono font-bold">ANALYZING {selectedMarket}</span>
                <span className="text-xs text-slate-500 mt-1">Calculating risk for ${balance} account...</span>
            </div>
        </div>
      )}

      {/* Configuration Form (Visible when no signal) */}
      {showConfig && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Market Selection */}
            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Target className="w-3 h-3" /> Select Market (USD)
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {MARKETS.map(m => (
                        <button
                            key={m}
                            onClick={() => onMarketChange(m)}
                            className={`px-2 py-2 rounded-lg text-sm font-bold border transition-all ${selectedMarket === m ? 'bg-gold-500 text-slate-900 border-gold-400 shadow-lg shadow-gold-500/20' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {/* Trading Style */}
            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Settings2 className="w-3 h-3" /> Trading Style
                </label>
                <div className="grid grid-cols-2 gap-3 p-1 bg-slate-800/50 rounded-xl border border-slate-700">
                    <button
                        onClick={() => onStyleChange(TradingStyle.SCALP)}
                        className={`py-3 rounded-lg text-sm font-bold transition-all flex flex-col items-center gap-1 ${selectedStyle === TradingStyle.SCALP ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <span>Short-term</span>
                        <span className="text-[10px] opacity-70 font-normal">Scalping / Aggressive</span>
                    </button>
                    <button
                        onClick={() => onStyleChange(TradingStyle.SWING)}
                        className={`py-3 rounded-lg text-sm font-bold transition-all flex flex-col items-center gap-1 ${selectedStyle === TradingStyle.SWING ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <span>Long-term</span>
                        <span className="text-[10px] opacity-70 font-normal">Swing / Position</span>
                    </button>
                </div>
            </div>

            {/* Account Balance Input */}
            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <DollarSign className="w-3 h-3" /> Current Balance (USD)
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-400 font-bold">$</span>
                    </div>
                    <input 
                        type="number" 
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-8 pr-4 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                        placeholder="Enter your balance..."
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-xs text-slate-500">USD</span>
                    </div>
                </div>
                <p className="text-[10px] text-slate-500">
                    AI will adjust Stop Loss & Risk based on this amount.
                </p>
            </div>

             <div className="text-center text-slate-500 flex flex-col items-center mt-2">
                <p className="text-xs max-w-[200px]">Ready to generate {selectedStyle.toLowerCase()} setup for {selectedMarket}.</p>
            </div>
        </div>
      )}

      {/* Signal Display (Visible when signal exists) */}
      {signal && !loading && (
          <div className="w-full h-full flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
            
            {/* Context Badge */}
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase border-b border-slate-800 pb-2">
                <span>{signal.market}</span>
                <span>{signal.style} • BAL: ${signal.accountBalance}</span>
            </div>

            {/* Main Verdict */}
            <div className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 ${getSignalColor(signal.type)} transition-all`}>
              {getSignalIcon(signal.type)}
              <h3 className="text-3xl font-black tracking-widest">{signal.type}</h3>
              <div className="mt-1 flex items-center gap-2">
                 <span className="text-[10px] uppercase font-bold text-slate-400">Confidence</span>
                 <div className="h-1.5 w-12 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-current" style={{ width: `${signal.confidence}%` }}></div>
                 </div>
                 <span className="text-[10px] font-mono">{signal.confidence}%</span>
              </div>
            </div>

            {/* Entry & Stop Loss */}
            <div className="grid grid-cols-2 gap-3">
                 <div className="col-span-1 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                     <div className="flex items-center gap-2 mb-1 text-slate-400 text-[10px] uppercase font-bold">
                        <Crosshair className="w-3 h-3" /> Entry (USD)
                    </div>
                    <div className="text-base font-mono font-bold text-white flex items-baseline gap-0.5">
                        <span className="text-slate-500 text-xs">$</span>
                        {signal.entryPrice}
                    </div>
                </div>
                <div className="col-span-1 bg-red-900/10 p-3 rounded-lg border border-red-900/30">
                    <div className="flex items-center gap-2 mb-1 text-red-400 text-[10px] uppercase font-bold">
                        <Shield className="w-3 h-3" /> Stop Loss
                    </div>
                    <div className="text-base font-mono font-bold text-red-400 flex items-baseline gap-0.5">
                        <span className="text-red-500/50 text-xs">$</span>
                        {signal.stopLoss}
                    </div>
                </div>
            </div>

            {/* Take Profit Ladder */}
            <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                <div className="bg-slate-800/80 px-3 py-2 border-b border-slate-700/50 flex items-center gap-2">
                     <Target className="w-3 h-3 text-gold-500" />
                     <span className="text-xs font-bold text-gold-500 uppercase">Take Profit Steps (USD)</span>
                </div>
                <div className="divide-y divide-slate-700/30">
                    {signal.takeProfit.map((tp, index) => (
                        <div key={index} className="flex items-center justify-between px-3 py-2 hover:bg-gold-500/5 transition-colors">
                            <span className="text-[10px] text-slate-400 font-bold tracking-wider">TP {index + 1}</span>
                            <span className={`font-mono text-sm font-bold flex items-baseline gap-0.5 ${index === 4 ? 'text-gold-400' : 'text-emerald-400'}`}>
                                <span className="opacity-50 text-xs">$</span>
                                {tp}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reasoning */}
            <div className={`p-3 rounded-lg text-[10px] border leading-relaxed ${
                isErrorSignal 
                ? 'bg-red-500/10 border-red-500/50 text-red-200' 
                : 'bg-slate-900/50 border-slate-800 text-slate-300'
            }`}>
                <p className={`font-semibold mb-1 flex items-center gap-1 ${isErrorSignal ? 'text-red-400' : 'text-slate-500'}`}>
                    {isErrorSignal ? <AlertTriangle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {isErrorSignal ? 'SYSTEM ALERT' : 'AI Analysis'}
                </p>
                {signal.reasoning}
            </div>

            <div className="text-right text-[10px] text-slate-600 font-mono">
                {signal.timestamp}
            </div>
          </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        {signal && !loading && !isErrorSignal && (
             <button
                onClick={() => onOpenTrade(signal)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 animate-in slide-in-from-bottom-2"
             >
                <PlayCircle className="w-5 h-5" /> Execute & Track Trade
             </button>
        )}
        
        <button
            onClick={signal ? () => onGenerate(parseFloat(balance)) : handleGenerateClick}
            disabled={loading}
            className={`w-full py-4 font-black text-lg uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                signal 
                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700' // Secondary style for "New Signal"
                : 'bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-slate-900 shadow-gold-500/20' // Primary style for "Generate"
            }`}
        >
            {loading ? 'Processing...' : signal ? <><RefreshCw className="w-4 h-4" /> New Analysis</> : 'Generate Signal'}
        </button>
      </div>

    </div>
  );
};