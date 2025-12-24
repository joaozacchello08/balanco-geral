import { useEffect, useState } from "react"
import { type TransactionsResponse } from "./models/Transaction"

export default function App() {
  const [transactionsResponse, setTransactionsResponse] = useState<TransactionsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getTransactions = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("http://127.0.0.1:8080/transacoes")
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
          <table className="sql-table-lookalike">
            <thead>
              <tr>
                <th>Valor</th>
                <th>Descrição</th>
                <th>Data</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {[
                ...transactionsResponse.transacoes.entradas,
                ...transactionsResponse.transacoes.saidas
              ].map(tx => (
                <tr key={tx.id}>
                  <td>{tx.value}</td>
                  <td>{tx.description}</td>
                  <td>{tx.date}</td>
                  <td>{tx.t_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}