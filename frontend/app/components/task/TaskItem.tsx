"use client";

import React from "react";

const TaskItem = () => {
  return (
    <li className="list-row items-center">
      <div className="text-4xl font-thin opacity-30 tabular-nums">01</div>

      <div className="list-col-grow">
        <div>Task 1</div>
      </div>
      <button className="btn btn-square btn-ghost">
        <fieldset className="fieldset w-64  p-4">
          <label className="label">
            <input type="checkbox" className="checkbox checkbox-success" />
          </label>
        </fieldset>
      </button>
    </li>
  );
};

export default TaskItem;
