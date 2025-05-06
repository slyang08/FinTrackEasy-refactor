// src/controllers/authController.js
import Account from "../models/Account.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
    console.log(req.body);

    const { nickname, email, password, confirmPassword, phone } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const user = await User.create({ nickname, email, phone });
        const account = await Account.create({ user: user._id, password });

        const token = generateToken({ userId: user._id, accountId: account._id });

        res.status(201).json({ token });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({
            message: "Registration failed",
            error: err.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Sorry, cannot find the user" });

        const account = await Account.findOne({ user: user._id }).select("+password");
        if (!account) return res.status(401).json({ message: "Sorry, cannot find the account" });

        const isMatch = await account.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: "Sorry, cannot match password" });

        const token = generateToken({ userId: user._id, accountId: account._id });
        res.status(200).json({
            token,
            user: {
                id: user._id,
                nickname: user.nickname,
                name: user.name,
                email: user.email,
                phone: user.phone,
                preferredLanguage: user.preferredLanguage,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
