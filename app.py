#region imports
from fastapi import FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse
from typing import Annotated
from services.transaction_service import (
    registrar_entrada,
    registrar_saida,
    ver_balanço,
    atualizar,
    apagar,
    ver_transacoes
)
import os
from repositories.transaction_repo import init_db, drop_table_main_table
from pydantic import BaseModel
from models.transaction import TransactionUpdate, Registro
#endregion

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#region ui setup
files = {
    "index.html": "pages/index.html",
    "favicon.ico": "pages/assets/favicon.ico",
    "testing.html": "pages/testing.html"
}

@app.get("/", response_class=HTMLResponse)
def root(): # /index.html
    with open(files["index.html"], "r") as f:
        html = f.read()
    return html

@app.get("/testing", response_class=HTMLResponse)
def testing():
    with open(files["testing.html"], "r") as f:
        html = f.read()
    return html

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse(files["favicon.ico"])
#endregion

#region get
@app.get("/transacoes")
def get_transacoes():
    transacoes = ver_transacoes()
    return { "transacoes": transacoes }

@app.get("/balanco")
def get_balanco():
    balanco = ver_balanço()
    return { "balanco": balanco }
#endregion

#region delete
@app.delete("/db")
def delete_db():
    try:
        drop_table_main_table()
        init_db()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Não foi possível dropar a table. Erro: {str(e)}")

@app.delete("/t/{t_id}")
def delete_registro(t_id: int):
    try:
        apagar(t_id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Não foi possível apagar registro. Erro: {str(e)}")
#endregion

#region post
@app.post("/entrada")
def entrada(data: Registro):
    try:
        registrar_entrada(data.value, data.description)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Não foi possível registrar entrada. Erro: {str(e)}")

@app.post("/saida")
def saida(data: Registro):
    try:
        registrar_saida(data.value, data.description)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Não foi possível registrar saída. Erro: {str(e)}")
#endregion

#region put
@app.put("/{t_id}")
def atualizar_registro(t_id: int, updates: TransactionUpdate):
    try:
        atualizar(t_id, updates)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Não foi possível atualizar um registro. Erro: {str(e)}")
#endregion
