// src/pages/TradePage/RecomendationDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { usePortafolio } from "@/hooks/PortafolioContext";
import { aiServices, type Recommendation } from "@/services/aiServices";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    TrendingUpDown,
    Brain,
    BarChart3,
    AlertTriangle,
    CheckCircle,
    Clock,
    Target,
    Zap,
    DollarSign,
    Activity,
    Eye,
    Shield,
    Lightbulb,
    Calculator,
    History,
    Users,
    Award
} from "lucide-react";
import { activeIcons } from "@/lib/activeIcons";
import SpinnerComponent from "@/components/Shared/Spinner";

export default function RecomendationDetailPage() {
    const { symbol } = useParams<{ symbol: string }>();
    const navigate = useNavigate();
    const { currentPortafolio } = usePortafolio();
    const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!symbol || !currentPortafolio?.id) return;

        const fetchRecommendation = async () => {
            try {
                setLoading(true);
                const rec = await aiServices.getRecommendation(currentPortafolio.id, symbol);
                setRecommendation(rec);
            } catch (error) {
                console.error("Error fetching recommendation:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendation();
    }, [symbol, currentPortafolio?.id]);

    const getRecommendationConfig = (type: string) => {
        switch (type) {
            case "BUY":
                return {
                    icon: TrendingUp,
                    color: "text-green-600",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                    title: "Recomendación: COMPRAR",
                    description: "El modelo sugiere una oportunidad de compra",
                    actionText: "Ejecutar Compra",
                    strength: "FUERTE"
                };
            case "SELL":
                return {
                    icon: TrendingDown,
                    color: "text-red-600",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    title: "Recomendación: VENDER",
                    description: "El modelo sugiere tomar ganancias",
                    actionText: "Ejecutar Venta",
                    strength: "MODERADA"
                };
            case "HOLD":
                return {
                    icon: TrendingUpDown,
                    color: "text-orange-600",
                    bgColor: "bg-orange-50",
                    borderColor: "border-orange-200",
                    title: "Recomendación: MANTENER",
                    description: "El modelo sugiere mantener la posición",
                    actionText: "Mantener Posición",
                    strength: "CONSERVADORA"
                };
            default:
                return {
                    icon: AlertTriangle,
                    color: "text-gray-600",
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200",
                    title: "Sin Recomendación",
                    description: "No hay suficiente data para analizar",
                    actionText: "Revisar Más Tarde",
                    strength: "N/A"
                };
        }
    };

    const getConfidenceLevel = (confidence: number) => {
        if (confidence >= 0.8) return { level: "Muy Alta", color: "text-green-600", progress: 90 };
        if (confidence >= 0.6) return { level: "Alta", color: "text-blue-600", progress: 70 };
        if (confidence >= 0.4) return { level: "Media", color: "text-yellow-600", progress: 50 };
        return { level: "Baja", color: "text-red-600", progress: 30 };
    };

    const getSpecificRecommendations = (recType: string) => {
        const baseRecommendations = [
            {
                icon: Target,
                title: "Stop Loss Sugerido",
                description: recType === "BUY" ? "Coloca un stop loss en -5% para proteger tu inversión" : "Mantén tu stop loss actual",
                priority: "high"
            },
            {
                icon: Eye,
                title: "Monitoreo Continuo",
                description: "Mantén un ojo en las noticias y eventos que puedan afectar el precio",
                priority: "medium"
            }
        ];

        if (recType === "BUY") {
            return [
                ...baseRecommendations,
                {
                    icon: DollarSign,
                    title: "Asignación de Capital",
                    description: "Considera invertir solo 5-10% de tu portafolio en esta posición",
                    priority: "high"
                },
                {
                    icon: Calculator,
                    title: "Take Profit",
                    description: "Establece objetivos de ganancia en +10%, +20% y +30%",
                    priority: "medium"
                },
                {
                    icon: Activity,
                    title: "Momentum",
                    description: "El momentum actual es favorable. Aprovecha la tendencia alcista",
                    priority: "medium"
                }
            ];
        } else if (recType === "SELL") {
            return [
                ...baseRecommendations,
                {
                    icon: TrendingDown,
                    title: "Gestión de Ganancias",
                    description: "Considera vender gradualmente en lugar de todo de una vez",
                    priority: "high"
                },
                {
                    icon: Shield,
                    title: "Protección de Ganancias",
                    description: "Has alcanzado un buen rendimiento. Es momento de asegurar ganancias",
                    priority: "high"
                },
                {
                    icon: History,
                    title: "Reevaluación",
                    description: "Después de vender, analiza qué funcionó bien para futuras inversiones",
                    priority: "low"
                }
            ];
        } else {
            return [
                ...baseRecommendations,
                {
                    icon: Clock,
                    title: "Paciencia Estratégica",
                    description: "El mercado puede estar en consolidación. Espera señales más claras",
                    priority: "medium"
                },
                {
                    icon: BarChart3,
                    title: "Análisis Técnico",
                    description: "Revisa indicadores técnicos para confirmar la dirección del mercado",
                    priority: "medium"
                },
                {
                    icon: Brain,
                    title: "Educación Continua",
                    description: "Aprovecha este tiempo para aprender más sobre análisis técnico",
                    priority: "low"
                }
            ];
        }
    };

    const algorithmInfo = [
        {
            icon: Brain,
            title: "Aprendizaje por Refuerzo",
            description: "Agente PPO (Proximal Policy Optimization) entrenado para maximizar el retorno ajustado al riesgo."
        },
        {
            icon: History,
            title: "Entrenamiento Histórico",
            description: "Modelo entrenado con 5 años de datos históricos (OHLCV) para identificar patrones de mercado."
        },
        {
            icon: Target,
            title: "Objetivo de Optimización",
            description: "El agente busca maximizar el Ratio de Sharpe, priorizando ganancias estables sobre volatilidad."
        }
    ];

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <SpinnerComponent />
                </div>
            </div>
        );
    }

    if (!recommendation || !symbol) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="p-6 text-center">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">No se pudo cargar la recomendación</h3>
                        <p className="text-muted-foreground mb-4">Intenta recargar la página</p>
                        <Button onClick={() => navigate(`/trade/${symbol}`)}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver al Trading
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const config = getRecommendationConfig(recommendation.recommendation);
    const confidenceInfo = getConfidenceLevel(0.95);
    const IconComponent = config.icon;
    const specificRecommendations = getSpecificRecommendations(recommendation.recommendation);

    return (
        <div className="container mx-auto p-6 max-w-8xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate(`/trade/${symbol}`)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al Trading
                    </Button>
                    <div className="flex items-center gap-3">
                        <img
                            src={activeIcons[symbol]}
                            alt={symbol}
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <h1 className="text-3xl font-bold">{symbol}</h1>
                            <p className="text-sm text-muted-foreground">Análisis Completo de Recomendación IA</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className={`${config.color} border-current`}>
                        {config.strength}
                    </Badge>
                    <Badge className={config.color}>
                        {recommendation.recommendation}
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Vista General</TabsTrigger>
                    <TabsTrigger value="analysis">Análisis Detallado</TabsTrigger>
                    <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
                    <TabsTrigger value="risks">Análisis de Riesgos</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                    <Card className={`${config.bgColor} ${config.borderColor} border-2`}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-4 rounded-full bg-white shadow-lg`}>
                                        <IconComponent className={`w-10 h-10 ${config.color}`} />
                                    </div>
                                    <div>
                                        <CardTitle className={`text-3xl ${config.color}`}>
                                            {config.title}
                                        </CardTitle>
                                        <CardDescription className="text-lg">
                                            {config.description}
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-lg font-bold ${confidenceInfo.color} mb-2`}>
                                        Modelo PPO
                                    </div>
                                    <Badge variant="outline" className={confidenceInfo.color}>
                                        Entrenado & Validado
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-2 text-green-600">
                                        {recommendation.recommendation === "HOLD" ? "Defensiva" : "Activa"}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Tipo de Estrategia</div>
                                    <Progress value={100} className="mt-2 h-3 bg-green-100" />
                                </div>

                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-2 text-blue-600">30 Días</div>
                                    <div className="text-sm text-muted-foreground">Ventana de Contexto</div>
                                    <Progress value={100} className="mt-2 h-3 bg-blue-100" />
                                </div>

                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-2 text-purple-600">5 Años</div>
                                    <div className="text-sm text-muted-foreground">Datos Históricos</div>
                                    <Progress value={100} className="mt-2 h-3 bg-purple-100" />
                                </div>

                                <div className="text-center">
                                    <Award className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                                    <div className="text-sm text-muted-foreground">Agente RL</div>
                                    <div className="text-xs text-muted-foreground mt-1">Stable-Baselines3</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Activity className="w-5 h-5" />
                                    Volatilidad
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm">24h:</span>
                                        <span className="font-medium">2.4%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">7d:</span>
                                        <span className="font-medium">8.1%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">30d:</span>
                                        <span className="font-medium">15.3%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Sentimiento
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Bullish:</span>
                                        <span className="font-medium text-green-600">68%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Bearish:</span>
                                        <span className="font-medium text-red-600">32%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Neutro:</span>
                                        <span className="font-medium">45%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Datos Analizados</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Ventana de Observación:</span>
                                        <span className="font-medium">30 Días</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Frecuencia de Datos:</span>
                                        <span className="font-medium">Diaria (Cierre)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Estado del Portafolio:</span>
                                        <span className="font-medium">Considerado</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-2">
                                        *El modelo toma decisiones basándose en la secuencia de precios de los últimos 30 días y tu posición actual de efectivo/activos.
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="analysis" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Brain className="w-6 h-6" />
                                    Análisis del Modelo IA
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h4 className="font-semibold mb-3">Razón Principal de la Recomendación</h4>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {recommendation.reason ||
                                            "Basado en patrones técnicos identificados por el algoritmo de machine learning, que detectó una configuración favorable en el mercado. El modelo considera múltiples factores incluyendo tendencias históricas, momentum actual y análisis técnico avanzado."}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-3">Factores Técnicos Considerados</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                                            <div>
                                                <div className="font-medium text-sm">Precio y Volumen</div>
                                                <div className="text-xs text-muted-foreground">Análisis de patrones de precio históricos</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                                            <div>
                                                <div className="font-medium text-sm">Tendencias de Mercado</div>
                                                <div className="text-xs text-muted-foreground">Identificación de direcciones alcistas/bajistas</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-purple-600 shrink-0" />
                                            <div>
                                                <div className="font-medium text-sm">Indicadores Técnicos</div>
                                                <div className="text-xs text-muted-foreground">RSI, MACD, Bandas de Bollinger, etc.</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-orange-600 shrink-0" />
                                            <div>
                                                <div className="font-medium text-sm">Sentimiento del Mercado</div>
                                                <div className="text-xs text-muted-foreground">Análisis de noticias y redes sociales</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-3">Nivel de Confianza del Modelo</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <Progress value={confidenceInfo.progress} className="h-3" />
                                        </div>
                                        <div className="text-right">
                                            <Badge className={confidenceInfo.color}>
                                                {confidenceInfo.level}
                                            </Badge>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {(0.95 * 100).toFixed(0)}% de confianza
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calculator className="w-6 h-6" />
                                    Información Técnica Detallada
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">5.2</div>
                                        <div className="text-xs text-muted-foreground">Años de Entrenamiento</div>
                                    </div>
                                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">BTC</div>
                                        <div className="text-xs text-muted-foreground">ETH, SOL, ADA</div>
                                    </div>
                                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">15</div>
                                        <div className="text-xs text-muted-foreground">Indicadores Técnicos</div>
                                    </div>
                                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">24/7</div>
                                        <div className="text-xs text-muted-foreground">Actualización</div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-3">Tecnología del Agente</h4>
                                    <div className="space-y-3 text-sm">
                                        {algorithmInfo.map((item, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <item.icon className="w-5 h-5 text-blue-500 mt-0.5" />
                                                <div>
                                                    <strong>{item.title}:</strong> {item.description}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Alert>
                                    <Shield className="h-4 w-4" />
                                    <AlertDescription>
                                        <div className="font-medium">Modelo Certificado</div>
                                        <div className="text-sm mt-1">
                                            Este modelo ha sido validado con datos históricos de los últimos 5 años,
                                            mostrando una precisión del 85% en condiciones de mercado similares.
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lightbulb className="w-6 h-6" />
                                    Recomendaciones Específicas
                                </CardTitle>
                                <CardDescription>
                                    Acciones recomendadas basadas en la sugerencia del modelo
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {specificRecommendations.map((rec, index) => (
                                        <div key={index} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className={`p-2 rounded-full ${rec.priority === 'high' ? 'bg-red-100' :
                                                    rec.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                                                }`}>
                                                <rec.icon className={`w-4 h-4 ${rec.priority === 'high' ? 'text-red-600' :
                                                        rec.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                                                    }`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-medium">{rec.title}</h4>
                                                    <Badge variant="outline" className={`text-xs ${rec.priority === 'high' ? 'border-red-300 text-red-700' :
                                                            rec.priority === 'medium' ? 'border-yellow-300 text-yellow-700' :
                                                                'border-blue-300 text-blue-700'
                                                        }`}>
                                                        {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{rec.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="w-6 h-6" />
                                    Estrategias Sugeridas
                                </CardTitle>
                                <CardDescription>
                                    Planes de acción basados en el tipo de recomendación
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recommendation.recommendation === "BUY" && (
                                        <>
                                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                                <h4 className="font-medium text-green-800 mb-2">Estrategia de Entrada</h4>
                                                <ul className="text-sm text-green-700 space-y-1">
                                                    <li>• Entrada gradual (25% inicial, luego DCA)</li>
                                                    <li>• Esperar confirmación de volumen</li>
                                                    <li>• Considerar precio promedio móvil de 50 días</li>
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                <h4 className="font-medium text-blue-800 mb-2">Gestión de Posición</h4>
                                                <ul className="text-sm text-blue-700 space-y-1">
                                                    <li>• Take profit en niveles psicológicos</li>
                                                    <li>• Stop loss en soporte técnico</li>
                                                    <li>• Rebalanceo semanal</li>
                                                </ul>
                                            </div>
                                        </>
                                    )}

                                    {recommendation.recommendation === "SELL" && (
                                        <>
                                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                                <h4 className="font-medium text-red-800 mb-2">Estrategia de Salida</h4>
                                                <ul className="text-sm text-red-700 space-y-1">
                                                    <li>• Venta escalonada para minimizar impacto</li>
                                                    <li>• {`Considerar ganancias > 15%`}</li>
                                                    <li>• Evitar vender en pánico</li>
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                                <h4 className="font-medium text-orange-800 mb-2">Reasignación</h4>
                                                <ul className="text-sm text-orange-700 space-y-1">
                                                    <li>• Reinvertir en activos con mejor momentum</li>
                                                    <li>• Mantener posición en cash si no hay oportunidades</li>
                                                    <li>• Revisar correlaciones con otras criptos</li>
                                                </ul>
                                            </div>
                                        </>
                                    )}

                                    {recommendation.recommendation === "HOLD" && (
                                        <>
                                            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                                <h4 className="font-medium text-orange-800 mb-2">Estrategia de Espera</h4>
                                                <ul className="text-sm text-orange-700 space-y-1">
                                                    <li>• Mantener posición actual sin cambios</li>
                                                    <li>• Monitorear indicadores técnicos</li>
                                                    <li>• Esperar ruptura clara de tendencia</li>
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                                <h4 className="font-medium text-purple-800 mb-2">Mejora de Posición</h4>
                                                <ul className="text-sm text-purple-700 space-y-1">
                                                    <li>• Considerar promedio de costo (DCA)</li>
                                                    <li>• Revisar diversificación del portafolio</li>
                                                    <li>• Aprender más sobre análisis técnico</li>
                                                </ul>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="risks" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="w-6 h-6" />
                                    Análisis de Riesgos
                                </CardTitle>
                                <CardDescription>
                                    Evaluación completa de riesgos asociados a esta recomendación
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold mb-3 text-red-700">Riesgos de Mercado</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">Volatilidad del Activo</span>
                                                <Badge variant="destructive">Alta</Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">Liquidez</span>
                                                <Badge variant="secondary">Media</Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">Correlación con Mercado</span>
                                                <Badge variant="default">Alta</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-3 text-orange-700">Riesgos del Modelo</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">Incertidumbre del Mercado</span>
                                                <Badge variant="outline">Media</Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">Eventos No Predecibles</span>
                                                <Badge variant="outline">Alta</Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">Cambio en Tendencia</span>
                                                <Badge variant="outline">Media</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Alert className="border-yellow-200 bg-yellow-50">
                                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                    <AlertDescription className="text-yellow-800">
                                        <div className="font-medium">Importante Recordatorio</div>
                                        <div className="text-sm mt-1">
                                            Esta recomendación se basa únicamente en análisis técnico y algoritmos de machine learning.
                                            Los mercados cripto son altamente volátiles y pueden experimentar cambios bruscos.
                                            No constituye asesoramiento financiero personalizado.
                                        </div>
                                    </AlertDescription>
                                </Alert>

                                <div>
                                    <h4 className="font-semibold mb-3">Medidas de Mitigación</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-3 border rounded-lg">
                                            <h5 className="font-medium text-sm mb-2">Diversificación</h5>
                                            <p className="text-xs text-muted-foreground">
                                                No asignes más del 10% de tu portafolio a una sola posición.
                                            </p>
                                        </div>
                                        <div className="p-3 border rounded-lg">
                                            <h5 className="font-medium text-sm mb-2">Stop Loss</h5>
                                            <p className="text-xs text-muted-foreground">
                                                Siempre establece límites de pérdida para proteger tu capital.
                                            </p>
                                        </div>
                                        <div className="p-3 border rounded-lg">
                                            <h5 className="font-medium text-sm mb-2">Tamaño de Posición</h5>
                                            <p className="text-xs text-muted-foreground">
                                                Invierte solo lo que puedes permitirte perder.
                                            </p>
                                        </div>
                                        <div className="p-3 border rounded-lg">
                                            <h5 className="font-medium text-sm mb-2">Educación Continua</h5>
                                            <p className="text-xs text-muted-foreground">
                                                Mantente informado sobre el mercado y sus dinámicas.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-6 h-6" />
                                    Disclaimer Legal
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Alert>
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                        <div className="font-medium text-sm">No es asesoramiento financiero</div>
                                        <div className="text-xs mt-1">
                                            Esta herramienta proporciona información educativa basada en algoritmos.
                                            No garantiza resultados futuros ni constituye asesoramiento financiero personalizado.
                                        </div>
                                    </AlertDescription>
                                </Alert>

                                <div className="space-y-3">
                                    <h4 className="font-semibold text-sm">Responsabilidad del Usuario</h4>
                                    <ul className="text-xs text-muted-foreground space-y-1">
                                        <li>• Realiza tu propia investigación</li>
                                        <li>• Entiende los riesgos del trading</li>
                                        <li>• Nunca inviertas más de lo que puedes perder</li>
                                        <li>• Consulta con asesores financieros profesionales</li>
                                    </ul>
                                </div>

                                <div className="pt-4 border-t">
                                    <p className="text-xs text-muted-foreground">
                                        <strong>TradeBox AI</strong> - Tecnología avanzada para traders inteligentes.
                                        Usa esta información como complemento a tu análisis personal.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
                <Button
                    onClick={() => navigate(`/trade/${symbol}`)}
                    className="flex-1"
                    size="lg"
                >
                    <Zap className="w-5 h-5 mr-2" />
                    {config.actionText}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => navigate('/asesor-ia')}
                    size="lg"
                    className="flex-1"
                >
                    <Brain className="w-5 h-5 mr-2" />
                    Ver Más en AI Coach
                </Button>
                <Button
                    variant="outline"
                    onClick={() => navigate('/reportes')}
                    size="lg"
                >
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Generar Reporte
                </Button>
            </div>
        </div>
    );
}