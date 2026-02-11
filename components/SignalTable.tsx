import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, Activity, Check, X, RefreshCcw, Zap, Timer } from 'lucide-react';
import { fetchHourlySignals, fetchMinuteSignals } from '../services/geminiService';
import { SignalHistoryItem } from '../types';

export const SignalTable: React.FC = () => {
    const [data, setData] = useState<SignalHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState<'H1' | 'M1'>('H1');

    const loadData = async (tf: 'H1' | 'M1') => {
        setLoading(true);
        // Removed setData([]) to prevent table flashing/disappearing while scanning
        
        try {
            let signals: SignalHistoryItem[] = [];
            
            if (tf === 'H1') {
                signals = await fetchHourlySignals();
            } else {
                signals = await fetchMinuteSignals();
            }

            if (signals && signals.length > 0) {
                // Ensure time is formatted nicely
                const processed = signals.map(s => ({
                    ...s,
                    // Force a new timestamp for realtime effect if the service returns generic "Live"
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                }));
                setData(processed);
            } else {
                // Fallback 
                setData([
                    { 
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
                        market: 'XAUUSD', 
                        style: tf === 'H1' ? 'SWING' : 'SCALP', 
                        type: 'WAIT', 
                        entry: '---', 
                        tp: '---', 
                        status: 'WAITING', 
                        pips: '0' 
                    }
                ]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Initial load and Interval setup
    useEffect(() => {
        loadData(timeframe);

        // Set up auto-refresh every 60 seconds (1 minute)
        const intervalId = setInterval(() => {
            loadData(timeframe);
        }, 60000);

        // Cleanup interval on unmount or when timeframe changes
        return () => clearInterval(intervalId);
    }, [timeframe]);

    return (
        <div className="glass-panel rounded-xl p-6 w-full animate-in slide-in-from-bottom-4 duration-700 min-h-[250px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border transition-colors ${timeframe === 'M1' ? 'bg-purple-500/10 border-purple-500/20' : 'bg-gold-500/10 border-gold-500/20'}`}>
                        {timeframe === 'M1' ? <Zap className="w-5 h-5 text-purple-500" /> : <Activity className="w-5 h-5 text-gold-500" />}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Realtime Market Scanner</h3>
                        <div className="flex gap-2 mt-1">
                            <button 
                                onClick={() => setTimeframe('H1')}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all border ${
                                    timeframe === 'H1' ? 'bg-gold-500 text-slate-900 border-gold-400' : 'text-slate-500 border-transparent hover:text-slate-300'
                                }`}
                            >
                                HOURLY (H1)
                            </button>
                            <button 
                                onClick={() => setTimeframe('M1')}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all border ${
                                    timeframe === 'M1' ? 'bg-purple-500 text-white border-purple-400' : 'text-slate-500 border-transparent hover:text-slate-300'
                                }`}
                            >
                                1 MINUTE (M1)
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => loadData(timeframe)} 
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors disabled:opacity-50 text-xs font-bold border border-slate-700"
                    >
                        <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'SCANNING...' : 'SCAN NOW'}
                    </button>
                    <span className="text-xs text-slate-400 bg-slate-800 px-3 py-2 rounded-lg flex items-center gap-2 border border-slate-700">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Live
                    </span>
                </div>
            </div>
            
            {loading && data.length === 0 ? (
                // Only show full loader if we have NO data. Otherwise show existing data while loading.
                <div className="flex flex-col items-center justify-center h-40 space-y-3">
                    <div className="w-8 h-8 border-2 border-slate-600 border-t-gold-500 rounded-full animate-spin"></div>
                    <p className="text-xs text-slate-500 font-mono animate-pulse">Analyzing {timeframe} Candle Structure...</p>
                </div>
            ) : (
                <div className="overflow-x-auto relative">
                     {/* Overlay loader for background refresh */}
                    {loading && (
                        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                             <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="text-[10px] text-slate-500 border-b border-slate-700/50 uppercase tracking-wider">
                                <th className="py-3 pl-4 font-bold">Time Scanned</th>
                                <th className="py-3 font-bold">Market</th>
                                <th className="py-3 font-bold">TF / Style</th>
                                <th className="py-3 font-bold">Latest Signal</th>
                                <th className="py-3 font-bold">Entry</th>
                                <th className="py-3 font-bold">Target</th>
                                <th className="py-3 font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {data.map((row, i) => (
                                <tr key={i} className="border-b border-slate-700/30 bg-slate-800/20 hover:bg-slate-800/30 transition-colors group">
                                    <td className="py-6 pl-4 text-slate-400 font-mono text-xs flex items-center gap-2">
                                        <Timer className="w-3 h-3" />
                                        {row.time}
                                    </td>
                                    <td className="py-6 font-bold text-white group-hover:text-gold-400 transition-colors">{row.market}</td>
                                    <td className="py-6">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${
                                            row.style === 'SCALP' 
                                            ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' 
                                            : 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                                        }`}>
                                            {timeframe === 'M1' ? 'M1 SCALP' : row.style}
                                        </span>
                                    </td>
                                    <td className="py-6">
                                        <div className={`flex items-center gap-1 font-bold ${
                                            row.type === 'BUY' ? 'text-trading-buy' : 
                                            row.type === 'SELL' ? 'text-trading-sell' : 'text-slate-400'
                                        }`}>
                                            {row.type === 'BUY' && <ArrowUpRight className="w-5 h-5" />}
                                            {row.type === 'SELL' && <ArrowDownRight className="w-5 h-5" />}
                                            {row.type === 'WAIT' && <Clock className="w-5 h-5" />}
                                            <span className="text-lg">{row.type}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 font-mono text-slate-300 font-bold">
                                        {row.entry !== '---' ? `$${row.entry}` : row.entry}
                                    </td>
                                    <td className="py-6 font-mono text-slate-300 font-bold">
                                         {row.tp !== '---' ? `$${row.tp}` : row.tp}
                                    </td>
                                    <td className="py-6">
                                        <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide px-3 py-1.5 rounded-lg border ${
                                            row.status === 'RUNNING' ? 'text-gold-500 border-gold-500/20 bg-gold-500/10' : 
                                            row.status === 'WAITING' ? 'text-slate-400 border-slate-500/20 bg-slate-500/10' :
                                            'text-emerald-400'
                                        }`}>
                                            {row.status === 'RUNNING' && <Activity className="w-3 h-3 animate-pulse" />}
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};