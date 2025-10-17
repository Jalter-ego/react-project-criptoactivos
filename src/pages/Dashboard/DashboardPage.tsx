import CardHeaders from "@/components/Dashboard/CardHeaders";
import CardListActives from "@/components/Dashboard/CardListActives";
import PerformanceChart from "@/components/Dashboard/PerformanceChart";
import TransactionsHistory from "@/components/TradePage/TransactionsHistory";
import { Input } from "@/components/ui/input";
import { usePortafolio } from "@/hooks/PortafolioContext";
import Layout from "@/Layout";
import { transactionServices, type Transaction } from "@/services/transactionServices";
import { useEffect, useState } from "react";
import { toast } from "sonner";



export default function DashboardPage() {
    const { currentPortafolio } = usePortafolio();
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {
        if (currentPortafolio) {
            transactionServices.findAllByPortafolio(currentPortafolio.id)
                .then(setTransactions)
                .catch(() => toast("No se pudo obtener las transacciones"))
        }
    }, [])
    return (
        <Layout>
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
        </Layout>
    );
}
