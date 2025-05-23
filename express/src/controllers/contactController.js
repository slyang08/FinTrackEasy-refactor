// src/controllers/contactController.js
import ContactForm from "../models/Contact.js";
import sendEmail from "../utils/sendEmail.js";

// @route   POST /api/contact
// @access  Public
// @desc    Submit general contact form
export const submitContactForm = async (req, res, next) => {
    try {
        const contact = await ContactForm.create({
            ...req.body,
            type: "general",
        });

        // Send a letter to the administrator
        await sendEmail(
            "fintrackeasy@gmail.com",
            "New Contact Us Submission",
            `<p>Name: ${contact.name || ""}<br/>
                Email: ${contact.email}<br/>
                Phone: ${contact.phone || ""}<br/>
                Description: ${contact.description || ""}</p>`
        );
        res.status(201).json({ message: "Contact submitted", contact });
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
