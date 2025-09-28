import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const NESTJS_WS_URL = "http://localhost:3000"; 
const PRODUCT_IDS = [
  "BTC-USD", "ETH-USD", "SOL-USD", "ADA-USD", "DOGE-USD",
  "AVAX-USD", "MATIC-USD","XRP-USD", "DOT-USD",
];

type TickerData = {
  product_id: string;
  price: string;
  volume_24_h: string;
};

const initialTickers: Record<string, TickerData> = PRODUCT_IDS.reduce((acc, id) => {
  acc[id] = { product_id: id, price: '---', volume_24_h: '---' };
  return acc;
}, {} as Record<string, TickerData>);


export default function TickerTable() {
  const [tickers, setTickers] = useState<Record<string, TickerData>>(initialTickers);

  useEffect(() => {
    const socket = io(NESTJS_WS_URL);

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
          </tr>
        </thead>
        <tbody>
          {Object.values(tickers).map((ticker) => (
            <tr key={ticker.product_id}>
              <td className="px-2 py-1">{ticker.product_id}</td>
              <td className="px-2 py-1 text-right">{parseFloat(ticker.price).toFixed(2)}</td>
              <td className="px-2 py-1 text-right">{parseFloat(ticker.volume_24_h).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-gray-400">Los datos se actualizan en tiempo real desde el servidor.</p>
    </div>
  );
}