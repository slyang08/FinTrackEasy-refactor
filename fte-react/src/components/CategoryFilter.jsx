// TO DO: add api functionality
// import api from "@/api/axios.js";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Categories for mapping, maybe dynamimcally load from user's expenses and incomes in the future
const expenseCategories = [
    { label: "Food & Drink", value: "Food & Drink" },
    { label: "Car", value: "Car" },
    { label: "Shopping", value: "Shopping" },
    { label: "Bills & Fees", value: "Bills & Fees" },
    { label: "Home", value: "Home" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Travel", value: "Travel" },
    { label: "Healthcare", value: "Healthcare" },
    { label: "Family & Personal", value: "Family & Personal" },
    { label: "Transport", value: "Transport" },
    { label: "Other", value: "Other" },
];

const incomeCategories = [
    { label: "Gift", value: "Gift" },
    { label: "Salary", value: "Salary" },
    { label: "Extra Income", value: "Extra Income" },
    { label: "Loan", value: "Loan" },
    { label: "Parental Leave", value: "Parental Leave" },
    { label: "Business", value: "Business" },
    { label: "Insurance Payout", value: "Insurance Payout" },
    { label: "Other", value: "Other" },
];

export default function CategoryFilter({ selectedCategories = [], onChange }) {
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
                                <label key={cat.value} className="flex items-center gap-2 text-xs">
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
                                <label key={cat.value} className="flex items-center gap-2 text-xs">
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
            </PopoverContent>
        </Popover>
    );
}
