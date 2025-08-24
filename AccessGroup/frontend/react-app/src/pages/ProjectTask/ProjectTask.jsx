import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";   
import MainLayout from "../../components/MainLayout/MainLayout";
import ProjectService from "../../services/ProjectService";
import ProjectTaskService from "../../services/ProjectTaskService";
import UserService from "../../services/UserService";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa"; 
import "./ProjectTask.css";

const ProjectTask = () => {
      useEffect(() => {
        document.title = "Project Task "; // set tab name
      }, []);
    
  const { id } = useParams(); 
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",
  });

  // Fetch project details
  const fetchProject = async () => {
    try {
      const res = await ProjectService.getById(id);
      setProject(res.data);
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  // Fetch tasks for this project
  const fetchTasks = async () => {
    try {
      const res = await ProjectTaskService.getByProjectId(id);
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching project tasks:", error);
    }
  };

  // Fetch all users (if you want assign dropdown later)
  const fetchUsers = async () => {
    try {
      const res = await UserService.getAll();
      setUsers(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchTasks();
    fetchUsers();
  }, [id]);

  const calculateDaysLeft = (dueDate) => {
    if (!dueDate) return "-";
    const today = new Date();
    const due = new Date(dueDate);
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  };

  // Modal handlers
  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        status: task.status || "Pending",
      });
    } else {
      setEditingTask(null);
      setTaskForm({
        title: "",
        description: "",
        dueDate: "",
        status: "Pending",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) =>
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    ...taskForm,
    projectId: parseInt(id),
    dueDate: taskForm.dueDate
      ? new Date(taskForm.dueDate).toISOString()
      : null,
  };

  try {
    if (editingTask) {
      // ✅ Include id in payload so it matches backend check
      await ProjectTaskService.updateTask(editingTask.id, {
        ...payload,
        id: editingTask.id,
      });
    } else {
      await ProjectTaskService.createTask(payload);
    }
    await fetchTasks();
    setIsModalOpen(false);
  } catch (error) {
    console.error("Error saving task:", error.response?.data || error);
  }
};


  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await ProjectTaskService.deleteTask(taskId);
      await fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <MainLayout>
      <div className="project-page">
        {project && (
          <>
            <div className="back-btn">
            <Link to="/access/project" className="back-link">
              <FaArrowLeft style={{ marginRight: "8px" }} />
              Back to Projects
            </Link>
          </div>
          <div className="project-card">
      <h1 className="project-title">{project.title}</h1>
      <div className="project-info">
        <p><span className="label">Remark:</span> {project.remark}</p>
        <p><span className="label">Status:</span> {project.status}</p>
        <p>
          <span className="label">Assigned To:</span>{" "}
          {project.assignedUser?.name || "-"}
        </p>
      </div>
    </div>

            <div className="task-header">
              <h2>Project Tasks</h2>
              <button className="create-btn" onClick={() => handleOpenModal()}>
                + Create Task
              </button>
            </div>

            <table className="project-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Days Left</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
  {tasks.length > 0 ? (
    tasks.map((task) => (
      <tr key={task.id}>
        <td>{task.id}</td>
        <td>
          <span
            onClick={() => handleOpenModal(task)}
            style={{ 
              cursor: "pointer", 
              textDecoration: "underline", 
              color: "blue" 
            }}
            title="Click to edit"
          >
            {task.title || "-"}
          </span>
          <FaTrash
            onClick={() => handleDelete(task.id)}
            title="Delete task"
            style={{
              marginLeft: "8px",
              cursor: "pointer",
              color: "red",
              verticalAlign: "middle",
            }}
          />
        </td>
        <td>{task.description}</td>
        <td>{task.status}</td>
        <td>{task.dueDate?.split("T")[0]}</td>
        <td>{calculateDaysLeft(task.dueDate)}</td>
        <td>
          <button
            className="action-btn"
            onClick={() => {
              const newStatus =
                task.status === "Pending" ? "Completed" : "Pending";
              ProjectTaskService.updateTask(task.id, {
                ...task,
                status: newStatus,
              }).then(() => fetchTasks());
            }}
          >
            {task.status === "Pending" ? "Done" : "Undone"}
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" style={{ textAlign: "center" }}>
        No tasks found
      </td>
    </tr>
  )}
</tbody>

            </table>
          </>
        )}

        {/* Task Modal */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{editingTask ? "Edit Task" : "Create Task"}</h2>
              <form onSubmit={handleSubmit} className="modal-form">
                                  <button
                    type="button"
                    className="x-btn"
                    onClick={handleCloseModal}
                  >
                    x
                  </button>
                <label>
                  Title:
                  <input
                    type="text"
                    name="title"
                    value={taskForm.title}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Description:
                  <input
                    type="text"
                    name="description"
                    value={taskForm.description}
                    onChange={handleChange}
                  />
                </label>
                
                <label>
                  Due Date:
                  <input
                    type="date"
                    name="dueDate"
                    value={taskForm.dueDate}
                    onChange={handleChange}
                  />
                </label>
                <div className="modal-actions">
                  <button type="submit" className="create-btn">
                    {editingTask ? "Update" : "Create"}
                  </button>

                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProjectTask;
