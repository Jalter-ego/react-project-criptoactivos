import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type {  TickerData } from "@/services/activeServices";
import { type TransactionType } from "@/services/transactionServices";

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
        <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Realizar Transacción</h2>
            <div className="flex gap-4 mb-4">
                <Button
                    onClick={() => setTransactionType("BUY")}
                    className={`py-2 px-4 rounded-md ${transactionType === "BUY" ? "bg-blue-500 text-white" : "bg-gray-400"}`}
                >
                    Comprar
                </Button>
                <Button
                    onClick={() => setTransactionType("SELL")}
                    className={`py-2 px-4 rounded-md ${transactionType === "SELL" ? "bg-red-500 text-white" : "bg-gray-400"}`}
                >
                    Vender
                </Button>
            </div>
            <div className="mb-4">
                <label>Monto en USD:</label>
                <Slider
                    value={[amountUSD]}
                    max={maxSliderValue}
                    step={0.01}
                    onValueChange={(val) => setAmountUSD(val[0])}
                    className="py-2"
                />
                <p className="mt-2 text-sm text-foreground">${amountUSD.toFixed(2)}</p>
            </div>
            <div className="text-center">
                <p>Cantidad aproximada de {symbol}: {calculatedQuantity.toFixed(6)}</p>
                {transactionType === "SELL" && calculatedQuantity > availableAssetQuantity && (
                    <p className="text-red-500">No posees suficientes {symbol} para vender.</p>
                )}
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}
            <Button
                onClick={onConfirm}
                disabled={isInvalid}
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
                {isLoading ? "Procesando..." : `Confirmar ${transactionType === "BUY" ? "Compra" : "Venta"}`}
            </Button>
        </div>
    );
};