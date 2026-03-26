import React, { useState, useEffect } from "react";

function App() {
  const API_URL = "https://task-manager-63ey.onrender.com";

  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ================= FETCH =================
  const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/tasks`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
  };

  // ================= ADD =================
  const addTask = async () => {
    if (!text) return;

    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ title: text }),
    });

    setText("");
    fetchTasks();
  };

  // ================= DELETE =================
  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    fetchTasks();
  };

  // ================= TOGGLE =================
  const toggleTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    fetchTasks();
  };

  // ================= LOGIN =================
  const login = async () => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      fetchTasks();
    } else {
      alert("Login failed");
    }
  };

  // ================= REGISTER =================
  const register = async () => {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    alert(data.message);
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setTasks([]);
  };

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
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button onClick={login}>Login</button>
        <button onClick={register}>Register</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Task Manager 🚀</h1>

      <button onClick={logout}>Logout</button>

      <br /><br />

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter task"
      />
      <button onClick={addTask}>Add</button>

      <h3>Total Tasks: {tasks.length}</h3>

      {tasks.map((t) => (
        <div key={t._id}>
          <span
            onClick={() => toggleTask(t._id)}
            style={{
              cursor: "pointer",
              textDecoration: t.completed ? "line-through" : "none",
            }}
          >
            {t.title}
          </span>

          <button onClick={() => deleteTask(t._id)}>❌</button>
        </div>
      ))}
    </div>
  );
}

export default App;