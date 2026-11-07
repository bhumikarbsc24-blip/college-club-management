
const express = require("express");

const router = express.Router();

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

// Admin dashboard - only authenticated Admin users
router.get("/dashboard", protect, adminOnly, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the Admin Dashboard!",
        admin: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
});

module.exports = router;
