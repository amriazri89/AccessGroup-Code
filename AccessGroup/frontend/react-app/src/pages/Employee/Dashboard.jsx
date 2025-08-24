import React, { useEffect } from "react";
import "./Dashboard.css";

function Dashboard() {
  useEffect(() => {
    // Animate cards when page loads
    const cards = document.querySelectorAll(".employee-card");
    cards.forEach((card, index) => {
      card.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
    });
  }, []);

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Employee Projects Dashboard</h1>
        <p>Track team progress and project status in real-time</p>
      </div>

      <div className="stats-bar">
        <div className="stat">
          <div className="stat-number">12</div>
          <div className="stat-label">Total Employees</div>
        </div>
        <div className="stat">
          <div className="stat-number">28</div>
          <div className="stat-label">Active Projects</div>
        </div>
        <div className="stat">
          <div className="stat-number">85%</div>
          <div className="stat-label">Completion Rate</div>
        </div>
        <div className="stat">
          <div className="stat-number">6</div>
          <div className="stat-label">Overdue Tasks</div>
        </div>
      </div>

      <div className="content">
        <div className="employee-grid">
          {/* Example employee card */}
          <div className="employee-card">
            <div className="employee-header">
              <div className="employee-avatar">SA</div>
              <div className="employee-info">
                <h3>Sarah Anderson</h3>
                <div className="employee-role">Frontend Developer</div>
              </div>
            </div>

            <div className="projects-section">
              <div className="projects-header">
                <div className="projects-title">Current Projects</div>
                <div className="project-count">3 Projects</div>
              </div>

              <div className="project">
                <div className="project-info">
                  <div className="project-name">E-Commerce Redesign</div>
                  <div className="project-details">Due: Mar 15 • 12 days left</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "75%" }}></div>
                  </div>
                </div>
                <div className="status-badge status-active">Active</div>
              </div>
            </div>
          </div>
          {/* Add more employee cards same as HTML */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
