const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Mongo Error:", err));

// ✅ Schema
const taskSchema = new mongoose.Schema({
  text: String,
});

const Task = mongoose.model("Task", taskSchema);

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ GET tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.log("❌ GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST task
app.post("/tasks", async (req, res) => {
  try {
    const newTask = new Task({ text: req.body.text });
    const saved = await newTask.save();
    res.json(saved);
  } catch (err) {
    console.log("❌ POST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));