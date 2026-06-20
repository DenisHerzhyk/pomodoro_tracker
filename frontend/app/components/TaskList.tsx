"use client";

import React, { useEffect, useRef, useState } from "react";
import TaskItem from "./task/TaskItem";
import { CirclePlus } from "lucide-react";
import axios from "axios";

const TaskList = () => {
  const [clicked, setClicked] = useState(false);
  const [taskTitle, setTaskTitle] = useState<string | null>(null);
  const [taskNote, setTaskNote] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!clicked) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (heroRef.current && !heroRef.current.contains(event.target as Node)) {
        setClicked(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clicked]);

  const handleTaskCreate = async () => {
    if (!taskTitle) return;
    try {
      const response = await axios.post(
        "http://localhost:8000/api/py/task",
        {
          title: taskTitle,
          description: taskNote,
          is_completed: true,
          total_work_seconds: 0,
        },
        { withCredentials: true },
      );

      console.log("Task created:", response.data);
      setClicked(false);
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const currentTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/py/task", {
        withCredentials: true,
      });
      console.log("Tasks received:", response.data);
    } catch (err) {
      console.error("Failed to receive tasks:", err);
    }
  };
  return (
    <div className="mt-20">
      <div className="in-progress">
        <h2>Tasks in progress</h2>
        <ul className="list bg-gray-700 rounded-box shadow-md flex flex-col gap-3 mt-5">
          <TaskItem />
        </ul>
        {clicked ? (
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
                      onClick={handleTaskCreate}
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
            onClick={() => setClicked(true)}
          >
            <CirclePlus />
            Add Task
          </button>
        )}
      </div>

      <div className="done-tasks mt-10">
        <h2>Completed tasks</h2>
        <ul className="list bg-gray-700 rounded-box shadow-md flex flex-col gap-3 mt-5">
          <TaskItem />
        </ul>
      </div>

      <button onClick={currentTasks} className="btn btn-secondary">
        Show Tasks in log
      </button>
    </div>
  );
};

export default TaskList;
