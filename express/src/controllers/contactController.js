// src/controllers/contactController.js
import ContactForm from "../models/Contact.js";

// @route   POST /api/contact
// @access  Public
// @desc    Submit general contact form
export const submitContactForm = async (req, res, next) => {
    try {
        const contact = await ContactForm.create({
            ...req.body,
            type: "general",
        });
        res.status(201).json({ message: "Contact submitted", contact });
    } catch (err) {
        next(err);
    }
};

// @desc Submit trouble-login help form
export const submitLoginHelpForm = async (req, res, next) => {
    try {
        const contact = await ContactForm.create({
            email: req.body.email,
            type: "account-help",
        });
        res.status(201).json({ message: "Help request submitted", contact });
    } catch (err) {
        next(err);
    }
};

// @desc Get all contact forms
export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await ContactForm.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) {
        next(err);
    }
};

// @desc Get contact by ID
export const getContactById = async (req, res, next) => {
    try {
        const contact = await ContactForm.findById(req.params.id);
        if (!contact) return res.status(404).json({ message: "Contact not found" });
        res.json(contact);
    } catch (err) {
        next(err);
    }
};

// @desc Update contact status
export const updateContactStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const contact = await ContactForm.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        if (!contact) return res.status(404).json({ message: "Contact not found" });
        res.json({ message: "Status updated", contact });
    } catch (err) {
        next(err);
    }
};
