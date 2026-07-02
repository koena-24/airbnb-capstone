import axios from "axios";

const api = axios.create({
  baseURL: "https://airbnb-capstone-mkdq.onrender.com/api",
});

export default api;