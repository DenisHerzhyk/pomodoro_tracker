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
  onToggleComplete: (id: number, isCurrentlyCompleted: boolean) => void;
  onDelete: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [timersRecord, setTimersRecord] = useState<TimerRecord[]>();
  const [calcTimer, setCalcTimer] = useState(0);
  const [calcBreakTime, setCalcBreakTime] = useState(0);

  useEffect(() => {
    const getTimerRecord = async () => {
      const response = await axios.get(
        `http://localhost:8000/api/py/timer_records/${id}`,
        { withCredentials: true },
      );
      const records: TimerRecord[] = response.data;
      setTimersRecord(records);

      const pomodoro = records
        .filter((tr) => tr.mode === "pomodoro")
        .reduce((sum, tr) => sum + tr.duration_seconds, 0);
      const breaks = records
        .filter((tr) => tr.mode === "shortBreak" || tr.mode === "longBreak")
        .reduce((sum, tr) => sum + tr.duration_seconds, 0);

      setCalcTimer(pomodoro);
      setCalcBreakTime(breaks);
    };

    getTimerRecord();
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
            onChange={() => onToggleComplete(id, is_completed)}
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
      {is_completed && (
        <div className="w-full mt-3 flex flex-row gap-4 text-sm text-gray-400 border-t border-gray-600 pt-3">
          <div className="flex items-center gap-1">
            <span>🍅</span>
            <span className="text-white font-semibold">
              {Math.floor(calcTimer / 60)}:
              {(calcTimer % 60).toString().padStart(2, "0")}
            </span>
            <span>focus</span>
          </div>
          <div className="flex items-center gap-1">
            <span>☕</span>
            <span className="text-white font-semibold">
              {Math.floor(calcBreakTime / 60)}:
              {(calcBreakTime % 60).toString().padStart(2, "0")}{" "}
            </span>
            <span>breaks</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🍅 ×</span>
            <span className="text-white font-semibold">
              {(calcTimer / 25 / 10).toFixed(2)}
            </span>
            <span>pomodoros</span>
          </div>
        </div>
      )}
    </li>
  );
};

export default TaskItem;
