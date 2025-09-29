import React, { createContext, useContext, useState } from "react";
import type { Portafolio } from "@/services/portafolioServices";

type PortafolioContextType = {
  currentPortafolio: Portafolio | null;
  setCurrentPortafolio: (p: Portafolio) => void;
  clearPortafolio: () => void;
};

const PortafolioContext = createContext<PortafolioContextType | undefined>(undefined);

export const PortafolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPortafolio, setCurrentPortafolioState] = useState<Portafolio | null>(() => {
    // Cargar desde localStorage al iniciar
    const saved = localStorage.getItem("currentPortafolio");
    return saved ? JSON.parse(saved) as Portafolio : null;
  });


  const setCurrentPortafolio = (p: Portafolio) => {
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
