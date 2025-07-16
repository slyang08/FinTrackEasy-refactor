import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import api from "@/api/axios.js";
import { expenseCategories } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const categories = expenseCategories;
const formSchema = z.object({
    budgetName: z.string().min(1, "Name is required"),
    budgetAmount: z.coerce
        .number({ invalid_type_error: "Please enter a valid number" })
        .min(0, "Budget must be at least 0"),
    budgetCategory: z.string(),
    budgetDuration: z.string(),
});

export default function BudgetForm({ setOpen, existBudgetCategories }) {
    const [budgetCategories, setBudgetCategories] = useState([]);

    // Remove all categories with a defined budget
    useEffect(() => {
        setBudgetCategories(
            categories.filter(({ value }) => !existBudgetCategories.includes(value))
        );
    }, [existBudgetCategories]);

    // Form Schema
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            budgetName: "",
            budgetAmount: "",
            budgetCategory: "",
            budgetDuration: "monthly",
        },
    });

    // Handle submit form
    async function handleAddNewBudget(values) {
        const today = new Date();
        const budget = {
            name: values.budgetName,
            amount: values.budgetAmount,
            category: values.budgetCategory,
            dateRange: {
                start: new Date(today.getFullYear(), today.getMonth(), 1),
                end: new Date(today.getFullYear(), today.getMonth() + 1, 0),
            },
        };
        try {
            await api.post("budgets", budget);
            setOpen(false);
        } catch (err) {
            console.log(err.message);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddNewBudget)}>
                <div className="flex gap-5">
                    <div className="flex-1/2">
                        <FormField
                            control={form.control}
                            name="budgetName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Budget Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex-1/3">
                        <FormField
                            control={form.control}
                            name="budgetAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex my-5 gap-5">
                    <FormField
                        control={form.control}
                        name="budgetCategory"
                        render={({ field }) => (
                            <FormItem className="flex-1/2">
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {budgetCategories.map((category) => (
                                                    <SelectItem
                                                        key={category.value}
                                                        value={category.value}
                                                    >
                                                        {category.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="budgetDuration"
                        render={({ field }) => (
                            <FormItem className="flex-1/3">
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex- gap-5 justify-end">
                    {setOpen && (
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                    )}
                    <Button variant="report" type="submit">
                        Add Budget
                    </Button>
                </div>
            </form>
        </Form>
    );
}
