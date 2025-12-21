from datetime import date
from db.database import get_connection
from models.transaction import TransactionType, TransactionUpdate

def init_db() -> None:
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                value INTEGER NOT NULL,
                description TEXT NOT NULL,
                date TEXT NOT NULL,
                t_type TEXT NOT NULL
            )
        """)

def create(t_type: TransactionType, value: int, description: str, date_str: str | None = None) -> None:
    if date_str is None:
        date_str = date.today().isoformat()
    
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO transactions (value, description, date, t_type) VALUES (?, ?, ?, ?)",
            (value, description, date_str, t_type)
        )

def delete(t_id: int) -> None:
    with get_connection() as conn:
        conn.execute("DELETE FROM transactions WHERE id = ?", (t_id,))

def update(t_id: int, updates: TransactionUpdate) -> None:
    if not updates:
        pass

    fields = ", ".join(f"{k} = ?" for k in updates)
    values = list(updates.values()) + [t_id]

    with get_connection() as conn:
        conn.execute(
            f"UPDATE transactions SET {fields} WHERE id = ?",
            values
        )
