# run server : uvicorn src.main:app --reload
from fastapi import FastAPI, HTTPException
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


#read incomplete task
@app.get("/api/py/incomplete_tasks")
async def read_incomplete_tasks(session: SessionDep) -> List[Task]:
    tasks = session.exec(select(Task).where(Task.is_completed == False)).all()
    return tasks

#read complete task 
@app.get("/api/py/complete_tasks")
async def read_complete_tasks(session:SessionDep) -> List[Task]:
    tasks = session.exec(select(Task).where(Task.is_completed == True)).all()
    return tasks

#get task 
@app.get("/api/py/task/{task_id}")
async def find_task(task_id: int, session: SessionDep) -> Task:
    task = session.get(Task, task_id)
    if not task:
        HTTPException(status_code=404, detail=f"Task '${task_id}' was not found")

    return task

#delete task
@app.delete("/api/py/task/{task_id}")
async def delete_task(task_id: int, session: SessionDep) -> dict[str, bool]:
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task '${task_id}' was not found")
    
    session.delete(task)
    session.commit()
    return {"ok": True}

#create task
@app.post("/api/py/task")
async def create_task(task: Task, session: SessionDep) -> Task:
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

#toggle task
@app.patch("/api/py/task/{task_id}")
async def toggle_task(task_id: int, session: SessionDep) -> Task:
    print("WE ARE IN PATCH")
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"The task id '{task_id}' was not found")

    task.is_completed = not task.is_completed
    session.add(task)
    session.commit()
    session.refresh(task)
    print("FINISHED THE PATCH")
    return task

# @app.post("/api/py/task/{task.id}")
# async def create_task():
#     return "POST"


# @app.post("/api/py/push_record/{timer.id}")
# async def push_timer_record():
#     return "POST"
