"use client";

import React, { useEffect, useRef, useState } from "react";

const Timer = ({
  onWorkSecondsUpdate,
  onBreakSecondsUpdate,
  resetSignal,
  setMode,
  mode,
}) => {
  const [seconds, setSeconds] = useState(60 * 25);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const secondsRef = useRef(60 * 25);
  const hasSavedRef = useRef(false);

  useEffect(() => {
    if (resetSignal === 0) return;
    secondsRef.current = 60 * 25;
    setSeconds(60 * 25);
    hasSavedRef.current = false;
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [resetSignal]);

  const stopAndSaveTimer = () => {
    if (!intervalRef.current || hasSavedRef.current) return;
    const initialTime =
      mode === "pomodoro" ? 60 * 25 : mode === "shortBreak" ? 60 * 5 : 60 * 15;
    const elapsed = initialTime - secondsRef.current;

    if (!isRunning || hasSavedRef.current || elapsed <= 0) return;
    hasSavedRef.current = true;

    if (mode === "pomodoro") {
      onWorkSecondsUpdate(elapsed);
    } else {
      onBreakSecondsUpdate(elapsed);
    }

    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handlePomodoro = () => {
    setMode("pomodoro");
    setSeconds(60 * 25);
    secondsRef.current = 60 * 25;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };
  const handleShortBreak = async () => {
    stopAndSaveTimer();
    setMode("shortBreak");
    setSeconds(60 * 5);
    secondsRef.current = 60 * 5;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };
  const handleLongBreak = async () => {
    stopAndSaveTimer();
    setMode("longBreak");
    setSeconds(60 * 15);
    secondsRef.current = 60 * 15;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };
  const startTimer = () => {
    if (intervalRef.current) return;
    // Reset timer to initial value for current mode before starting
    const initialTime =
      mode === "pomodoro"
        ? 60 * 25
        : mode === "shortBreak"
          ? 60 * 5
          : mode === "longBreak"
            ? 60 * 15
            : 60 * 1; // fallback to 1 minute for safety
    secondsRef.current = initialTime;
    setSeconds(initialTime);
    hasSavedRef.current = false;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        const next = prev <= 1 ? 0 : prev - 1;
        secondsRef.current = next;
        if (next === 0) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsRunning(false);
        }
        return next;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (!intervalRef.current) return;
    stopAndSaveTimer();
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
        {isRunning ? (
          <button className={`btn btn-error w-1/2 py-6 `} onClick={stopTimer}>
            STOP
          </button>
        ) : (
          <button
            className={`btn btn-success w-full py-6`}
            onClick={startTimer}
          >
            START
          </button>
        )}

        {isRunning && (
          <button className="btn btn-neutral w-1/2 py-6" onClick={restartTimer}>
            RESTART
          </button>
        )}
      </div>
    </div>
  );
};

export default Timer;
