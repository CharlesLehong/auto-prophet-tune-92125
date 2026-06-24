from fastapi import FastAPI

app = FastAPI(title="Forecast Service")


@app.get("/health")
def health():
    return {"status": "ok"}
