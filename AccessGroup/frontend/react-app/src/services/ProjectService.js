import api from "./api";

const ProjectService = {
  getAll: () => api.get("/project"),
  // ProjectService.js
  getActiveCount: () => api.get("/project/active/count"),
  getOverallStats: () => api.get("/project/overall-stats"),
  getStats: () => api.get(`/project/stats/${id}`),
  getByUser: (userId) => api.get(`/project/user/${userId}`),
  getById: (id) => api.get(`/project/${id}`),
  create: (data) => api.post("/project", data),
  update: (id, data) => api.put(`/project/${id}`, data),
  delete: (id) => api.delete(`/project/${id}`),
  getProjectTaskList: (id) => api.get(`/project/${id}/tasks`),
};

export default ProjectService;
