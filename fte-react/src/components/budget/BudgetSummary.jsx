import { useEffect, useState } from "react";

import api from "@/api/axios.js";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import BudgetItem from "./BudgetItem";

export default function BudgetSummary({ dateRange, confirmDelete, confirmEdit }) {
    const [date, setDate] = useState({});
    const [budgets, setBudgets] = useState({});
    const [sortedDate, setSortedDate] = useState({});
    const [isDeleted, setIsDeleted] = useState(false);
    const [totalPerCategory, setTotalPerCategory] = useState({});

    useEffect(() => {
        console.log(`Confirm Delete state: ${confirmDelete}`);
    }, [confirmDelete]);

    // Set date
    useEffect(() => {
        setDate({
            from: new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), 1),
            to: new Date(dateRange.to.getFullYear(), dateRange.to.getMonth() + 1, 0),
        });
    }, [dateRange]);

    // Fetch budgets
    useEffect(() => {
        if (!date.from || !date.to) return;

        const fetchBudgets = async () => {
            try {
                const res = await api.get("budgets", {
                    params: {
                        startDate: date.from,
                        endDate: date.to,
                    },
                });
                const data = res.data;
                setBudgets(
                    data.reduce((acc, item) => {
                        const convertedDate = new Date(item.dateRange.start);
                        const yearMonth = `${convertedDate.getFullYear()}-${String(convertedDate.getMonth() + 1).padStart(2, "0")}`;

                        if (!acc[yearMonth]) acc[yearMonth] = [];
                        acc[yearMonth].push(item);

                        return acc;
                    }, {})
                );
            } catch (err) {
                console.log(err.message);
            }
        };
        fetchBudgets();
    }, [date, isDeleted]);

    // Sort budgets
    useEffect(() => {
        const sortedKeys = Object.keys(budgets).sort((front, back) => back.localeCompare(front));
        console.log();
        const firstFive = sortedKeys.slice(0, 5);
        setSortedDate(firstFive);
    }, [budgets]);

    // Fetch usedAmount
    useEffect(() => {
        if (Object.keys(budgets).length === 0) return;
        if (confirmDelete !== confirmEdit) return;

        // Filter categories need to fetch for expense
        const categories = Object.entries(budgets).reduce((acc, [yearMonth, items]) => {
            const categories = items.map((b) => b.category);
            acc[yearMonth] = categories;
            return acc;
        }, {});

        // Fetch totals
        const fetchTotals = async () => {
            try {
                const results = await fetchExpensesByPeriodAndCategories(categories);
                const expenses = Object.fromEntries(results);
                const totals = Object.entries(expenses).reduce((acc, [yearMonth, expenses]) => {
                    acc[yearMonth] = expenses.reduce((sum, expense) => {
                        const category = expense.category;
                        sum[category] = (sum[category] || 0) + expense.amount;
                        return sum;
                    }, {});
                    return acc;
                }, {});
                setTotalPerCategory(totals);
            } catch (err) {
                console.log(err.message);
            }
        };
        fetchTotals();
    }, [budgets, confirmDelete, confirmEdit]);

    async function fetchExpensesByPeriodAndCategories(categories) {
        const promises = Object.entries(categories).map(async ([key, value]) => {
            const searchDate = new Date(key + "-02");
            const params = {
                startDate: new Date(searchDate.getFullYear(), searchDate.getMonth(), 1),
                endDate: new Date(searchDate.getFullYear(), searchDate.getMonth() + 1, 0),
                categories: value.join(","),
            };
            const res = await api.get("expenses/filter", { params });
            return [key, res.data];
        });
        return await Promise.all(promises);
    }

    return (
        <div className="h-full w-full">
            <Card className="max-h-80 pb-0">
                <CardHeader>
                    <CardTitle className="flex justify-center">Monthly Budget</CardTitle>
                </CardHeader>

                <CardContent className="max-h-[400px] overflow-y-auto  pt-5">
                    {sortedDate.length > 0 ? (
                        sortedDate.map((yearMonth, index) => (
                            <div key={yearMonth}>
                                <div className="font-semibold text-gray-700">
                                    {new Date(yearMonth + "-02").toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                    })}
                                </div>
                                {Array.isArray(budgets[yearMonth]) &&
                                    budgets[yearMonth].map((budget) => {
                                        const amount =
                                            totalPerCategory?.[yearMonth]?.[budget.category] || 0;
                                        return (
                                            <BudgetItem
                                                key={budget._id}
                                                budget={budget}
                                                usedAmount={amount}
                                                isDeleted={isDeleted}
                                                setIsDeleted={setIsDeleted}
                                                className="my-5"
                                            />
                                        );
                                    })}
                                {index < Object.keys(budgets).length - 1 && (
                                    <div className="mx-auto my-10 h-[2px] w-[80%] bg-gray-300 rounded" />
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center text-gray-400 py-10">
                            Looks like you did not set any budgets.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
