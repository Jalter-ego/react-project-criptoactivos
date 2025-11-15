import { type TransactionType } from "@/services/transactionServices";

export const calculateQuantity = (amountUSD: number, currentPrice: number): number => {
  return amountUSD > 0 && currentPrice > 0 ? amountUSD / currentPrice : 0;
};

export const isInvalidTransaction = ({
  amountUSD,
  transactionType,
  availableCash,
  availableAssetQuantity,
  calculatedQuantity,
}: {
  amountUSD: number;
  transactionType: TransactionType;
  availableCash: number;
  availableAssetQuantity: number;
  calculatedQuantity: number;
}): string | null => {
  if (amountUSD <= 0) return "Monto inválido.";
  if (transactionType === "BUY" && amountUSD > availableCash) return "Fondos insuficientes.";
  if (transactionType === "SELL" && calculatedQuantity > availableAssetQuantity) return "No posees suficientes activos.";
  if (isNaN(calculatedQuantity)) return "Cálculo inválido.";
  return null;
};

export const getFeedbackColor = (type: string): string => {
  switch (type) {
    case "RISK_ALERT":
      return "text-red-600 bg-red-50 border-red-200";
    case "BEHAVIORAL_NUDGE":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "COST_ANALYSIS":
      return "text-green-600 bg-green-50 border-green-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};