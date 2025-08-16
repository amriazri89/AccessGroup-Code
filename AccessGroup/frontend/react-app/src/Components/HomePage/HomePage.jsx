import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaMoneyBillWave,
  FaChartBar,
  FaHome,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import "./HomePage.css";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement
);

function HomePage() {
  const [activePage, setActivePage] = useState("dashboard");
  const [username, setUsername] = useState("");
  const [userList, setUserList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ id: null, name: "", email: "" });
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  // ✅ Helper to get Authorization header
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch logged-in user's name
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      fetch(`http://localhost:5008/api/user/${storedUserId}`, {
        headers: getAuthHeader(),
      })
        .then((res) => res.json())
        .then((data) => setUsername(data.name))
        .catch((err) => console.error(err));
    }
  }, []);

  // Fetch users when MyAccessUser page is active
  useEffect(() => {
    if (activePage === "users") fetchUsers();
  }, [activePage]);

  const fetchUsers = () => {
    fetch("http://localhost:5008/api/user", {
      headers: getAuthHeader(),
    })
      .then((res) => res.json())
      .then((data) => setUserList(data))
      .catch((err) => console.error(err));
  };

  // CREATE user
  const handleAddUser = () => {
    fetch("http://localhost:5008/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(formData),
    })
      .then(() => {
        fetchUsers();
        setShowAddModal(false);
        setFormData({ name: "", email: "", password: "" });
      })
      .catch((err) => console.error(err));
  };

  // DELETE user
  const handleDeleteUser = (id) => {
    fetch(`http://localhost:5008/api/user/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    })
      .then(() => fetchUsers())
      .catch((err) => console.error(err));
  };

  // EDIT user
  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, password: "" });
    setShowEditModal(true);
  };

  const handleEditUser = () => {
    fetch(`http://localhost:5008/api/user/${selectedUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(formData),
    })
      .then(() => {
        fetchUsers();
        setShowEditModal(false);
        setSelectedUser({ id: null, name: "", email: "" });
        setFormData({ name: "", email: "", password: "" });
      })
      .catch((err) => console.error(err));
  };

  // Dummy chart data
  const barData = {
    labels: ["HR", "Finance", "IT", "Admin", "Projects"],
    datasets: [{ label: "Tasks Completed", data: [12, 19, 7, 15, 10], backgroundColor: "rgba(54, 162, 235, 0.6)" }],
  };
  const doughnutData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [{ data: [8, 12, 20], backgroundColor: ["#FF6384", "#36A2EB", "#4BC0C0"] }],
  };
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [{ label: "Monthly Revenue ($)", data: [3000, 4500, 4000, 6000, 7500], borderColor: "#36A2EB", fill: false }],
  };

  return (
    <div className="homepage-container">
      <aside className="sidebar">
        <h1 className="logo">Access Group</h1>
        <nav className="menu-links">
          <div className="menu-items">
            <button className="menu-btn" onClick={() => setActivePage("dashboard")}>
              <FaHome className="icon" /> Dashboard
            </button>
            <button className="menu-btn" onClick={() => setActivePage("finance")}>
              <FaMoneyBillWave className="icon" /> Finance
            </button>
            <button className="menu-btn" onClick={() => setActivePage("reports")}>
              <FaChartBar className="icon" /> Reports
            </button>
            <button className="menu-btn" onClick={() => setActivePage("users")}>
              <FaUsers className="icon" /> MyAccessUser
            </button>
          </div>
          <a href="/login" className="login-btn logout-btn">
            Logout
          </a>
        </nav>
      </aside>

      <main className="main-content">
        <section className="hero">
          {activePage === "dashboard" && (
            <>
              <h2>📊 Welcome <span>{username}</span></h2>
              <p>Here you can get an overview of HR, Finance, and Reports in one place.</p>
              <div className="charts">
                <div className="chart-card"><h3>Department Performance</h3><Bar data={barData} /></div>
                <div className="chart-card"><h3>Task Status</h3><Doughnut data={doughnutData} /></div>
              </div>
            </>
          )}

          {activePage === "salesReport" && (
            <div>
              <h2>📑 Sales Report</h2>
              <Line data={lineData} />
            </div>
          )}

          {activePage === "users" && (
            <div>
              <h2>👥 My Access Users</h2>
              <button className="add-user-btn" onClick={() => setShowAddModal(true)}>
                <FaPlus /> Add User
              </button>
              <table className="user-table">
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Email</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {userList.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <button onClick={() => openEditModal(user)}><FaEdit /></button>
                        <button onClick={() => handleDeleteUser(user.id)}><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="footer">
          © {new Date().getFullYear()} Access Group. All rights reserved.
        </footer>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add New User</h3>
              <input placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <input placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              <button onClick={handleAddUser}>Add</button>
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit User</h3>
              <input placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <input placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <input type="password" placeholder="Password (leave blank to keep current)" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              <button onClick={handleEditUser}>Save</button>
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;
