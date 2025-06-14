import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Category lists for filtering
const expenseCategoriesList = [
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

const incomeCategoriesList = [
    "Gift",
    "Salary",
    "Extra Income",
    "Loan",
    "Parental Leave",
    "Business",
    "Insurance Payout",
    "Other",
];

// function dateRangeToQueryParams(range) {
//     if (!range?.from) return "";
//     const params = new URLSearchParams();

//     if (range.from) {
//         params.append("from", range.from.toISOString());
//     }
//     if (range.to) {
//         params.append("to", range.to.toISOString());
//     }

//     return params.toString();
// }

function dateRangeToYearMonthParams(range) {
    if (!range?.from) return "";
    const params = new URLSearchParams();

    if (range.from) {
        params.append("year", range.from.getFullYear());
        params.append("month", range.from.getMonth() + 1);
    }

    return params.toString();
}

function useTransactions(dateRange, categories = []) {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!dateRange?.from) return;

        async function fetchData() {
            setLoading(true);
            setError(null);

            try {
                // const dateParams = dateRangeToQueryParams(dateRange);
                const dateParams = dateRangeToYearMonthParams(dateRange);

                // Split categories by type
                // const incomeCats = categories.filter((cat) => incomeCategoriesList.includes(cat));
                // const expenseCats = categories.filter((cat) => expenseCategoriesList.includes(cat));

                // Build separate query params for incomes and expenses
                const incomeParams = new URLSearchParams(dateParams);
                // if (incomeCats.length > 0) {
                //     incomeParams.append("category", incomeCats.join(","));
                // }

                const expenseParams = new URLSearchParams(dateParams);
                // if (expenseCats.length > 0) {
                //     expenseParams.append("category", expenseCats.join(","));
                // }

                const [incomeRes, expenseRes] = await Promise.all([
                    axios.get(`/api/incomes/filter?${incomeParams.toString()}`),
                    axios.get(`/api/expenses/filter?${expenseParams.toString()}`),
                ]);

                setIncomes(incomeRes.data);
                setExpenses(expenseRes.data);

                toast.success("Transactions loaded successfully");
            } catch (err) {
                setError(err);
                toast.error(`Failed to load transactions: ${err.message || err}`);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [dateRange, categories]); // removed refreshCounter here

    return { incomes, expenses, loading, error };
}

export default useTransactions;
