import axios from "axios";

export const saveBeforeSwitchService = async (elapsed: number) => {
  await axios.patch(
    "http://localhost:8000/api/py/save_before_switch",
    { elapsed },
    { withCredentials: true },
  );
};
