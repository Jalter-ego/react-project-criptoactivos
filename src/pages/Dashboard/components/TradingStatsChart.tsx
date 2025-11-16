// src/pages/Dashboard/components/TradingStatsChart.tsx
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { transactionServices } from "@/services/transactionServices";

interface TradingStatsChartProps {
    portafolioId: string;
}

export default function TradingStatsChart({ portafolioId }: TradingStatsChartProps) {
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!portafolioId) return;

        const fetchData = async () => {
            try {
                const transactions = await transactionServices.findAllByPortafolio(portafolioId);
                
                // Calcular estadísticas de los últimos 7 días
                const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    return date.toISOString().split('T')[0];
                }).reverse();

                const dailyStats = last7Days.map(date => {
                    const dayTransactions = transactions.filter(t => 
                        new Date(t.createdAt).toISOString().split('T')[0] === date
                    );
                    
                    const pnl = dayTransactions.reduce((sum) => {
                        return sum + (Math.random() - 0.5) * 100; // Simulado
                    }, 0);

                    return {
                        date: new Date(date).toLocaleDateString('es-ES', { weekday: 'short' }),
                        pnl: parseFloat(pnl.toFixed(2)),
                        trades: dayTransactions.length
                    };
                });

                setStats(dailyStats);
            } catch (error) {
                console.error("Error fetching trading stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [portafolioId]);

    if (loading) {
        return <div className="text-center p-8">Cargando estadísticas...</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                    formatter={(value: number, name: string) => [
                        name === 'pnl' ? `$${value.toFixed(2)}` : value,
                        name === 'pnl' ? 'P&L' : 'Trades'
                    ]}
                />
                <Bar dataKey="pnl" fill="#8884d8" name="pnl" />
                <Bar dataKey="trades" fill="#82ca9d" name="trades" />
            </BarChart>
        </ResponsiveContainer>
    );
}