import { type ISODate, type Transaction, type TransactionUpdate, type TransactionType } from "../models/Transaction"
import { useState, useRef } from "react"

type Props = {
    tx: Transaction
}

type Action = "editing" | "deleting" | "default"

const BASE_URL = "http://127.0.0.1:8080"

export default function TransactionC({ tx }: Props) {
    const [action, setAction] = useState<Action>("default")
    const updates = useRef<TransactionUpdate>({})

    const updateRow = async (t_id: number, u: TransactionUpdate) => {
        try {
            const response = await fetch(`${BASE_URL}/${t_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(u)
            })

            alert(response.ok ? "Atualizado com sucesso!" : "Não foi possível atualizar.")
            window.location.reload()
        } catch {
            alert("Erro de conexão.")
        }
    }

    const deleteRow = async (t_id: number) => {
        try {
            const response = await fetch(`${BASE_URL}/t/${t_id}`, { method: "DELETE" })

            alert(response.ok ? "Apagado com sucesso!" : "Não foi possível apagar.")
            window.location.reload()
        } catch {
            alert("Erro de conexão.")
        }
    }

    function renderContent() {
        if (action === "default") {
            return (
                <tr key={tx.id}>
                    <td>{tx.value}</td>
                    <td>{tx.description}</td>
                    <td>{tx.date}</td>
                    <td>{tx.t_type}</td>
                    <td className="actions">
                        <button title="Editar" onClick={() => setAction("editing")}>✏️</button>
                        <button title="Apagar" onClick={() => setAction("deleting")}>🗑️</button>
                    </td>
                </tr>
            )
        }

        if (action === "editing") {
            return (
                <tr key={tx.id}>
                    <td>
                        <input
                            type="number"
                            defaultValue={tx.value}
                            step="0.01"
                            onChange={e => {
                                updates.current.value = Number(e.target.value)
                            }}
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            defaultValue={tx.description}
                            onChange={e => {
                                updates.current.description = e.target.value
                            }}
                        />
                    </td>
                    <td>
                        <input 
                            type="date"
                            defaultValue={tx.date}
                            onChange={e => {
                                updates.current.date = e.target.value as ISODate
                            }}
                        />
                    </td>
                    <td>
                        <select defaultValue={tx.t_type} onChange={e => {
                            updates.current.t_type = e.target.value as TransactionType
                        }}>
                            <option value="entrada">Entrada</option>
                            <option value="saida">Saida</option>
                        </select>
                    </td>
                    <td className="actions">
                        <button
                            title="Salvar alterações"
                            onClick={() => updateRow(tx.id, updates.current)}
                        >
                            ✅
                        </button>
                        <button title="Cancelar" onClick={() => setAction("default")}>❌</button>
                    </td>
                </tr>
            )
        }

        if (action === "deleting") {
            return (
                <tr key={tx.id}>
                    <td>{tx.value}</td>
                    <td>{tx.description}</td>
                    <td>{tx.date}</td>
                    <td>{tx.t_type}</td>
                    <td className="actions">
                        <button title="Confirmar" onClick={() => deleteRow(tx.id)}>✅</button>
                        <button title="Cancelar" onClick={() => setAction("default")}>❌</button>
                    </td>
                </tr>
            )
        }

        return null
    }

    return renderContent()
}
