export type TransactionType = "entrada" | "saida";
export type ISODate = `${number}-${number}-${number}`

export interface Transaction {
  id: number;
  value: number;
  description: string;
  /** ISO yyyy-mm-dd */
  date: ISODate;
  t_type: TransactionType;
}

export interface NewTransaction {
  value: number;
  description: string;
  /** ISO yyyy-mm-dd */
  date?: ISODate;
  t_type: TransactionType;
}

export interface Registro {
  value: number;
  description: string
}

export interface TransactionsGroup {
  entradas: Transaction[];
  saidas: Transaction[];
}

export interface TransactionsResponse {
  transacoes: TransactionsGroup;
}

export interface TransactionUpdate {
  t_type?: TransactionType;
  value?: number;
  description?: string;
  date?: ISODate;
}
