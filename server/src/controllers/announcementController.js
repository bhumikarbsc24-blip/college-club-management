
const Announcement = require("../models/Announcement");

// Get all announcements
const getAllAnnouncements = async (req, res, next) => {
    try {
        const announcements = await Announcement.find()
            .sort({ publishedDate: -1 });

        res.status(200).json({
            success: true,
            count: announcements.length,
            announcements
        });
    } catch (error) {
        next(error);
    }
};

// Create announcement
const createAnnouncement = async (req, res, next) => {
    try {
        const { title, message, category } = req.body;

        if (!title || !message || !category) {
            return res.status(400).json({
                success: false,
                message: "Please provide title, message and category"
            });
        }

        const announcement = await Announcement.create({
            title,
            message,
            category
        });

        res.status(201).json({
            success: true,
            message: "Announcement published successfully",
            announcement
        });
    } catch (error) {
        next(error);
    }
};

// Delete announcement
const deleteAnnouncement = async (req, res, next) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(
            req.params.id
        );

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Announcement deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllAnnouncements,
    createAnnouncement,
    deleteAnnouncement
};
