import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-center">
                        <Badge variant={transactionType === "BUY" ? "default" : "destructive"} className="mr-2">
                            {transactionType}
                        </Badge>
                        Confirmar Transacción
                    </DialogTitle>
                    <DialogDescription>
                        Revisa los detalles antes de confirmar.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span>Activo:</span>
                        <span className="font-medium">{symbol}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Monto (USD):</span>
                        <span className="font-medium">${amountUSD.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Cantidad:</span>
                        <span className="font-medium">{calculatedQuantity.toFixed(6)} {symbol}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Precio por unidad:</span>
                        <span className="font-medium">${currentPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold text-primary">${(amountUSD).toFixed(2)}</span>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? "Procesando..." : "Confirmar Transacción"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};