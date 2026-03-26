require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ✅ Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  completed: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("Task", taskSchema);

// ================= ROUTES ================= //

// ✅ Root route (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully!");
});

// ✅ Get all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// ✅ Add new task
app.post("/tasks", async (req, res) => {
  const newTask = new Task({
    title: req.body.title,
  });

  const savedTask = await newTask.save();
  res.json(savedTask);
});

// ✅ Update task
app.put("/tasks/:id", async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedTask);
});

// ✅ Delete task
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// ================= SERVER ================= //

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});