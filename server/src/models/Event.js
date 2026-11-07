
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Event title is required"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "Event description is required"],
            trim: true
        },
        date: {
            type: Date,
            required: [true, "Event date is required"]
        },
        venue: {
            type: String,
            required: [true, "Event venue is required"],
            trim: true
        },
        category: {
            type: String,
            required: [true, "Event category is required"],
            trim: true
        },
        status: {
            type: String,
            enum: ["Upcoming", "Completed", "Cancelled"],
            default: "Upcoming"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
