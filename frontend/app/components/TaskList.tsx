"use client";

import { toast } from "react-toastify";
import React, { useEffect, useRef, useState } from "react";
import TaskItem from "./task/TaskItem";
import { CirclePlus } from "lucide-react";
import axios from "axios";
import { handleTaskCreate } from "./services/task/taskCreateService";
import { getAllCreatedTasks } from "./services/task/getAllIncompleteTasksService";
import { getAllCompleteTasks } from "./services/task/getAllCompleteTasksService";
import { handleTaskDelete } from "./services/task/taskDeleteService";

const TaskList = ({
  onWorkSecondsUpdate,
  onBreakSecondsUpdate,
  onReset,
  totalSeconds,
  mode,
}) => {
  const [expandDescr, setExpandDesk] = useState(false);
  const [incompTasks, setIncompTasks] = useState([]);
  const [compTasks, setCompTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState<string | null>(null);
  const [taskNote, setTaskNote] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const toggleInProgressRef = useRef(false);

  useEffect(() => {
    if (!expandDescr) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (heroRef.current && !heroRef.current.contains(event.target as Node)) {
        setExpandDesk(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expandDescr]);

  useEffect(() => {
    getAllCreatedTasks(setIncompTasks);
    getAllCompleteTasks(setCompTasks);
  }, []);

  const handleToggleComplete = async (
    id: number,
    isCurrentlyCompleted: boolean,
  ) => {
    if (toggleInProgressRef.current) {
      return;
    }
    toggleInProgressRef.current = true;

    try {
      if (!isCurrentlyCompleted && (totalSeconds === 0 || !mode)) {
        toast.error("Start Pomodoro before completing task");
        return;
      }

      await axios.patch(`http://localhost:8000/api/py/task/${id}`, null, {
        params: {
          totalSeconds,
          mode,
        },
        withCredentials: true,
      });
      onWorkSecondsUpdate(0);
      onBreakSecondsUpdate(0);
      getAllCreatedTasks(setIncompTasks);
      getAllCompleteTasks(setCompTasks);
    } catch (err) {
      console.error("Failed to find or update the task: ", err);
    } finally {
      toggleInProgressRef.current = false;
    }
  };

  return (
    <div className="mt-20">
      <div className="in-progress">
        <h2>Tasks in progress</h2>
        <ul className="list bg-gray-700 rounded-box shadow-md flex flex-col gap-3 mt-5">
          {incompTasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              is_completed={task.is_completed}
              onToggleComplete={handleToggleComplete}
              onDelete={() =>
                handleTaskDelete(task.id, setIncompTasks, setCompTasks)
              }
            />
          ))}
        </ul>
        {expandDescr ? (
          <div className="hero mt-10" ref={heroRef}>
            <div className=" flex-col lg:flex-row-reverse w-full">
              <div className="card bg-gray-700 w-full ">
                <div className="card-body flex flex-col gap-5">
                  <fieldset className="fieldset">
                    <input
                      type="text"
                      className="input w-full bg-gray-600"
                      placeholder="What are you working on?"
                      required
                      onChange={(e) => setTaskTitle(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Notes</legend>
                    <textarea
                      className="textarea h-24 w-full bg-gray-600"
                      placeholder="Task Notes..."
                      onChange={(e) => setTaskNote(e.target.value)}
                    ></textarea>
                    <div className="label">Optional</div>
                  </fieldset>
                  <div className="buttons flex flex-row gap-3 justify-end mt-5">
                    <button className="btn btn-outline">Cancel</button>
                    <button
                      className="btn btn-outline btn-success"
                      onClick={() =>
                        handleTaskCreate(
                          taskTitle,
                          taskNote,
                          setExpandDesk,
                          setIncompTasks,
                          setCompTasks,
                        )
                      }
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            className="btn btn-dash btn-warning py-7 w-full mt-10"
            onClick={() => setExpandDesk(true)}
          >
            <CirclePlus />
            Add Task
          </button>
        )}
      </div>

      <div className="done-tasks mt-10">
        <h2>Completed tasks</h2>
        <ul className="list bg-gray-700 rounded-box shadow-md flex flex-col gap-3 mt-5">
          {compTasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              is_completed={task.is_completed}
              onToggleComplete={handleToggleComplete}
              onDelete={() =>
                handleTaskDelete(task.id, setIncompTasks, setCompTasks)
              }
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskList;
