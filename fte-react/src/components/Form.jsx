"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import api from "@/api/axios.js";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import CategoriesDropdown from "./CategoriesDropdown";
import ConfirmationDialog from "./ConfirmationDialog";

// Enforces that if the Category "Other" is chosen, a Custom Category must be addeds
export const formSchema = z
    .object({
        txnDate: z.coerce.date(),
        txnCategory: z.string(),
        txnNote: z.string().max(30, "Note must be 30 characters or fewer").trim().optional(),
        txnAmount: z.coerce
            .number({
                invalid_type_error: "Amount must be a number",
                required_error: "Amount is required",
            })
            .positive("Amount must be positive")
            .refine((val) => !Number.isNaN(val), { message: "Amount must be a valid number" }),
        txnRecurring: z.boolean().optional(),
        txnCustomCategory: z
            .string()
            .max(20, "Custom category must be 20 characters or fewer")
            .trim()
            .optional(),
    })
    .refine(
        (data) => {
            return data.txnCategory !== "Other" || !!data.txnCustomCategory?.trim();
        },
        {
            message: "Please provide a custom category name",
            path: ["txnCustomCategory"],
        }
    );

// Category mapping for combo boxes
export const expenseCategories = [
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

const MAX_NOTE_LENGTH = 30;

export default function TransactionForm({
    type,
    setOpen,
    editingId = null,
    editingData = null,
    setAddedExpense,
}) {
    const [dropdown] = useState("dropdown");
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingValues, setPendingValues] = useState(null);
    const [charCount, setCharCount] = useState(0);

    // Render the form depending on whether it is an expense or income form: default to expense for now
    const categoryOptions = type === "income" ? incomeCategories : expenseCategories;

    // Initialize form using zod and React Hook Form
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            txnDate: new Date(),
            txnAmount: "",
            txnCategory: "",
            txnNote: "",
            txnRecurring: false,
            txnCustomCategory: "",
        },
    });

    // Load the form with the existing transaction data if the button is an edit button and has passed the type
    useEffect(() => {
        if (editingData) {
            form.reset({
                txnDate: editingData.date ? new Date(editingData.date) : new Date(),
                txnCategory: editingData.category || "",
                txnNote: editingData.note || "",
                txnAmount: editingData.amount || "",
                txnRecurring: editingData.isRecurring ?? false,
                txnCustomCategory:
                    editingData.category === "Other" ? editingData.customCategory || "" : "",
            });
        }
    }, [editingData, form]);

    // On submit, show the confirmation dialog with the pending values in the form
    // Coerces the entry in the Amount field to be a number and is formatted in currency in the confirmation dialog component
    const onSubmit = (values) => {
        console.log("Submitting form with values:", values);

        // Convert txnDate to ISO format
        const formattedDate = DateTime.fromJSDate(values.txnDate, {
            zone: "America/Toronto",
        }).toISO();

        // Ensure txnNote is properly reset to undefined if it's empty
        const txnNote2 = values.txnNote?.trim() === "" ? undefined : values.txnNote;

        setPendingValues({
            ...values,
            txnNote: txnNote2,
            txnDate: formattedDate,
            txnAmount: values.txnAmount ? Number(values.txnAmount) : null, // Ensure txnAmount is a number
        });

        setShowConfirm(true);
    };

    // Watch for the "Other" category being selected to pop up the Custom Category
    const selectedCategory = form.watch("txnCategory");

    // Calls appropriate API for creating or updating depending on if an editID is passed in
    const handleConfirm = async () => {
        console.log("Payload being submitted:", pendingValues);

        try {
            const endpoint = type === "income" ? "/incomes" : "/expenses";

            const payload = {
                date: pendingValues.txnDate || undefined,
                amount: pendingValues.txnAmount,
                category: pendingValues.txnCategory,
                note: pendingValues.txnNote,
                isRecurring: pendingValues.txnRecurring,
                // include customCategory only if category is Other
                ...(pendingValues.txnCategory === "Other" && {
                    customCategory: pendingValues.txnCustomCategory,
                }),
            };

            console.log("Payload:", payload);

            if (editingId) {
                await api.patch(`${endpoint}/${editingId}`, payload);
                toast.success(`${type === "income" ? "Income" : "Expense"} entry updated!`);
            } else {
                const res = await api.post(endpoint, payload);
                if (setAddedExpense) setAddedExpense(res.data);
                toast.success(`${type === "income" ? "Income" : "Expense"} entry added!`);
            }

            setOpen(false);
            setShowConfirm(false);
            form.reset();
        } catch (error) {
            console.error("Submission failed:", error);
            toast.error("Failed to save entry. Please try again.");
        }
    };

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit, (errors) => {
                        console.log("Form validation failed", errors);
                    })}
                    className="space-y-8 max-w-3xl mx-auto py-10"
                >
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name="txnCategory"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <CategoriesDropdown
                                                categories={categoryOptions}
                                                type={type}
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="col-span-6 flex flex-col gap-5">
                            <FormField
                                control={form.control}
                                name="txnDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? format(field.value, "PPP")
                                                            : "Pick a date"}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-[var(--radix-popover-trigger-width)] p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    captionLayout={dropdown}
                                                    initialFocus
                                                    className="w-full"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {selectedCategory === "Other" && (
                        <div className="col-span-6 mt-2">
                            <FormField
                                control={form.control}
                                name="txnCustomCategory"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Custom Category</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="" />
                                        </FormControl>
                                        <FormDescription>
                                            Required when "Other" is selected.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    <FormField
                        control={form.control}
                        name="txnNote"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Note</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder={
                                            type === "expense"
                                                ? "bought new sunglasses"
                                                : "work bonus"
                                        }
                                        className="w-full min-h-30"
                                        maxLength={MAX_NOTE_LENGTH}
                                        {...field}
                                        onChange={(e) => {
                                            setCharCount(e.target.value.length);
                                            field.onChange(e);
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>
                                    {MAX_NOTE_LENGTH - charCount} character
                                    {MAX_NOTE_LENGTH - charCount !== 1 ? "s" : ""} left
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-12 gap-">
                        <div className="col-span-5">
                            <FormField
                                control={form.control}
                                name="txnAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Textarea className="min-h-4 max-h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="col-span-7">
                            <FormField
                                control={form.control}
                                name="txnRecurring"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value ?? false}
                                                onCheckedChange={(checked) =>
                                                    field.onChange(checked === true)
                                                }
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-sm font-medium">
                                                Recurrence (optional)
                                            </FormLabel>
                                            <FormDescription>
                                                Select this if the transaction recurs monthly.
                                            </FormDescription>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex justify-left gap-4 mt-4">
                        {setOpen && (
                            <Button
                                variant="destructive"
                                type="button"
                                onClick={() => setOpen(false)}
                                className="cursor-pointer"
                            >
                                Cancel
                            </Button>
                        )}
                        <Button variant="secondary" type="submit" className="cursor-pointer">
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
            <ConfirmationDialog
                open={showConfirm}
                setOpen={setShowConfirm}
                onConfirm={handleConfirm}
                actionType="submit"
                entry={{
                    category: pendingValues?.txnCategory,
                    customCategory: pendingValues?.txnCustomCategory,
                    note: pendingValues?.txnNote,
                    amount: pendingValues?.txnAmount,
                }}
            />
        </>
    );
}
