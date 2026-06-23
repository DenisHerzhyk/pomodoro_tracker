from datetime import datetime

from sqlmodel import Field, SQLModel


class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    description: str
    is_completed: bool = False


class TimerRecord(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    task_id: int | None = Field(default=None, foreign_key="task.id")
    mode: str
    duration_seconds: int
    completed_at: datetime = Field(default_factory=datetime.utcnow)
