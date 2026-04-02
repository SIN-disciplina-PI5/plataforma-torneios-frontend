import axios from "axios";

export const login = async (data: { email: string; senha: string }) => {
  const response = await axios.post("http://localhost:3000/login", data);
  return response.data;
};
