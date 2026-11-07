
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify whether the user is logged in
const protect = async (req, res, next) => {
    try {
        let token;

        // Read token from Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Please log in."
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user in MongoDB
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User account not found"
            });
        }

        // Attach logged-in user to request
        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please log in again."
        });
    }
};

// Allow only Admin users
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "Admin") {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
    });
};

module.exports = {
    protect,
    adminOnly
};
