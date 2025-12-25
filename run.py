from repositories.transaction_repo import init_db
import uvicorn
from app import app

if __name__ == "__main__":
    init_db()
    uvicorn.run(app, host="127.0.0.1", port=8080)
