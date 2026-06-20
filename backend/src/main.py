# run server : uvicorn src.main:app --reload
from fastapi import FastAPI
from sqlmodel import select
from .dependency import SessionDep
from .models import Task
from typing import List
from .db import create_db_and_tables 
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(docs_url="/api/py/docs")

#cors 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers={"*"}
)
#create table
@app.on_event("startup")
async def on_startup():
    return create_db_and_tables()


#read task
@app.get("/api/py/task")
async def read_tasks(session: SessionDep) -> List[Task]:
    tasks = session.exec(select(Task)).all()
    return tasks

#create task
@app.post("/api/py/task")
async def create_task(task: Task, session: SessionDep) -> Task:
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


# @app.post("/api/py/task/{task.id}")
# async def create_task():
#     return "POST"


# @app.post("/api/py/push_record/{timer.id}")
# async def push_timer_record():
#     return "POST"
