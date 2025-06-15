import { useCallback, useEffect, useState } from "react";

import api from "../api/axios";

function formatToISODate(date) {
    if (!date) return "";
    return date.toISOString().slice(0, 10);
}

const useFilteredExpenses = (dateRange, selectedCategories) => {
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [loadingExpenses, setLoadingExpenses] = useState(false);
    const [error, setError] = useState(null);

    const fetchFilteredExpenses = useCallback(async () => {
        try {
            setLoadingExpenses(true);

            const params = {};

            if (dateRange?.from && dateRange?.to) {
                params.startDate = formatToISODate(dateRange.from);
                params.endDate = formatToISODate(dateRange.to);
            }

            if (selectedCategories?.length > 0) {
                params.categories = selectedCategories.join(",");
            }

            const res = await api.get("/Expenses/filter", { params });

            const expenses = res.data.map((txn) => ({
                ...txn,
                type: "Expense",
            }));

            setFilteredExpenses(expenses.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (err) {
            console.error("❌ Error fetching filtered Expenses:", err);
            setError("Failed to load Expenses.");
        } finally {
            setLoadingExpenses(false);
        }
    }, [dateRange, selectedCategories]);

    useEffect(() => {
        fetchFilteredExpenses();
    }, [fetchFilteredExpenses]);

    return { filteredExpenses, loadingExpenses, error };
};

export default useFilteredExpenses;
