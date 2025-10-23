import axios from "axios";
import { api } from "./api";

const API_URL = `${api}/feedback`;

export type FeedbackType = "RISK_ALERT" | "BEHAVIORAL_NUDGE" | "COST_ANALYSIS";

export interface Feedback {
  id: string;
  message: string;
  type: FeedbackType;
  createdAt: string;
}

export const feedbackServices = {
  findRecentByPortafolio: async (portafolioId: string): Promise<Feedback[]> => {
    console.log(portafolioId);
    
    const res = await axios.get(`${API_URL}/portafolio/${portafolioId}/recent`);
    return res.data;
  },
};
