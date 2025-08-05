import { formSchema } from "../../schemas/formSchema";

describe("formSchema validation", () => {
    test("valid data passes validation", () => {
        const data = {
            txnDate: "2025-08-04",
            txnCategory: "Food & Drink",
            txnAmount: 20,
            txnNote: "Lunch with friends",
            txnRecurring: false,
        };

        expect(() => formSchema.parse(data)).not.toThrow();
    });

    test("txnNote longer than 30 characters fails", () => {
        const data = {
            txnDate: "2025-08-04",
            txnCategory: "Food & Drink",
            txnAmount: 20,
            txnNote: "a".repeat(31), // 31 characters
        };

        expect(() => formSchema.parse(data)).toThrow(/Note must be 30 characters or fewer/);
    });

    test("txnAmount must be a positive number", () => {
        const data = {
            txnDate: "2025-08-04",
            txnCategory: "Food & Drink",
            txnAmount: -5,
        };

        expect(() => formSchema.parse(data)).toThrow(/Amount must be positive/);
    });

    test("txnAmount must be a valid number", () => {
        const data = {
            txnDate: "2025-08-04",
            txnCategory: "Food & Drink",
            txnAmount: "abc", // invalid number
        };

        expect(() => formSchema.parse(data)).toThrow(/Amount must be a number/);
    });

    test('txnCategory "Other" requires txnCustomCategory', () => {
        const data = {
            txnDate: "2025-08-04",
            txnCategory: "Other",
            txnAmount: 20,
        };

        expect(() => formSchema.parse(data)).toThrow(/Please provide a custom category name/);

        // Valid if custom category is provided
        const validData = {
            txnDate: "2025-08-04",
            txnCategory: "Other",
            txnAmount: 20,
            txnCustomCategory: "Custom Category",
        };

        expect(() => formSchema.parse(validData)).not.toThrow();
    });

    test("txnCustomCategory max length 20 characters", () => {
        const data = {
            txnDate: "2025-08-04",
            txnCategory: "Other",
            txnAmount: 20,
            txnCustomCategory: "a".repeat(21), // 21 characters
        };

        expect(() => formSchema.parse(data)).toThrow(
            /Custom category must be 20 characters or fewer/
        );
    });

    test("txnNote is optional and trimmed", () => {
        const data = {
            txnDate: "2025-08-04",
            txnCategory: "Food & Drink",
            txnAmount: 20,
            txnNote: "  trimmed note  ",
        };

        const parsed = formSchema.parse(data);
        expect(parsed.txnNote).toBe("trimmed note");
    });

    test("txnDate is coerced to Date object", () => {
        const data = {
            txnDate: "2025-08-04T12:00:00Z",
            txnCategory: "Food & Drink",
            txnAmount: 20,
        };

        const parsed = formSchema.parse(data);
        expect(parsed.txnDate instanceof Date).toBe(true);
    });
});
