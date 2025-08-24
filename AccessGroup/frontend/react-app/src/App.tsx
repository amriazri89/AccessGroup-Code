import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/MainLayout/MainLayout";
import HomePage from "./pages/HomePage/HomePage";
import Dashboard from "./pages/Dashboard/Dashboard.bk";
import Project from "./pages/Project/Project";
import ProjectTask from "./pages/ProjectTask/ProjectTask";
import "./styles/style.css";
import Login from "./pages/Login/Login";
import Employee from "./pages/Employee/Employee";
function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/access/login" element={<Login/>} />
        <Route path="/access/dashboard" element={<Dashboard />} />
        <Route path="/access/project" element={<Project />} />
        <Route path="/access/project-task/:id" element={<ProjectTask />} />
        <Route path="/access/employee" element={<Employee />} />
      </Routes>
    </Router>
  );
}

export default App;
