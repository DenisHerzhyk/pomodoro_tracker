# run server : uvicorn src.main:app --reload
from fastapi import FastAPI

app = FastAPI(docs_url="/api/py/docs")


@app.get("/api/py/task")
async def read_task() -> tuple[str, str]:
    return ("Hello", "pet project")
