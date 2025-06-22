import Joi from "joi";

// General category options (you can also write them separately if you want to distinguish by category)
const incomeCategories = [
    "Salary",
    "Business",
    "Gift",
    "Extra Income",
    "Loan",
    "Parental Leave",
    "Insurance Payout",
    "Other",
];
const expenseCategories = [
    "Food & Drink",
    "Shopping",
    "Transport",
    "Home",
    "Bills & Fees",
    "Entertainment",
    "Groceries",
    "Car",
    "Travel",
    "Family & Personal",
    "Healthcare",
    "Other",
];

// Income filter schema
export const incomeFilterQuerySchema = Joi.object({
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref("startDate")).required(),
    categories: Joi.string()
        .custom((value, helpers) => {
            const arr = value.split(",");
            for (const c of arr) {
                if (!incomeCategories.includes(c.trim())) {
                    return helpers.error("any.invalid", { value: c });
                }
            }
            return value;
        }, "categories validation")
        .optional(),
});

// Expense filter schema
export const expenseFilterQuerySchema = Joi.object({
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref("startDate")).required(),
    categories: Joi.string()
        .custom((value, helpers) => {
            const arr = value.split(",");
            for (const c of arr) {
                if (!expenseCategories.includes(c.trim())) {
                    return helpers.error("any.invalid", { value: c });
                }
            }
            return value;
        }, "categories validation")
        .optional(),
});

// Income query verification
export const incomeQuerySchema = Joi.object({
    category: Joi.string()
        .valid(...incomeCategories)
        .optional(),
    year: Joi.number().integer().min(2000).max(2100).optional(),
    month: Joi.number().integer().min(1).max(12).optional(),
    date: Joi.date().iso().optional(), // If single-day query is supported
});

// Expenditure query verification
export const expenseQuerySchema = Joi.object({
    category: Joi.string()
        .valid(...expenseCategories)
        .optional(),
    year: Joi.number().integer().min(2000).max(2100).optional(),
    month: Joi.number().integer().min(1).max(12).optional(),
    date: Joi.date().iso().optional(),
});
