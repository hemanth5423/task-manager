const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ================= DB =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// ================= MODELS =================
const User = mongoose.model("User", {
  email: String,
  password: String,
});

const Task = mongoose.model("Task", {
  title: String,
  completed: { type: Boolean, default: false },
  userId: String,
});

// ================= AUTH =================
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ================= ROUTES =================

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.json({ message: "User already exists" });

    await new User({ email, password }).save();

    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Register failed" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) return res.json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret123"
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// GET TASKS
app.get("/tasks", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

// ADD TASK
app.post("/tasks", auth, async (req, res) => {
  const task = await new Task({
    title: req.body.title,
    userId: req.userId,
  }).save();

  res.json(task);
});

// DELETE TASK
app.delete("/tasks/:id", auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// TOGGLE COMPLETE
app.put("/tasks/:id", auth, async (req, res) => {
  const task = await Task.findById(req.params.id);

  task.completed = !task.completed;
  await task.save();

  res.json(task);
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});