"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

type TimerRecord = {
  id: number;
  task_id: number;
  mode: string;
  duration_seconds: number;
  completed_at: Date;
};

const TaskItem = ({
  id,
  title,
  description,
  is_completed,
  onToggleComplete,
  onDelete,
}: {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  onToggleComplete: (id: number) => void;
  onDelete: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [timerRecord, setTimerRecord] = useState<Date>();

  useEffect(() => {
    const getTimerRecord = async () => {
      const response = await axios.get(
        `http://localhost:8000/api/py/timer_records/${id}`,
      );

      setTimerRecord(response.data);
    };
  }, []);
  return (
    <li className="list-row items-center">
      <div
        className={`text-4xl font-thin tabular-nums ${is_completed ? "text-green-300" : "text-orange-300"}`}
      >
        {(id + 1)?.toString().padStart(2, "0")}
      </div>
      <div className="list-col-grow">
        <div
          className={`${is_completed && "line-through"} text-lg font-semibold`}
        >
          {title}
        </div>
        <div className="max-w-50">
          <p className={`text-gray-300 ${open ? "" : "truncate"}`}>
            {description}
          </p>

          <button
            onClick={() => setOpen(!open)}
            className="text-blue-500 text-sm mt-1"
          >
            {open ? "Show less" : "Show more"}
          </button>
        </div>
      </div>
      <fieldset className="fieldset w-64 p-4 flex justify-end">
        <label className="label">
          <input
            type="checkbox"
            className={`checkbox ${is_completed ? "checkbox-success" : "checkbox-warning"}`}
            onChange={() => onToggleComplete(id)}
            checked={is_completed}
          />
          <br />
          <button
            className="bg-red-500 px-4 h-[24px] text-white font-semibold rounded-lg"
            onClick={onDelete}
          >
            Delete
          </button>
        </label>
      </fieldset>
      {/* add a time records to the completed task */}
      {/* the issue with the last deleted task */}
    </li>
  );
};

export default TaskItem;
