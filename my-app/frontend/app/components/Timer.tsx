"use client";

import React, { useEffect, useRef, useState } from "react";

const modes = ["pomodoro", "shortBreak", "longBreak"];
type Mode = (typeof modes)[number];

const Timer = () => {
  const [seconds, setSeconds] = useState(60 * 25);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<Mode>("pomodoro");

  const handlePomodoro = () => {
    setMode("pomodoro");
    setSeconds(60 * 25);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };
  const handleShortBreak = () => {
    setMode("shortBreak");
    setSeconds(60 * 5);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };
  const handleLongBreak = () => {
    setMode("longBreak");
    setSeconds(60 * 15);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };
  const startTimer = () => {
    if (intervalRef.current) return;

    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resumeTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };

  const restartTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
      setSeconds(
        mode === "pomodoro"
          ? 60 * 25
          : mode === "shortBreak"
            ? 60 * 5
            : mode === "longBreak"
              ? 60 * 15
              : 60 * 1,
      );
    }
  };
  let minutes = Math.floor(seconds / 60);
  let secs = seconds % 60;
  return (
    <div className=" flex flex-col font-mono text-7xl px-13 pb-20 pt-10 bg-gray-700 rounded-lg w-full justify-center items-center">
      <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
        <li className="text-sm">
          <button
            onClick={handlePomodoro}
            className={`${mode === "pomodoro" ? "bg-[#33373E]" : ""} px-4 py-2`}
          >
            Pomodoro
          </button>
        </li>
        <li className="text-sm">
          <button
            onClick={handleShortBreak}
            className={`${mode === "shortBreak" ? "bg-[#33373E]" : ""} px-4 py-2`}
          >
            {" "}
            Short Break
          </button>
        </li>
        <li className="text-sm">
          <button
            onClick={handleLongBreak}
            className={`${mode === "longBreak" ? "bg-[#33373E]" : ""} px-4 py-2`}
          >
            Long Break
          </button>
        </li>
      </ul>
      <div className="text-7xl font-mono mt-15">
        {minutes}:{secs.toString().padStart(2, "0")}
      </div>
      <div className="buttons w-full flex flex-row gap-4 text-lg mt-16">
        <button
          className={`${isRunning ? "btn btn-info" : "btn btn-success"} ${isRunning ? "w-1/2" : "w-full"} py-6 `}
          onClick={isRunning ? resumeTimer : startTimer}
        >
          {isRunning ? "RESUME" : "START"}
        </button>
        {isRunning && (
          <button
            className="btn btn-neutral  w-1/2 py-6"
            onClick={restartTimer}
          >
            RESTART
          </button>
        )}
      </div>
    </div>
  );
};

export default Timer;
