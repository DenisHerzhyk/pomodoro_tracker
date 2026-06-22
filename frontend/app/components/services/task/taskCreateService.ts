import axios from "axios";
import { getAllCompleteTasks } from "./getAllCompleteTasksService";
import { getAllCreatedTasks } from "./getAllIncompleteTasksService";

export const handleTaskCreate = async (
  taskTitle: string,
  taskNote: string,
  setExpandDescr: React.Dispatch<React.SetStateAction<boolean>>,
  setIncompTasks: React.Dispatch<React.SetStateAction<any[]>>,
  setCompTasks: React.Dispatch<React.SetStateAction<any[]>>,
) => {
  if (!taskTitle) return;
  try {
    await axios.post(
      "http://localhost:8000/api/py/task",
      {
        title: taskTitle,
        description: taskNote,
        is_completed: false,
        total_work_seconds: 0,
      },
      { withCredentials: true },
    );

    getAllCreatedTasks(setIncompTasks);
    getAllCompleteTasks(setCompTasks);
    setExpandDescr(false);
  } catch (err) {
    console.error("Failed to create task: ", err);
  }
};
