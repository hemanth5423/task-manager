import React, { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const API_URL = "https://task-manager-63ey.onrender.com";

  // ================= FETCH TASKS =================
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();

      console.log("Tasks:", data);

      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch tasks error:", err);
      alert("Failed to fetch tasks");
      setTasks([]);
    }
  };

  // ================= ADD TASK =================
  const addTask = async () => {
    if (!text) return;

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: text }),
      });

      const data = await res.json();
      console.log("Add task:", data);

      setText("");
      fetchTasks();
    } catch (err) {
      console.error("Add task error:", err);
      alert("Failed to add task");
    }
  };

  // ================= REGISTER =================
  const register = async () => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Register status:", res.status);

      const data = await res.json();
      console.log("Register response:", data);

      alert(data.message || "Registered successfully!");
    } catch (err) {
      console.error("Register error:", err);
      alert("Register failed");
    }
  };

  // ================= LOGIN =================
  const login = async () => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Login status:", res.status);

      const data = await res.json();
      console.log("Login response:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        fetchTasks();
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed");
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setTasks([]);
  };

  // ================= AUTO LOGIN =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchTasks();
    }
  }, []);

  // ================= UI =================

  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>🔐 Login / Register</h1>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button onClick={login}>Login</button>
        <button onClick={register} style={{ marginLeft: "10px" }}>
          Register
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Task Manager 🚀</h1>

      <button onClick={logout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      <br />

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter task..."
      />
      <button onClick={addTask}>Add</button>

      <h3>Total Tasks: {tasks.length}</h3>

      <ul style={{ listStyle: "none" }}>
        {tasks.map((task) => (
          <li key={task._id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;