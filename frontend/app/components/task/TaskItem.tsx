"use client";

import React, { useState } from "react";

const TaskItem = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <li className="list-row items-center">
      <div
        className={`text-4xl font-thin tabular-nums ${isChecked ? "text-green-300 line-through" : "text-gray-400"}`}
      >
        01
      </div>
      <div className="list-col-grow">
        <div className={`${isChecked && "line-through"} text-lg font-semibold`}>
          Task 1
        </div>
        <div className="max-w-[200px]">
          <p className={`text-gray-300 ${open ? "" : "truncate"}`}>
            This is task description....This is task description....This is task
            description....
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
            className="checkbox checkbox-success"
            onChange={() => setIsChecked(!isChecked)}
            checked={isChecked}
          />
        </label>
      </fieldset>
    </li>
  );
};

export default TaskItem;
