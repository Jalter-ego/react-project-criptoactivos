// services/types/transaction.types.ts (o similar)

export const TransactionType = {
  BUY: "BUY",
  SELL: "SELL",
} as const;

export type TransactionTypeKeys = keyof typeof TransactionType; // 'BUY' | 'SELL'
export type TransactionTypeValues =
  (typeof TransactionType)[TransactionTypeKeys];

export interface Transaction {
  id: string;
  type: TransactionTypeValues;
  amount: number;
  price: number;

  activeSymbol: string;
  portafolioId: string;

  createdAt: string;
}

export interface CreateTransactionDto {
  type: TransactionTypeValues;
  amount: number;
  price: number;
  activeSymbol: string;
  portafolioId: string;
}

export interface UpdateTransactionDto {
  type?: TransactionTypeValues;
  amount?: number;
  price?: number;
}
