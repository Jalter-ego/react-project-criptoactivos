import React, { createContext, useContext, useState, useEffect } from "react";

// Decodifica el JWT (sin validación de firma, solo para extraer datos)
function decodeJWT(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

type User = {
  id: string;
  email: string;
  name: string | null;
  picture?: string;
};

type UserContextType = {
  user: User | null;
  token: string | null;
  setUserData: (token: string) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setUserData(storedToken);
    }
  }, []);

  const setUserData = (token: string) => {
    setToken(token);
    localStorage.setItem("token", token);
    const decoded = decodeJWT(token);
    
    if (decoded && decoded.user) {
      setUser({
        id: decoded.user.id,
        email: decoded.user.email,
        name: decoded.user.name,
        picture: decoded.picture,
      });
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, token, setUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser debe usarse dentro de UserProvider");
  return ctx;
};