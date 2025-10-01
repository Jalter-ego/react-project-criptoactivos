import React, { createContext, useContext, useState } from "react";
import type { PortafolioWithHoldings } from "@/services/portafolioServices";

type PortafolioContextType = {
  currentPortafolio: PortafolioWithHoldings | null;
  setCurrentPortafolio: (p: PortafolioWithHoldings) => void;
  clearPortafolio: () => void;
};

const PortafolioContext = createContext<PortafolioContextType | undefined>(undefined);

export const PortafolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPortafolio, setCurrentPortafolioState] = useState<PortafolioWithHoldings | null>(() => {
    // Cargar desde localStorage al iniciar
    const saved = localStorage.getItem("currentPortafolio");
    return saved ? JSON.parse(saved) as PortafolioWithHoldings : null;
  });


  const setCurrentPortafolio = (p: PortafolioWithHoldings) => {
    setCurrentPortafolioState(p);
    localStorage.setItem("currentPortafolio", JSON.stringify(p));
  };

  const clearPortafolio = () => {
    setCurrentPortafolioState(null);
    localStorage.removeItem("currentPortafolio");
  };

  return (
    <PortafolioContext.Provider value={{ currentPortafolio, setCurrentPortafolio, clearPortafolio }}>
      {children}
    </PortafolioContext.Provider>
  );
};

export const usePortafolio = () => {
  const ctx = useContext(PortafolioContext);
  if (!ctx) throw new Error("usePortafolio debe usarse dentro de PortafolioProvider");
  return ctx;
};
