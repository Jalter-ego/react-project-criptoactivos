// src/pages/LiveAreaPage.tsx
import LiveAreaChart from "@/components/liveAreaCharts";
import TradingChart from "@/components/tradingChart";

export default function LiveAreaPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-900 text-white">
      <h1 className="text-2xl font-bold my-4">Live Area Chart </h1>
      <div className="w-full max-w-4xl">
        <TradingChart />
      </div>
    </div>
  );
}
