import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmationDialog({
    open,
    setOpen,
    onConfirm,
    entry,
    actionType = "submit",
}) {
    // Dialogue options setup for CRUD in income/expense
    const actionLabels = {
        delete: "Delete",
        edit: "Confirm",
        submit: "Submit",
    };

    const titleText = {
        delete: "Are you absolutely sure you want to delete this entry?",
        edit: "Are you sure you want to edit this entry?",
        submit: "Are you sure you want to submit this entry?",
    };

    const descriptionText = {
        delete: "This action cannot be undone.",
        edit: "This will update the entry.",
        submit: "This will save your transaction.",
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{titleText[actionType]}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {descriptionText[actionType]}
                        <br />
                        <strong>Summary:</strong>
                        <br />
                        Category:{" "}
                        {entry?.category === "Other"
                            ? entry?.customCategory
                            : entry?.category || "N/A"}
                        <br />
                        Note: {entry?.note || "N/A"}
                        <br />
                        Amount: {entry?.amount != null ? `$${entry.amount}` : "N/A"}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            onClick={onConfirm}
                            variant={actionType === "delete" ? "destructive" : "default"}
                        >
                            {actionLabels[actionType]}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
