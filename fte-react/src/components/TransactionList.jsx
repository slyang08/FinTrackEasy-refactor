import { format } from "date-fns";

import { Button } from "@/components/ui/button";

export default function TransactionList({ transactions, onEdit, onDelete }) {
    if (transactions.length === 0) {
        return (
            <div className="text-center text-gray-500 italic py-8">
                No transactions available. Please add income or expenses to get started.
            </div>
        );
    }

    return (
        <ul className="text-sm space-y-2">
            {transactions.map((txn) => (
                <li key={txn._id} className="flex justify-between items-center border-b pb-1">
                    <div>
                        <p className="font-medium">{txn.category}</p>
                        <p className="text-xs text-gray-500">{format(new Date(txn.date), "PPP")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={txn.type === "income" ? "text-green-600" : "text-red-600"}>
                            {txn.type === "income" ? "+" : "-"}${Number(txn.amount).toFixed(2)}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="bg-yellow-300 hover:bg-yellow-400 text-black"
                            onClick={() => onEdit(txn)}
                        >
                            Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onDelete(txn)}>
                            Delete
                        </Button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
