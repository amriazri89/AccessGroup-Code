import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import aclogo from "/aclogo.jpg";
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { to: "/access/dashboard", label: "Dashboard" },
    { to: "/access/project", label: "Project" },
    { to: "/access/employee", label: "Employee" },
  ];



  return (
    <aside className="sidebar">
        <br></br><img src={aclogo} alt="Logo"   style={{ display: "inline", verticalAlign: "middle",marginTop: "20px" }} 
/>
      <nav className="sidebar-nav">
        <ul>
          {items.map((it) => (
            <li
              key={it.to}
              className={location.pathname === it.to ? "active" : ""}
            >
              <Link to={it.to}>{it.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

     
    </aside>
  );
};

export default Sidebar;
