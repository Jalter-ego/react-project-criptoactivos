import axios from "axios";
import { api } from "./api";

const API_URL = `${api}/ai-insights`;

export interface ConcentrationData{
  name: string,
  value: number
}

export interface PortfolioInsights {
  concentrationData: ConcentrationData[];
  costsData: { period: string; costs: number; periodType: 'week' | 'month' }[]; 
  totalFeedbacks: number;
}

export interface Recommendation {
  recommendation: "HOLD" | "BUY" | "SELL";
  confidence?: number; 
  reason?: string;
}

export const aiServices = {
  getInsights: async (portafolioId: string): Promise<PortfolioInsights> => {
    const res = await axios.get(`${API_URL}/portfolio/${portafolioId}`);
    return res.data;
  },

  getRecommendation: async (portafolioId: string, symbol: string): Promise<Recommendation> => {
    const res = await axios.get(`${API_URL}/sugerencia/portafolio/${portafolioId}/active/${symbol}`);
    return res.data;
  },
};