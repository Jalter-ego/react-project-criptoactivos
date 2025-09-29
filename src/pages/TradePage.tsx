import { useParams } from "react-router-dom";
import { useActive } from "@/hooks/useActive";
import { usePortafolio } from "@/hooks/PortafolioContext";
import { useState, useEffect } from "react";
import { activeIcons } from "@/lib/activeIcons";
import { transactionServices, type CreateTransaction, type TransactionType, type Transaction } from "@/services/transactionServices";
import Layout from "@/Layout";
import { Slider } from "@/components/ui/slider"

export default function TradePage() {
    const { currentPortafolio } = usePortafolio();
    const { id } = useParams<{ id: string }>();
    const { active } = useActive();
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
                setCurrentPrice(prev => prev + fluctuation);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [active]);

    useEffect(() => {
        if (currentPortafolio) {
            transactionServices.findAllByUser(currentPortafolio.id).then(setTransactions).catch(() => setError("Error al cargar historial"));
        }
    }, [currentPortafolio]);

    console.log(id);
    console.log(active);
    console.log(currentPortafolio);

    if (!id || !active || !currentPortafolio) {
        return (
            <Layout>
                <p className="text-center text-red-500">No hay datos suficientes para mostrar la página de trading.</p>
            </Layout>
        );
    }

    const symbol = id;
    const imageUrl = activeIcons[symbol] || "https://via.placeholder.com/64";
    const availableCash = currentPortafolio.cash;
    const calculatedQuantity = amountUSD > 0 && currentPrice > 0 ? amountUSD / currentPrice : 0;
    const isInvalid = amountUSD <= 0 || (transactionType === "BUY" && amountUSD > availableCash) || isNaN(calculatedQuantity);

    const handleTransaction = async () => {
        if (isInvalid) {
            setError(transactionType === "BUY" ? "Monto inválido o fondos insuficientes." : "Monto inválido.");
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
            await transactionServices.create(data);
            setSuccess(`Transacción de ${transactionType === "BUY" ? "compra" : "venta"} realizada con éxito.`);
            setAmountUSD(0);
            setShowModal(false);
            transactionServices.findAllByUser(currentPortafolio.id).then(setTransactions);
        } catch (err) {
            setError("Error al procesar la transacción. Intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Trading: {symbol}</h1>
                    <img src={imageUrl} alt={symbol} className="w-20 h-20 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">Información del Activo</h2>
                        <p className="text-lg">Precio actual: ${currentPrice.toFixed(2)}</p>
                        <p>Volumen 24h: {active.volume_24_h}</p>
                        <p className="mt-2 text-sm text-gray-500">Precio actualizado en tiempo real</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">Tu Portafolio</h2>
                        <p>Dinero disponible: ${availableCash.toFixed(2)}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Realizar Transacción</h2>
                    <div className="flex gap-4 mb-4">
                        <button
                            onClick={() => setTransactionType("BUY")}
                            className={`py-2 px-4 rounded-md ${transactionType === "BUY" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        >
                            Comprar
                        </button>
                        <button
                            onClick={() => setTransactionType("SELL")}
                            className={`py-2 px-4 rounded-md ${transactionType === "SELL" ? "bg-red-500 text-white" : "bg-gray-200"}`}
                        >
                            Vender
                        </button>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="amountUSD" className="block text-sm font-medium text-gray-700">
                            Monto en USD:
                        </label>
                        <Slider
                            value={[amountUSD]} 
                            max={availableCash} 
                            step={0.01}
                            onValueChange={(val) => setAmountUSD(val[0])}
                            className="py-2"
                        />
                        <p className="mt-2 text-sm text-gray-600">${amountUSD.toFixed(2)}</p>
                    </div>

                    <div className="text-center">
                        <p>Cantidad aproximada de {symbol}: {calculatedQuantity.toFixed(6)}</p>
                        {transactionType === "BUY" && amountUSD > availableCash && (
                            <p className="text-red-500">Fondos insuficientes.</p>
                        )}
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {success && <p className="text-green-500 mt-2">{success}</p>}
                    <button
                        onClick={() => setShowModal(true)}
                        disabled={isInvalid}
                        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {isLoading ? "Procesando..." : `Confirmar ${transactionType === "BUY" ? "Compra" : "Venta"}`}
                    </button>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                            <h2 className="text-xl font-bold mb-4">Confirmar Transacción</h2>
                            <p>Tipo: {transactionType}</p>
                            <p>Activo: {symbol}</p>
                            <p>Monto: ${amountUSD.toFixed(2)}</p>
                            <p>Cantidad: {calculatedQuantity.toFixed(6)} {symbol}</p>
                            <p>Precio por unidad: ${currentPrice.toFixed(2)}</p>
                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-300 py-2 rounded-md"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleTransaction}
                                    disabled={isLoading}
                                    className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                                >
                                    {isLoading ? "Procesando..." : "Confirmar"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Transaction History */}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-4">Historial de Transacciones</h2>
                    {transactions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">Tipo</th>
                                        <th className="py-2 px-4 border-b">Cantidad</th>
                                        <th className="py-2 px-4 border-b">Precio</th>
                                        <th className="py-2 px-4 border-b">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => (
                                        <tr key={tx.id}>
                                            <td className="py-2 px-4 border-b">{tx.type}</td>
                                            <td className="py-2 px-4 border-b">{tx.amount.toFixed(6)} {symbol}</td>
                                            <td className="py-2 px-4 border-b">${tx.price.toFixed(2)}</td>
                                            <td className="py-2 px-4 border-b">{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No hay transacciones recientes.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
}