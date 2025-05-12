// src/controllers/accountController.js
import Account from "../models/Account.js";

// @desc    Get all accounts for current user
export const getMyAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ user: req.userId });
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Create new account
export const createAccount = async (req, res) => {
    try {
        const { password } = req.body;
        const account = new Account({
            user: req.userId,
            password,
        });
        await account.save();
        res.status(201).json(account);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc    Update account status
// PATCH /api/accounts/:id/status
export const updateAccountStatus = async (req, res) => {
    const { status } = req.body;
    const validStatuses = ["Active", "Closed", "Frozen"];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid account status" });
    }

    try {
        const updated = await Account.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            { status },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Account not found" });

        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc    Delete account
export const deleteAccount = async (req, res) => {
    try {
        const deleted = await Account.findOneAndDelete({
            _id: req.params.id,
            user: req.userId,
        });
        if (!deleted) return res.status(404).json({ message: "Account not found" });
        res.json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
