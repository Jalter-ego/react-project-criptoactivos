import { Button } from "@/components/ui/button";
import { getFeedbackColor } from "../utils/tradeUtils";
import { type Feedback } from "@/services/feedbackServices";
import type { CreateTransaction } from "@/services/transactionServices";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactionType: string;
    symbol: string;
    recentTransaction: Partial<CreateTransaction> | null;
    feedbacks: Feedback[];
}

export const FeedbackModal = ({
    isOpen,
    onClose,
    transactionType,
    symbol,
    recentTransaction,
    feedbacks,
}: FeedbackModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center p-4">
            <div className="bg-card p-6 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-center">Resumen de Transacción</h2>

                <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
                    <p className="text-green-700 font-medium">
                        ¡{transactionType === "BUY" ? "Compra" : "Venta"} confirmada!
                    </p>
                    <p className="text-sm">
                        Activo: {symbol} | Cantidad: {recentTransaction?.amount?.toFixed(6)} | Precio: ${recentTransaction?.price?.toFixed(2)}
                    </p>
                </div>

                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Retroalimentación de IA:</h3>
                    {feedbacks.length > 0 ? (
                        feedbacks.map((fb, i) => (
                            <div key={i} className={`p-3 border rounded-lg mb-2 ${getFeedbackColor(fb.type)}`}>
                                <p className="text-sm">{fb.message}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm italic">
                            ¡Buena decisión! No se detectaron alertas. Sigue gestionando tu riesgo.
                        </p>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button onClick={onClose} className="flex-1">
                        Cerrar
                    </Button>
                    <Button onClick={()=> {}} variant="outline" className="flex-1">
                        Ver Historial
                    </Button>
                </div>
            </div>
        </div>
    );
};