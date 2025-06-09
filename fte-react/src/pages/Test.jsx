import { useState } from "react";

import FormDialog from "@/components/FormDialog";
import { Button } from "@/components/ui/button";

export default function Test() {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState(null); // 'income' or 'expense'

    const openDialog = (entryType) => {
        setType(entryType);
        setOpen(true);
    };

    return (
        <div>
            <Button onClick={() => openDialog("income")}>Add Income</Button>
            <Button onClick={() => openDialog("expense")}>Add Expense</Button>

            <FormDialog open={open} setOpen={setOpen} type={type} />
        </div>
    );
}
