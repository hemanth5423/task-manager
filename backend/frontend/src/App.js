import React, { useState, useEffect } from "react";

function App() {
  const API_URL = "https://task-manager-63ey.onrender.com";

  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/tasks`, {
      headers: { Authorization: token }
    });
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  // Add task
  const addTask = async () => {
    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ title: text })
    });
    setText("");
    fetchTasks();
  };

  // Delete
  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: token }
    });
    fetchTasks();
  };

  // Toggle
  const toggleTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { Authorization: token }
    });
    fetchTasks();
  };

  // Login
  const login = async () => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  // Register
  const register = async () => {
    await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    alert("Registered! Now login");
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  // LOGIN SCREEN
  if (!token) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>🔐 Login / Register</h2>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br /><br />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br /><br />
        <button onClick={login}>Login</button>
        <button onClick={register}>Register</button>
      </div>
    );
  }

  // TASK UI
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Task Manager 🚀</h1>
      <button onClick={logout}>Logout</button>

      <br /><br />

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter task..."
      />
      <button onClick={addTask}>Add</button>

      <h3>Total Tasks: {tasks.length}</h3>

      {tasks.map((t) => (
        <div key={t._id} style={{ margin: "10px" }}>
          <span style={{
            textDecoration: t.completed ? "line-through" : "none",
            marginRight: "10px"
          }}>
            {t.title}
          </span>

          <button onClick={() => toggleTask(t._id)}>✔</button>
          <button onClick={() => deleteTask(t._id)}>❌</button>
        </div>
      ))}
    </div>
  );
}

export default App;