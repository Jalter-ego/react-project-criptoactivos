// src/pages/Dashboard/components/PortfolioDistributionChart.tsx
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { aiServices, type ConcentrationData } from "@/services/aiServices";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

interface PortfolioDistributionChartProps {
    portafolioId: string;
}

export default function PortfolioDistributionChart({ portafolioId }: PortfolioDistributionChartProps) {
    const [data, setData] = useState<ConcentrationData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!portafolioId) return;

        const fetchData = async () => {
            try {
                const insights = await aiServices.getInsights(portafolioId);
                setData(insights.concentrationData || []);
            } catch (error) {
                console.error("Error fetching portfolio distribution:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [portafolioId]);

    if (loading) {
        return <div className="text-center p-8">Cargando distribución...</div>;
    }

    if (data.length === 0) {
        return (
            <div className="text-center text-muted-foreground p-8">
                No hay datos de distribución disponibles
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data as any}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${(value as number).toFixed(1)}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Porcentaje']} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}