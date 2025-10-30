import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import type { TickerData } from "@/services/activeServices";
import { type TransactionType } from "@/services/transactionServices";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface TransactionFormProps {
    symbol: string;
    currentPrice: number;
    active: TickerData;
    availableCash: number;
    availableAssetQuantity: number;
    transactionType: TransactionType;
    setTransactionType: (type: TransactionType) => void;
    amountUSD: number;
    setAmountUSD: (val: number) => void;
    calculatedQuantity: number;
    isInvalid: boolean;
    error: string | null;
    success: string | null;
    isLoading: boolean;
    onConfirm: () => void;
}

export const TransactionForm = ({
    symbol,
    currentPrice,
    availableCash,
    availableAssetQuantity,
    transactionType,
    setTransactionType,
    amountUSD,
    setAmountUSD,
    calculatedQuantity,
    isInvalid,
    error,
    success,
    isLoading,
    onConfirm,
}: TransactionFormProps) => {
    const maxSliderValue = transactionType === "BUY" ? availableCash : availableAssetQuantity * currentPrice;

    return (
        <div className="space-y-6">
            <div className="flex justify-center gap-4">
                <Button
                    onClick={() => setTransactionType("BUY")}
                    variant={transactionType === "BUY" ? "default" : "outline"}
                    className="flex-1 max-w-xs"
                >
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Comprar
                </Button>
                <Button
                    onClick={() => setTransactionType("SELL")}
                    variant={transactionType === "SELL" ? "destructive" : "outline"}
                    className="flex-1 max-w-xs"
                >
                    <ArrowDownRight className="w-4 h-4 mr-2" />
                    Vender
                </Button>
            </div>

            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Monto en USD ({transactionType === "BUY" ? "Máx: $" + availableCash.toFixed(2) : "Máx: $" + (availableAssetQuantity * currentPrice).toFixed(2)})</label>
                        <Slider
                            value={[amountUSD]}
                            max={maxSliderValue}
                            step={0.01}
                            onValueChange={(val) => setAmountUSD(val[0])}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>$0</span>
                            <span>${amountUSD.toFixed(2)}</span>
                            <span>${maxSliderValue.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="text-center space-y-1">
                        <p className="text-sm text-muted-foreground">Cantidad aproximada de {symbol}: {calculatedQuantity.toFixed(6)}</p>
                        {transactionType === "SELL" && calculatedQuantity > availableAssetQuantity && (
                            <Badge className="text-xs">No posees suficientes {symbol} para vender.</Badge>
                        )}
                    </div>

                    {error && <Badge className="w-full justify-center">{error}</Badge>}
                    {success && <Badge className="w-full justify-center bg-green-500">{success}</Badge>}

                    <Button
                        onClick={onConfirm}
                        disabled={isInvalid || isLoading}
                        className="w-full"
                        size="lg"
                    >
                        {isLoading ? "Procesando..." : `Confirmar ${transactionType === "BUY" ? "Compra" : "Venta"}`}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};