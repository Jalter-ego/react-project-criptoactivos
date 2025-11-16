import CardHeaders from "@/pages/Dashboard/components/CardHeaders";
import TransactionsHistory from "@/components/Shared/TransactionsHistory";
import { Input } from "@/components/ui/input";
import { usePortafolio } from "@/hooks/PortafolioContext";
import { transactionServices, type Transaction } from "@/services/transactionServices";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CardListActives from "./components/CardListActives";
import SpinnerComponent from "@/components/Shared/Spinner";
import PortfolioDistributionChart from "./components/PortfolioDistributionChart";
import TradingStatsChart from "./components/TradingStatsChart";
import MarketOverview from "./components/MarketOverview";



export default function DashboardPage() {
    const { currentPortafolio } = usePortafolio();
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (currentPortafolio) {
            transactionServices.findAllByPortafolio(currentPortafolio.id)
                .then(setTransactions)
                .catch(() => toast("No se pudo obtener las transacciones"))
                .finally(() => {
                    setTimeout(() => {
                        setLoading(false)
                    }, 1000)
                })
        }
    }, [])

    if (loading) {
        return (
            <SpinnerComponent />
        )
    }

    return (
        <div className="w-full flex flex-col">
            <CardHeaders />
            <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 py-2">
                <div className="lg:col-span-2 space-y-6">

                    <div className="bg-card rounded-md p-4 border shadow-lg">
                        <div className="border-b pb-4 mb-4">
                            <h2 className="text-xl font-semibold">Actividad Reciente</h2>
                            <p className="text-muted-foreground text-sm">Últimas operaciones realizadas</p>
                        </div>
                        <Input type="text" placeholder="buscar..." className="mb-4" />
                        <TransactionsHistory transactions={transactions} />
                    </div>
                    <div className="bg-card rounded-md p-4 border shadow-lg">
                        <div className="border-b pb-4 mb-4">
                            <h2 className="text-xl font-semibold">Distribución de Activos</h2>
                            <p className="text-muted-foreground text-sm">Composición actual del portafolio</p>
                        </div>
                        <PortfolioDistributionChart portafolioId={currentPortafolio?.id || ''} />
                    </div>

                    <div className="bg-card rounded-md p-4 border shadow-lg">
                        <div className="border-b pb-4 mb-4">
                            <h2 className="text-xl font-semibold">Estadísticas de Trading</h2>
                            <p className="text-muted-foreground text-sm">Métricas de rendimiento</p>
                        </div>
                        <TradingStatsChart portafolioId={currentPortafolio?.id || ''} />
                    </div>
                </div>
                <div className="space-y-6">
                    <CardListActives />
                    <MarketOverview />
                </div>
            </section>
        </div>
    );
}
