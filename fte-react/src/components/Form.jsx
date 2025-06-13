"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import api from "@/api/axios.js";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import ConfirmationDialog from "./ConfirmationDialog";

// Enforces that if the Category "Other" is chosen, a description must be added
const formSchema = z
    .object({
        txnName: z.string().max(30).trim(),
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
    })
    .refine((data) => data.txnCategory !== "Other" || !!data.txnNote?.trim(), {
        message: "Please provide a description for 'Other' category",
        path: ["txnNote"],
    });

// Category mapping for combo boxes
const expenseCategories = [
    { label: "Food & Drink", value: "Food & Drink" },
    { label: "Car", value: "Car" },
    { label: "Shopping", value: "Food" },
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
    { label: "Gifts", value: "Gifts" },
    { label: "Other", value: "Other" },
    { label: "Salary", value: "Salary" },
    { label: "Extra Income", value: "Extra Income" },
    { label: "Loan", value: "Loan" },
    { label: "Parental Leave", value: "Parental Leave" },
    { label: "Business", value: "Business" },
    { label: "Insurance Payout", value: "Insurance Payout" },
];

// // Recurrence mapping - deprecated as recurring is now just a checkbox
// const recurring = [
//     { label: "None", value: "None" },
//     { label: "Bi-weekly", value: "Bi-weekly" },
//     { label: "Monthly", value: "Monthly" },
//     { label: "Weekly", value: "Weekly" },
// ];

export default function TransactionForm({ type, setOpen, editingId = null, editingData = null }) {
    const [dropdown] = React.useState("dropdown");
    const [showConfirm, setShowConfirm] = React.useState(false);
    const [pendingValues, setPendingValues] = React.useState(null);

    // Render the form depending on whether it is an expense or income form: default to expense for now
    const categoryOptions = type === "income" ? incomeCategories : expenseCategories;

    // Initialize form using zod and React Hook Form
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            txnDate: new Date(),
        },
    });

    // Load the form with the existing transaction data if the button is an edit button and has passed the type
    React.useEffect(() => {
        if (editingData) {
            form.reset({
                // txnName: editingData.name || "",
                txnDate: editingData.date ? new Date(editingData.date) : new Date(),
                txnCategory: editingData.category || "",
                txnNote: editingData.description || "",
                txnAmount: editingData.amount || "",
                txnRecurring: editingData.isRecurring ? editingData.isRecurring : undefined,
            });
        }
    }, [editingData, form]);

    // On submit, show the confirmation dialog with the pending values in the form
    // Coerces the entry in the Amount field to be a number and is formatted in currency in the confirmation dialog component
    const onSubmit = (values) => {
        console.log("Submitting form with values:", values);

        setPendingValues({
            ...values,
            txnAmount: values.txnAmount ? Number(values.txnAmount) : null,
        });
        setShowConfirm(true);
    };

    // Calls appropriate API for creating or updating depending on if an editID is passed in
    const handleConfirm = async () => {
        try {
            const endpoint = type === "income" ? "/incomes" : "/expenses";
            const payload = {
                name: pendingValues.txnName,
                date: pendingValues.txnDate || undefined,
                amount: pendingValues.txnAmount,
                category: pendingValues.txnCategory,
                description: pendingValues.txnNote,
                isRecurring:
                    pendingValues.txnRecurring === "None" ? null : pendingValues.txnRecurring,
            };

            if (editingId) {
                await api.patch(`${endpoint}/${editingId}`, payload);
                toast.success(`${type === "income" ? "Income" : "Expense"} entry updated!`);
            } else {
                await api.post(endpoint, payload);
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
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? categoryOptions.find(
                                                                  (l) => l.value === field.value
                                                              )?.label
                                                            : "Select category"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <ScrollArea>
                                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                                    <Command>
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                No categories found.
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {categoryOptions.map((category) => (
                                                                    <CommandItem
                                                                        value={category.label}
                                                                        key={category.value}
                                                                        onSelect={() => {
                                                                            form.setValue(
                                                                                "txnCategory",
                                                                                category.value
                                                                            );
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                category.value ===
                                                                                    field.value
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {category.label}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </ScrollArea>
                                        </Popover>
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
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>30 character limit</FormDescription>
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
                            >
                                Cancel
                            </Button>
                        )}
                        <Button variant="secondary" type="submit">
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
                    // name: pendingValues?.txnName,
                    category: pendingValues?.txnCategory,
                    note: pendingValues?.txnNote,
                    amount: pendingValues?.txnAmount,
                }}
            />
        </>
    );
}
