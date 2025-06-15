import { format, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function TransactionList({ transactions, onEdit, onDelete, showNote = false }) {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="text-center text-gray-500 italic py-8">
                No transactions available. Please add income or expenses to get started.
            </div>
        );
    }

    const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    const groupedTransactions = sortedTransactions.reduce((groups, txn) => {
        const dateKey = txn.date.slice(0, 10);
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(txn);
        return groups;
    }, {});

    const dateKeys = Object.keys(groupedTransactions).sort((a, b) => new Date(b) - new Date(a));

    return (
        <div className="max-h-[400px] overflow-y-auto border rounded-md relative shadow-sm">
            {/* Sticky Transaction header */}
            <div className="sticky top-0 bg-white z-20 py-3 text-center text-lg">Transactions</div>

            <div>
                {dateKeys.map((date, idx) => (
                    <div key={date} className="pt-6">
                        {/* Divider line */}
                        {idx > 0 && (
                            <div className="mx-auto mb-2 h-[2px] w-[80%] bg-gray-300 rounded" />
                        )}

                        {/* Date header */}
                        <div className="px-4 py-2 font-semibold text-gray-700">
                            {format(parseISO(date), "PPP")}
                        </div>

                        <Table className="border-none">
                            <TableBody>
                                {groupedTransactions[date].map((txn) => (
                                    <TableRow key={txn._id} className="border-none">
                                        <TableCell className="border-none">
                                            <p>{txn.category}</p>
                                            {txn.recurring && (
                                                <p className="text-xs text-muted-foreground italic">
                                                    Recurring
                                                </p>
                                            )}
                                        </TableCell>

                                        {showNote && (
                                            <TableCell className="text-muted-foreground italic truncate border-none">
                                                {txn.note || "-"}
                                            </TableCell>
                                        )}

                                        <TableCell className="text-right border-none">
                                            <span
                                                className={
                                                    txn.type === "income"
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }
                                            >
                                                {txn.type === "income" ? "+" : "-"}$
                                                {Number(txn.amount).toFixed(2)}
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-right space-x-2 border-none">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="bg-yellow-300 hover:bg-yellow-400 text-black"
                                                onClick={() => onEdit(txn)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => onDelete(txn)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ))}
            </div>
        </div>
    );
}
