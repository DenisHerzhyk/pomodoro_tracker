"use client";

import { useEffect, useState } from "react";
import Timer from "./components/Timer";
import TaskList from "./components/TaskList";

const modes = ["pomodoro", "shortBreak", "longBreak"];
type Mode = (typeof modes)[number];

const Home = () => {
  const [totalWorkSeconds, setTotalWorkSeconds] = useState(0);
  const [totalBreakSeconds, setTotalBreakSeconds] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [mode, setMode] = useState<Mode>("pomodoro");

  const totalSeconds =
    mode === "pomodoro" ? totalWorkSeconds : totalBreakSeconds;
  return (
    <div className="h-screen w-screen px-12 flex flex-col items-center">
      <h1 className="text-center text-3xl font-extrabold w-full mt-30">
        Pomodoro Tracker
      </h1>
      <div className="mt-10">
        <Timer
          onWorkSecondsUpdate={setTotalWorkSeconds}
          onBreakSecondsUpdate={setTotalBreakSeconds}
          setMode={setMode}
          mode={mode}
        />
        <TaskList
          onWorkSecondsUpdate={setTotalWorkSeconds}
          onBreakSecondsUpdate={setTotalBreakSeconds}
          onReset={() => {
            setResetSignal((s) => s + 1);
            setTotalWorkSeconds(0);
            setTotalBreakSeconds(0);
          }}
          totalSeconds={totalSeconds}
          mode={mode}
        />
      </div>
    </div>
  );
};

export default Home;
