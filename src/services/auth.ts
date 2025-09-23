const API_URL = "http://localhost:3000/auth";

export const login = async (email: string, password: string) => {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      throw new Error("Error en login");
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const googleLogin = async (token: string) => {
  try {
    const res = await fetch(`${API_URL}/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) {
      throw new Error("Error en login con Google");
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
};