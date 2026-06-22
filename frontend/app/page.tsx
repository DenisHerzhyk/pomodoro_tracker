"use client";

import { useEffect, useState } from "react";
import Timer from "./components/Timer";
import TaskList from "./components/TaskList";

const modes = ["pomodoro", "shortBreak", "longBreak"];
type Mode = (typeof modes)[number];

interface Tasks {}
const Home = () => {
  const [totalWorkSeconds, setTotalWorkSeconds] = useState(0);
  const [totalBreakSeconds, setTotalBreakSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [mode, setMode] = useState<Mode>("pomodoro");

  useEffect(() => {
    mode === "pomodoro"
      ? setTotalSeconds(totalWorkSeconds)
      : setTotalSeconds(totalBreakSeconds);
  }, [mode]);
  const handleSubmit = () => {};
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
        <TaskList totalSeconds={totalSeconds} mode={mode} />
      </div>
    </div>
  );
};

export default Home;
