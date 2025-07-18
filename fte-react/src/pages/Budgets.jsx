import { useEffect, useState } from "react";

import api from "@/api/axios.js";

import BudgetCalendar from "../components/budget/BudgetCalendar";
import BudgetForm from "../components/budget/BudgetForm";
import BudgetItem from "../components/budget/BudgetItem";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog";

const today = new Date();

export default function Budgets() {
    const [dateRange, setDateRange] = useState({
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    });
    const [open, setOpen] = useState(false);
    const [currMonthBudgets, setCurrMonthBudgets] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [existBudgetCategories, setExistBudgetCategories] = useState([]);
    const [totalPerCategory, setTotalPerCategory] = useState({});
    const [isDeleted, setIsDeleted] = useState(false);

    // Fetch budgets
    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const res = await api.get("budgets", {
                    params: {
                        startDate: dateRange.from,
                        endDate: dateRange.to,
                    },
                });
                if (dateRange.from.getMonth() === today.getMonth()) {
                    setCurrMonthBudgets(res.data);
                }
                setBudgets(res.data);
            } catch (err) {
                console.log(err.message);
            }
        };
        fetchBudgets();
    }, [open, dateRange, isDeleted]);

    // Filter the categories of defined budgets
    // Use for the add budget form to filter out these categories
    useEffect(() => {
        const allCategories = currMonthBudgets.map((b) => b.category);
        setExistBudgetCategories(allCategories);
    }, [currMonthBudgets]);

    // Fetch expense to calculate the total expenses of each category
    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const params = {
                    startDate: dateRange.from,
                    endDate: dateRange.to,
                    categories: existBudgetCategories.join(","),
                };
                if (params.categories) {
                    const res = await api.get("expenses/filter", { params });
                    const expenses = res.data;
                    setTotalPerCategory(
                        expenses.reduce((acc, expense) => {
                            const category = expense.category;
                            acc[category] = (acc[category] || 0) + expense.amount;
                            return acc;
                        }, {})
                    );
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchExpense();
    }, [dateRange, existBudgetCategories, budgets]);

    return (
        <div className="min-h-screen p-6 mx-auto max-w-5xl">
            {/* Top Controls */}
            <div className="grid grid-cols-3 w-full">
                <div className="justify-self-start">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="report">Add New Budget</Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="self-center text-lg">
                                    Create New Budget
                                </DialogTitle>
                                <DialogDescription className="sr-only">
                                    Enter budget detail and create a new budget
                                </DialogDescription>
                            </DialogHeader>
                            <BudgetForm
                                setOpen={setOpen}
                                existBudgetCategories={existBudgetCategories}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="justify-self-center">
                    <BudgetCalendar dateRange={dateRange} setDateRange={setDateRange} />
                </div>
            </div>

            {/* Monthly Budget Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-center text-2xl">Monthly Budgets</CardTitle>
                </CardHeader>
                <CardContent>
                    {budgets.length > 0 ? (
                        budgets.map((budget) => {
                            return (
                                <BudgetItem
                                    key={budget.category}
                                    budget={budget}
                                    usedAmount={totalPerCategory[budget.category]}
                                    isDeleted={isDeleted}
                                    setIsDeleted={setIsDeleted}
                                />
                            );
                        })
                    ) : (
                        <div className="flex justify-center text-gray-500 my-5">
                            Looks like you did not set a budget for this month.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
