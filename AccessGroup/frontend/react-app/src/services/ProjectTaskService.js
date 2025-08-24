import api from "./api";

const ProjectTaskService = {
  // get all tasks
  getAll: () => api.get("/projecttask"),

  // get one task by id
  getById: (taskId) => api.get(`/projecttask/${taskId}`),

  // get tasks by project id
  getByProjectId: (projectId) => api.get(`/projecttask/project/${projectId}`),

  // create task
  createTask: (data) => api.post("/projecttask", data),

  // update task
  updateTask: (taskId, data) => api.put(`/projecttask/${taskId}`, data),

  // delete task
  deleteTask: (taskId) => api.delete(`/projecttask/${taskId}`),
};

export default ProjectTaskService;
