
const Membership = require("../models/Membership");
const Club = require("../models/Club");

// Student requests to join a club
const joinClub = async (req, res, next) => {
    try {
        const { clubId } = req.params;

        const club = await Club.findById(clubId);

        if (!club) {
            return res.status(404).json({
                success: false,
                message: "Club not found"
            });
        }

        const existingMembership = await Membership.findOne({
            student: req.user._id,
            club: clubId
        });

        if (existingMembership) {
            return res.status(400).json({
                success: false,
                message: "You have already requested to join this club"
            });
        }

        const membership = await Membership.create({
            student: req.user._id,
            club: clubId
        });

        res.status(201).json({
            success: true,
            message: "Club joining request submitted successfully",
            membership
        });
    } catch (error) {
        next(error);
    }
};

// Student views their memberships
const getMyMemberships = async (req, res, next) => {
    try {
        const memberships = await Membership.find({
            student: req.user._id
        }).populate("club", "name category description");

        res.status(200).json({
            success: true,
            count: memberships.length,
            memberships
        });
    } catch (error) {
        next(error);
    }
};

// Admin views all membership requests
const getAllMemberships = async (req, res, next) => {
    try {
        const memberships = await Membership.find()
            .populate("student", "name email usn")
            .populate("club", "name category");

        res.status(200).json({
            success: true,
            count: memberships.length,
            memberships
        });
    } catch (error) {
        next(error);
    }
};

// Admin approves or rejects a request
const updateMembershipStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!["Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid membership status"
            });
        }

        const membership = await Membership.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!membership) {
            return res.status(404).json({
                success: false,
                message: "Membership request not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Membership status updated successfully",
            membership
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    joinClub,
    getMyMemberships,
    getAllMemberships,
    updateMembershipStatus
};
