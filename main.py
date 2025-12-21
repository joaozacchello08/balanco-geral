from repositories.transaction_repo import init_db
from services.transaction_service import (
    registrar_entrada,
    registrar_saida,
    apagar,
    atualizar,
    ver_balanço
)

def read_float(msg: str) -> float:
    return float(input(msg).strip())

def read_int(msg: str) -> int:
    return int(input(msg).strip())

def read_str(msg: str) -> str:
    return input(msg).strip()

if __name__ == "__main__":
    init_db()

    while True:
        action = input(
            "\nAção:\n"
            "[e] entrada\n"
            "[s] saída\n"
            "[d] deletar\n"
            "[u] atualizar\n"
            "[r] ver balanço\n"
            "[q] sair\n> "
        ).strip().lower()

        if action == "q":
            break

        try:
            if action == "e":
                value = read_float("Valor: ")
                desc = read_str("Descrição: ")
                registrar_entrada(value, desc)

            elif action == "s":
                value = read_float("Valor: ")
                desc = read_str("Descrição: ")
                registrar_saida(value, desc)

            elif action == "d":
                t_id = read_int("ID do registro: ")
                apagar(t_id)

            elif action == "u":
                t_id = read_int("ID do registro: ")
                updates = {}

                if input("Atualizar valor? (y/n): ").lower() == "y":
                    updates["value"] = read_float("Novo valor: ")

                if input("Atualizar descrição? (y/n): ").lower() == "y":
                    updates["description"] = read_str("Nova descrição: ")

                if input("Atualizar tipo? (y/n): ").lower() == "y":
                    updates["t_type"] = read_str("entrada/saida: ")

                if input("Atualizar data? (y/n): ").lower() == "y":
                    updates["date"] = read_str("Data (YYYY-MM-DD): ")

                atualizar(t_id, updates)
            
            elif action == "r":
                saldo = ver_balanço()
                print(f"Saldo geral: R$ {saldo}")

            else:
                print("Ação inválida.")

        except Exception as e:
            print(f"Erro: {e}")
