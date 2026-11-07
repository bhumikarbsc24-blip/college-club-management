
const errorMiddleware = (err, req, res, next) => {
    console.error("Error:", err.message);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // MongoDB duplicate value error
    if (err.code === 11000) {
        statusCode = 400;
        message = "A club with this name already exists";
    }

    // MongoDB validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map(error => error.message)
            .join(", ");
    }

    // Invalid MongoDB ID
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = errorMiddleware;
