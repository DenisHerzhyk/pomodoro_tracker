# run server : uvicorn src.main:app --reload
from typing import List

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import select

from .db import create_db_and_tables
from .dependency import SessionDep
from .models import Task, TimerRecord

app = FastAPI(docs_url="/api/py/docs")

# cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# create table
@app.on_event("startup")
async def on_startup():
    return create_db_and_tables()


# read incomplete task
@app.get("/api/py/incomplete_tasks")
async def read_incomplete_tasks(session: SessionDep) -> List[Task]:
    tasks = session.exec(select(Task).where(Task.is_completed == False)).all()
    return tasks


# read complete task
@app.get("/api/py/complete_tasks")
async def read_complete_tasks(session: SessionDep) -> List[Task]:
    tasks = session.exec(select(Task).where(Task.is_completed == True)).all()
    return tasks


# get task
@app.get("/api/py/task/{task_id}")
async def find_task(task_id: int, session: SessionDep) -> Task:
    task = session.get(Task, task_id)
    if not task:
        HTTPException(
            status_code=404, detail=f"Task '${task_id}' was not found"
        )

    return task


# delete task
@app.delete("/api/py/task/{task_id}")
async def delete_task(task_id: int, session: SessionDep) -> dict[str, bool]:
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=404, detail=f"Task '${task_id}' was not found"
        )

    records = session.exec(
        select(TimerRecord).where(TimerRecord.task_id == task_id)
    ).all()

    for record in records:
        session.delete(record)

    session.delete(task)
    session.commit()
    return {"ok": True}


# create task
@app.post("/api/py/task")
async def create_task(task: Task, session: SessionDep) -> Task:
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


# toggle task
@app.patch("/api/py/task/{task_id}")
async def toggle_task(
    task_id: int,
    session: SessionDep,
    totalSeconds: int = Query(default=0),
    mode: str = Query(default=""),
) -> dict:
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=404, detail=f"The task id '{task_id}' was not found"
        )

    was_incomplete = not task.is_completed
    task.is_completed = not task.is_completed
    session.add(task)

    tr = None
    if was_incomplete and totalSeconds > 0 and mode:
        tr = TimerRecord(
            task_id=task_id, mode=mode, duration_seconds=totalSeconds
        )
        session.add(tr)

    session.commit()
    session.refresh(task)
    if tr:
        session.refresh(tr)

    return {"task": task, "timer_record": tr}


@app.get("/api/py/timer_records/{task_id}")
async def get_timer_records(
    task_id: int, session: SessionDep
) -> List[TimerRecord]:
    timer_records = session.exec(
        select(TimerRecord).where(TimerRecord.task_id == task_id)
    ).all()
    return timer_records
