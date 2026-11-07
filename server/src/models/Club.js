
const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Club name is required"],
            trim: true,
            unique: true
        },

        description: {
            type: String,
            required: [true, "Club description is required"],
            trim: true
        },

        category: {
            type: String,
            required: [true, "Club category is required"],
            trim: true
        },

        image: {
            type: String,
            default: ""
        },

        facultyCoordinator: {
            type: String,
            required: [true, "Faculty coordinator is required"],
            trim: true
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Club", clubSchema);
