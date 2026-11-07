
const express = require("express");
const router = express.Router();

const {
    getAllAnnouncements,
    createAnnouncement,
    deleteAnnouncement
} = require("../controllers/announcementController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

// Anyone can view announcements
router.get("/", getAllAnnouncements);

// Only Admin can publish or delete announcements
router.post("/", protect, adminOnly, createAnnouncement);
router.delete("/:id", protect, adminOnly, deleteAnnouncement);

module.exports = router;
