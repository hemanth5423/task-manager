import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    if (editId) {
      await axios.put(`${API}/${editId}`, { title });
      setEditId(null);
    } else {
      await axios.post(API, { title });
    }

    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchTasks();
  };

  const toggleTask = async (id, completed) => {
    await axios.put(`${API}/${id}`, { completed: !completed });
    fetchTasks();
  };

  const editTask = (task) => {
    setTitle(task.title);
    setEditId(task._id);
  };

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Task Manager 🚀</h1>

        {/* Input */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />

          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 15px",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>

        {/* Search */}
        <input
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        {/* Stats */}
        <div style={{ marginBottom: "20px" }}>
          <strong>Total:</strong> {total} |{" "}
          <strong>Completed:</strong> {completed}
        </div>

        {/* Tasks */}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks
            .filter((t) =>
              t.title.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => a.completed - b.completed)
            .map((t) => (
              <li
                key={t._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#f9fafb",
                }}
              >
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() =>
                      toggleTask(t._id, t.completed)
                    }
                  />

                  <span
                    style={{
                      textDecoration: t.completed
                        ? "line-through"
                        : "none",
                      color: t.completed ? "gray" : "black",
                    }}
                  >
                    {t.title}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => editTask(t)}
                    style={{
                      background: "#3b82f6",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => deleteTask(t._id)}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    ❌
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default App;