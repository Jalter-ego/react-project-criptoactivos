import { api } from "./api";


export interface Active{
    symbol: string,
    name: string
} 

export type TickerData = {
  product_id: string;
  price: string;
  volume_24_h: string;
  low_24_h: string
  high_24_h: string
  low_52_w: string
  high_52_w: string
  price_percent_chg_24_h: string
  best_bid: string,
  best_ask: string,
  best_bid_quantity: string,
  best_ask_quantity: string
}

export const getAllActives = async () => {
  try {
    const res = await fetch(`${api}/active`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error en traer los activos");
    }
    return data;
  } catch (error) {
    throw error;
  }
};