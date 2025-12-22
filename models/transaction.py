from typing import Literal, TypedDict, NotRequired
from pydantic import BaseModel

TransactionType = Literal["entrada", "saida"]

class TransactionUpdate(TypedDict):
    """date -> ISO yyyy-mm-dd"""
    t_type: NotRequired[TransactionType]
    value: NotRequired[float]
    description: NotRequired[str]
    date: NotRequired[str] # ISO yyyy-mm-dd

class Registro(BaseModel):
    value: float
    description: str
    # data = { value: 2.99, description: "tubaina oxxo" }
