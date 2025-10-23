import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    transactionType: string;
    symbol: string;
    amountUSD: number;
    calculatedQuantity: number;
    currentPrice: number;
}

export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    transactionType,
    symbol,
    amountUSD,
    calculatedQuantity,
    currentPrice,
}: ConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 bg-black/20 bg-opacity-50 flex items-center justify-center">
            <div className="bg-card p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4">Confirmar Transacción</h2>
                <p>Tipo: {transactionType}</p>
                <p>Activo: {symbol}</p>
                <p>Monto: ${amountUSD.toFixed(2)}</p>
                <p>Cantidad: {calculatedQuantity.toFixed(6)} {symbol}</p>
                <p>Precio por unidad: ${currentPrice.toFixed(2)}</p>
                <div className="flex gap-4 mt-6">
                    <Button onClick={onClose} className="flex-1 bg-gray-600 text-white py-2 rounded-md">
                        Cancelar
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {isLoading ? "Procesando..." : "Confirmar"}
                    </Button>
                </div>
            </div>
        </div>
    );
};