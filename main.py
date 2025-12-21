import sqlite3
from typing import Literal
from datetime import date

conn = sqlite3.connect('db/test.db')
cur = conn.cursor()

def start_db() -> None:
    cur.execute('''
        CREATE TABLE IF NOT EXISTS main(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            value FLOAT NOT NULL,
            description TEXT NOT NULL,
            date TEXT NOT NULL,
            type TEXT NOT NULL
        )
    ''') # date -> "DD/MM/YYYY"
         # type -> "entrada" or "saida"
    conn.commit()

def registrar(type: Literal["entrada", "saida"], value: float, description: str, date: str = date.today().strftime("%d/%m/%Y")) -> None:
    try:
        cur.execute('''
            INSERT INTO main (value, description, date, type)
            VALUES (?, ?, ?, ?)
        ''', (value, description, date, type))
        conn.commit()
    except Exception as e:
        print(f"Erro tentando registrar {type}: {str(e)}")

if __name__ == "__main__":
    start_db()
    
