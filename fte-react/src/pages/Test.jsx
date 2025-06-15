import React, { useState } from "react";

import useFilteredIncomes from "@/hooks/useFilteredIncomes";

export default function Test() {
    const [dateRange, setDateRange] = useState({
        from: new Date("2025-01-01"),
        to: new Date("2025-12-31"),
    });

    // Example categories selected; change or connect to UI as needed
    const [selectedCategories, setSelectedCategories] = useState(["Salary", "Business"]);

    const { filteredIncomes, loadingIncomes, error } = useFilteredIncomes(
        dateRange,
        selectedCategories
    );

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Filtered Incomes Test</h2>

            {loadingIncomes && <p>Loading incomes...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loadingIncomes && !error && filteredIncomes.length === 0 && <p>No incomes found.</p>}

            <ul className="list-disc ml-6">
                {filteredIncomes.map((income) => (
                    <li key={income._id}>
                        {income.category} - ${income.amount} on{" "}
                        {new Date(income.date).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}
