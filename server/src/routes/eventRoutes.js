
const express = require("express");
const router = express.Router();

const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

// Students and everyone can view events
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// Only Admin can manage events
router.post("/", protect, adminOnly, createEvent);
router.put("/:id", protect, adminOnly, updateEvent);
router.delete("/:id", protect, adminOnly, deleteEvent);

module.exports = router;
