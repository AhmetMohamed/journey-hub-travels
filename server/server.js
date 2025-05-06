const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const authRoutes = require("./routes/auth");
const routeRoutes = require("./routes/routes");
const scheduleRoutes = require("./routes/schedules");
const bookingRoutes = require("./routes/bookings");
const statsRoutes = require("./routes/stats");
const reportsRoutes = require("./routes/reports");
const userRoutes = require("./routes/users");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// app.use(cors({
//   origin: process.env.NODE_ENV === "production"
//     ? process.env.FRONTEND_URL || "*" // Allow any origin by default or use specific URL
//     : "http://localhost:8080",
//   credentials: true
// }));
app.use(
  cors({
    origin: "https://sahal-bus-client.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/users", userRoutes);

// For Vercel, we won't serve static files directly as that's handled by the vercel.json routing
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// MongoDB Connection URL - use environment variable if available
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://sahaltransportbus:sahal2025@cluster0.kpkxz12.mongodb.net/sahal-bus";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB at", MONGODB_URI))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// For Vercel, export the Express app as a module
module.exports = app;

// Only listen on a port if this file is run directly (not when imported by Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
