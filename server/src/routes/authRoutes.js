
const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Student registration
router.post("/register", registerUser);

// Student/Admin login
router.post("/login", loginUser);

// Protected profile route
router.get("/profile", protect, getProfile);

module.exports = router;
