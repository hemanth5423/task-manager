import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://task-manager-63ey.onrender.com/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [search, setSearch] = useState("");

  // ✅ Fetch tasks
  const fetchTasks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Add task
  const addTask = async () => {
    if (!newTask.trim()) return;

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask }),
    });

    setNewTask("");
    fetchTasks();
  };

  // ✅ Delete task
  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    fetchTasks();
  };

  // ✅ Toggle complete
  const toggleTask = async (task) => {
    await fetch(`${API_URL}/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });

    fetchTasks();
  };

  // ✅ Edit task
  const editTask = async (task) => {
    const updatedTitle = prompt("Edit task:", task.title);
    if (!updatedTitle) return;

    await fetch(`${API_URL}/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: updatedTitle }),
    });

    fetchTasks();
  };

  // ✅ Filter tasks
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="App">
      <h1>Task Manager 🚀</h1>

      {/* Add Task */}
      <div>
        <input
          type="text"
          placeholder="Enter task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Stats */}
      <h3>Total Tasks: {tasks.length}</h3>
      <h3>Completed: {completedCount}</h3>

      {/* Task List */}
      {filteredTasks.map((task) => (
        <div key={task._id} className="task">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task)}
          />

          <span
            style={{
              textDecoration: task.completed ? "line-through" : "none",
            }}
          >
            {task.title}
          </span>

          <button onClick={() => editTask(task)}>Edit</button>
          <button onClick={() => deleteTask(task._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;