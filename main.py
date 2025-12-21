from repositories.transaction_repo import init_db
from services.transaction_service import registrar_entrada

if __name__ == "__main__":
    init_db()
    registrar_entrada(5000, "salário")
