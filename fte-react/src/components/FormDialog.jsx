import Form from "@/components/Form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function FormDialog({ open, setOpen, type }) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {type === "income" ? "Add Income Entry" : "Add Expense Entry"}
                    </DialogTitle>
                </DialogHeader>
                <Form setOpen={setOpen} type={type} />
            </DialogContent>
        </Dialog>
    );
}
