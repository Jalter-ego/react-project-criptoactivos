// src/services/transactionServices.ts
import axios from "axios";
import { apilocal } from "./api";

const API_URL = `${apilocal}/transaction`;

// Tipo para tipos de transacción
export type TransactionType = "BUY" | "SELL";

// Interfaces para tipar la data en el frontend
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  price: number;
  activeSymbol: string;
  portafolioId: string;
  createdAt?: string; // por si tu backend devuelve fecha
  updatedAt?: string;
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
  create: async (data: CreateTransaction): Promise<Transaction> => {
    const res = await axios.post(API_URL, data);
    return res.data;
  },

  findAll: async (): Promise<Transaction[]> => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  findAllByUser: async (userId: string): Promise<Transaction[]> => {
    const res = await axios.get(`${API_URL}/user/${userId}`);
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
