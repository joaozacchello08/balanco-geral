import uvicorn
from repositories.transaction_repo import init_db
from app import app

if __name__ == "__main__":
    init_db()
    uvicorn.run(app, port=8080, log_level="debug")
    
