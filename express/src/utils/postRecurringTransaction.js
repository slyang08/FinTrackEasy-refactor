import cron from "node-cron";

import Expense from "../models/Expense.js";
import Income from "../models/Income.js";

// Recurring Job for handling recurring transaction
export default async function startRecurringTransaction() {
    cron.schedule("0 0 * * *", async () => {
        console.log(`[${new Date().toISOString()}] Start posting Recurring Transaction`);

        // Post recurring transactions
        await Promise.all([
            saveNewTransactions(Expense, "Expense"),
            saveNewTransactions(Income, "Income"),
        ]);

        console.log(`[${new Date().toISOString()}] Recurring Transaction End`);
    });
}

async function saveNewTransactions(Model, label) {
    // Get the day of toady's date
    const today = new Date().getDate();

    // Retrieve all recurring transactions
    const recurring = await Model.aggregate([
        { $match: { isRecurring: true } },
        { $addFields: { dayOfMonth: { $dayOfMonth: "$date" } } },
        { $match: { dayOfMonth: today } },
    ]);

    // Return immediately when no recurring record found
    if (!recurring.length) {
        console.log("No recurring transactions to post today.");
        return;
    }

    // Map all recurring transaction to new object which only have account, category, amount, and note
    const newTransactions = recurring.map(({ account, category, amount, note }) => ({
        account,
        category,
        amount,
        note,
    }));

    // Insert all recurring transactions
    try {
        const results = await Model.insertMany(newTransactions);
        console.log(`[${label}] Posted ${results}`);
    } catch (err) {
        console.log(`[${label}] Cannot posted recurring transaction: ${err}`);
    }
}
