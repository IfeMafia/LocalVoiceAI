import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  // Ensure cookies are sent with requests
  withCredentials: true,
});

// Add a response interceptor to handle token expiry (401 errors)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Redirect to login if unauthorized
        window.location.href = "/login?expired=true";
      }
    }
    return Promise.reject(error);
  }
);

export default api;