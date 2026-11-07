
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Database connection
const connectDB = require("./src/config/db");

// Routes
const adminRoutes = require("./src/routes/adminRoutes");
const clubRoutes = require("./src/routes/clubRoutes");
const authRoutes = require("./src/routes/authRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
const announcementRoutes = require("./src/routes/announcementRoutes");
const membershipRoutes = require("./src/routes/membershipRoutes");

// Middleware
const requestLogger = require("./src/middleware/requestLogger");
const errorMiddleware = require("./src/middleware/errorMiddleware");

// Initialize Express
const app = express();

// Built-in and custom middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Home route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "College Club Management Portal API is running"
    });
});

// Club APIs
app.use("/api/clubs", clubRoutes);

// Authentication APIs
app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/announcements", announcementRoutes);

app.use("/api/memberships", membershipRoutes);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

// Centralized error handling
app.use(errorMiddleware);

// Server configuration
const PORT = process.env.PORT || 5000;

// Connect database and start server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log("------------------------------------");
            console.log("College Club Management Portal");
            console.log(`Server running on http://localhost:${PORT}`);
            console.log("MongoDB connection established");
            console.log("------------------------------------");
        });
    } catch (error) {
        console.error("Unable to start server:", error.message);
        process.exit(1);
    }
};

startServer();
