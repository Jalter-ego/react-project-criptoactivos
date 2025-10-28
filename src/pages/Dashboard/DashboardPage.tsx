import CardHeaders from "@/pages/Dashboard/components/CardHeaders";
import PerformanceChart from "@/pages/Dashboard/components/PerformanceChart";
import TransactionsHistory from "@/components/Shared/TransactionsHistory";
import { Input } from "@/components/ui/input";
import { usePortafolio } from "@/hooks/PortafolioContext";
import { transactionServices, type Transaction } from "@/services/transactionServices";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CardListActives from "./components/CardListActives";
import SpinnerComponent from "@/components/Shared/Spinner";



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
                <div className="lg:col-span-2 h-fit bg-card rounded-md p-4 border shadow-lg">
                    <div className="border-b pb-4">
                        <h2 className="text-xl">Actividad</h2>
                        <p className="text-muted-foreground text-sm">Ultimas operaciones</p>
                    </div>
                    <Input type="text" placeholder="buscar..." />
                    <TransactionsHistory
                        transactions={transactions}
                    />
                    <div className="mt-6">
                        <PerformanceChart portafolioId={currentPortafolio?.id || ''} />
                    </div>
                </div>
                <CardListActives />
            </section>
        </div>
    );
}
