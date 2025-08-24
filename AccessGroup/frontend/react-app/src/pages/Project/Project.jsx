import React, { useState, useEffect } from "react";
import MainLayout from "../../components/MainLayout/MainLayout";
import ProjectService from "../../services/ProjectService";
import UserService from "../../services/UserService";
import "./Project.css";
import { FaTrash } from "react-icons/fa";

const Project = () => {
  useEffect(() => {
    document.title = "Employee Projects ";
  }, []);

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // create/edit modal
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    id: null,
    title: "",
    remark: "",
    status: "Pending",
    dueDate: "",
    assignedUserId: "",
    dateCreated: "",
    createdByUserId: null,
    statusReason: "",
    dateCreated: "",
  });

  // OnHold modal state (for adding statusReason)
  const [showOnHoldModal, setShowOnHoldModal] = useState(false);
  const [onHoldProject, setOnHoldProject] = useState(null);
  const [onHoldReason, setOnHoldReason] = useState("");
  const [onHoldReasonSelect, setOnHoldReasonSelect] = useState("");

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await ProjectService.getAll();
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    }
  };

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("userId")); // adjust if your auth stores differently
    if (userId) {
      setProjectForm((prev) => ({ ...prev, createdByUserId: userId }));
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await UserService.getAll();
      // UserService.getAll may return res.data or array - handle both
      const userList = Array.isArray(res) ? res : res?.data ?? [];
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Open modal for create or edit
  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setProjectForm({
        id: project.id,
        title: project.title || "",
        remark: project.remark || "",
        status: project.status || "Pending",
        dueDate: project.dueDate ? project.dueDate.split("T")[0] : "",
        assignedUserId: project.assignedUserId || "",
        statusReason: project.statusReason || "",
        createdByUserId: project.createdByUserId || "",
        dateCreated: project.dateCreated  ? project.dateCreated.split("T")[0] : "",
      });
    } else {
      setEditingProject(null);
      setProjectForm({
        title: "",
        remark: "",
        status: "Pending",
        dueDate: "",
        assignedUserId: "",
        statusReason: "",
        createdByUserId: "",
        dateCreated: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleChange = (e) =>
    setProjectForm({ ...projectForm, [e.target.name]: e.target.value });

  // Create or update project
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        // Use full project payload so other fields are preserved
        await ProjectService.update(editingProject.id, {
          ...editingProject,
          title: projectForm.title,
          remark: projectForm.remark,
          status: projectForm.status,
          dueDate: projectForm.dueDate,
          dateCreated: projectForm.dateCreated,
          assignedUserId: projectForm.assignedUserId,
          statusReason:
            projectForm.status === "Active" ? projectForm.statusReason : null, // clear if not Active
          createdByUserId: projectForm.createdByUserId,
        });
      } else {
        console.log("Creating project with data:", projectForm);
        await ProjectService.create(projectForm);
      }
      await fetchProjects(); // refresh list after save
      setProjectForm({
        title: "",
        remark: "",
        status: "Pending",
        dueDate: "",
        assignedUserId: "",
        statusReason: "",
        createdByUserId: "",
        dateCreated: "",
      });
      setEditingProject(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  // Delete project
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await ProjectService.delete(id);
      await fetchProjects(); // refresh list after delete
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Helpers for days left
  const calculateDaysLeft = (dueDate) => {
    if (!dueDate) return "-";
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Generic status update helper
  const updateProjectStatus = async (project, newStatus, reason = null) => {
    try {
      const payload = {
        ...project,
        status: newStatus,
        // include or clear statusReason
        statusReason: reason,
      };
      // Some backends expect only the editable fields - adapt as needed
      await ProjectService.update(project.id, payload);
      await fetchProjects();
    } catch (error) {
      console.error("Error updating project status:", error);
    }
  };

  // Action handlers
  const handleStart = async (project) => {
    await updateProjectStatus(project, "Active", null);
  };

  const handleComplete = async (project) => {
    await updateProjectStatus(project, "Completed", null);
  };

  const handleReopen = async (project) => {
    await updateProjectStatus(project, "Active", null);
  };

  const handleOpenOnHold = (project) => {
    setOnHoldProject(project);
    setOnHoldReasonSelect("");
    setOnHoldReason("");
    setShowOnHoldModal(true);
  };

  const handleConfirmOnHold = async () => {
    const reason =
      onHoldReasonSelect === "Other" ? onHoldReason : onHoldReasonSelect;
    if (!onHoldProject) return;
    await updateProjectStatus(onHoldProject, "OnHold", reason);
    setShowOnHoldModal(false);
    setOnHoldProject(null);
    setOnHoldReason("");
    setOnHoldReasonSelect("");
  };

  const handleCancelOnHold = () => {
    setShowOnHoldModal(false);
    setOnHoldProject(null);
    setOnHoldReason("");
    setOnHoldReasonSelect("");
  };

  return (
    <MainLayout>
      <div className="project-page">
        <div className="project-header">
          <h1>Projects</h1>
        </div>
        <p>List of all projects.</p>
        <button className="create-btn" onClick={() => handleOpenModal()}>
          + Create Project
        </button>
        <br />
        <table className="project-table">
          <thead>
            <tr>
              <th>ID</th>
              <th style={{ width: "200px" }}>Title</th>
              <th>Remark</th>
              <th style={{ width: "100px" }}>Status</th>
              <th>Assigned To</th>
              <th>Start Date </th>
              <th>Due Date</th>
              <th>Day Left</th>
              <th>Project Task</th>
              <th>Tasks Completion Rate</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(projects) && projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.id}</td>
                  <td>
                    <span
                      onClick={() => handleOpenModal(project)}
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        color: "blue",
                      }}
                      title="Click to edit"
                    >
                      {project.title || "-"}
                    </span>
                    {/* delete beside title */}
                    <FaTrash
                      onClick={() => handleDelete(project.id)}
                      title="Delete project"
                      style={{
                        marginLeft: "8px",
                        cursor: "pointer",
                        color: "red",
                        verticalAlign: "middle",
                      }}
                    />
                  </td>
                  <td>{project.remark || "-"}</td>
                  <td>
                    <div>
                      <span
                        className={`status-badge status-${(project.status || "")
                          .toString()
                          .toLowerCase()}`}
                      >
                        {project.status}
                      </span>
                    </div>
                    {project.completeDate && (
                      <div className="status-reason" style={{ marginTop: 6 }}>
                        [{" "}
                        <small>
                          {new Date(project.completeDate).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </small>{" "}
                        ]
                      </div>
                    )}

                    {project.statusReason ? (
                      <div className="status-reason" style={{ marginTop: 6 }}>
                        [ <small> {project.statusReason}</small> ]
                      </div>
                    ) : null}
                  </td>
                  <td>{project.assignedUser?.name || "-"}</td>
                  <td>{project.dateCreated?.split("T")[0]}</td>
                  <td>{project.dueDate?.split("T")[0]}</td>
                  <td>{calculateDaysLeft(project.dueDate)} day(s)</td>
                  <td>
                    <a
                      href={`../access/project-task/${project.id}`}
                      className="inline-flex items-center px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-red-600 transition"
                    >
                      Track Tasks
                    </a>
                  </td>
                  <td>{project.tasksCompletionRate || 0}%</td>
                  <td>
                    <center>
                      {/* Actions based on status */}
                      {project.status === "Pending" && (
                        <button
                          className="action-btn start-btn"
                          onClick={() => handleStart(project)}
                        >
                          Start
                        </button>
                      )}

                      {project.status === "Active" && (
                        <>
                          <button
                            className="action-btn complete-btn"
                            onClick={() => handleComplete(project)}
                          >
                            Complete
                          </button>
                          <button
                            className="action-btn onhold-btn"
                            onClick={() => handleOpenOnHold(project)}
                            style={{ marginLeft: 8 }}
                          >
                            OnHold
                          </button>
                        </>
                      )}

                      {project.status === "Completed" && (
                        <button
                          className="action-btn reopen-btn"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to reopen this project?"
                              )
                            ) {
                              handleReopen(project);
                            }
                          }}
                        >
                          Reopen
                        </button>
                      )}

                      {project.status === "OnHold" && (
                        <>
                          <button
                            className="action-btn resume-btn"
                            onClick={() =>
                              updateProjectStatus(project, "Active", null)
                            }
                          >
                            Resume
                          </button>
                        </>
                      )}
                    </center>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  No projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{editingProject ? "Edit Project" : "Create New Project"}</h2>
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
                    value={projectForm.title}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Remark:
                  <input
                    type="text"
                    name="remark"
                    value={projectForm.remark}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  <input
                    type="hidden"
                    name="createdByUserId"
                    value={ JSON.parse(localStorage.getItem("userId"))}
                  />
                </label>
                {projectForm.status === "Active" && (
                  <label>
                    Informed Progress (if any):
                    <input
                      type="text"
                      name="statusReason"
                      value={projectForm.statusReason}
                      onChange={handleChange}
                    />
                  </label>
                )}

                <label>
                  Status:
                  <select
                    name="status"
                    value={projectForm.status}
                    onChange={handleChange}
                  >
                    <option>Pending</option>
                    <option>Active</option>
                    <option>Completed</option>
                    <option>OnHold</option>
                  </select>
                </label>
                <label>
                  Assign To:
                  <select
                    name="assignedUserId"
                    value={projectForm.assignedUserId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Employee</option>
                    {Array.isArray(users) &&
                      users.map((user) => (
                        <option
                          key={user.id ?? user.userId}
                          value={user.id ?? user.userId}
                        >
                          {user.name ?? user.Name}
                        </option>
                      ))}
                  </select>
                </label>
                <label>
                  Start Project Date:
                  <input
                    type="date"
                    name="dateCreated"
                    value={projectForm.dateCreated}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                 Project Due Date:
                  <input
                    type="date"
                    name="dueDate"
                    value={projectForm.dueDate}
                    onChange={handleChange}
                    required
                  />
                </label>

                <div className="modal-actions">
                  <button type="submit" className="create-btn">
                    {editingProject ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* OnHold modal */}
        {showOnHoldModal && (
          <div className="modal-overlay" onClick={handleCancelOnHold}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Place Project On Hold</h3>
              <button
                className="x-btn"
                onClick={handleCancelOnHold}
                style={{ marginLeft: 8 }}
              >
                x
              </button>
              <p>
                Project: <strong>{onHoldProject?.title}</strong>
              </p>

              <label>
                Reason : &nbsp;
                <select
                  value={onHoldReasonSelect}
                  onChange={(e) => setOnHoldReasonSelect(e.target.value)}
                >
                  <option value="">Select reason</option>
                  
<option value="Blocked By Compliance">Blocked By Compliance</option>
                  <option value="Client Delay">Client Delay</option>
                  <option value="Resource Unavailable">
                    Resource Unavailable
                  </option>
                  <option value="Budget Issue">Budget Issue</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              {onHoldReasonSelect === "Other" && (
                <label>
                  Other reason:
                  <input
                    type="text"
                    value={onHoldReason}
                    onChange={(e) => setOnHoldReason(e.target.value)}
                  />
                </label>
              )}

              <div className="modal-actions" style={{ marginTop: 12 }}>
                <button className="create-btn" onClick={handleConfirmOnHold}>
                  Confirm OnHold
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Project;
