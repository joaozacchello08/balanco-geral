from typing import Literal, TypedDict, NotRequired

TransactionType = Literal["entrada", "saida"]

class TransactionUpdate(TypedDict):
    t_type: NotRequired[TransactionType]
    value: NotRequired[float]
    description: NotRequired[str]
    date: NotRequired[str] # ISO yyyy-mm-dd
