// App.tsx
import { useEffect, useState, useRef } from "react"
import {
  type TransactionsResponse,
  type Transaction,
  type TransactionType,
  type Registro
} from "./models/Transaction"
import TransactionC from "./component/Transaction"
import "./App.css"

const BASE_URL = "http://127.0.0.1:8080"

type SortField = "value" | "date"
type SortOrder = "asc" | "desc"

export default function App() {
  const [data, setData] = useState<TransactionsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const [eField, setEField] = useState<SortField>("date")
  const [eOrder, setEOrder] = useState<SortOrder>("desc")

  const [sField, setSField] = useState<SortField>("date")
  const [sOrder, setSOrder] = useState<SortOrder>("desc")

  const [insertEntrada, setInsertEntrada] = useState(false)
  const [insertSaida, setInsertSaida] = useState(false)

  const newEntrada = useRef<Registro>({
    value: 0,
    description: ""
  })

  const newSaida = useRef<Registro>({
    value: 0,
    description: ""
  })


  const sortList = (
    list: Transaction[],
    field: SortField,
    order: SortOrder
  ) =>
    [...list].sort((a, b) => {
      const cmp =
        field === "value"
          ? a.value - b.value
          : new Date(a.date).getTime() - new Date(b.date).getTime()
      return order === "asc" ? cmp : -cmp
    })

  const submit = async (r: Registro, type: TransactionType) => {
    await fetch(`${BASE_URL}/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(r)
    })
    window.location.reload()
  }

  useEffect(() => {
    fetch(`${BASE_URL}/transacoes`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>
  if (!data) return <p>Erro</p>

  const entradas = sortList(data.transacoes.entradas, eField, eOrder)
  const saidas = sortList(data.transacoes.saidas, sField, sOrder)

  const totalEntradas = entradas.reduce((acc, t) => acc + t.value, 0)
  const totalSaidas = saidas.reduce((acc, t) => acc + t.value, 0)
  const balancoGeral = totalEntradas - totalSaidas

  return (
    <div className="content">
      <h1>Fluxo Caixa</h1>

      <div className="tables-wrapper">
        {/* ENTRADAS */}
        <table className="sql-table-lookalike">
          <thead>
            <tr>
              <th colSpan={5}>
                ENTRADAS - TOTAL R$ {totalEntradas.toFixed(2)}
              </th>
            </tr>
            <tr>
              <th>Valor</th>
              <th>Descrição</th>
              <th>Data</th>
              <th>
                <select onChange={e => setEField(e.target.value as SortField)}>
                  <option value="date">Data</option>
                  <option value="value">Valor</option>
                </select>
              </th>
              <th>
                <select onChange={e => setEOrder(e.target.value as SortOrder)}>
                  <option value="desc">↓</option>
                  <option value="asc">↑</option>
                </select>
                <button onClick={() => setInsertEntrada(true)}>➕</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {insertEntrada && (
              <tr>
                <td>
                  <input type="number" step={0.01}
                    onChange={e =>
                      (newEntrada.current.value = Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    onChange={e =>
                      (newEntrada.current.description = e.target.value)
                    }
                  />
                </td>
                <td><input type="date" disabled /></td>
                <td colSpan={2}>
                  <button onClick={() => submit(newEntrada.current, "entrada")}>✅</button>
                  <button onClick={() => setInsertEntrada(false)}>❌</button>
                </td>
              </tr>
            )}
            {entradas.map(tx => <TransactionC key={tx.id} tx={tx} />)}
          </tbody>
        </table>

        {/* SAÍDAS */}
        <table className="sql-table-lookalike">
          <thead>
            <tr>
              <th colSpan={5}>
                SAÍDAS - TOTAL R$ {totalSaidas.toFixed(2)}
              </th>
            </tr>
            <tr>
              <th>Valor</th>
              <th>Descrição</th>
              <th>Data</th>
              <th>
                <select onChange={e => setSField(e.target.value as SortField)}>
                  <option value="date">Data</option>
                  <option value="value">Valor</option>
                </select>
              </th>
              <th>
                <select onChange={e => setSOrder(e.target.value as SortOrder)}>
                  <option value="desc">↓</option>
                  <option value="asc">↑</option>
                </select>
                <button onClick={() => setInsertSaida(true)}>➕</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {insertSaida && (
              <tr>
                <td>
                  <input type="number" step={0.01}
                    onChange={e =>
                      (newSaida.current.value = Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    onChange={e =>
                      (newSaida.current.description = e.target.value)
                    }
                  />
                </td>
                <td><input type="date" disabled /></td>
                <td colSpan={2}>
                  <button onClick={() => submit(newSaida.current, "saida")}>✅</button>
                  <button onClick={() => setInsertSaida(false)}>❌</button>
                </td>
              </tr>
            )}
            {saidas.map(tx => <TransactionC key={tx.id} tx={tx} />)}
          </tbody>
        </table>
      </div>

      {/* BALANÇO GERAL */}
      <h2 className="balance">
        BALANÇO GERAL – R$ {balancoGeral.toFixed(2)}
      </h2>
    </div>
  )
}
