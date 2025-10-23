import { useEffect, useState } from "react";
import { socket } from "@/services/socket";
import { useActive } from "@/hooks/useActive";
import type { TickerData } from "@/services/activeServices";

interface UseTradeSocketProps {
  id: string;
}

export const useTradeSocket = ({ id }: UseTradeSocketProps) => {
  const { setActive } = useActive();
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    if (!id) return;

    if (socket.disconnected) {
      socket.connect();
    }
    socket.emit("subscribe_to_active", id);

    const handleTickerUpdate = (data: TickerData) => {
      if (data.product_id === id) {
        const price = parseFloat(data.price);
        setCurrentPrice(price);
        setActive(data);
      }
    };

    socket.on("ticker_update", handleTickerUpdate);

    return () => {
      socket.emit("unsubscribe_from_active", id);
      socket.off("ticker_update", handleTickerUpdate);
    };
  }, [id, setActive]);

  return { currentPrice };
};