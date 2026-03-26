const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// Schema
const taskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);

// ================= ROUTES =================

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Task Manager API Running");
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.log("❌ GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add task
app.post("/tasks", async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title,
    });

    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    console.log("❌ POST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update task (Edit + Toggle)
app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // If title is sent → edit
    if (req.body.title) {
      task.title = req.body.title;
    } 
    // Else → toggle complete
    else {
      task.completed = !task.completed;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    console.log("❌ PUT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.log("❌ DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});