import { api } from "./api";

const API_URL = `${api}/auth`;

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      console.log(data);
      
      throw new Error(data.message || "Error en registro");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Error en login");
    }
    return data;
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
