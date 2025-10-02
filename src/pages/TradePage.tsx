import { useParams } from "react-router-dom";
import { useActive } from "@/hooks/useActive";
import { usePortafolio } from "@/hooks/PortafolioContext";
import { useState, useEffect } from "react";
import { activeIcons } from "@/lib/activeIcons";
import { transactionServices, type CreateTransaction, type TransactionType, type Transaction } from "@/services/transactionServices";
import Layout from "@/Layout";
import { Slider } from "@/components/ui/slider"
import { portafolioServices, type Holding } from "@/services/portafolioServices";
import TransactionsHistory from "@/components/TradePage/TransactionsHistory";
import { Button } from "@/components/ui/button";

export default function TradePage() {
    const { currentPortafolio, setCurrentPortafolio } = usePortafolio();
    const { id } = useParams<{ id: string }>();
    const { active } = useActive();
    const [currentHolding, setCurrentHolding] = useState<Holding | null>(null);

    const [amountUSD, setAmountUSD] = useState<number>(0);
    const [transactionType, setTransactionType] = useState<TransactionType>("BUY");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentPrice, setCurrentPrice] = useState(active ? parseFloat(active.price) : 0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (active) {
                const fluctuation = (Math.random() - 0.5) * 0.02 * parseFloat(active.price);
                setCurrentPrice(prev => Math.max(0, prev + fluctuation));
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [active]);

    // --> 4. Efecto MEJORADO para cargar TODOS los datos necesarios
    useEffect(() => {
        if (currentPortafolio && id) {
            // Cargar historial de transacciones
            transactionServices.findAllByPortafolioAndActive(currentPortafolio.id, id)
                .then(setTransactions)
                .catch(() => setError("Error al cargar historial"));

            // Cargar el estado actual del portafolio, incluyendo los holdings
            portafolioServices.findOne(currentPortafolio.id)
                .then(fullPortafolio => {
                    // Actualizamos el contexto por si acaso tiene datos desactualizados
                    setCurrentPortafolio(fullPortafolio);
                    // Buscamos si tenemos este activo en particular
                    const holdingForAsset = fullPortafolio.holdings.find(h => h.activeSymbol === id);
                    setCurrentHolding(holdingForAsset || null);
                })
                .catch(() => setError("Error al cargar datos del portafolio."));
        }
    }, [currentPortafolio?.id, id]); // Depende del ID del portafolio y del activo

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

    // --> 5. Lógica dinámica para el valor máximo del slider
    const maxSliderValue = transactionType === 'BUY'
        ? availableCash
        : availableAssetQuantity * currentPrice;

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

            // --> 7. El servicio ahora devuelve el portafolio actualizado
            const updatedPortafolio = await transactionServices.create(data);

            // --> 8. Actualizamos el estado global (Context)
            setCurrentPortafolio(updatedPortafolio);

            setSuccess(`Transacción de ${transactionType === "BUY" ? "compra" : "venta"} realizada con éxito.`);
            setAmountUSD(0);
            setShowModal(false);

            // Refrescamos el historial
            transactionServices.findAllByPortafolio(currentPortafolio.userId).then(setTransactions);
        } catch (err: any) {
            // Mostrar error del backend si está disponible
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
                        onClick={() => setShowModal(true)}
                        disabled={isInvalid}
                        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {isLoading ? "Procesando..." : `Confirmar ${transactionType === "BUY" ? "Compra" : "Venta"}`}
                    </Button>
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-40 bg-black/20 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-card p-6 rounded-lg shadow-lg max-w-sm w-full">
                            <h2 className="text-xl font-bold mb-4">Confirmar Transacción</h2>
                            <p>Tipo: {transactionType}</p>
                            <p>Activo: {symbol}</p>
                            <p>Monto: ${amountUSD.toFixed(2)}</p>
                            <p>Cantidad: {calculatedQuantity.toFixed(6)} {symbol}</p>
                            <p>Precio por unidad: ${currentPrice.toFixed(2)}</p>
                            <div className="flex gap-4 mt-6">
                                <Button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-600 text-white py-2 rounded-md"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleTransaction}
                                    disabled={isLoading}
                                    className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                                >
                                    {isLoading ? "Procesando..." : "Confirmar"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                <h2 className="text-lg font-semibold">Historial de Transacciones</h2>
                <TransactionsHistory
                    transactions={transactions}
                />

            </div>
        </Layout>
    );
}