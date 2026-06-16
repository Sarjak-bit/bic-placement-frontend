import axios from "axios";

const api = axios.create({
  baseURL: "https://bic-placement-backend.onrender.com/api",
});

// Automatically refresh token if expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh");

      try {
        const res = await axios.post("https://bic-placement-backend.onrender.com/api/users/token/refresh/", {
          refresh,
        });
        localStorage.setItem("access", res.data.access);
        originalRequest.headers["Authorization"] = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;