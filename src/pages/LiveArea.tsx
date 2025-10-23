// src/pages/LiveAreaPage.tsx
import TradingViewWidget from "@/components/Shared/TradingViewWidget";
import { useParams } from "react-router-dom";
export default function LiveAreaPage() {
  const { symbol } = useParams<{ symbol: string }>();
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white-900 text-black">
      <h1 className="text-3xl font-bold my-8">Live Area Chart</h1>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-7xl h-[80vh] flex items-center justify-center">
          <div className="w-full h-full rounded-xl shadow-2xl overflow-hidden bg-gray-800">
            <TradingViewWidget symbol={symbol || "ETHUSD"} />
          </div>
        </div>
      </div>
    </div>
  );
}
