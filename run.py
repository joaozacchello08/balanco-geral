import uvicorn
from repositories.transaction_repo import init_db
from app import app
import webbrowser

if __name__ == "__main__":
    init_db()
    port = 8080
    uvicorn.run(app, port=port, log_level="debug")
