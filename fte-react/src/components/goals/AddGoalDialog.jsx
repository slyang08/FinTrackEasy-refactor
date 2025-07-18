import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import ConfirmationDialog from "./ConfirmationDialog";

export default function AddGoalDialog({
    open,
    onOpenChange,
    onSubmit,
    initialData = null,
    confirmText = "Add Goal",
}) {
    const [form, setForm] = useState({
        name: "",
        targetAmount: "",
        currentSaving: "",
        startDate: null,
        targetDate: null,
    });

    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || "",
                targetAmount: initialData.targetAmount || "",
                currentSaving: initialData.currentSaving || "",
                startDate: initialData.startDate ? new Date(initialData.startDate) : null,
                targetDate: initialData.targetDate ? new Date(initialData.targetDate) : null,
            });
        } else if (open) {
            setForm({
                name: "",
                targetAmount: "",
                currentSaving: "",
                startDate: null,
                targetDate: null,
            });
        }
    }, [initialData, open]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (
            !form.name ||
            !form.targetAmount ||
            !form.currentSaving ||
            !form.startDate ||
            !form.targetDate
        ) {
            alert("Please fill out all fields before submitting.");
            return;
        }

        if (Number(form.targetAmount) <= 0 || Number(form.currentSaving) < 0) {
            alert("Please enter valid positive amounts.");
            return;
        }

        setShowConfirm(true);
    };

    const handleConfirm = () => {
        onSubmit(form);
        setShowConfirm(false);
        onOpenChange(false);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="space-y-6">
                    <DialogTitle className="text-center font-semibold text-lg">
                        {confirmText === "Add Goal" ? "Add a Goal" : "Edit Goal"}
                    </DialogTitle>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 space-y-1">
                            <Label className="text-sm text-muted-foreground font-normal">
                                Goal Name
                            </Label>
                            <Input name="name" value={form.name} onChange={handleChange} />
                        </div>

                        <div className="space-y-1">
                            <Label className="text-sm text-muted-foreground font-normal">
                                Goal Amount
                            </Label>
                            <Input
                                name="targetAmount"
                                type="number"
                                value={form.targetAmount}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label className="text-sm text-muted-foreground font-normal">
                                Current Savings
                            </Label>
                            <Input
                                name="currentSaving"
                                type="number"
                                value={form.currentSaving}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label className="text-sm text-muted-foreground font-normal">
                                Start Date
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        {form.startDate ? (
                                            format(form.startDate, "PPP")
                                        ) : (
                                            <span>&nbsp;</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="p-0">
                                    <Calendar
                                        mode="single"
                                        selected={form.startDate}
                                        onSelect={(date) => setForm({ ...form, startDate: date })}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-sm text-muted-foreground font-normal">
                                Target Date
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        {form.targetDate ? (
                                            format(form.targetDate, "PPP")
                                        ) : (
                                            <span>&nbsp;</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="p-0">
                                    <Calendar
                                        mode="single"
                                        selected={form.targetDate}
                                        onSelect={(date) => setForm({ ...form, targetDate: date })}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            className="text-blue-600 hover:bg-blue-50"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleSubmit}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                open={showConfirm}
                title={confirmText === "Add Goal" ? "Confirm Goal Creation" : "Confirm Goal Update"}
                description="Please confirm the goal details below:"
                details={
                    <>
                        <p>
                            <strong>Name:</strong> {form.name}
                        </p>
                        <p>
                            <strong>Target Amount:</strong> $
                            {Number(form.targetAmount).toLocaleString()}
                        </p>
                        <p>
                            <strong>Current Saving:</strong> $
                            {Number(form.currentSaving).toLocaleString()}
                        </p>
                        <p>
                            <strong>Start Date:</strong> {format(form.startDate, "PPP")}
                        </p>
                        <p>
                            <strong>Target Date:</strong> {format(form.targetDate, "PPP")}
                        </p>
                    </>
                }
                confirmText={confirmText}
                onConfirm={handleConfirm}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
}
