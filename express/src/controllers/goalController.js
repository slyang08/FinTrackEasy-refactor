// src/controllers/goalController.js
import mongoose from "mongoose";

import Goal from "../models/Goal.js";

// Helper: Check for valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @route   POST /api/goals
 * @desc    Create a new goal for the authenticated user
 * @access  Private
 */
export const createGoal = async (req, res, next) => {
    try {
        const { name, date, amount, currentSaving } = req.body;

        const goal = await Goal.create({
            name,
            date,
            amount,
            currentSaving,
            account: req.account._id,
        });
        res.status(201).json(goal);
    } catch (err) {
        next(err);
    }
};

/**
 * @route   GET /api/goals
 * @desc    Get all goals of the authenticated user
 * @access  Private
 */
export const getGoals = async (req, res, next) => {
    try {
        const goals = await Goal.find({ account: req.account._id }).sort({ createdAt: -1 });
        res.json(goals);
    } catch (err) {
        next(err);
    }
};

/**
 * @route   GET /api/goals/:id
 * @desc    Get a single goal by ID for the authenticated user
 * @access  Private
 */
export const getGoal = async (req, res) => {
    try {
        const goal = await Goal.findOne({ _id: req.params.id, account: req.account._id });
        if (!goal) return res.status(404).json({ error: "Goal not found" });
        res.status(200).json(goal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @route   PATCH /api/goals/:id
 * @desc    Update a goal for the authenticated user
 * @access  Private
 */
export const updateGoal = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid goal ID" });
        }

        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, account: req.account._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!goal) return res.status(404).json({ message: "Goal not found" });

        res.json(goal);
    } catch (err) {
        next(err);
    }
};

/**
 * @route   DELETE /api/goals/:id
 * @desc    Delete a goal for the authenticated user
 * @access  Private
 */
export const deleteGoal = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid goal ID" });
        }

        const deleted = await Goal.findOneAndDelete({
            _id: req.params.id,
            account: req.account._id,
        });

        if (!deleted) return res.status(404).json({ message: "Goal not found" });

        res.json({ message: "Goal deleted" });
    } catch (err) {
        next(err);
    }
};
