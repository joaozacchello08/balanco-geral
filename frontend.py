from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn

app = FastAPI()

@app.get("/api/health")
def health():
    return { "ok": True }

app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

@app.get("/")
def index():
    return FileResponse("dist/index.html")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5200)
