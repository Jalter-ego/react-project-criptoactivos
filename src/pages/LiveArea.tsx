// src/pages/LiveAreaPage.tsx
import SpinnerComponent from "@/components/Shared/Spinner";
import TradingViewWidget from "@/components/Shared/TradingViewWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { chartConcepts } from "@/lib/educationContent";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
export default function LiveAreaPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  })

  const formatSymbol = (rawSymbol: string | undefined) => {
    if (!rawSymbol) return "ETH-USD";
    if (rawSymbol.endsWith("USD")) {
      const base = rawSymbol.slice(0, -3);
      return `${base}-USD`;
    }
    return rawSymbol;
  };


  const handleClickNavigation = () => {
    navigate(`/trade/${formatSymbol(symbol)}`);
  };


  if (loading) {
    return (
      <SpinnerComponent />
    )
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white-900 text-black">
      <div className="w-full flex justify-center px-4">
        <div className="w-full max-w-7xl flex flex-col gap-6 py-10">
          <div className="relative w-full h-[70vh] rounded-xl shadow-2xl overflow-hidden bg-gray-800">
            <button
              className="absolute right-1/2 top-1.5 bg-primary text-white px-3 py-1 rounded-md text-sm cursor-pointer hover:opacity-90 transition-opacity duration-300"
              onClick={handleClickNavigation}
            >
              Comprar/Vender
            </button>
            <TradingViewWidget symbol={symbol || "ETHUSD"} />
          </div>
          <Card className="border-primary/30 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Conceptos clave al analizar el gráfico</span>
                <Badge variant="outline">TradingView</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {chartConcepts.map((concept) => (
                <div key={concept.title} className="rounded-lg border border-dashed border-muted-foreground/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <concept.icon className="w-4 h-4 text-primary" />
                    {concept.title}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {concept.detail}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
