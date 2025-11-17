import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { portafolioServices, type RiskMetrics } from "@/services/portafolioServices";
import { TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react";
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
          <SpinnerComponent size="32"/>
        </CardContent>
      </Card>
    );
  }

  if (error || !metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Métricas de Riesgo</CardTitle>
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
    if (ratio > 1) return { variant: "default" as const, text: "Excelente" };
    if (ratio > 0.5) return { variant: "secondary" as const, text: "Bueno" };
    return { variant: "destructive" as const, text: "Riesgoso" };
  };

  const sharpeBadge = getSharpeBadge(metrics.sharpeRatio);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Métricas de Riesgo
        </CardTitle>
        <CardDescription>
          Análisis basado en {metrics.dataPoints} puntos de datos ({metrics.periodDays} días)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-4 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-muted-foreground">Ratio de Sharpe</span>
          </div>
          <div className={`text-3xl font-bold ${getSharpeColor(metrics.sharpeRatio)}`}>
            {metrics.sharpeRatio.toFixed(2)}
          </div>
          <Badge variant={sharpeBadge.variant} className="mt-2">
            {sharpeBadge.text}
          </Badge>
          <p className="text-xs text-muted-foreground mt-1">
            Retorno ajustado por riesgo
          </p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 border rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-muted-foreground">Retorno Total</span>
            </div>
            <div className="text-lg font-semibold text-green-600">
              {formatPercentage(metrics.totalReturn)}
            </div>
          </div>

          <div className="text-center p-3 border rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-muted-foreground">Max Drawdown</span>
            </div>
            <div className="text-lg font-semibold text-red-600">
              {formatPercentage(metrics.maxDrawdown)}
            </div>
          </div>
        </div>

        {/* Métricas detalladas */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Métricas Detalladas</h4>
          
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ratio de Sortino:</span>
              <span className="font-medium">{metrics.sortinoRatio.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Volatilidad (σ):</span>
              <span className="font-medium">{formatPercentage(metrics.volatility)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Volatilidad Bajista:</span>
              <span className="font-medium">{formatPercentage(metrics.downsideVolatility)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Retorno Promedio:</span>
              <span className="font-medium">{formatPercentage(metrics.averageReturn)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tasa Libre de Riesgo:</span>
              <span className="font-medium">{formatPercentage(metrics.riskFreeRate)}</span>
            </div>
          </div>
        </div>

        {/* Interpretación */}
        <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
          <strong>Interpretación:</strong> 
          {`Un Sharpe Ratio > 1 indica que el portafolio genera buen retorno por unidad de riesgo. 
          El Sortino Ratio penaliza solo la volatilidad bajista. Valores más altos son mejores`}.
        </div>
      </CardContent>
    </Card>
  );
}