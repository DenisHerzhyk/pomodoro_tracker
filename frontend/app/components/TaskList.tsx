"use client";

import React, { useEffect, useRef, useState } from "react";
import TaskItem from "./task/TaskItem";
import { CirclePlus } from "lucide-react";

const TaskList = () => {
  const [clicked, setClicked] = useState(false);
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
                    />
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Notes</legend>
                    <textarea
                      className="textarea h-24 w-full bg-gray-600"
                      placeholder="Task Notes..."
                    ></textarea>
                    <div className="label">Optional</div>
                  </fieldset>
                  <div className="buttons flex flex-row gap-3 justify-end mt-5">
                    <button className="btn btn-outline">Cancel</button>
                    <button className="btn btn-outline btn-success">
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
    </div>
  );
};

export default TaskList;
