import axios from "axios";
import { getAllCreatedTasks } from "./getAllIncompleteTasksService";
import { getAllCompleteTasks } from "./getAllCompleteTasksService";

export const handleTaskDelete = async (
  id: number,
  setIncompTasks: React.Dispatch<React.SetStateAction<any[]>>,
  setCompTasks: React.Dispatch<React.SetStateAction<any[]>>,
) => {
  try {
    await axios.delete(`http://localhost:8000/api/py/task/${id}`, {
      withCredentials: true,
    });

    getAllCreatedTasks(setIncompTasks);
    getAllCompleteTasks(setCompTasks);
  } catch (err) {
    console.error("Failed to delete task: ", err);
  }
};
