// src/controllers/savingController.js
import Goal from "../models/Goal.js";

/**
 * @route   GET /api/goals/:goalId/savings
 * @desc    Get all savings under a specific goal
 * @access  Public / Auth depends on your setup
 */
export const getSavings = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.goalId);
        if (!goal) return res.status(404).json({ message: "Goal not found" });

        res.json(goal.savings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * @route   POST /api/goals/:goalId/savings
 * @desc    Add a new saving item under a goal
 * @access  Public
 */
export const addSaving = async (req, res) => {
    const { name, amount } = req.body;

    try {
        const goal = await Goal.findById(req.params.goalId);
        if (!goal) return res.status(404).json({ message: "Goal not found" });

        const saving = {
            name,
            amount,
            date: Date.now(),
        };

        goal.savings.push(saving);
        goal.currentSaving += amount;
        await goal.save();

        res.status(201).json(goal.savings[goal.savings.length - 1]); // Return the newly added
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * @route   DELETE /api/goals/:goalId/savings/:savingId
 * @desc    Delete a saving item from a goal
 * @access  Public
 */
export const deleteSaving = async (req, res) => {
    const { goalId, savingId } = req.params;

    try {
        const goal = await Goal.findById(goalId);
        if (!goal) return res.status(404).json({ message: "Goal not found" });

        const saving = goal.savings.id(savingId);
        if (!saving) return res.status(404).json({ message: "Saving not found" });

        goal.currentSaving -= saving.amount;
        saving.remove();
        await goal.save();

        res.json({ message: "Saving deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * @route   PATCH /api/goals/:goalId/savings/:savingId
 * @desc    Update a saving item (name, amount, or date)
 * @access  Public
 */
export const updateSaving = async (req, res) => {
    const { goalId, savingId } = req.params;
    const { name, amount, date } = req.body;

    try {
        const goal = await Goal.findById(goalId);
        if (!goal) return res.status(404).json({ message: "Goal not found" });

        const saving = goal.savings.id(savingId);
        if (!saving) return res.status(404).json({ message: "Saving not found" });

        // Adjust currentSaving
        if (typeof amount === "number") {
            goal.currentSaving += amount - saving.amount;
            saving.amount = amount;
        }

        if (name !== undefined) saving.name = name;
        if (date !== undefined) saving.date = date;

        await goal.save();

        res.json(saving);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
