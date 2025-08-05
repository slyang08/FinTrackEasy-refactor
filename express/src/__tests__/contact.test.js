// express/src/__tests__/contact.test.js
import request from "supertest";

import ContactForm from "../models/Contact.js";
import app from "../server.js";

jest.mock("../models/Contact.js");

describe("Contact Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("POST /api/contact - should submit a contact form", async () => {
        const newContact = {
            name: "John Doe",
            email: "john@example.com",
            note: "Test note",
            termsAccepted: true,
        };

        ContactForm.create.mockResolvedValue(newContact);

        const response = await request(app).post("/api/contact").send(newContact);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Contact submitted");
        expect(ContactForm.create).toHaveBeenCalledWith({
            ...newContact,
            type: "general",
        });
    }, 15000);
});
