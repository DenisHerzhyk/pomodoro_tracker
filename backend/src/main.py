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
    if not tasks:
        raise HTTPException(status_code=404, detail="Tasks not found")
    return tasks

#read complete task 
@app.get("/api/py/complete_tasks")
async def read_complete_tasks(session:SessionDep) -> List[Task]:
    tasks = session.exec(select(Task).where(Task.is_completed == True)).all()
    if not tasks:
        raise HTTPException(status_code=404, detail="Tasks not found")
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
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"The task id '{task_id}' was not found")

    task.is_completed = not task.is_completed
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

#update all tasks once timer finished
@app.patch("/api/py/finished_timer")
async def finished_timer(session: SessionDep) -> List[Task]:
    pomodoro_minutes = 25
    tasks = session.exec(select(Task).where(Task.is_completed == False)).all()

    if not tasks:
        raise HTTPException(status_code=404, detail="Tasks not found")
    
    for task in tasks:
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        task.total_work_seconds += pomodoro_minutes
        session.add(task)
        session.commit()
        session.refresh(task)

    return tasks

#update all tasks before switching from pomodoro
@app.patch("/api/py/save_before_switch")
async def save_before_switch(elapsed: int, session:SessionDep) -> List[Task]:
    tasks = session.exec(select(Task).where(Task.is_completed == False)).all()

    if not tasks:
        raise HTTPException(status_code=404, detail="Tasks not found")

    for task in tasks:
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        task.total_work_seconds += elapsed
        session.add(task)
        session.commit()
        session.refresh(task)

    return tasks