import axios from "axios";

export const getAllCompleteTasks = async (
  setCompTasks: React.Dispatch<React.SetStateAction<any[]>>,
) => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/py/complete_tasks",
      {
        withCredentials: true,
      },
    );
    setCompTasks(response.data);
  } catch (err) {
    console.error("Failed to receive tasks: ", err);
  }
};
