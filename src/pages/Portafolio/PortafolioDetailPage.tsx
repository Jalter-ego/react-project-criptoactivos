import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePortafolio } from "@/hooks/PortafolioContext";
import { portafolioServices, type Holding, type PortafolioWithHoldings } from "@/services/portafolioServices";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, DollarSign, TrendingUp, PieChart, Calendar } from "lucide-react";
import PerformanceChart from "../Dashboard/components/PerformanceChart";
import RiskMetricsCard from "./components/RiskMetricsCard";
import SpinnerComponent from "@/components/Shared/Spinner";
import { activeIcons } from "@/lib/activeIcons";
import { useUser } from "@/hooks/useContext";


export default function PortafolioDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useUser();
    const { currentPortafolio, setCurrentPortafolio } = usePortafolio();
    const [portfolio, setPortfolio] = useState<PortafolioWithHoldings | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      if (!id) return;
      fetchPortfolioDetails();
    }, [id]);
  
    const fetchPortfolioDetails = async () => {
      try {
        setLoading(true);
        const portfolioData = await portafolioServices.findOneWithPrices(id!);
        console.log(portfolioData);
        
        setPortfolio(portfolioData);
      } catch (error) {
        console.error("Error fetching portfolio details:", error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleSelectPortfolio = () => {
      if (portfolio) {
        setCurrentPortafolio(portfolio);
        navigate('/portafolios');
      }
    };
  
    const totalHoldingsValue = portfolio?.holdings?.reduce((sum, h) => sum + (h.totalValue || 0), 0) || 0;
    const totalValue = (portfolio?.cash || 0) + totalHoldingsValue;
    const isCurrent = currentPortafolio?.id === portfolio?.id;
  
    if (loading) {
        return (
          <SpinnerComponent />
        )
      }
  
    if (!portfolio) {
      return (
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Portafolio no encontrado</p>
              <Button onClick={() => navigate('/portafolios')} className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Portafolios
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/portafolios')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                {portfolio.name}
                {isCurrent && <Badge variant="secondary">Portafolio Activo</Badge>}
              </h1>
              <p className="text-muted-foreground">Detalles completos del portafolio</p>
            </div>
          </div>
          {!isCurrent && (
            <Button onClick={handleSelectPortfolio}>
              Seleccionar como Activo
            </Button>
          )}
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-muted-foreground">Valor Total</span>
              </div>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            </CardContent>
          </Card>
  
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-muted-foreground">Saldo Disponible</span>
              </div>
              <div className="text-2xl font-bold">${portfolio.cash.toFixed(2)}</div>
            </CardContent>
          </Card>
  
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-muted-foreground">Valor Invertido</span>
              </div>
              <div className="text-2xl font-bold">${portfolio.invested.toFixed(2)}</div>
            </CardContent>
          </Card>
  
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-muted-foreground">Activos</span>
              </div>
              <div className="text-2xl font-bold">{portfolio.holdings.length}</div>
            </CardContent>
          </Card>
        </div>
  
        <Card>
          <CardHeader>
            <CardTitle>Composición del Portafolio</CardTitle>
            <CardDescription>
              Activos actuales con precios en tiempo real
            </CardDescription>
          </CardHeader>
          <CardContent>
            {portfolio.holdings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay activos en este portafolio</p>
              </div>
            ) : (
              <div className="space-y-4">
                {portfolio.holdings.map((holding: Holding) => {
                  const percentage = totalHoldingsValue > 0 ? ((holding.totalValue || 0) / totalHoldingsValue) * 100 : 0;
                  return (
                    <div key={holding.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={activeIcons[holding.activeSymbol]}
                          alt={holding.activeSymbol}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{holding.activeSymbol}</div>
                          <div className="text-sm text-muted-foreground">
                            {holding.quantity.toFixed(6)} unidades
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${(holding.totalValue || 0).toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${(holding.currentPrice || 0).toFixed(2)} × {holding.quantity.toFixed(4)}
                        </div>
                        <Badge variant="outline" className="mt-1">
                          {percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
  
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Información del Portafolio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">ID:</span>
                <div className="font-mono text-xs mt-1">{portfolio.id}</div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Usuario:</span>
                <div className="font-mono text-xs mt-1">{user?.name}</div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Creado:</span>
                <div className="mt-1">{new Date(portfolio.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Última actualización:</span>
                <div className="mt-1">{new Date(portfolio.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
  
        {/* Análisis de Rendimiento y Riesgo */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Análisis de Rendimiento</h2>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <PerformanceChart portafolioId={portfolio.id} />
            </div>
            <div>
              <RiskMetricsCard portafolioId={portfolio.id} />
            </div>
          </div>
        </div>
      </div>
    );
  }