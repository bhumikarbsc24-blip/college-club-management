
const Event = require("../models/Event");

// Get all events
const getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find().sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            events
        });
    } catch (error) {
        next(error);
    }
};

// Get one event
const getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            event
        });
    } catch (error) {
        next(error);
    }
};

// Create an event
const createEvent = async (req, res, next) => {
    try {
        const { title, description, date, venue, category } = req.body;

        if (!title || !description || !date || !venue || !category) {
            return res.status(400).json({
                success: false,
                message: "Please provide title, description, date, venue and category"
            });
        }

        const event = await Event.create({
            title,
            description,
            date,
            venue,
            category
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            event
        });
    } catch (error) {
        next(error);
    }
};

// Update an event
const updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            event
        });
    } catch (error) {
        next(error);
    }
};

// Delete an event
const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Event deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
