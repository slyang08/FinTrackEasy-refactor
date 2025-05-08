// src/controllers/accountController.js
import Account from "../models/Account.js";
import { isPasswordReused } from "../utils/password.js";

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

// @desc    Change account password
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const accountId = req.params.accountId;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const account = await Account.findById(accountId).select(
            "+password previousPasswords user"
        );

        if (!account || !account.user || account.user.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const isMatch = await account.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        // Check if old password is reused (optional)
        if (await isPasswordReused(newPassword, account.previousPasswords)) {
            return res
                .status(400)
                .json({ message: "New password cannot be one of your previous passwords." });
        }

        // Store the old password (optional, it is recommended to store only the hash, not the plain text)
        account.previousPasswords = [
            ...(account.previousPasswords || []),
            { hash: account.password, changedAt: new Date() },
        ].slice(-5); // Only keep the last 5 times

        // Assign to new password
        account.password = newPassword;

        await account.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        next(err);
    }
};

// @desc    Reset account password
export const resetPassword = async (req, res, next) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const account = await Account.findById(req.params.id).select("+password");

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // You can add isAdmin judgment or verification process check
        account.password = newPassword;
        await account.save();

        res.json({ message: "Password reset successfully" });
    } catch (err) {
        next(err);
    }
};
