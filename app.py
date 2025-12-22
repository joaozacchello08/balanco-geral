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

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

files = {
    "index.html": "pages/index.html",
    "favicon.ico": "pages/assets/favicon.ico"
}

@app.get("/", response_class=HTMLResponse)
def root(): # /index.html
    with open(files["index.html"], "r") as f:
        html = f.read()
    return html

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse(files["favicon.ico"])

@app.get("/transacoes")
def get_transacoes():
    transacoes = ver_transacoes()
    return { "transacoes": transacoes }

@app.get("/balanco")
def get_balanco():
    balanco = ver_balanço()
    return { "balanco": balanco }

@app.delete("/db")
def delete_db(user_sure: Annotated[bool | None, Header(alias="X-User-Sure")] = None):
    if user_sure is not True:
        raise HTTPException(status_code=status.HTTP_412_PRECONDITION_FAILED, detail="User was NOT sure.")
    
    try:
        drop_table_main_table()
        init_db()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Não foi possível dropar a table. Erro: {str(e)}")
