// src/pages/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout/MainLayout";
import UserService from "../../services/UserService";
import ProjectService from "../../services/ProjectService";
import "./Dashboard.css";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Employee Projects Dashboard "; // set tab name
  }, []);

  const [employees, setEmployees] = useState([]);
  const [projectsMap, setProjectsMap] = useState({}); // userId => projects
  const [activeProjects, setActiveProjects] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [overdueProjects, setOverdueProjects] = useState(0);
  const [overdueTasks, setOverdueTasks] = useState(0);

  useEffect(() => {
    const animateCards = () => {
      const cards = document.querySelectorAll(".employee-card");
      cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
      });
    };

    // Fetch all employees
    const fetchEmployees = async () => {
      try {
        const res = await UserService.getAll();
        const employeeList = Array.isArray(res) ? res : [];
        setEmployees(employeeList);

        // Fetch projects per employee
        const projectPromises = employeeList.map((emp) =>
          ProjectService.getByUser(emp.id)
            .then((projRes) => ({
              userId: emp.id,
              projects: projRes.data || [],
            }))
            .catch(() => ({ userId: emp.id, projects: [] }))
        );

        const projectResults = await Promise.all(projectPromises);
        const projectsByUser = {};
        projectResults.forEach(({ userId, projects }) => {
          projectsByUser[userId] = projects;
        });
        setProjectsMap(projectsByUser);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    // Fetch summary stats (keep exactly as you wrote it)
    const fetchProjectStats = async () => {
      try {
        const res = await ProjectService.getOverallStats();
        setActiveProjects(res.data.totalActiveProjects || 0);
        setCompletionRate(res.data.completionRatePercent || 0);
        setOverdueProjects(res.data.totalOverdueProjects || 0);
        setOverdueTasks(res.data.totalOverdueTasks || 0);
      } catch (error) {
        console.error("Error fetching project stats:", error);
      }
    };

    fetchEmployees();
    fetchProjectStats();
    animateCards();
  }, []);

  const statusClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "active":
        return "status-active";
      case "completed":
        return "status-completed";
      case "overdue":
        return "status-overdue";
      default:
        return "status-inactive";
    }
  };

  const initials = (name) =>
    (name || "N A")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <MainLayout>
      <div className="dashboard-page">
        {/* HERO */}
        <div className="hero">
          <div className="header header--hero">
            <h1>Employee Projects Dashboard</h1>
            <p>Track team progress and project status in real-time</p>
          </div>
        </div>

        {/* SUMMARY STATS */}
        <div className="stats-container">
          <div className="stats-bar">
            <div className="stat">
              <div className="stat-number">{employees.length}</div>
              <div className="stat-label">Total Employees</div>
            </div>
            <div className="stat">
              <div className="stat-number">{activeProjects}</div>
              <div className="stat-label">Active Projects</div>
            </div>
            <div className="stat">
              <div className="stat-number">
                {typeof completionRate === "number"
                  ? completionRate.toFixed(1) + "%"
                  : "0.0%"}
              </div>
              <div className="stat-label">Completion Rate</div>
            </div>
            <div className="stat">
              <div className="stat-number">{overdueProjects}</div>
              <div className="stat-label">Overdue Projects</div>
            </div>
            <div className="stat">
              <div className="stat-number">{overdueTasks}</div>
              <div className="stat-label">Overdue Tasks</div>
            </div>
          </div>
        </div>

        {/* EMPLOYEE CARDS */}
        <div className="content-section">
          <div className="employee-grid">
            {employees.map((employee) => {
              const employeeProjects = projectsMap[employee.id] || [];
              return (
                <div key={employee.id} className="employee-card">
                  <div className="employee-header">
                    <div className="employee-avatar">
                      {initials(employee.name)}
                    </div>
                    <div className="employee-info">
                      <h3>{employee.name || "Unknown"}</h3>
                      <div className="employee-role">
                        {employee.position || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="projects-section">
                    <div className="projects-header">
                      <div className="projects-title">Current Projects</div>
                      <div className="project-count">
                        {employeeProjects.length} Projects
                      </div>
                    </div>

                    {employeeProjects.length ? (
                      employeeProjects.map((project) => (
                        <div key={project.id} className="project-item">
                          <div className="project">
                            <div className="project-info">
                              <div className="project-name">{project.title}</div>
                              {/* Display statusReason, Completed date, or Due info */}
                              <div className="project-details">
                                {project.statusReason ? (
                                  <>{project.statusReason}</>
                                ) : project.completeDate ? (
                                  <>
                                    Completed:{" "}
                                    {new Date(
                                      project.completeDate
                                    ).toLocaleDateString()}
                                  </>
                                ) : project.dueDate ? (
                                  <>
                                    Due:{" "}
                                    {new Date(
                                      project.dueDate
                                    ).toLocaleDateString()}{" "}
                                    •{" "}
                                    {Math.ceil(
                                      (new Date(project.dueDate) - new Date()) /
                                        (1000 * 60 * 60 * 24)
                                    )}{" "}
                                    day(s) left
                                  </>
                                ) : (
                                  <>No due date</>
                                )}
                              </div>

                              {/* Progress bar */}
                              {/* Progress bar */}
                              <div className="progress-bar">
                                <div
                                  className="progress-fill"
                                  style={{
                                    width: project.completeDate
                                      ? "100%" // full if completed
                                      : project.completionRate
                                      ? `${project.completionRate}%`
                                      : "0%", // fallback
                                  }}
                                ></div>
                              </div>
                            </div>

                            {/* Status badge */}
                            <div
                              className={`status-badge status-${project.status?.toLowerCase()}`}
                              style={{ fontSize: "0.58rem" }}
                            >
                              {project.status.toUpperCase()}
                            </div>
                          </div>

                          {/* <div
                            className={`status-badge ${statusClass(
                              project.status.toUpperCase()
                            )}`}
                          >
                            {project.status || "N/A"}
                          </div> */}

                          {project.tasks?.length ? (
                            <div className="tasks-list">
                              {project.tasks.map((task) => (
                                <div key={task.id} className="task-item">
                                  <span className="task-name">
                                    {task.title}
                                  </span>
                                  <span
                                    className={`task-status ${statusClass(
                                      task.status
                                    )}`}
                                  >
                                    {task.status || "N/A"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <div className="no-projects">No projects assigned</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
