import { useEffect, useState, useRef } from "react"
import {
  type TransactionsResponse,
  type Transaction,
  type ISODate,
  type TransactionType,
  type NewTransaction,
  type Registro
} from "./models/Transaction"
import TransactionC from "./component/Transaction"
import "./App.css"

const BASE_URL = "http://127.0.0.1:8080"

type SortField = "value" | "date"
type SortOrder = "asc" | "desc"

export default function App() {
  const [transactionsResponse, setTransactionsResponse] =
    useState<TransactionsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [sortField, setSortField] = useState<SortField>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const [isInserting, setIsInserting] = useState(false)
  const newRow = useRef<Registro>({})
  const newRow_t_type = useRef<TransactionType>("entrada")

  const sortTransactions = (list: Transaction[]) =>
    [...list].sort((a, b) => {
      const compare =
        sortField === "value"
          ? a.value - b.value
          : new Date(a.date).getTime() - new Date(b.date).getTime()

      return sortOrder === "asc" ? compare : -compare
    })

  const submitNewRow = async (r: Registro) => {
    try {
      if (newRow_t_type.current === "entrada") {
        const response = await fetch(`${BASE_URL}/entrada`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(r)
        })
        alert(response.ok ? "Criado com sucesso!" : "Não foi possível criar.")
      } else {
        const response = await fetch(`${BASE_URL}/saida`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(r)
        })
        alert(response.ok ? "Criado com sucesso!" : "Não foi possível criar.")
      }
      window.location.reload()
    } catch {
      alert("Erro de conexão.")
    }
  }

  useEffect(() => {
    const getTransactions = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`${BASE_URL}/transacoes`)
        const data = await response.json()
        setTransactionsResponse(data)
      } catch {
        setError("Failed to fetch data.")
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
              <select
                value={sortField}
                onChange={e => setSortField(e.target.value as SortField)}
              >
                <option value="date">Data</option>
                <option value="value">Valor</option>
              </select>

              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as SortOrder)}
              >
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
                  <th className="actions">
                    <button title="Adicionar" onClick={() => setIsInserting(true)}>
                      ➕
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody>
                {isInserting && (
                  <tr>
                    <td>
                      <input
                        type="number"
                        step={0.01}
                        placeholder="Valor..."
                        onChange={e => {
                          newRow.current.value = Number(
                            Number(e.target.value).toFixed(2)
                          )
                        }}
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        placeholder="Descrição..."
                        onChange={e => {
                          newRow.current.description = e.target.value
                        }}
                      />
                    </td>

                    <td>
                      <input
                        type="date"
                        disabled
                      />
                    </td>

                    <td>
                      <select
                        onChange={e => {
                          newRow_t_type.current =
                            e.target.value as TransactionType
                        }}
                      >
                        <option value="entrada">Entrada</option>
                        <option value="saida">Saida</option>
                      </select>
                    </td>

                    <td className="actions">
                      <button
                        title="Salvar alterações"
                        onClick={() => submitNewRow(newRow.current)}
                      >
                        ✅
                      </button>
                      <button
                        title="Cancelar"
                        onClick={() => setIsInserting(false)}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                )}

                {sortTransactions([
                  ...transactionsResponse.transacoes.entradas,
                  ...transactionsResponse.transacoes.saidas
                ]).map(tx => (
                  <TransactionC key={tx.id} tx={tx} />
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  )
}
