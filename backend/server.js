require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ Routes
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ✅ Root route (for testing)
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

// ✅ Port (IMPORTANT for deployment)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});