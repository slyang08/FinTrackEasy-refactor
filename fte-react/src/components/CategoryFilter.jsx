// TO DO: add api functionality
// import api from "@/api/axios.js";

import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";

import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// TO DO: Hook up backend route to api/categories, wait for a fix
// for sorting the expense and income categories, only returns a flat array at this time

const allIncome = [
    "Gift",
    "Salary",
    "Extra Income",
    "Loan",
    "Parental Leave",
    "Business",
    "Insurance Payout",
    "Other",
];

const allExpense = [
    "Food & Drink",
    "Car",
    "Shopping",
    "Bills & Fees",
    "Home",
    "Entertainment",
    "Travel",
    "Healthcare",
    "Family & Personal",
    "Transport",
    "Other",
];

export default function CategoryFilter({ selectedCategories = [], onChange, dateRange }) {
    const [incomeCategories, setIncomeCategories] = useState([]);
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchCategories() {
            setLoading(true);

            const startDate = dateRange?.from;
            const endDate = dateRange?.to;

            try {
                if (startDate && endDate) {
                    // Fetch income categories
                    const incomeRes = await api.get("/incomes/getIncomeCategories", {
                        params: { startDate, endDate },
                    });

                    // Fetch expense categories
                    const expenseRes = await api.get("/expenses/getExpenseCategories", {
                        params: { startDate, endDate },
                    });

                    const income = incomeRes.data || [];
                    const expense = expenseRes.data || [];

                    setIncomeCategories(income.map((c) => ({ label: c, value: c })));
                    setExpenseCategories(expense.map((c) => ({ label: c, value: c })));
                } else {
                    // If no dateRange, get all categories without filtering
                    const incomeRes = await api.get("/income/getIncomeCategories");
                    const expenseRes = await api.get("/expense/getExpenseCategories");

                    setIncomeCategories(
                        (incomeRes.data || []).map((c) => ({ label: c, value: c }))
                    );
                    setExpenseCategories(
                        (expenseRes.data || []).map((c) => ({ label: c, value: c }))
                    );
                }
            } catch (err) {
                console.error("Failed to fetch categories", err);
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, [dateRange]);

    const toggleCategory = (value) => {
        if (!onChange) return;
        if (selectedCategories.includes(value)) {
            onChange(selectedCategories.filter((v) => v !== value));
        } else {
            onChange([...selectedCategories, value]);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="block w-full md:inline-block md:w-auto" variant="outline">
                    Filter by Categories
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full max-w-[450px] max-h-[300px] overflow-y-auto">
                {loading ? (
                    <Button size="sm" disabled>
                        <Loader2Icon className="animate-spin" />
                        Loading categories...
                    </Button>
                ) : incomeCategories.length === 0 && expenseCategories.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        No categories found for the selected period.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-2">
                        {/* Income Column */}
                        <div>
                            <Label className="text-sm font-medium text-green-600 mb-2 block">
                                Income
                            </Label>
                            <div
                                className={`grid gap-2 ${
                                    incomeCategories.length >= 10 ? "grid-cols-2" : "grid-cols-1"
                                }`}
                            >
                                {incomeCategories.map((cat) => (
                                    <label
                                        key={cat.value}
                                        className="flex items-center gap-2 text-xs"
                                    >
                                        <Checkbox
                                            checked={selectedCategories.includes(cat.value)}
                                            onCheckedChange={() => toggleCategory(cat.value)}
                                        />
                                        <span>{cat.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Expense Column */}
                        <div>
                            <Label className="text-sm font-medium text-red-600 mb-2 block">
                                Expense
                            </Label>
                            <div
                                className={`grid gap-2 ${
                                    expenseCategories.length >= 10 ? "grid-cols-2" : "grid-cols-1"
                                }`}
                            >
                                {expenseCategories.map((cat) => (
                                    <label
                                        key={cat.value}
                                        className="flex items-center gap-2 text-xs"
                                    >
                                        <Checkbox
                                            checked={selectedCategories.includes(cat.value)}
                                            onCheckedChange={() => toggleCategory(cat.value)}
                                        />
                                        <span>{cat.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
