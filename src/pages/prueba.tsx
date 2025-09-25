import { useEffect, useRef, useState } from "react";

const WS_API_URL = "wss://advanced-trade-ws.coinbase.com";

const CHANNEL_NAMES = {
  ticker: "ticker",
};

const PRODUCT_IDS = [
  "BTC-USD",
  "ETH-USD",
  "SOL-USD",
  "ADA-USD",
  "DOGE-USD",
  "AVAX-USD",
  "MATIC-USD",
  "BNB-USD",
  "XRP-USD",
  "DOT-USD",
];

export default function Prueba() {
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket(WS_API_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      // Suscribirse al canal ticker para varios pares
      const subscribeMsg = {
        type: "subscribe",
        channel: CHANNEL_NAMES.ticker,
        product_ids: PRODUCT_IDS,
      };
      ws.send(JSON.stringify(subscribeMsg));
    };

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Coinbase WebSocket (Ticker - Todas las monedas)</h2>
      <div className="h-96 overflow-auto bg-black text-green-400 p-2 rounded">
        {messages.slice(-50).map((msg, idx) => (
          <pre key={idx}>{msg}</pre>
        ))}
      </div>
    </div>
  );
}