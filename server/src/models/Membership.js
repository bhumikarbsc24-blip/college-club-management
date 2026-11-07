
const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        club: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Club",
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending"
        }
    },
    { timestamps: true }
);

// Prevent duplicate club joining requests
membershipSchema.index(
    { student: 1, club: 1 },
    { unique: true }
);

module.exports = mongoose.model("Membership", membershipSchema);
