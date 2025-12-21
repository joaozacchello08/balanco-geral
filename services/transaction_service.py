from models.transaction import TransactionUpdate
from repositories import transaction_repo as repo

def registrar_entrada(value: float, description: str):
    if value <= 0:
        raise ValueError("value inválido")
    repo.create("entrada", value, description)

def registrar_saida(value: float, description: str):
    if value <= 0:
        raise ValueError("value inválido")
    repo.create("saida", value, description)

def atualizar(t_id: int, updates: TransactionUpdate):
    repo.update(t_id, updates)

def apagar(t_id: int):
    repo.delete(t_id)
