import { useEffect,useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription,DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddSavingDialog({
    open,
    onClose,
    onSubmit,
    initialData = null,
    confirmText,
}) {
    const [form, setForm] = useState({ name: "", amount: "" });

    // Update form state when initialData or open changes (for editing)
    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || "",
                amount: initialData.amount != null ? initialData.amount.toString() : "",
            });
        } else {
            setForm({ name: "", amount: "" });
        }
    }, [initialData, open]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!form.name || !form.amount || isNaN(Number(form.amount))) {
            alert("Please enter valid name and amount");
            return;
        }
        onSubmit(form);
        setForm({ name: "", amount: "" });
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="space-y-6">
                <div>
                    <DialogTitle>
                        {confirmText || (initialData ? "Edit Saving" : "Add Saving")}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Update the saving entry for this goal."
                            : "Record a new saving entry for this goal."}
                    </DialogDescription>
                </div>

                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label>Saving Name</Label>
                        <Input name="name" value={form.name} onChange={handleChange} autoFocus />
                    </div>

                    <div className="space-y-2">
                        <Label>Saving Amount</Label>
                        <Input
                            name="amount"
                            type="number"
                            value={form.amount}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        className="text-blue-600 hover:bg-blue-50"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-green-700 text-white hover:bg-green-800"
                        onClick={handleSubmit}
                    >
                        {confirmText || (initialData ? "Update Saving" : "Add Saving")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
