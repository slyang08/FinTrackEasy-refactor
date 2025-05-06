// src/models/Account.js
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { hashPassword, isPasswordReused } from "../utils/password.js";

const accountSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
            select: false, // Use .select('+password') when needed
        },
        status: {
            type: String,
            enum: ["Active", "Closed", "Frozen"],
            default: "Active",
            index: true,
        },
        previousPasswords: [
            {
                hash: String,
                changedAt: Date,
            },
        ],
    },
    { timestamps: true }
);

// Composite Index
accountSchema.index({ user: 1, status: 1 });

// Password encryption middleware
accountSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        if (await isPasswordReused(this.password, this.previousPasswords)) {
            return next(new Error("New password cannot be the same as previous passwords."));
        }

        // Hash the password
        const hashed = await hashPassword(this.password);
        this.password = hashed;
        this.previousPasswords.push({ hash: hashed, changedAt: new Date() });

        // Keep up to 5 records
        if (this.previousPasswords.length > 5) this.previousPasswords.shift(); // Delete the oldest password record

        next();
    } catch (err) {
        next(err);
    }
});

// Add password comparison method (for login verification)
accountSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("Account", accountSchema);
