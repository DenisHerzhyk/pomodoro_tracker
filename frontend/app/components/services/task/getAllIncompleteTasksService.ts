import axios from "axios";

export const getAllCreatedTasks = async (
  setIncompTasks: React.Dispatch<React.SetStateAction<any[]>>,
) => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/py/incomplete_tasks",
      {
        withCredentials: true,
      },
    );
    setIncompTasks(response.data);
  } catch (err) {
    console.error("Failed to receive tasks: ", err);
  }
};
