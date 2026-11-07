
const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Announcement title is required"],
            trim: true
        },
        message: {
            type: String,
            required: [true, "Announcement message is required"],
            trim: true
        },
        category: {
            type: String,
            required: [true, "Announcement category is required"],
            trim: true
        },
        publishedDate: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
