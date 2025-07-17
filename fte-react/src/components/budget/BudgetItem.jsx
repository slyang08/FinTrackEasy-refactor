import { useEffect, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaTrashCan } from "react-icons/fa6";

import api from "@/api/axios.js";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import ExpenseIcon from "../icons/CategoryIcon";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";

const currMonth = new Date().getMonth();

export default function BudgetItem({
    budget,
    usedAmount,
    isDeleted,
    setIsDeleted,
    className = "my-10",
}) {
    const [progress, setProgress] = useState(0);
    const [amount, setAmount] = useState(usedAmount);

    useEffect(() => {
        const timer = setTimeout(() => setProgress(progress), 500);
        return () => clearTimeout(timer);
    }, [progress]);

    useEffect(() => {
        setAmount(usedAmount);
        var percentage = (usedAmount / budget.amount) * 100;
        if (percentage > 100) percentage = 100;
        setProgress(percentage);
    }, [usedAmount, budget]);

    function convertDateFormat(dateString) {
        const date = new Date(dateString);
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const yyyy = String(date.getFullYear());
        return `${mm}/${dd}/${yyyy}`;
    }

    async function handleDelete() {
        try {
            await api.delete(`budgets/${budget._id}`);
            setIsDeleted(!isDeleted);
        } catch (err) {
            console.log(err.message);
        }
    }

    return (
        <div className={`min-w-sm ${className}`}>
            {/* Category */}
            <div className="font-semibold text-sm my-2">{budget.category}</div>
            <div>
                <div className="flex gap-3 items-center">
                    <ExpenseIcon icon={budget.category} type="expense" />
                    <div className="w-full">
                        <div className="flex justify-between">
                            <div className="text-sm">
                                {convertDateFormat(budget.dateRange.start)}
                            </div>
                            <div className="text-sm">{(progress || 0).toFixed(0)}%</div>
                            <div className="text-sm">{convertDateFormat(budget.dateRange.end)}</div>
                        </div>
                        <Progress value={progress} className="my-3" />
                        <div className="flex justify-between">
                            <div className="text-sm">$0.00</div>
                            <div className="text-sm">${(amount || 0).toFixed(2)}</div>
                            <div className="text-sm">{`$${budget.amount.toFixed(2)}`}</div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between mt-2">
                    <div className="mt-2 text-sm">
                        Residual amount: ${(budget.amount - usedAmount || budget.amount).toFixed(2)}
                    </div>
                    {new Date(budget.dateRange.start).getMonth() === currMonth && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="destructive" className="group">
                                    <FaRegTrashCan className="group-hover:hidden transition" />
                                    <FaTrashCan className="hidden group-hover:inline-block transition" />
                                </Button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Deleting this budget is a one-way trip. You sure about that,
                                        boss?
                                    </DialogTitle>
                                    <DialogDescription className="sr-only">
                                        Confirm to delete selected budget
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex gap-3 justify-end">
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button variant="destructive" onClick={handleDelete}>
                                        Confirm
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>
        </div>
    );
}
