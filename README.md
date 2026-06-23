# Pomodoro Tracker

A full-stack Pomodoro technique application built with Next.js (frontend) and FastAPI (backend) to help users manage their time and tasks effectively.

## Features

- **Pomodoro Timer**: Customizable timer for work sessions, short breaks, and long breaks
- **Task Management**: Create, complete, and delete tasks with descriptions
- **Time Tracking**: Records time spent on each task with timestamps
- **Visual Feedback**: Clear visual indication of timer status and mode
- **Task Organization**: Separate views for active and completed tasks
- **Persistent Storage**: SQLite database for persistent data storage

## Tech Stack

### Frontend
- **Next.js 13+** (App Router)
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Axios** for HTTP requests
- **Lucide React** for icons

### Backend
- **FastAPI** - Modern, fast web framework for Python
- **SQLModel** - SQL database modeling library
- **SQLite** - Lightweight relational database
- **Uvicorn** - ASGI server

### DevOps
- **Poetry** - Python dependency management
- **pnpm** - Fast Node.js package manager
- **ESLint** - JavaScript/TypeScript linting

## Project Structure

```
my-app/
├── backend/
│   ├── src/
│   │   ├── main.py          # FastAPI application entry point
│   │   ├── models.py        # Database models (Task, TimerRecord)
│   │   ├── db.py            # Database initialization
│   │   └── dependency.py    # Dependency injection
│   ├── database.db          # SQLite database
│   ├── pyproject.toml       # Poetry configuration
│   └── poetry.lock          # Poetry lock file
└── frontend/
    ├── app/
    │   ├── layout.tsx       # Root layout
    │   ├── page.tsx         # Home page
    │   └── components/      # React components
    │       ├── Timer.tsx    # Pomodoro timer component
    │       ├── TaskList.tsx # Task management component
    │       └── task/        # Task-related components and services
    ├── public/              # Static assets
    └── package.json         # Node.js dependencies
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm
- Python (v3.8+)
- Poetry

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
poetry install
```

3. Activate the virtual environment:
```bash
poetry shell
```

4. Start the development server:
```bash
uvicorn src.main:app --reload
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Tasks
- `GET /api/py/incomplete_tasks` - Get all incomplete tasks
- `GET /api/py/complete_tasks` - Get all completed tasks
- `GET /api/py/task/{task_id}` - Get a specific task by ID
- `POST /api/py/task` - Create a new task
- `PATCH /api/py/task/{task_id}` - Toggle task completion status and record timer data
- `DELETE /api/py/task/{task_id}` - Delete a task
- `GET /api/py/timer_records/{task_id}` - Get timer records for a specific task

## Features in Detail

### Timer Functionality
- Three timer modes: Pomodoro (25 min), Short Break (5 min), Long Break (15 min)
- Start/Stop/Restart controls
- Visual countdown display
- Automatic mode switching when timer completes

### Task Management
- Create tasks with titles and optional descriptions
- Mark tasks as complete/incomplete
- Delete tasks
- Visual separation of active and completed tasks
- Automatic time tracking when tasks are completed

### Data Persistence
- SQLite database stores all tasks and timer records
- Automatic database initialization on startup
- Persistent storage across application restarts

## Development Notes

### Backend
- Uses FastAPI with automatic OpenAPI documentation (available at `/api/py/docs`)
- CORS configured to allow requests from `http://localhost:3000`
- Database models defined with SQLModel
- Dependency injection for database sessions

### Frontend
- Uses Next.js 13+ App Router with server components
- Client components for interactive elements (timer, task management)
- State management with React hooks
- Axios for API communication with credentials included for session handling
- Tailwind CSS for responsive, utility-first styling

## Learning Objectives

This project was created to learn:
1. Full-stack application architecture
2. Frontend-backend communication patterns
3. State management in React applications
4. RESTful API design with FastAPI
5. Database modeling and ORM usage with SQLModel
6. State persistence strategies
7. Real-time UI updates based on backend data
8. Modern development tooling (Poetry, pnpm, Next.js 13+)

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Data visualization/dashboard for productivity analytics
- [ ] Customizable timer durations
- [ ] Sound notifications for timer completion
- [ ] Dark/Light theme toggle
- [ ] Mobile-responsive design improvements
- [ ] Unit and integration testing
- [ ] Docker containerization
- [ ] Deployment configuration (AWS, Vercel, etc.)

## License

This project is for educational purposes as part of a full-stack development learning journey.

---

Built with ❤️ for learning full-stack development