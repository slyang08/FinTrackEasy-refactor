// src/controllers/userController.js
import User from "../models/User.js";

// @desc    Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get a single user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get current user info
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ user });
    } catch (err) {
        next(err);
    }
};

// @desc Update logged-in user's profile (nickname, phone, language)
export const updateProfile = async (req, res, next) => {
    try {
        // Get current login id (supports session or JWT)
        const currentUserId = req.user?._id?.toString() || req.userId;
        // Only allow owner to change itself information
        if (req.params.id !== currentUserId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const { nickname, phone, preferredLanguage } = req.body;
        const updateFields = {};
        if (nickname !== undefined) updateFields.nickname = nickname;
        if (phone !== undefined) updateFields.phone = phone;
        if (preferredLanguage !== undefined) updateFields.preferredLanguage = preferredLanguage;

        // Update and send back new data
        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateFields, {
            new: true,
            runValidators: true,
        }).lean();

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete user
export const deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
