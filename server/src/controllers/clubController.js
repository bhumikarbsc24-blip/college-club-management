
const Club = require("../models/Club");

// 1. Get all clubs
const getAllClubs = async (req, res, next) => {
    try {
        const clubs = await Club.find();

        res.status(200).json({
            success: true,
            count: clubs.length,
            clubs
        });
    } catch (error) {
        next(error);
    }
};

// 2. Get a single club by ID
const getClubById = async (req, res, next) => {
    try {
        const club = await Club.findById(req.params.id);

        if (!club) {
            return res.status(404).json({
                success: false,
                message: "Club not found"
            });
        }

        res.status(200).json({
            success: true,
            club
        });
    } catch (error) {
        next(error);
    }
};

// 3. Create a new club
const createClub = async (req, res, next) => {
    try {
        const { name, description, category, facultyCoordinator, image } = req.body;

        if (!name || !description || !category || !facultyCoordinator) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, description, category and faculty coordinator"
            });
        }

        const club = await Club.create({
            name,
            description,
            category,
            facultyCoordinator,
            image
        });

        res.status(201).json({
            success: true,
            message: "Club created successfully",
            club
        });
    } catch (error) {
        next(error);
    }
};

// 4. Update a club
const updateClub = async (req, res, next) => {
    try {
        const club = await Club.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!club) {
            return res.status(404).json({
                success: false,
                message: "Club not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Club updated successfully",
            club
        });
    } catch (error) {
        next(error);
    }
};

// 5. Delete a club
const deleteClub = async (req, res, next) => {
    try {
        const club = await Club.findByIdAndDelete(req.params.id);

        if (!club) {
            return res.status(404).json({
                success: false,
                message: "Club not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Club deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllClubs,
    getClubById,
    createClub,
    updateClub,
    deleteClub
};
