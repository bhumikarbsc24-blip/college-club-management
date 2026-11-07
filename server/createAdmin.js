
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("./src/config/db");
const User = require("./src/models/User");

const createAdmin = async () => {
    try {
        await connectDB();

        const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

        if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
            throw new Error("Admin details are missing from .env");
        }

        if (ADMIN_PASSWORD.length < 6) {
            throw new Error("Admin password must have at least 6 characters");
        }

        const existingAdmin = await User.findOne({
            email: ADMIN_EMAIL.toLowerCase().trim()
        });

        if (existingAdmin) {
            throw new Error("An account with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

        const admin = await User.create({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: "Admin"
        });

        console.log("Admin account created successfully!");
        console.log("Admin email:", admin.email);
        console.log("Admin role:", admin.role);

    } catch (error) {
        console.error("Admin creation failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();
