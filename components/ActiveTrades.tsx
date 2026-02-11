import React from 'react';
import { ActiveTrade, SignalType } from '../types';
import { Play, CheckCircle, XCircle, Wallet, Trash2 } from 'lucide-react';

interface ActiveTradesProps {
  trades: ActiveTrade[];
  onCloseTrade: (id: string, type: 'TP' | 'SL' | 'MANUAL') => void;
  onClearHistory: () => void;
}

export const ActiveTrades: React.FC<ActiveTradesProps> = ({ trades, onCloseTrade, onClearHistory }) => {
  if (trades.length === 0) return null;

  const activeCount = trades.filter(t => t.status === 'OPEN').length;

  return (
    <div className="glass-panel rounded-xl p-6 w-full animate-in fade-in duration-500 border-t-4 border-t-gold-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <Wallet className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">My Active Session</h3>
            <p className="text-xs text-slate-400">
                {activeCount > 0 
                    ? `${activeCount} Positions Running - Manage Risk Carefully` 
                    : 'No open positions'}
            </p>
          </div>
        </div>
        
        {trades.length > 0 && (
            <button 
                onClick={onClearHistory}
                className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
                <Trash2 className="w-3 h-3" /> Clear History
            </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="text-[10px] text-slate-500 border-b border-slate-700/50 uppercase tracking-wider">
              <th className="py-3 pl-4 font-bold">Market / Time</th>
              <th className="py-3 font-bold">Type</th>
              <th className="py-3 font-bold">Entry</th>
              <th className="py-3 font-bold">Status</th>
              <th className="py-3 pr-4 font-bold text-right">Manual Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {trades.map((trade) => (
              <tr key={trade.id} className={`border-b border-slate-700/30 transition-colors ${trade.status === 'OPEN' ? 'bg-slate-800/20' : 'opacity-60'}`}>
                <td className="py-4 pl-4">
                    <div className="flex flex-col">
                        <span className="font-bold text-white">{trade.market}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{trade.timestamp}</span>
                    </div>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                    trade.type === SignalType.BUY ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {trade.type}
                  </span>
                </td>
                <td className="py-4 font-mono text-slate-300">{trade.entryPrice}</td>
                <td className="py-4">
                    {trade.status === 'OPEN' ? (
                        <div className="flex items-center gap-2 text-gold-500 font-bold text-xs">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
                            </span>
                            RUNNING
                        </div>
                    ) : (
                        <span className={`text-xs font-bold px-2 py-1 rounded border ${
                            trade.status === 'CLOSED_TP' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                            trade.status === 'CLOSED_SL' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                            'border-slate-500/30 text-slate-400 bg-slate-500/10'
                        }`}>
                            {trade.status.replace('CLOSED_', '')}
                        </span>
                    )}
                </td>
                <td className="py-4 pr-4 text-right align-middle">
                    {trade.status === 'OPEN' ? (
                        <div className="flex items-center justify-end gap-2">
                             <button
                                onClick={() => onCloseTrade(trade.id, 'TP')}
                                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-900/20"
                                title="Close in Profit"
                            >
                                <CheckCircle className="w-3 h-3" /> TP
                            </button>
                            <button
                                onClick={() => onCloseTrade(trade.id, 'SL')}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-red-900/20"
                                title="Cut Loss / Close"
                            >
                                <XCircle className="w-3 h-3" /> CUT
                            </button>
                        </div>
                    ) : (
                        <span className="text-xs text-slate-600 font-mono">Closed</span>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};