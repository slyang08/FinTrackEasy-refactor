import * as z from "zod";

export const formSchema = z
    .object({
        txnDate: z.coerce.date(),
        txnCategory: z.string(),
        txnNote: z.string().max(30, "Note must be 30 characters or fewer").trim().optional(),
        txnAmount: z.coerce
            .number({
                invalid_type_error: "Amount must be a number",
                required_error: "Amount is required",
            })
            .positive("Amount must be positive")
            .refine((val) => !Number.isNaN(val), { message: "Amount must be a valid number" }),
        txnRecurring: z.boolean().optional(),
        txnCustomCategory: z
            .string()
            .max(20, "Custom category must be 20 characters or fewer")
            .trim()
            .optional(),
    })
    .refine(
        (data) => {
            return data.txnCategory !== "Other" || !!data.txnCustomCategory?.trim();
        },
        {
            message: "Please provide a custom category name",
            path: ["txnCustomCategory"],
        }
    );
