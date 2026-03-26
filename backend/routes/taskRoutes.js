const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// GET all tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// ADD task
router.post("/", async (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ error: "Title required" });
  }

  const task = new Task({
    title: req.body.title,
  });

  const saved = await task.save();
  res.json(saved);
});

// UPDATE task
router.put("/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;