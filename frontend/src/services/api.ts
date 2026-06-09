import axios from "axios";

/*
  Central API configuration
  This file connects the React frontend to the backend server
*/



const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

/*
  Optional: Request interceptor
  Useful if later you add authentication tokens
*/

API.interceptors.request.use(
  (config) => {
    // Example: attach auth token if needed later
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
  Optional: Response interceptor
  Helps handle errors globally
*/

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default API;