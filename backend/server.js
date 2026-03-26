const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ================= MONGODB =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ================= SCHEMA =================
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const TaskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
});

const User = mongoose.model("User", UserSchema);
const Task = mongoose.model("Task", TaskSchema);

// ================= ROUTES =================

// 👉 Register
app.post("/register", async (req, res) => {
  try {
    console.log("Register body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ message: "Email & password required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.log("Register error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// 👉 Login
app.post("/login", async (req, res) => {
  try {
    console.log("Login body:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.json({ message: "Invalid credentials" });
    }

    // Simple token
    res.json({ token: "dummy-token" });
  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

// 👉 Get Tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// 👉 Add Task
app.post("/tasks", async (req, res) => {
  try {
    const task = new Task({ title: req.body.title });
    await task.save();
    res.json(task);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});