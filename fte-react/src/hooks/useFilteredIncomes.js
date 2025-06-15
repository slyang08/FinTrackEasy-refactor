import { useCallback,useEffect, useState } from "react";

import api from "../api/axios";

function formatToISODate(date) {
    if (!date) return "";
    return date.toISOString().slice(0, 10);
}

const useFilteredIncomes = (dateRange, selectedCategories) => {
    const [filteredIncomes, setFilteredIncomes] = useState([]);
    const [loadingIncomes, setLoadingIncomes] = useState(false);
    const [error, setError] = useState(null);

    const fetchFilteredIncomes = useCallback(async () => {
        try {
            setLoadingIncomes(true);

            const params = {};

            if (dateRange?.from && dateRange?.to) {
                params.startDate = formatToISODate(dateRange.from);
                params.endDate = formatToISODate(dateRange.to);
            }

            if (selectedCategories?.length > 0) {
                params.categories = selectedCategories.join(",");
            }

            const res = await api.get("/incomes/filter", { params });

            const incomes = res.data.map((txn) => ({
                ...txn,
                type: "income",
            }));

            setFilteredIncomes(incomes.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (err) {
            console.error("❌ Error fetching filtered incomes:", err);
            setError("Failed to load incomes.");
        } finally {
            setLoadingIncomes(false);
        }
    }, [dateRange, selectedCategories]);

    useEffect(() => {
        fetchFilteredIncomes();
    }, [fetchFilteredIncomes]);

    return { filteredIncomes, loadingIncomes, error };
};

export default useFilteredIncomes;
