
const express = require("express");
const router = express.Router();

const {
    joinClub,
    getMyMemberships,
    getAllMemberships,
    updateMembershipStatus
} = require("../controllers/membershipController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

// Student routes
router.post("/join/:clubId", protect, joinClub);
router.get("/my-memberships", protect, getMyMemberships);

// Admin routes
router.get("/", protect, adminOnly, getAllMemberships);
router.put("/:id", protect, adminOnly, updateMembershipStatus);

module.exports = router;
