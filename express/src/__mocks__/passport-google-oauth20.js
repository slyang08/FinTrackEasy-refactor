// src/__mocks__/passport-google-oauth20.js

export class Strategy {
    constructor(options, verify) {
        this.name = "google";
    }
    authenticate(req, options) {
        this.success({ id: "mock-google-id" });
    }
}
