import { useParams } from "react-router-dom";
import { useActive } from "@/hooks/useActive";
import { usePortafolio } from "@/hooks/PortafolioContext";
import { useState, useEffect } from "react";
import { activeIcons } from "@/lib/activeIcons";
import { transactionServices, type CreateTransaction, type TransactionType } from "@/services/transactionServices";
import Layout from "@/Layout";
import TransactionsHistory from "@/components/Shared/TransactionsHistory";
import { feedbackServices, type Feedback } from "@/services/feedbackServices";
import { useTradeSocket } from "./hooks/useTradeSocket";
import { useTradeData } from "./hooks/useTradeData";
import { FeedbackModal } from "./components/FeedbackModal";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { TransactionForm } from "./components/TransactionForm";

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
    const { currentHolding, transactions, setTransactions} = useTradeData({ id: id! });


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
            <Layout>
                <p className="text-center text-red-500">Cargando datos o datos insuficientes...</p>
            </Layout>
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
        <Layout>
            <div className="max-w-4xl mx-auto bg-card p-8 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Trading: {symbol}</h1>
                    <img src={imageUrl} alt={symbol} className="w-20 h-20 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-card2 p-4 rounded-lg text-foreground">
                        <h2 className="text-lg font-semibold mb-2">Información del Activo</h2>
                        <p className="text-lg">Precio actual: ${currentPrice.toFixed(2)}</p>
                        <p>Volumen 24h: {active.volume_24_h}</p>
                        <p className="mt-2 text-sm text-gray-500">Precio actualizado en tiempo real</p>
                    </div>
                    <div className="bg-card2 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">Tu Portafolio</h2>
                        <p>Dinero disponible: ${availableCash.toFixed(2)}</p>
                        <p>Posees: {availableAssetQuantity.toFixed(6)} {symbol}</p>
                    </div>
                </div>

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
                    onConfirm={handleTransaction}
                    active={active}
                />

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
                <FeedbackModal
                    isOpen={showFeedbackModal}
                    onClose={() => setShowFeedbackModal(false)}
                    transactionType={transactionType}
                    symbol={symbol}
                    recentTransaction={recentTransaction}
                    feedbacks={feedbacks}
                />
                <h2 className="text-lg font-semibold">Historial de Transacciones</h2>
                <TransactionsHistory
                    transactions={transactions}
                />

            </div>
        </Layout>
    );
}