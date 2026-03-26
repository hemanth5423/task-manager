import React, { useEffect, useState } from "react";

const API = "https://task-manager-63ey.onrender.com";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API}/tasks`);
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // Add task
  const addTask = async () => {
    if (!text.trim()) return;

    const res = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: text }),
    });

    const data = await res.json();
    setTasks([...tasks, data]);
    setText("");
  };

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`${API}/tasks/${id}`, {
      method: "DELETE",
    });

    setTasks(tasks.filter((t) => t._id !== id));
  };

  // Toggle complete
  const toggleTask = async (id) => {
    const res = await fetch(`${API}/tasks/${id}`, {
      method: "PUT",
    });

    const updated = await res.json();

    setTasks(tasks.map((t) => (t._id === id ? updated : t)));
  };

  // Edit task
  const editTask = async (id, oldText) => {
    const newText = prompt("Edit task:", oldText);
    if (!newText) return;

    const res = await fetch(`${API}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newText }),
    });

    const updated = await res.json();

    setTasks(tasks.map((t) => (t._id === id ? updated : t)));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚀 Task Manager</h1>

      {/* Input */}
      <div style={styles.inputBox}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter task..."
          style={styles.input}
        />
        <button onClick={addTask} style={styles.addBtn}>
          Add
        </button>
      </div>

      <p>Total Tasks: {tasks.length}</p>

      {/* Task list */}
      <div style={styles.list}>
        {tasks.map((task) => (
          <div key={task._id} style={styles.card}>
            <span
              onClick={() => toggleTask(task._id)}
              style={{
                ...styles.text,
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.title}
            </span>

            <div>
              <button
                onClick={() => editTask(task._id, task.title)}
                style={styles.editBtn}
              >
                ✏️
              </button>

              <button
                onClick={() => deleteTask(task._id)}
                style={styles.deleteBtn}
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "Arial",
  },
  title: {
    marginBottom: "20px",
  },
  inputBox: {
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    width: "220px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  addBtn: {
    padding: "10px 15px",
    marginLeft: "10px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  card: {
    background: "#f4f4f4",
    padding: "12px",
    margin: "10px",
    width: "320px",
    display: "flex",
    justifyContent: "space-between",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  text: {
    cursor: "pointer",
  },
  editBtn: {
    marginRight: "5px",
    background: "orange",
    border: "none",
    padding: "5px 8px",
    borderRadius: "5px",
  },
  deleteBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "5px 8px",
    borderRadius: "5px",
  },
};

export default App;