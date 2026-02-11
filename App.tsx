import React, { useState } from 'react';
import { ChartWidget } from './components/ChartWidget';
import { SignalCard } from './components/SignalCard';
import { SignalTable } from './components/SignalTable';
import { ActiveTrades } from './components/ActiveTrades';
import { generateTradeSignal } from './services/geminiService';
import { TradeSignal, TradingStyle, ActiveTrade } from './types';
import { Zap } from 'lucide-react';

const App: React.FC = () => {
  const [signal, setSignal] = useState<TradeSignal | null>(null);
  const [activeTrades, setActiveTrades] = useState<ActiveTrade[]>([]);
  const [loading, setLoading] = useState(false);
  const [market, setMarket] = useState('XAUUSD');
  const [tradingStyle, setTradingStyle] = useState<TradingStyle>(TradingStyle.SCALP);

  const handleGenerateSignal = async (balance: number) => {
    if (signal) {
        setSignal(null);
        return;
    }

    setLoading(true);
    setSignal(null); 
    try {
      const newSignal = await generateTradeSignal(market, tradingStyle, balance);
      setSignal(newSignal);
    } catch (error) {
      console.error("Failed to generate signal", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTrade = (tradeSignal: TradeSignal) => {
    const newTrade: ActiveTrade = {
        ...tradeSignal,
        id: crypto.randomUUID(),
        status: 'OPEN',
    };
    // Add to top of list
    setActiveTrades(prev => [newTrade, ...prev]);
    // Clear current signal to allow generating a new one
    setSignal(null);
  };

  const handleCloseTrade = (id: string, type: 'TP' | 'SL' | 'MANUAL') => {
    setActiveTrades(prev => prev.map(trade => {
        if (trade.id === id) {
            return {
                ...trade,
                status: type === 'TP' ? 'CLOSED_TP' : type === 'SL' ? 'CLOSED_SL' : 'CLOSED_MANUAL'
            };
        }
        return trade;
    }));
  };

  const handleClearHistory = () => {
      // Only clear closed trades
      setActiveTrades(prev => prev.filter(t => t.status === 'OPEN'));
  };

  return (
    <div className="min-h-screen bg-trading-bg text-slate-100 font-sans selection:bg-gold-500/30 pb-12">
      
      {/* Navigation / Header */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-gold-500 p-1.5 rounded-lg">
                <Zap className="h-5 w-5 text-slate-900 fill-current" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Signal<span className="text-gold-500">Master</span>
              </span>
            </div>
            <div className="text-xs font-mono text-slate-500 hidden sm:block">
               GEMINI POWERED • {market}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Section: Ticker Tape / Status (Visual Only) */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {['XAUUSD', 'EURUSD', 'GBPUSD', 'BTCUSD', 'ETHUSD', 'US30'].map((pair) => (
                <div key={pair} className={`flex items-center gap-2 px-4 py-2 rounded-full border ${pair === market ? 'bg-gold-500/10 border-gold-500/50' : 'bg-slate-800 border-slate-700'} min-w-max transition-colors`}>
                    <span className={`font-mono font-bold ${pair === market ? 'text-gold-500' : 'text-slate-400'}`}>{pair}</span>
                    <span className="text-xs text-slate-500">{pair === market ? '• SELECTED' : ''}</span>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Chart */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                        Grow Your Small Account <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
                            AI Trading Challenge
                        </span>
                    </h1>
                    <p className="text-slate-400 max-w-xl">
                        AI-powered trading signals using Gemini 3.0. Enter your balance for personalized risk management.
                    </p>
                </div>
                
                <ChartWidget symbol={market} />
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                        <div className="text-slate-500 text-xs uppercase mb-1">Style</div>
                        <div className="text-emerald-400 font-bold">{tradingStyle}</div>
                     </div>
                     <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                        <div className="text-slate-500 text-xs uppercase mb-1">Leverage</div>
                        <div className="text-white font-bold">High (1:500+)</div>
                     </div>
                     <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                        <div className="text-slate-500 text-xs uppercase mb-1">Strategy</div>
                        <div className="text-gold-500 font-bold">AI Adaptive</div>
                     </div>
                     <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                        <div className="text-slate-500 text-xs uppercase mb-1">Status</div>
                        <div className="flex items-center gap-2 text-white font-bold">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Online
                        </div>
                     </div>
                </div>
            </div>

            {/* Right Column: Signal Card */}
            <div className="lg:col-span-5 flex items-start justify-center lg:justify-end">
                <SignalCard 
                    signal={signal} 
                    loading={loading} 
                    onGenerate={handleGenerateSignal}
                    onOpenTrade={handleOpenTrade}
                    selectedMarket={market}
                    selectedStyle={tradingStyle}
                    onMarketChange={setMarket}
                    onStyleChange={setTradingStyle}
                />
            </div>
        </div>

        {/* User Active Trades Table */}
        {activeTrades.length > 0 && (
            <div className="mt-8">
                <ActiveTrades 
                    trades={activeTrades} 
                    onCloseTrade={handleCloseTrade}
                    onClearHistory={handleClearHistory}
                />
            </div>
        )}

        {/* Market History Table */}
        <div className="mt-8">
            <SignalTable />
        </div>

        {/* Disclaimer Footer */}
        <footer className="mt-12 border-t border-slate-800 pt-8 text-center sm:text-left">
             <div className="text-[10px] text-slate-600 leading-relaxed max-w-4xl mx-auto text-center">
                <p className="font-bold mb-1">RISK WARNING</p>
                <p>
                    Trading Forex and Commodities carries a high level of risk and may not be suitable for all investors. 
                    Small accounts often require high leverage which increases risk significantly. 
                    These signals are generated by AI for educational and simulation purposes only.
                    Never trade with money you cannot afford to lose.
                </p>
            </div>
        </footer>

      </main>
    </div>
  );
};

export default App;