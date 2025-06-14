import React, { useEffect, useState } from "react";

import api from "@/api/axios.js";

export default function Test() {
    const [transactions, setTransactions] = useState([]);

    const fetchFilteredTransactions = async ({ year, month, category }) => {
        try {
            const params = {};
            if (year) params.year = Number(year); // Convert to number if it's a string
            if (month) params.month = Number(month);
            if (category) params.category = category;

            const [incomeRes, expenseRes] = await Promise.all([
                api.get("/incomes/filter", { params }),
                api.get("/expenses/filter", { params }),
            ]);

            const incomes = incomeRes.data.map((txn) => ({ ...txn, type: "income" }));
            const expenses = expenseRes.data.map((txn) => ({ ...txn, type: "expense" }));

            setTransactions(
                [...incomes, ...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))
            );
        } catch (err) {
            console.error("Error fetching filtered transactions:", err);
        }
    };

    useEffect(() => {
        fetchFilteredTransactions({}); // ✅ no filters, but valid destructuring
    }, []);

    return (
        <div>
            <h1>Filtered Transactions</h1>
            <pre>{JSON.stringify(transactions, null, 2)}</pre>
        </div>
    );
}
