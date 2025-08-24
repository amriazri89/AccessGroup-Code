import React, { useState, useEffect } from "react";
import MainLayout from "../../components/MainLayout/MainLayout";
import UserService from "../../services/UserService";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./Employee.css";

const Employee = () => {
      useEffect(() => {
        document.title = "Access Employee "; // set tab name
      }, []);
    
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeForm, setEmployeeForm] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    role: "",       // 🔹 Added role field
    password: ""
  });

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const res = await UserService.getAll();
      setEmployees(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setEmployeeForm({
        id: employee.id,
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        department: employee.department || "",
        position: employee.position || "",
        role: employee.role || "",   // 🔹 Fill role when editing
      });
    } else {
      setEditingEmployee(null);
      setEmployeeForm({
        id: null,
        name: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        role: "",   // 🔹 Reset role
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) =>
    setEmployeeForm({ ...employeeForm, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await UserService.update(editingEmployee.id, employeeForm);
      } else {
        await UserService.create(employeeForm);
      }
      await fetchEmployees();
      setEmployeeForm({
        id: null,
        name: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        role: "",   // 🔹 reset role
      });
      setEditingEmployee(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await UserService.delete(id);
      await fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <MainLayout>
      <div className="employee-page">
        <div className="employee-header">
          <h1>Employees</h1>
        </div>
        <p>List of all employees.</p>
        <button className="create-btn" onClick={() => handleOpenModal()}>
          + Add Employee
        </button>

        <br></br>
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Position</th>
              <th>Role</th> {/* 🔹 New Column */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(employees) && employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name || "-"}</td>
                  <td>{emp.email || "-"}</td>
                  <td>{emp.phone || "-"}</td>
                  <td>{emp.department || "-"}</td>
                  <td>{emp.position || "-"}</td>
                  <td>{emp.role || "-"}</td> {/* 🔹 Display role */}
                  <td>
                    <FaEdit
                      className="action-icon edit-icon"
                      onClick={() => handleOpenModal(emp)}
                      title="Edit Employee"
                      style={{ cursor: "pointer", marginRight: "10px" }}
                    />
                    <FaTrash
                      className="action-icon delete-icon"
                      onClick={() => handleDelete(emp.id)}
                      title="Delete Employee"
                      style={{ cursor: "pointer", color: "red" }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{editingEmployee ? "Edit Employee" : "Add New Employee"}</h2>
              <form onSubmit={handleSubmit} className="modal-form">
                <button
                    type="button"
                    className="x-btn"
                    onClick={handleCloseModal}
                  >
                    x
                  </button>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={employeeForm.name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={employeeForm.email}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Phone:
                  <input
                    type="text"
                    name="phone"
                    value={employeeForm.phone}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Department:
                  <input
                    type="text"
                    name="department"
                    value={employeeForm.department}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Position:
                  <input
                    type="text"
                    name="position"
                    value={employeeForm.position}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Role:  {/* 🔹 New Input */}
                  <select
                    name="role"
                    value={employeeForm.role}
                    onChange={handleChange}
                    required
                  ><option value="User">User</option>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </label>

                <div className="modal-actions">
                  <button type="submit" className="create-btn">
                    {editingEmployee ? "Update" : "Add"}
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

export default Employee;
