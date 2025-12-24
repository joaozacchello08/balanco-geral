export type TransactionType = "entrada" | "saida";

export interface Transaction {
  id: number;
  value: number;
  description: string;
  /** ISO yyyy-mm-dd */
  date: string;
  t_type: TransactionType;
}

export interface TransactionsGroup {
  entradas: Transaction[];
  saidas: Transaction[];
}

export interface TransactionsResponse {
  transacoes: TransactionsGroup;
}
