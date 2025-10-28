import axios from "axios";
import { api } from "./api";

const API_URL = `${api}/ai-insights`;

export interface PortfolioInsights {
  concentrationData: { name: string; value: number }[];
  costsData: { month: string; costs: number }[];
  totalFeedbacks: number;
}

export const aiServices = {
  getInsights: async (portafolioId: string): Promise<PortfolioInsights> => {
    const res = await axios.get(`${API_URL}/portfolio/${portafolioId}`);
    return res.data;
  },
};