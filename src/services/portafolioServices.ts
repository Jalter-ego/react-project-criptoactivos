// src/services/portafolioServices.ts
import axios from "axios";
import { apilocal } from "./api";

const API_URL = `${apilocal}/portafolio`;

// Interfaces para tipar la data en el frontend
export interface Portafolio {
  id: string;
  name: string;
  cash: number;
  userId: string;
}

export interface CreatePortafolio {
  name: string;
  cash: number;
  userId: string;
}

export interface UpdatePortafolio {
  name?: string;
  cash?: number;
  userId?: string;
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

  findAllByUser: async (userId: string): Promise<Portafolio[]> => {
    const res = await axios.get(`${API_URL}/user/${userId}`);
    return res.data;
  },

  findOne: async (id: string): Promise<Portafolio> => {
    const res = await axios.get(`${API_URL}/${id}`);
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
