const express = require("express");
const router = express.Router();

const {
    getAllClubs,
    getClubById,
    createClub,
    updateClub,
    deleteClub
} = require("../controllers/clubController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

// Anyone can view clubs
router.get("/", getAllClubs);
router.get("/:id", getClubById);

// Only logged-in Admins can manage clubs
router.post("/", protect, adminOnly, createClub);
router.put("/:id", protect, adminOnly, updateClub);
router.delete("/:id", protect, adminOnly, deleteClub);

module.exports = router;