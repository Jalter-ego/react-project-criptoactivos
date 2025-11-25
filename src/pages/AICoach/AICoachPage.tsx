// src/pages/AICoach/AICoachPage.tsx
import { useState, useEffect } from "react";
import { usePortafolio } from "@/hooks/PortafolioContext";
import { feedbackServices, type Feedback } from "@/services/feedbackServices";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Brain, Shield, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { toast } from "sonner";
import SpinnerComponent from "@/components/Shared/Spinner";
import { getFeedbackColor } from "../TradePage/utils/tradeUtils";
import { aiServices, type PortfolioInsights } from "@/services/aiServices";
import SessionAnalysisSummary from "./components/SessionAnalysisSummary";
import LearningCenter from "./components/LearningCenter";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AICoachPage() {
    const { currentPortafolio } = usePortafolio();
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("recientes");
    const [insights, setInsights] = useState<PortfolioInsights | null>(null);

    const fetchAllData = async () => {
        try {
            if (!currentPortafolio) {
                toast.warning("no hay un portafolio activo")
                return;
            }
            setLoading(true);
            const [allFeedbacks, portfolioInsights] = await Promise.all([
                feedbackServices.findAllByPortafolio(currentPortafolio.id),
                aiServices.getInsights(currentPortafolio.id),
            ]);
            setFeedbacks(allFeedbacks);
            setInsights(portfolioInsights);
        } catch (err) {
            console.error("Error fetching data:", err);
            toast.error("Error al cargar insights");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!currentPortafolio?.id) return;
        fetchAllData();
    }, [currentPortafolio?.id]);

    const riskFeedbacks = feedbacks.filter(f => f.type === "RISK_ALERT");
    const behaviorFeedbacks = feedbacks.filter(f => f.type === "BEHAVIORAL_NUDGE");
    const costFeedbacks = feedbacks.filter(f => f.type === "COST_ANALYSIS");

    const concentrationData = insights?.concentrationData || [];
    const costsData = insights?.costsData || [];
    const isWeeklyData = costsData.length > 0 && costsData[0]?.periodType === 'week';
    console.log(concentrationData);
    console.log(costsData);
    console.log(isWeeklyData);
    
    
    

    const formatPeriodLabel = (period: string, isWeekly: boolean) => {
        if (isWeekly) {
            return period.replace('W', 'Sem ');
        }
        return period;
    };



    const behaviorScore = Math.round(100 - (behaviorFeedbacks.length / feedbacks.length) * 100); // Mock score

    if (loading) {
        return (
            <SpinnerComponent />
        );
    }

    const renderCustomLabel = (entry: any) => {
        return `${entry.name}: ${entry.value.toFixed(1)}%`;
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">IA Coach: Tu Asesor Personal</h1>
                <Badge variant="secondary" className="px-4 py-1">Portfolio: {currentPortafolio?.name}</Badge>
            </div>

            <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Bienvenido al Coach IA</AlertTitle>
                <AlertDescription>
                    Analizo tus trades para ayudarte a mejorar. Revisa insights y actúa para optimizar tu rendimiento.
                </AlertDescription>
            </Alert>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    <TabsTrigger value="recientes">Recientes</TabsTrigger>
                    <TabsTrigger value="riesgos">Riesgos ({riskFeedbacks.length})</TabsTrigger>
                    <TabsTrigger value="comportamiento">Comportamiento ({behaviorFeedbacks.length})</TabsTrigger>
                    <TabsTrigger value="costos">Costos ({costFeedbacks.length})</TabsTrigger>
                    <TabsTrigger value="lecciones">Lecciones & Nudges</TabsTrigger>
                    <TabsTrigger value="analisis-final">Análisis Final</TabsTrigger>
                </TabsList>

                <TabsContent value="recientes" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Últimos Insights</CardTitle>
                            <CardDescription>Feedbacks de tus trades recientes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {feedbacks.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">No hay insights aún. ¡Haz un trade!</p>
                            ) : (
                                <div className="space-y-3">
                                    {feedbacks.slice(0, 10).map((fb) => (
                                        <div key={fb.id} className={`p-3 border rounded-lg ${getFeedbackColor(fb.type)}`}>
                                            <div className="flex justify-between items-start">
                                                <Badge variant="secondary" className="text-xs">{fb.type}</Badge>
                                                <span className="text-xs text-muted-foreground">{new Date(fb.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="mt-1 text-sm">{fb.message}</p>
                                        </div>
                                    ))}
                                    {feedbacks.length > 10 && <Button variant="link">Ver más</Button>}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="lecciones" className="space-y-4">
                    <LearningCenter />
                </TabsContent>

                <TabsContent value="riesgos" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Riesgos Activos</CardTitle>
                            <CardDescription>Monitoreo de concentración y apalancamiento. Cada porción muestra el activo y su % del total.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-center">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={concentrationData as any}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            nameKey="name"
                                            label={renderCustomLabel}
                                        >
                                            {concentrationData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${entry.name}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`]} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            {concentrationData.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {concentrationData.map((entry) => (
                                        <Badge key={entry.name} variant="secondary" className="justify-between">
                                            <span className="flex-1">{entry.name}</span>
                                            <span className="font-semibold">{entry.value.toFixed(1)}%</span>
                                            <div className="w-4 h-2 ml-2 rounded-full bg-[hsl(var(--chart-${(index % 5) + 1}))]" />
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            <div className="space-y-2 mt-4">
                                {riskFeedbacks.slice(0, 3).map((fb) => (
                                    <Alert key={fb.id} variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>{fb.type}</AlertTitle>
                                        <AlertDescription>{fb.message}</AlertDescription>
                                    </Alert>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="comportamiento" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Insights Comportamentales</CardTitle>
                            <CardDescription>Tu score de sesgos: {behaviorScore}/100</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <Brain className="w-8 h-8 mx-auto mb-2 text-primary" />
                                        <p className="font-bold">{behaviorScore}</p>
                                        <p className="text-sm text-muted-foreground">Score Sesgos</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                                        <p className="font-bold">{behaviorFeedbacks.length}</p>
                                        <p className="text-sm text-muted-foreground">Nudges Recientes</p>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="space-y-2">
                                {behaviorFeedbacks.map((fb) => (
                                    <div key={fb.id} className={`p-3 border rounded-lg ${getFeedbackColor(fb.type)}`}>
                                        <p className="text-sm">{fb.message}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="costos" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Análisis de Costos</CardTitle>
                            <CardDescription>
                                {isWeeklyData 
                                    ? "Costos semanales de transacciones y slippage." 
                                    : "Costos mensuales de transacciones y slippage."
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={costsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="period" 
                                        tickFormatter={(value) => formatPeriodLabel(value, isWeeklyData)}
                                    />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Costo']}
                                        labelFormatter={(value) => formatPeriodLabel(value, isWeeklyData)}
                                    />
                                    <Line type="monotone" dataKey="costs" stroke="#8884d8" strokeWidth={2}/>
                                </LineChart>
                            </ResponsiveContainer>
                            <div className="space-y-2 mt-4">
                                {costFeedbacks.slice(0, 3).map((fb) => (
                                    <div key={fb.id} className={`p-3 border rounded-lg ${getFeedbackColor(fb.type)}`}>
                                        <p className="text-sm">{fb.message}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="analisis-final" className="space-y-6">
                    <SessionAnalysisSummary 
                        feedbacks={feedbacks} 
                        insights={insights}
                        portafolioName={currentPortafolio?.name || ''}
                    />
                </TabsContent>
            </Tabs>

            <div className="text-center">
                <Button onClick={fetchAllData} variant="outline" className="mr-2">Actualizar</Button>
                <Button>Exportar Insights</Button>
            </div>
        </div>
    );
}