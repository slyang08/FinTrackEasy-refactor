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

export default function ConfirmationDialog({ open, setOpen, onConfirm, entry, actionType }) {
    // actionType could be "delete" or "edit" for CRUD on income/expense
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {actionType === "delete"
                            ? "Are you absolutely sure you want to delete this entry?"
                            : "Are you sure you want to edit this entry?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action{" "}
                        {actionType === "delete" ? "cannot be undone" : "will update the entry"}.
                        <br />
                        <strong>Summary:</strong>
                        <br />
                        Name: {entry?.name || "N/A"}
                        <br />
                        Note: {entry?.note || "N/A"}
                        <br />
                        Amount: {entry?.amount != null ? `$${entry.amount}` : "N/A"}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button onClick={onConfirm} variant="destructive">
                            {actionType === "delete" ? "Delete" : "Confirm"}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
