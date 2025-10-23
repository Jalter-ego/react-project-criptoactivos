import type { TickerData } from "@/services/activeServices";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { activeIcons } from "@/lib/activeIcons";
import { useNavigate } from "react-router-dom";
import { useActive } from "@/hooks/useActive";
import { Input } from "@/components/ui/input";

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

export default function CardListActives() {
    const [tickers, setTickers] = useState<Record<string, TickerData>>(initialTickers);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { setActive } = useActive();

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

    const filteredTickers = Object.values(tickers).filter((ticker) =>
        ticker.product_id.toLowerCase().includes(search.toLowerCase())
    );

    const handleClick = (ticker: TickerData) => {
        setActive(ticker);          
        navigate(`/trade/${ticker.product_id}`); 
    };
    return (
        < div className="lg:col-span-1 bg-card rounded-md p-4 border shadow-lg overflow-auto" >
            <div className="border-b pb-4 mb-4">
                <h2 className="text-xl font-semibold">Activos</h2>
                <p className="text-muted-foreground text-sm">Precios en tiempo real</p>
            </div>

            <Input
                type="text"
                placeholder="Buscar activo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table className="min-w-full text-sm mt-3">
                <thead>
                    <tr className="text-left border-b">
                        <th className="px-2 py-2">Moneda</th>
                        <th className="px-2 py-2 text-right">Precio (USD)</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTickers.map((ticker) => (
                        <tr key={ticker.product_id}
                            className="border-b"
                            onClick={() => handleClick(ticker)}>
                            <td className="px-2 py-2 flex items-center gap-2">
                                <img
                                    src={activeIcons[ticker.product_id]}
                                    alt={ticker.product_id}
                                    className="w-5 h-5 rounded-full"
                                />
                                {ticker.product_id}
                            </td>
                            <td className="px-2 py-2 text-right">
                                {ticker.price !== "---"
                                    ? `$${parseFloat(ticker.price).toFixed(2)}`
                                    : "---"}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div >
    )
}