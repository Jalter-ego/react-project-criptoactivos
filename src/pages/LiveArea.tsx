// src/pages/LiveAreaPage.tsx
import SpinnerComponent from "@/components/Shared/Spinner";
import TradingViewWidget from "@/components/Shared/TradingViewWidget";
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
      <div className="w-full flex justify-center">
        <div className="w-full max-w-7xl h-[80vh] flex items-center justify-center">
          <div className="relative w-full h-full rounded-xl shadow-2xl overflow-hidden bg-gray-800">
            <button className="absolute right-1/2 top-1.5 bg-primary text-white px-2 py-1 rounded-md
              text-sm cursor-pointer hover:opacity-90 transition-opacity duration-300"
              onClick={handleClickNavigation}>
              Buy
            </button>
            <TradingViewWidget symbol={symbol || "ETHUSD"} />
          </div>
        </div>
      </div>
    </div>
  );
}
