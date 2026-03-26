const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 DEBUG LOG
console.log("🚀 Server starting...");

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ✅ Schema
const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Task = mongoose.model("Task", taskSchema);

// ✅ ROOT ROUTE
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

// ✅ GET TASKS
app.get("/tasks", async (req, res) => {
  try {
    console.log("📥 GET /tasks called");

    const tasks = await Task.find();

    console.log("📦 Tasks:", tasks);

    res.json(tasks);
  } catch (err) {
    console.log("❌ ERROR in GET /tasks:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ ADD TASK
app.post("/tasks", async (req, res) => {
  try {
    console.log("📥 POST /tasks:", req.body);

    const newTask = new Task({
      text: req.body.text,
      completed: false,
    });

    await newTask.save();

    res.json(newTask);
  } catch (err) {
    console.log("❌ ERROR in POST /tasks:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});





