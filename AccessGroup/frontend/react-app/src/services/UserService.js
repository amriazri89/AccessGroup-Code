import api from "./api";

export default class UserService {
  // 🔹 Login user
  static async login(email, password) {
    try {
      const res = await api.post("/auth/login", { email, password });

      const data = res.data || {};

      // ✅ Always check values before storing
      if (data.token) localStorage.setItem("token", data.token);
      if (data.name) localStorage.setItem("name", data.name);
      if (data.email) localStorage.setItem("userEmail", data.email);
      if (data.userId) localStorage.setItem("userId", data.userId);
      if (data.role) localStorage.setItem("role", data.role);

      // default page fallback
      localStorage.setItem("defaultPage", "users");

      return data;
    } catch (err) {
      // ✅ Always check for JSON, otherwise fallback gracefully
      const status = err.response?.status;
      const backendMessage = err.response?.data?.message;

      if (status === 401) {
        throw new Error("Invalid credentials");
      }

      if (backendMessage) {
        throw new Error(backendMessage);
      }

      // if backend gave HTML or no structured error
      throw new Error("Login failed. Please try again.");
    }
  }

  // 🔹 Signup / Create user
  static async create({
    name,
    email,
    password = "123",
    phone,
    department,
    position,
    role = "User",
  }) {
    try {
      const res = await api.post("/user", {
        name,
        email,
        password,
        phone,
        department,
        position,
        role,
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to create user");
    }
  }

  // 🔹 Get all users
  static async getAll() {
    try {
      const res = await api.get("/user");
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to fetch users");
    }
  }

  // 🔹 Get single user by ID
  static async getById(userId) {
    try {
      const res = await api.get(`/user/${userId}`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to fetch user");
    }
  }

  // 🔹 Update user
  static async update(userId, { name, email, phone, department, position, role }) {
    try {
      const res = await api.put(`/user/${userId}`, {
        name,
        email,
        phone,
        department,
        position,
        role,
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to update user");
    }
  }

  // 🔹 Delete user
  static async delete(userId) {
    try {
      await api.delete(`/user/${userId}`);
      return true;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to delete user");
    }
  }

  // 🔹 Logout
  static logout() {
    localStorage.clear(); 
  }
}
