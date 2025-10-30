import { useParams } from "react-router-dom";
import { useActive } from "@/hooks/useActive";
import { usePortafolio } from "@/hooks/PortafolioContext";
import { useState, useEffect } from "react";
import { activeIcons } from "@/lib/activeIcons";
import { transactionServices, type CreateTransaction, type TransactionType } from "@/services/transactionServices";
import TransactionsHistory from "@/components/Shared/TransactionsHistory";
import { feedbackServices, type Feedback } from "@/services/feedbackServices";
import { useTradeSocket } from "./hooks/useTradeSocket";
import { useTradeData } from "./hooks/useTradeData";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { TransactionForm } from "./components/TransactionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Hash, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AICoachDrawer } from "./components/AICoachDrawer";

export default function TradePage() {
    const { currentPortafolio, setCurrentPortafolio } = usePortafolio();
    const { id } = useParams<{ id: string }>();
    const { active } = useActive();

    const [amountUSD, setAmountUSD] = useState<number>(0);
    const [transactionType, setTransactionType] = useState<TransactionType>("BUY");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [recentTransaction, setRecentTransaction] = useState<Partial<CreateTransaction> | null>(null);

    const { currentPrice } = useTradeSocket({ id: id! });
    const { currentHolding, transactions, setTransactions } = useTradeData({ id: id! });

    useEffect(() => {
        if (!showFeedbackModal || !currentPortafolio?.id) return;
        const interval = setInterval(() => {
            fetchRecentFeedbacks();
        }, 2000);
        fetchRecentFeedbacks();
        return () => clearInterval(interval);
    }, [showFeedbackModal, currentPortafolio?.id]);

    const fetchRecentFeedbacks = async () => {
        try {
            const recent = await feedbackServices.findRecentByPortafolio(currentPortafolio?.id || '');
            setFeedbacks(recent.filter(f => new Date(f.createdAt) > new Date(Date.now() - 30000))); // Solo últimos 30s, post-tx
        } catch (err) {
            console.error("Error fetching feedbacks:", err);
        }
    };

    if (!id || !active || !currentPortafolio) {
        return (
            <p className="text-center text-red-500">Cargando datos o datos insuficientes...</p>
        );
    }

    const symbol = id;
    const imageUrl = activeIcons[symbol] || "https://via.placeholder.com/64";

    // Datos del portafolio actualizados
    const availableCash = currentPortafolio.cash;
    const availableAssetQuantity = currentHolding?.quantity || 0;

    const calculatedQuantity = amountUSD > 0 && currentPrice > 0 ? amountUSD / currentPrice : 0;

    // --> 6. Lógica de validación MEJORADA
    const isInvalid = amountUSD <= 0 ||
        (transactionType === "BUY" && amountUSD > availableCash) ||
        (transactionType === "SELL" && calculatedQuantity > availableAssetQuantity) ||
        isNaN(calculatedQuantity);


    const handleOpenConfirmationModal = () => {
        setError(null);
        setSuccess(null);
        setShowModal(true);
    };

    const handleTransaction = async () => {
        if (isInvalid) {
            setError(transactionType === "BUY" ? "Monto inválido o fondos insuficientes." : "Monto inválido o no posees suficientes activos.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const data: CreateTransaction = {
                type: transactionType,
                amount: calculatedQuantity,
                price: currentPrice,
                activeSymbol: symbol,
                portafolioId: currentPortafolio.id,
            };

            const updatedPortafolio = await transactionServices.create(data);
            setCurrentPortafolio(updatedPortafolio);
            setRecentTransaction(data);

            setShowFeedbackModal(true);
            setAmountUSD(0);
            setShowModal(false);

            transactionServices.findAllByPortafolioAndActive(currentPortafolio.id, id).then(setTransactions);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al procesar la transacción. Intenta nuevamente.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 py-8 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <img src={imageUrl} alt={symbol} className="w-16 h-16 rounded-full border-2 border-primary" />
                        <div>
                            <CardTitle className="text-2xl">{symbol}</CardTitle>
                            <div className="flex items-center space-x-2">
                                <p className="text-3xl font-bold">${currentPrice.toFixed(2)}</p>
                                {Number(active.price_percent_chg_24_h) && Number(active.price_percent_chg_24_h) > 0 ? (
                                    <Badge className="bg-green-500">
                                        <TrendingUp className="w-3 h-3 mr-1" /> +{active.price_percent_chg_24_h}%
                                    </Badge>
                                ) : (
                                    <Badge className="bg-red-500">
                                        <TrendingDown className="w-3 h-3 mr-1" /> {active.price_percent_chg_24_h}%
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2" />
                            Información del Activo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-lg font-semibold">Precio actual: ${currentPrice.toFixed(2)}</p>
                        <p>Volumen 24h: {active.volume_24_h}</p>
                        <p className="text-sm text-muted-foreground">Precio actualizado en tiempo real</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Hash className="w-4 h-4 mr-2" />
                            Tu Portafolio
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p>Dinero disponible: ${availableCash.toFixed(2)}</p>
                        <p>Posees: {availableAssetQuantity.toFixed(6)} {symbol}</p>
                        <Badge className="mt-2">Saldo total: ${(availableCash + (availableAssetQuantity * currentPrice)).toFixed(2)}</Badge>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Realizar Transacción</CardTitle>
                </CardHeader>
                <CardContent>
                    <TransactionForm
                        symbol={symbol}
                        currentPrice={currentPrice}
                        availableCash={availableCash}
                        availableAssetQuantity={availableAssetQuantity}
                        transactionType={transactionType}
                        setTransactionType={setTransactionType}
                        amountUSD={amountUSD}
                        setAmountUSD={setAmountUSD}
                        calculatedQuantity={calculatedQuantity}
                        isInvalid={isInvalid}
                        error={error}
                        success={success}
                        isLoading={isLoading}
                        onConfirm={handleOpenConfirmationModal}
                        active={active}
                    />
                </CardContent>
            </Card>

            <ConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleTransaction}
                isLoading={isLoading}
                transactionType={transactionType}
                symbol={symbol}
                amountUSD={amountUSD}
                calculatedQuantity={calculatedQuantity}
                currentPrice={currentPrice}
            />
            <AICoachDrawer
                isOpen={showFeedbackModal}
                onClose={() => setShowFeedbackModal(false)}
                transactionType={transactionType}
                symbol={symbol}
                recentTransaction={recentTransaction}
                feedbacks={feedbacks}
            />
            <Card>
                <CardHeader>
                    <CardTitle>Historial de Transacciones</CardTitle>
                </CardHeader>
                <CardContent>
                    <TransactionsHistory
                        transactions={transactions}
                    />
                </CardContent>
            </Card>

        </div>
    );
}