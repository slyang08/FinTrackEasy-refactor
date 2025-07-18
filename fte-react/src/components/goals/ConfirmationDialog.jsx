import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription,DialogTitle } from "@/components/ui/dialog";

export default function ConfirmationDialog({
    open,
    title,
    description,
    details,
    confirmText = "Confirm",
    confirmVariant = "default",
    onConfirm,
    onCancel,
}) {
    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent className="space-y-6">
                <div>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </div>

                {details && <div className="text-sm text-gray-700 space-y-1">{details}</div>}

                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant={confirmVariant} onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
