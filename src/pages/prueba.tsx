import type { TickerData } from "@/services/active.service";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const PRODUCT_IDS = [
  "BTC-USD", "ETH-USD", "USDT-USD", "XRP-USD", "SOL-USD",
  "DOGE-USD", "ADA-USD", "LINK-USD", "AVAX-USD",
  "XLM-USD", "SUI-USD", "BCH-USD", "HBAR-USD",
  "LTC-USD", "SHIB-USD", "CRO-USD", "DOT-USD",
  "ENA-USD", "TAO-USD", "ETC-USD",
];

const initialTickers: Record<string, TickerData> = PRODUCT_IDS.reduce((acc, id) => {
  acc[id] = {
    product_id: id,
    price: '---',
    volume_24_h: '---',
    low_24_h: '---',
    high_24_h: '---',
    low_52_w: '---',
    high_52_w: '---',
    price_percent_chg_24_h: '---',
    best_bid: '---',
    best_ask: '---',
    best_bid_quantity: '---',
    best_ask_quantity: '---'
  };
  return acc;
}, {} as Record<string, TickerData>);


export default function TickerTable() {
  const [tickers, setTickers] = useState<Record<string, TickerData>>(initialTickers);

  useEffect(() => {
    const socket = io(api);

    socket.on("connect", () => {
      console.log("Connected to NestJS WebSocket Gateway!");
    });

    socket.on("new_ticker", (data: TickerData) => {
      console.log(data);

      setTickers(prevTickers => ({
        ...prevTickers,
        [data.product_id]: data,
      }));
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from NestJS Gateway");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Simulador de Inversiones (Datos en Tiempo Real)</h2>
      <table className="min-w-full bg-black text-green-400 rounded">
        <thead>
          <tr>
            <th className="px-2 py-1 text-left">Moneda</th>
            <th className="px-2 py-1 text-right">Precio (USD)</th>
            <th className="px-2 py-1 text-right">Volumen 24h</th>
            <th className="px-2 py-1 text-right">Mín 24h</th>
            <th className="px-2 py-1 text-right">% Chg 24h</th> 
          </tr>
        </thead>
        <tbody>
          {Object.values(tickers).map((ticker) => (
            <tr key={ticker.product_id}>
              <td className="px-2 py-1">{ticker.product_id}</td>
              <td className="px-2 py-1 text-right">{parseFloat(ticker.price).toFixed(2)}</td>
              <td className="px-2 py-1 text-right">{parseFloat(ticker.volume_24_h).toFixed(2)}</td>
              <td className="px-2 py-1 text-right">{ticker.low_24_h}</td> 
              <td className="px-2 py-1 text-right">{ticker.price_percent_chg_24_h}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-gray-400">Los datos se actualizan en tiempo real desde el servidor.</p>
    </div>
  );
}