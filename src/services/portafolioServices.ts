// src/services/portafolioServices.ts
import axios from "axios";
import { api } from "./api";

const API_URL = `${api}/portafolio`;

export interface Holding {
  id: string;
  quantity: number;
  portafolioId: string;
  activeSymbol: string;
}

export interface PortafolioWithHoldings {
  id: string;
  name: string;
  cash: number;
  invested: number
  userId: string;
  holdings: Holding[];
}

export interface Portafolio {
  id: string;
  name: string;
  cash: number;
  invested: number
  userId: string;
}

export interface CreatePortafolio {
  name: string;
  cash: number;
  userId: string;
}

export interface UpdatePortafolio {
  name?: string;
}

export interface PortafolioSnapshot {
  id: string;
  value: number;
  timestamp: string;
  portafolioId: string;
}

export const portafolioServices = {
  create: async (data: CreatePortafolio): Promise<Portafolio> => {
    const res = await axios.post(API_URL, data);
    return res.data;
  },

  findAll: async (): Promise<Portafolio[]> => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  findAllByUser: async (userId: string): Promise<PortafolioWithHoldings[]> => {
    const res = await axios.get(`${API_URL}/user/${userId}`);
    return res.data;
  },

  findOne: async (id: string): Promise<PortafolioWithHoldings> => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },

  findTotalValueOfPortafolio: async (id: string): Promise<{totalValue:number}> => {
    const res = await axios.get(`${API_URL}/${id}/value`);
    return res.data;
  },

  findSnapshots: async (portafolioId: string): Promise<PortafolioSnapshot[]> => {
    const res = await axios.get(`${API_URL}/${portafolioId}/snapshots`);
    return res.data;
  },

  update: async (id: string, data: UpdatePortafolio): Promise<Portafolio> => {
    const res = await axios.patch(`${API_URL}/${id}`, data);
    return res.data;
  },

  remove: async (id: string): Promise<Portafolio> => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
};
