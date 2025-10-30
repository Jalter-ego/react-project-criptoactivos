// src/services/transactionServices.ts
import axios from "axios";
import { api } from "./api";
import type { PortafolioWithHoldings } from "./portafolioServices";

const API_URL = `${api}/transaction`;

export type TransactionType = "BUY" | "SELL";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  price: number;
  activeSymbol: string;
  portafolioId: string;
  createdAt?: string; 
}

export interface CreateTransaction {
  type: TransactionType;
  amount: number;
  price: number;
  activeSymbol: string;
  portafolioId: string;
}

export interface UpdateTransaction {
  type?: TransactionType;
  amount?: number;
  price?: number;
  activeSymbol?: string;
  portafolioId?: string;
}

export const transactionServices = {
  create: async (data: CreateTransaction): Promise<PortafolioWithHoldings> => { 
    const res = await axios.post(API_URL, data);
    return res.data;
  },

  findAll: async (): Promise<Transaction[]> => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  findAllByPortafolio: async (portafolioId: string): Promise<Transaction[]> => {
    const res = await axios.get(`${API_URL}/portafolio/${portafolioId}`);
    return res.data;
  },

  findAllByPortafolioAndActive: async (portafolioId: string,symbol:string): Promise<Transaction[]> => {
    const res = await axios.get(`${API_URL}/portafolio/${portafolioId}/active/${symbol}`);
    return res.data;
  },

  findOne: async (id: string): Promise<Transaction> => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },

  update: async (id: string, data: UpdateTransaction): Promise<Transaction> => {
    const res = await axios.patch(`${API_URL}/${id}`, data);
    return res.data;
  },

  remove: async (id: string): Promise<Transaction> => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
};
