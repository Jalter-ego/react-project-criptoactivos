import { api } from "./api";
import type { CreateTransactionDto, Transaction, UpdateTransactionDto } from "./types/transaction.types";

const TRANSACTION_BASE_URL = `${api}/transaction`;
export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await fetch(TRANSACTION_BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as Transaction[];
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    throw error;
  }
};


export const getTransactionsByUserId = async (
  userId: string
): Promise<Transaction[]> => {
  try {
    const response = await fetch(`${TRANSACTION_BASE_URL}/user/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as Transaction[];
  } catch (error) {
    console.error(`Error fetching transactions for user ${userId}:`, error);
    throw error;
  }
};

export const getTransactionById = async (id: string): Promise<Transaction> => {
  try {
    const response = await fetch(`${TRANSACTION_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as Transaction;
  } catch (error) {
    console.error(`Error fetching transaction ${id}:`, error);
    throw error;
  }
};

export const createTransaction = async (
  data: CreateTransactionDto
): Promise<Transaction> => {
  try {
    const response = await fetch(TRANSACTION_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Failed to create transaction. Status: ${response.status}`
      );
    }
    return (await response.json()) as Transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};


export const updateTransaction = async (
  id: string,
  data: UpdateTransactionDto
): Promise<any> => {
  try {
    const response = await fetch(`${TRANSACTION_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating transaction ${id}:`, error);
    throw error;
  }
};


export const deleteTransaction = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${TRANSACTION_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as { message: string };
  } catch (error) {
    console.error(`Error deleting transaction ${id}:`, error);
    throw error;
  }
};
