"use client";

import { useState } from "react";
import Timer from "./components/Timer";
import TaskList from "./components/TaskList";

interface Tasks {}
const Home = () => {
  const [tasks, setTasks] = useState<Tasks[]>();
  const handleSubmit = () => {};
  return (
    <div className="h-screen w-screen px-12 flex flex-col items-center">
      <h1 className="text-center text-3xl font-extrabold w-full mt-30">
        Pomodoro Tracker
      </h1>
      <div className="mt-10">
        <Timer />
        <TaskList />
      </div>
    </div>
  );
};

export default Home;
