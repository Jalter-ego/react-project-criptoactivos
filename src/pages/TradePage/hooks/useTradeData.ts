import { useEffect, useState } from "react";
import { usePortafolio } from "@/hooks/PortafolioContext";
import { transactionServices, type Transaction } from "@/services/transactionServices";
import { portafolioServices, type Holding } from "@/services/portafolioServices";

interface UseTradeDataProps {
  id: string;
}

export const useTradeData = ({ id }: UseTradeDataProps) => {
  const { currentPortafolio, setCurrentPortafolio } = usePortafolio();
  const [currentHolding, setCurrentHolding] = useState<Holding | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setErrorState] = useState<string | null>(null);

  useEffect(() => {
    if (!currentPortafolio?.id || !id) return;

    const loadTransactions = async () => {
      try {
        const txs = await transactionServices.findAllByPortafolioAndActive(currentPortafolio.id, id);
        setTransactions(txs);
      } catch (err) {
        setErrorState("Error al cargar historial");
      }
    };

    const loadPortfolio = async () => {
      try {
        const fullPortafolio = await portafolioServices.findOne(currentPortafolio.id);
        setCurrentPortafolio(fullPortafolio);
        const holdingForAsset = fullPortafolio.holdings.find((h) => h.activeSymbol === id);
        setCurrentHolding(holdingForAsset || null);
      } catch (err) {
        setErrorState("Error al cargar datos del portafolio.");
      }
    };

    loadTransactions();
    loadPortfolio();
  }, [currentPortafolio?.id, id, setCurrentPortafolio]);

  return { currentHolding, transactions, error: error, setTransactions,refetch: () => {} };
};