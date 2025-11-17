import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
    Brain, 
    TrendingUp, 
    AlertTriangle, 
    Target, 
    Lightbulb,
    CheckCircle,
    Clock
} from "lucide-react";
import type { Feedback } from "@/services/feedbackServices";
import type { PortfolioInsights } from "@/services/aiServices";
import { Progress } from "@/components/ui/progress";

interface SessionAnalysisSummaryProps {
    feedbacks: Feedback[];
    insights: PortfolioInsights | null;
    portafolioName: string;
}

export default function SessionAnalysisSummary({ 
    feedbacks, 
    portafolioName 
}: SessionAnalysisSummaryProps) {
    
    // Análisis de feedbacks por tipo
    const riskAlerts = feedbacks.filter(f => f.type === "RISK_ALERT");
    const behavioralNudges = feedbacks.filter(f => f.type === "BEHAVIORAL_NUDGE");
    const costAnalysis = feedbacks.filter(f => f.type === "COST_ANALYSIS");
    
    // Estadísticas generales
    const totalFeedbacks = feedbacks.length;
    const recentFeedbacks = feedbacks.filter(f => {
        const feedbackDate = new Date(f.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return feedbackDate >= weekAgo;
    }).length;

    // Calcular score de comportamiento (basado en nudges comportamentales)
    const behaviorScore = totalFeedbacks > 0 ? 
        Math.max(0, 100 - (behavioralNudges.length / totalFeedbacks) * 100) : 100;

    // Análisis de patrones de tiempo
    const getFeedbacksByHour = () => {
        const hourlyStats = Array.from({ length: 24 }, () => 0);
        feedbacks.forEach(feedback => {
            const hour = new Date(feedback.createdAt).getHours();
            hourlyStats[hour]++;
        });
        return hourlyStats;
    };

    const hourlyStats = getFeedbacksByHour();
    const peakHour = hourlyStats.indexOf(Math.max(...hourlyStats));

    // Recomendaciones basadas en el análisis
    const getRecommendations = () => {
        const recommendations = [];
        
        if (behaviorScore < 70) {
            recommendations.push({
                type: "warning",
                title: "Sesgos Comportamentales Detectados",
                description: "Has recibido varios nudges sobre decisiones emocionales. Considera pausas más largas entre trades.",
                icon: Brain
            });
        }
        
        if (riskAlerts.length > behavioralNudges.length) {
            recommendations.push({
                type: "danger",
                title: "Enfoque en Gestión de Riesgos",
                description: "Los riesgos superan las preocupaciones comportamentales. Revisa tu estrategia de stop-loss.",
                icon: AlertTriangle
            });
        }
        
        if (costAnalysis.length > 5) {
            recommendations.push({
                type: "info",
                title: "Optimización de Costos",
                description: "Has acumulado varios análisis de costos. Considera spreads más amplios o menor frecuencia de trading.",
                icon: Target
            });
        }

        if (peakHour >= 22 || peakHour <= 6) {
            recommendations.push({
                type: "info",
                title: "Patrón de Trading Nocturno",
                description: "Detectamos actividad intensa fuera del horario normal. El trading nocturno puede aumentar la fatiga y errores.",
                icon: Clock
            });
        }
        
        return recommendations;
    };

    const recommendations = getRecommendations();

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="w-6 h-6 text-purple-600" />
                        Análisis Final de Sesión - {portafolioName}
                    </CardTitle>
                    <CardDescription>
                        Reflexión sobre tus patrones de trading y oportunidades de mejora
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{totalFeedbacks}</div>
                            <div className="text-sm text-muted-foreground">Total Feedbacks</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{recentFeedbacks}</div>
                            <div className="text-sm text-muted-foreground">Última Semana</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{behaviorScore.toFixed(0)}%</div>
                            <div className="text-sm text-muted-foreground">Score Comportamental</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Score de Comportamiento
                    </CardTitle>
                    <CardDescription>
                        Evaluación de tus decisiones de trading (100 = Excelente, 0 = Necesita mejora)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Rendimiento Comportamental</span>
                            <Badge variant={behaviorScore >= 80 ? "default" : behaviorScore >= 60 ? "secondary" : "destructive"}>
                                {behaviorScore >= 80 ? "Excelente" : behaviorScore >= 60 ? "Bueno" : "Requiere Atención"}
                            </Badge>
                        </div>
                        <Progress 
                            value={behaviorScore} 
                            className={`h-3 ${
                                behaviorScore >= 80 
                                    ? "[&>div]:bg-green-500" 
                                    : behaviorScore >= 60 
                                        ? "[&>div]:bg-yellow-500" 
                                        : "[&>div]:bg-red-500"
                            }`}
                        />
                        <p className="text-sm text-muted-foreground">
                            Basado en {behavioralNudges.length} nudges comportamentales de {totalFeedbacks} feedbacks totales
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Distribución de Feedbacks</CardTitle>
                    <CardDescription>Análisis de los tipos de insights recibidos</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-500" />
                            <div className="text-2xl font-bold text-red-600">{riskAlerts.length}</div>
                            <div className="text-sm text-muted-foreground">Alertas de Riesgo</div>
                            <div className="text-xs mt-1">
                                {totalFeedbacks > 0 ? ((riskAlerts.length / totalFeedbacks) * 100).toFixed(1) : 0}%
                            </div>
                        </div>

                        <div className="text-center p-4 border rounded-lg">
                            <Brain className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                            <div className="text-2xl font-bold text-purple-600">{behavioralNudges.length}</div>
                            <div className="text-sm text-muted-foreground">Nudges Comportamentales</div>
                            <div className="text-xs mt-1">
                                {totalFeedbacks > 0 ? ((behavioralNudges.length / totalFeedbacks) * 100).toFixed(1) : 0}%
                            </div>
                        </div>

                        <div className="text-center p-4 border rounded-lg">
                            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                            <div className="text-2xl font-bold text-blue-600">{costAnalysis.length}</div>
                            <div className="text-sm text-muted-foreground">Análisis de Costos</div>
                            <div className="text-xs mt-1">
                                {totalFeedbacks > 0 ? ((costAnalysis.length / totalFeedbacks) * 100).toFixed(1) : 0}%
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Patrones Detectados
                    </CardTitle>
                    <CardDescription>
                        Insights sobre tus hábitos de trading
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-blue-500" />
                            <div>
                                <div className="font-medium">Horario Peak de Actividad</div>
                                <div className="text-sm text-muted-foreground">
                                    Mayor actividad detectada a las {peakHour.toString().padStart(2, '0')}:00 horas
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div>
                                <div className="font-medium">Frecuencia de Feedback</div>
                                <div className="text-sm text-muted-foreground">
                                    {recentFeedbacks} insights en los últimos 7 días
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {recommendations.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-500" />
                            Recomendaciones para Mejorar
                        </CardTitle>
                        <CardDescription>
                            Sugerencias basadas en tu patrón de trading
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recommendations.map((rec, index) => (
                                <Alert key={index} className={
                                    rec.type === 'danger' ? 'border-red-200 bg-red-50' :
                                    rec.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                                    'border-blue-200 bg-blue-50'
                                }>
                                    <rec.icon className="h-4 w-4" />
                                    <AlertDescription>
                                        <div className="font-medium mb-1">{rec.title}</div>
                                        <div className="text-sm">{rec.description}</div>
                                    </AlertDescription>
                                </Alert>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="bg-radial-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                <CardContent className="p-6 text-center">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                    <h3 className="text-lg font-semibold mb-2">¡Sigue aprendiendo!</h3>
                    <p className="text-muted-foreground">
                        Cada sesión de trading es una oportunidad para mejorar. 
                        Revisa regularmente estos análisis para desarrollar mejores hábitos.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}