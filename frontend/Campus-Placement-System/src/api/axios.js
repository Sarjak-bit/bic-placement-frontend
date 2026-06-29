import axios from "axios";

const BASE_URL = "https://bic-placement-backend.onrender.com/";

const api = axios.create({
  baseURL: BASE_URL,
});

// The backend returns media file paths (profile pictures, resumes, offer
// letters) as relative paths like "/media/profiles/xyz.jpg". These must be
// prefixed with the backend's domain before use in <img src> or download
// links, otherwise the browser resolves them against the frontend's own
// origin and the request 404s silently.
export const getMediaUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BASE_URL.replace(/\/$/, "")}${path}`;
};

// Automatically refresh token if expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh");

      try {
        const res = await axios.post(`${BASE_URL}api/users/token/refresh/`, {
          refresh,
        });
        localStorage.setItem("access", res.data.access);
        originalRequest.headers["Authorization"] = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch {
        localStorage.clear();
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;