import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import aclogo from "/aclogo.jpg";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessageType("error");
      setMessage("❌ Passwords do not match");
      return;
    }

    try {
      if (!isLogin) {
        // SIGN UP
        const response = await fetch("http://localhost:5008/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (response.ok) {
          setMessageType("success");
          setMessage("✅ Sign-up successful! You can now log in.");
          setIsLogin(true);
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        } else {
          const errData = await response.json();
          setMessageType("error");
          setMessage(
            "❌ Sign-up failed: " + (errData.message || response.statusText)
          );
        }
      } else {
        // LOGIN
        const response = await fetch("http://localhost:5008/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();

          // Save JWT and user info
          localStorage.setItem("token", data.token);
          localStorage.setItem("name", data.name);
          localStorage.setItem("userEmail", data.email);
          localStorage.setItem("userId", data.userId);

          // 👇 Force "users" as default page after login
          localStorage.setItem("defaultPage", "users");

          setMessageType("success");
          setMessage("✅ Login successful! Redirecting...");
          setTimeout(() => navigate("/"), 1500);
        } else if (response.status === 401) {
          setMessageType("error");
          setMessage("❌ Invalid credentials");
        } else {
          setMessageType("error");
          setMessage("❌ Login failed. Please try again.");
        }
      }
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage("⚠️ Server error: " + err.message);
    }
  };

  return (
    <div className="login-signup-container">
      <img src={aclogo} alt="Logo" className="login-icon" />
      <h1 className="portal-title">
        <span style={{ color: "red" }}>Access </span>
        <span style={{ color: "turquoise" }}>Group</span> Portal
      </h1>

      <div className="login-signup-form">
        <h2 className="form-heading">{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label>Full Name</label>
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label>Email</label>
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label>Password</label>
          </div>

          {!isLogin && (
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label>Confirm Password</label>
            </div>
          )}

          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>

        {message && <p className={`form-message ${messageType}`}>{message}</p>}

        <center>
          <span style={{ fontSize: "17px" }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </span>
        </center>
      </div>
    </div>
  );
};

export default LoginSignup;
