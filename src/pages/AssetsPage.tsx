import type { TickerData } from "@/services/active.service";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { activeIcons } from "@/lib/activeIcons";
import Layout from "@/Layout";

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
        price: "---",
        volume_24_h: "---",
        low_24_h: "---",
        high_24_h: "---",
        low_52_w: "---",
        high_52_w: "---",
        price_percent_chg_24_h: "---",
        best_bid: "---",
        best_ask: "---",
        best_bid_quantity: "---",
        best_ask_quantity: "---",
    };
    return acc;
}, {} as Record<string, TickerData>);

export default function DetailedActivesTable() {
    const [tickers, setTickers] = useState<Record<string, TickerData>>(initialTickers);

    useEffect(() => {
        const socket = io(api);

        socket.on("connect", () => {
            console.log("✅ Conectado al WebSocket");
        });

        socket.on("new_ticker", (data: TickerData) => {
            setTickers((prev) => ({
                ...prev,
                [data.product_id]: data,
            }));
        });

        socket.on("disconnect", () => {
            console.log("❌ Desconectado del WebSocket");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <Layout>

            <div className="bg-card rounded-md p-4 border shadow-lg overflow-auto mt-6">
                <div className="border-b pb-4 mb-4">
                    <h2 className="text-xl font-semibold">Detalles de Activos</h2>
                    <p className="text-muted-foreground text-sm">
                        Información detallada en tiempo real
                    </p>
                </div>

                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="text-left border-b">
                            <th className="px-2 py-2">Activo</th>
                            <th className="px-2 py-2 text-right">Precio (USD)</th>
                            <th className="px-2 py-2 text-right">Volumen 24h</th>
                            <th className="px-2 py-2 text-right">Máx 24h</th>
                            <th className="px-2 py-2 text-right">Mín 24h</th>
                            <th className="px-2 py-2 text-right">Máx 52w</th>
                            <th className="px-2 py-2 text-right">Mín 52w</th>
                            <th className="px-2 py-2 text-right">% 24h</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(tickers).map((ticker) => (
                            <tr key={ticker.product_id} className="border-b hover:bg-muted/20">
                                <td className="px-2 py-2 flex items-center gap-2">
                                    <img
                                        src={activeIcons[ticker.product_id]}
                                        alt={ticker.product_id}
                                        className="w-5 h-5 rounded-full"
                                    />
                                    {ticker.product_id}
                                </td>
                                <td className="px-2 py-2 text-right">${parseFloat(ticker.price).toFixed(4)}</td>
                                <td className="px-2 py-2 text-right">{parseFloat(ticker.volume_24_h).toLocaleString()}</td>
                                <td className="px-2 py-2 text-right">${parseFloat(ticker.high_24_h).toFixed(4)}</td>
                                <td className="px-2 py-2 text-right">${parseFloat(ticker.low_24_h).toFixed(4)}</td>
                                <td className="px-2 py-2 text-right">${parseFloat(ticker.high_52_w).toFixed(4)}</td>
                                <td className="px-2 py-2 text-right">${parseFloat(ticker.low_52_w).toFixed(4)}</td>
                                <td className={`px-2 py-2 text-right font-semibold ${parseFloat(ticker.price_percent_chg_24_h) >= 0 ? "text-green-500" : "text-red-500"
                                    }`}>
                                    {parseFloat(ticker.price_percent_chg_24_h).toFixed(2)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
