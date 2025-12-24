import http.server
import socketserver
import uvicorn
from app import app
from repositories.transaction_repo import init_db
from pathlib import Path
import webbrowser
import threading

def run_static_server(PORT: int):
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"Static files: http://127.0.0.1:{PORT}/dist/index.html")
        httpd.serve_forever()

def run_api(PORT: int):
    uvicorn.run(app, host="127.0.0.1", port=PORT, log_level="debug")

if __name__ == "__main__":
    init_db()

    # react
    path = Path("dist/index.html").resolve()
    webbrowser.open(path.as_uri())

    t1 = threading.Thread(target=run_static_server(8000), daemon=True)
    t2 = threading.Thread(target=run_api())

    t1.start()
    t2.start()

    t2.join() # keep process alive
