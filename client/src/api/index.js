import axios from "axios";

const API_BASE = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the server returns 401 or 403, the token is missing/expired — clear it
// and redirect to the login page so the user re-authenticates.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("admin_token");
      // Only redirect if we're inside the admin area
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ─────────────────────────────────────────────────────────
export const login = (email, password) =>
  api.post("/auth/login", { email, password });

// ── Projects ─────────────────────────────────────────────────────
export const getProjects = () => api.get("/projects");
export const createProject = (data) => api.post("/projects", data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// ── Skills ───────────────────────────────────────────────────────
export const getSkills = () => api.get("/skills");
export const createSkill = (data) => api.post("/skills", data);
export const updateSkill = (id, data) => api.put(`/skills/${id}`, data);
export const deleteSkill = (id) => api.delete(`/skills/${id}`);

// ── Certificates ─────────────────────────────────────────────────
export const getCertificates = () => api.get("/certificates");
export const createCertificate = (data) => api.post("/certificates", data);
export const updateCertificate = (id, data) =>
  api.put(`/certificates/${id}`, data);
export const deleteCertificate = (id) => api.delete(`/certificates/${id}`);

export default api;
