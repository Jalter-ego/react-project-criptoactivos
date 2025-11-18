// src/pages/Portafolio/components/RiskMetricsCard.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Brain, 
    TrendingUp, 
    TrendingDown,
    AlertTriangle, 
    Target, 
    CheckCircle,
    XCircle,
    BarChart3,
    Info,
    BookOpen,
    Award,
    Shield,
} from "lucide-react";
import { portafolioServices, type RiskMetrics } from "@/services/portafolioServices";
import SpinnerComponent from "@/components/Shared/Spinner";

interface RiskMetricsCardProps {
    portafolioId: string;
}

const formatPercentage = (value: number) => `${(value * 100).toFixed(2)}%`;

export default function RiskMetricsCard({ portafolioId }: RiskMetricsCardProps) {
    const [metrics, setMetrics] = useState<RiskMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!portafolioId) return;

        const fetchMetrics = async () => {
            try {
                setLoading(true);
                const data = await portafolioServices.getRiskMetrics(portafolioId);
                setMetrics(data);
            } catch (err) {
                console.error("Error fetching risk metrics:", err);
                setError("No se pudieron cargar las métricas de riesgo");
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, [portafolioId]);

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <SpinnerComponent />
                </CardContent>
            </Card>
        );
    }

    if (error || !metrics) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Análisis de Riesgo</CardTitle>
                    <CardDescription>Análisis de rendimiento y volatilidad</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                        <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>{error || "No hay suficientes datos para calcular métricas"}</p>
                        <p className="text-sm">Necesitas más transacciones históricas</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const getSharpeColor = (ratio: number) => {
        if (ratio > 1) return "text-green-600";
        if (ratio > 0.5) return "text-yellow-600";
        return "text-red-600";
    };

    const getSharpeBadge = (ratio: number) => {
        if (ratio > 1) return { variant: "default" as const, text: "Excelente", color: "bg-green-600" };
        if (ratio > 0.5) return { variant: "secondary" as const, text: "Bueno", color: "bg-yellow-600" };
        return { variant: "destructive" as const, text: "Requiere Atención", color: "bg-red-600" };
    };

    const sharpeBadge = getSharpeBadge(metrics.sharpeRatio);

    // Consejos basados en las métricas
    const getInvestmentTips = () => {
        const tips = [];
        
        if (metrics.sharpeRatio < 0.5) {
            tips.push({
                icon: TrendingDown,
                title: "Diversificación",
                description: "Considera diversificar tu portafolio. Un Sharpe Ratio bajo indica que el riesgo asumido no está siendo compensado adecuadamente.",
                type: "warning"
            });
        }
        
        if (metrics.maxDrawdown > -0.2) {
            tips.push({
                icon: Shield,
                title: "Gestión de Pérdidas",
                description: "Tu máximo drawdown es significativo. Implementa stop-loss y toma de ganancias para proteger tu capital.",
                type: "danger"
            });
        }
        
        if (metrics.volatility > 0.3) {
            tips.push({
                icon: BarChart3,
                title: "Volatilidad Alta",
                description: "Tu portafolio es muy volátil. Considera activos más estables o estrategias de cobertura.",
                type: "warning"
            });
        }
        
        if (metrics.sortinoRatio > metrics.sharpeRatio) {
            tips.push({
                icon: Award,
                title: "Buen Ratio Sortino",
                description: "¡Excelente! Tu Sortino Ratio es mejor que el Sharpe, indicando buena gestión de riesgos bajistas.",
                type: "success"
            });
        }

        return tips;
    };

    const investmentTips = getInvestmentTips();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    Análisis Completo de Riesgo y Rendimiento
                </CardTitle>
                <CardDescription className="text-base">
                    Métricas avanzadas basadas en {metrics.dataPoints} puntos de datos ({metrics.periodDays} días)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="metrics" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="metrics">Métricas</TabsTrigger>
                        <TabsTrigger value="analysis">Análisis</TabsTrigger>
                        <TabsTrigger value="tips">Consejos</TabsTrigger>
                    </TabsList>

                    <TabsContent value="metrics" className="space-y-6 mt-6">
                        <div className="text-center p-6 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Target className="w-6 h-6 text-blue-600" />
                                <span className="text-sm font-medium text-muted-foreground">Ratio de Sharpe</span>
                            </div>
                            <div className={`text-4xl font-bold mb-2 ${getSharpeColor(metrics.sharpeRatio)}`}>
                                {metrics.sharpeRatio.toFixed(2)}
                            </div>
                            <Badge variant={sharpeBadge.variant} className="mb-4">
                                {sharpeBadge.text}
                            </Badge>
                            <Progress 
                                value={Math.min(metrics.sharpeRatio * 50, 100)} 
                                className={`h-3 [&>div]:${sharpeBadge.color.replace('bg-', 'bg-')}`}
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                {`Rendimiento ajustado por riesgo • Valores > 1 son excelentes`}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center p-4 border rounded-lg">
                                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
                                <div className="text-lg font-bold text-green-600">{formatPercentage(metrics.totalReturn)}</div>
                                <div className="text-sm text-muted-foreground">Retorno Total</div>
                            </div>

                            <div className="text-center p-4 border rounded-lg">
                                <TrendingDown className="w-6 h-6 mx-auto mb-2 text-red-600" />
                                <div className="text-lg font-bold text-red-600">{formatPercentage(metrics.maxDrawdown)}</div>
                                <div className="text-sm text-muted-foreground">Max Drawdown</div>
                            </div>

                            <div className="text-center p-4 border rounded-lg">
                                <BarChart3 className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                <div className="text-lg font-bold text-blue-600">{formatPercentage(metrics.volatility)}</div>
                                <div className="text-sm text-muted-foreground">Volatilidad</div>
                            </div>

                            <div className="text-center p-4 border rounded-lg">
                                <Brain className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                                <div className="text-lg font-bold text-purple-600">{metrics.sortinoRatio.toFixed(2)}</div>
                                <div className="text-sm text-muted-foreground">Sortino Ratio</div>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Métricas Detalladas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Retorno Promedio:</span>
                                            <span className="font-medium">{formatPercentage(metrics.averageReturn)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Volatilidad Bajista:</span>
                                            <span className="font-medium">{formatPercentage(metrics.downsideVolatility)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Tasa Libre de Riesgo:</span>
                                            <span className="font-medium">{formatPercentage(metrics.riskFreeRate)}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Puntos de Datos:</span>
                                            <span className="font-medium">{metrics.dataPoints}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Período (días):</span>
                                            <span className="font-medium">{metrics.periodDays}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Ratio Sharpe/Sortino:</span>
                                            <span className="font-medium">{(metrics.sharpeRatio / Math.max(metrics.sortinoRatio, 0.01)).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analysis" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="w-5 h-5" />
                                        Ratio de Sharpe
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>
                                            Mide el rendimiento ajustado por riesgo. Compara el retorno excedente 
                                            (sobre la tasa libre de riesgo) con la volatilidad total.
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <span><strong>&gt; 1:</strong> Excelente relación riesgo-retorno</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                                <span><strong>0.5 - 1:</strong> Buena relación, pero mejorable</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <XCircle className="w-4 h-4 text-red-600" />
                                                <span><strong>&lt; 0.5:</strong> Riesgo no compensado adecuadamente</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Brain className="w-5 h-5" />
                                        Ratio de Sortino
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>
                                            Similar al Sharpe, pero solo considera la volatilidad bajista 
                                            (pérdidas). Es más relevante para inversores risk-averse.
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Award className="w-4 h-4 text-green-600" />
                                                <span><strong>Valores más altos:</strong> Mejor gestión de downside risk</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Info className="w-4 h-4 text-blue-600" />
                                                <span><strong>Sortino &gt; Sharpe:</strong> Bueno para riesgo bajista</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Análisis Comparativo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 border rounded">
                                        <span className="font-medium">Ratio Sharpe vs Sortino</span>
                                        <Badge variant={metrics.sharpeRatio > metrics.sortinoRatio ? "default" : "secondary"}>
                                            {metrics.sharpeRatio > metrics.sortinoRatio ? "Sharpe Mejor" : "Sortino Mejor"}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {metrics.sharpeRatio > metrics.sortinoRatio 
                                            ? "Tu portafolio maneja bien la volatilidad general, pero podría mejorar en el manejo de pérdidas."
                                            : "¡Excelente! Tu portafolio es particularmente bueno manejando riesgos bajistas."
                                        }
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="tips" className="space-y-6 mt-6">
                        {investmentTips.length > 0 ? (
                            <div className="space-y-4">
                                {investmentTips.map((tip, index) => (
                                    <Alert key={index} className={
                                        tip.type === 'danger' ? 'border-red-200 bg-red-50' :
                                        tip.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                                        'border-green-200 bg-green-50'
                                    }>
                                        <tip.icon className="h-4 w-4" />
                                        <AlertDescription>
                                            <div className="font-medium mb-1">{tip.title}</div>
                                            <div className="text-sm">{tip.description}</div>
                                        </AlertDescription>
                                    </Alert>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Award className="w-12 h-12 mx-auto mb-4 text-green-600" />
                                <h3 className="text-lg font-semibold mb-2">¡Excelente Gestión!</h3>
                                <p className="text-muted-foreground">
                                    Tu portafolio muestra buenas métricas de riesgo. Sigue con estas prácticas.
                                </p>
                            </div>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Consejos Generales de Inversión
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Diversificación</h4>
                                        <p className="text-muted-foreground">
                                            No concentres más del 20% de tu portafolio en un solo activo.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Horizonte Temporal</h4>
                                        <p className="text-muted-foreground">
                                            A mayor horizonte, mayor tolerancia al riesgo.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Stop Loss</h4>
                                        <p className="text-muted-foreground">
                                            Define límites de pérdida del 5-10% por posición.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Rebalanceo</h4>
                                        <p className="text-muted-foreground">
                                            Revisa y ajusta tu portafolio trimestralmente.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}