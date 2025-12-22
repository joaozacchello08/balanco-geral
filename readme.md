# Fluxo Caixa

Este projeto tem como objetivo **registrar todo e qualquer fluxo de dinheiro em uma conta corrente**, permitindo o **melhor gerenciamento do dinheiro** de forma **direta ao ponto, simples e rápida**.

A aplicação foi desenvolvida utilizando **SQLite** e **FastAPI**.
Seu foco é **administrar o fluxo de caixa**, garantindo **controle sobre os gastos**.

## 🚀 Tecnologias
- Python3
- SQLite
- FastAPI

## 📦 Instalação
```bash
git clone https://github.com/joaozacchello08/balanco-geral.git
cd balanco-geral
pip install -r requirements.txt
```
Ou, usando um ambiente virtual própio para o projeto
```bash
git clone https://github.com/joaozacchello08/balanco-geral.git
cd balanco-geral
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

## ▶️ Uso
```bash
python run.py
```

## 📂 Estrutura
```
balanco-geral/
├── assets/
│   └── favicon.ico
├── db/
│   ├── database.py
│   └── default.db           # Gerada automaticamente na primeira execução
├── media/
│   └── image.png
├── models/
│   └── transaction.py
├── pages/
│   ├── index.html
│   └── testing.html
├── repositories/
│   └── transaction_repo.py
├── services/
│   └── transaction_service.py
├── .gitignore
├── app.py
├── config.py
├── readme.md
├── requirements.txt
└── run.py
```

## 🧪 Testes
Abrindo ```http://127.0.0.1:8080/testing``` você tem acesso a um painel de teste das rotas da API.
![Painel de Teste das Rotas da API](/media/image.png)

## ⚙️ Configuração
Em ```config.py```, você pode escolher outro diretório para o aplicativo criar o arquivo da base de dados. O default é ```db/default.db```.
```py
DB_PATH = "db/default.db"
```
