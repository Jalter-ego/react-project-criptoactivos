import axios from "axios";
import { api } from "./api";

export interface GenerateReportRequest {
  prompt: string;
  userId: string;
}

export interface ReportResponse {
  filename: string;
  mimeType: string;
  buffer: ArrayBuffer;
}

export const reportsService = {
  generateReport: async (data: GenerateReportRequest): Promise<Blob> => {
    const response = await axios.post(`${api}/reports/generate`, data, {
      responseType: 'blob',
    });
    
    return response.data;
  },
};