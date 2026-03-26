const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const SECRET = "mysecret";

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Models
const User = mongoose.model("User", {
  email: String,
  password: String
});

const Task = mongoose.model("Task", {
  title: String,
  completed: Boolean,
  userId: String
});


// 🔐 REGISTER
app.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ message: "Registered" });
  } catch {
    res.status(400).json({ error: "Registration failed" });
  }
});


// 🔐 LOGIN
app.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);

  if (!user) return res.status(400).json({ error: "Invalid user" });

  const token = jwt.sign({ id: user._id }, SECRET);
  res.json({ token });
});


// 🔐 AUTH MIDDLEWARE
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};


// 📌 GET TASKS
app.get("/tasks", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});


// ➕ ADD TASK
app.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    title: req.body.title,
    completed: false,
    userId: req.userId
  });
  await task.save();
  res.json(task);
});


// ✅ TOGGLE TASK
app.put("/tasks/:id", auth, async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.json(task);
});


// ❌ DELETE TASK
app.delete("/tasks/:id", auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});


app.listen(5000, () => console.log("Server running"));