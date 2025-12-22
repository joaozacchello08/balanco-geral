import uvicorn
from repositories.transaction_repo import init_db
from app import app
import webbrowser

if __name__ == "__main__":
    init_db()
    port = 8080
    # webbrowser.open(f"http://127.0.0.1:{port}")
    uvicorn.run(app, port=port, log_level="debug")
