from fastapi import FastAPI

app = FastAPI(title="Portfolio Backend")

@app.get("/")
async def root():
    return {"message": "Portfolio API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
