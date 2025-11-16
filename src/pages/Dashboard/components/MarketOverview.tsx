// src/pages/Dashboard/components/MarketOverview.tsx
import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MarketOverview() {
    const [marketData] = useState({
        btcChange: 2.5,
        ethChange: -1.2,
        totalVolume: "2.4B",
        marketCap: "1.2T"
    });

    return (
        <div className="bg-card rounded-md p-4 border shadow-lg">
            <div className="border-b pb-4 mb-4">
                <h2 className="text-xl font-semibold">Mercado Global</h2>
                <p className="text-muted-foreground text-sm">Resumen cripto</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            ₿
                        </div>
                        <span className="font-medium">BTC</span>
                    </div>
                    <div className={`flex items-center gap-1 ${marketData.btcChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {marketData.btcChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span className="font-medium">{marketData.btcChange >= 0 ? '+' : ''}{marketData.btcChange}%</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            Ξ
                        </div>
                        <span className="font-medium">ETH</span>
                    </div>
                    <div className={`flex items-center gap-1 ${marketData.ethChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {marketData.ethChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span className="font-medium">{marketData.ethChange >= 0 ? '+' : ''}{marketData.ethChange}%</span>
                    </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Volumen 24h:</span>
                        <span className="font-medium">${marketData.totalVolume}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Market Cap:</span>
                        <span className="font-medium">${marketData.marketCap}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}