// src/components/Dashboard/PerformanceChart.tsx
import { useState, useEffect } from "react";
import {
    AreaChart,
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { portafolioServices, type PortafolioSnapshot } from "@/services/portafolioServices";

interface PerformanceChartProps {
    portafolioId: string;
}

const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString("es-BO", {
        day: "numeric",
        month: "short",
    });
};

const formatCurrency = (value: number) => {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
};

export default function PerformanceChart({ portafolioId }: PerformanceChartProps) {
    const [data, setData] = useState<PortafolioSnapshot[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!portafolioId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const snapshotData = await portafolioServices.findSnapshots(portafolioId);

                // Ordenar por timestamp (por si no viene ordenado)
                const sortedData = snapshotData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

                // Calcular porcentaje de rendimiento basado en el primer valor
                if (sortedData.length > 0) {
                    const initialValue = sortedData[0].value;
                    const processedData = sortedData.map(snapshot => ({
                        ...snapshot,
                        percentage: ((snapshot.value - initialValue) / initialValue) * 100,
                    }));
                    setData(processedData);
                } else {
                    setData([]);
                }
            } catch (err) {
                setError("No se pudieron cargar los datos de rendimiento.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [portafolioId]);

    if (loading) {
        return <div className="text-center p-8">Cargando gráfico...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">{error}</div>;
    }

    if (data.length < 2) {
        return (
            <div className="text-center text-muted-foreground p-8">
                Necesitas al menos dos transacciones para ver tu historial de rendimiento.
            </div>
        );
    }

    const gradientId = "portfolioGradient";

    return (
        <div className="bg-card p-6 rounded-xl shadow-md border border-border h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-foreground">Rendimiento del Portafolio</h3>
                    <p className="text-sm text-muted-foreground">Evolución del valor a lo largo del tiempo</p>
                </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} vertical={false} />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={formatDate}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        tickFormatter={formatCurrency}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={['auto', 'auto']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                        labelFormatter={formatDate}
                        formatter={(value: number, name: string) => {
                            if (name === "percentage") {
                                return [formatPercentage(value), "Rendimiento %"];
                            }
                            return [formatCurrency(value), "Valor del Portafolio"];
                        }}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: "10px" }}
                        formatter={(value: string) =>
                            value === "percentage" ? "Rendimiento (%)" : "Valor ($)"
                        }
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="none"
                        fill={`url(#${gradientId})`}
                        isAnimationActive={true}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        name="Valor del Portafolio"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="percentage"
                        name="percentage"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={2}
                        dot={false}
                        yAxisId="right" 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}