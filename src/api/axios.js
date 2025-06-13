import axios from "axios";

// const BASE = "http://localhost:5279";
const BASE = "http://localhost:8000"

const api = axios.create({
  baseURL: BASE, 
  withCredentials: true, 
  headers: { "Content-Type": "application/json" },
});


export const apiAuth = axios.create({
  baseURL: `${BASE}/api/Auth`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});


export const apiR = axios.create({
  baseURL: `${BASE}/api/Resume`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default api;
