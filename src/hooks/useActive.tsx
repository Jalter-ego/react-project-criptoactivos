import React, { createContext, useContext, useState } from "react";
import type { TickerData } from "@/services/active.service";

type ActiveContextType = {
  active: TickerData | null;
  setActive: (ticker: TickerData) => void;
};

const ActiveContext = createContext<ActiveContextType | undefined>(undefined);

export const ActiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [active, setActive] = useState<TickerData | null>(null);

  return (
    <ActiveContext.Provider value={{ active, setActive }}>
      {children}
    </ActiveContext.Provider>
  );
};

export const useActive = () => {
  const ctx = useContext(ActiveContext);
  if (!ctx) throw new Error("useActive debe usarse dentro de ActiveProvider");
  return ctx;
};
