import React, { useEffect, useRef } from 'react';

interface ChartWidgetProps {
    symbol: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ symbol }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = "tradingview_widget_container";

  // Map simplified symbols to TradingView symbols
  const getTVSymbol = (s: string) => {
    switch (s) {
        case 'XAUUSD': return 'OANDA:XAUUSD';
        case 'BTCUSD': return 'COINBASE:BTCUSD';
        case 'EURUSD': return 'FX:EURUSD';
        case 'GBPUSD': return 'FX:GBPUSD';
        case 'US30': return 'OANDA:US30USD';
        case 'NAS100': return 'OANDA:NAS100USD';
        case 'ETHUSD': return 'COINBASE:ETHUSD';
        default: return `FX:${s}`;
    }
  };

  useEffect(() => {
    const scriptId = 'tradingview-widget-script';
    const tvSymbol = getTVSymbol(symbol);

    const initWidget = () => {
      if (window.TradingView && containerRef.current) {
        // Clear previous contents if needed
        containerRef.current.innerHTML = ""; 
        
        new window.TradingView.widget({
          "autosize": true,
          "symbol": tvSymbol,
          "interval": "60", // Default to 1H
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1", // 1 = Candles
          "locale": "en",
          "enable_publishing": false,
          "backgroundColor": "rgba(15, 23, 42, 1)", // Match app background
          "gridColor": "rgba(51, 65, 85, 0.3)",
          "hide_top_toolbar": false,
          "hide_legend": false,
          "save_image": false,
          "container_id": containerRef.current.id,
          "toolbar_bg": "#1e293b"
        });
      }
    };

    // Check if script is already present
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      // If script is already loaded, just init widget
      initWidget();
    }

  }, [symbol]);

  return (
    <div className="w-full h-[500px] glass-panel rounded-xl overflow-hidden border border-slate-700/50 relative shadow-inner shadow-black/50">
        {/* Placeholder/Loading State */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 -z-10">
            <span className="text-slate-500 text-xs animate-pulse">Loading Chart...</span>
        </div>
        <div id={widgetId} ref={containerRef} className="w-full h-full" />
    </div>
  );
};