// src/jest.process-exit-mock.js
jest.spyOn(process, "exit").mockImplementation((code) => {
    throw new Error("[JEST-MOCK] process.exit: " + code);
});
