require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ================= MONGODB CONNECTION ================= //

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
  });

// ================= SCHEMA ================= //

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("Task", taskSchema);

// ================= ROUTES ================= //

// ✅ Root route (to avoid "Not Found")
app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

// ✅ Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add task
app.post("/tasks", async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
    });

    const saved = await task.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update task
app.put("/tasks/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete task
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SERVER ================= //

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});