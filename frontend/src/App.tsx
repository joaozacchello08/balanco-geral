import { useEffect, useState } from "react"
import { type TransactionsResponse, type Transaction } from "./models/Transaction"
import TransactionC from "./component/Transaction"
import "./App.css"

const BASE_URL = "http://127.0.0.1:8080"

type SortField = "value" | "date"
type SortOrder = "asc" | "desc"

export default function App() {
  const [transactionsResponse, setTransactionsResponse] = useState<TransactionsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [sortField, setSortField] = useState<SortField>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const sortTransactions = (list: Transaction[]) => {
    return [...list].sort((a, b) => {
      let compare = 0

      if (sortField === "value") {
        compare = a.value - b.value
      }

      if (sortField === "date") {
        compare = new Date(a.date).getTime() - new Date(b.date).getTime()
      }

      return sortOrder === "asc" ? compare : -compare
    })
  }

  useEffect(() => {
    const getTransactions = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${BASE_URL}/transacoes`)
        const data = await response.json()
        setTransactionsResponse(data)
      } catch (error) {
        setError('Failed to fetch data.')
      } finally {
        setLoading(false)
      }
    }

    getTransactions()
  }, [])

  return (
    <div className="content">
      <h1>Fluxo Caixa</h1>
      <div className="container">
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {transactionsResponse && (
          <>
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <select onChange={e => setSortField(e.target.value as SortField)}>
                <option value="date">Data</option>
                <option value="value">Valor</option>
              </select>

              <select onChange={e => setSortOrder(e.target.value as SortOrder)}>
                <option value="desc">Decrescente</option>
                <option value="asc">Crescente</option>
              </select>
            </div>

            <table className="sql-table-lookalike">
              <thead>
                <tr>
                  <th>Valor (R$)</th>
                  <th>Descrição</th>
                  <th>Data (AAAA/MM/DD)</th>
                  <th>Tipo</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {sortTransactions([
                  ...transactionsResponse.transacoes.entradas,
                  ...transactionsResponse.transacoes.saidas
                ]).map(tx => <TransactionC tx={tx} />)}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  )
}