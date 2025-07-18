import { useState } from "react";
import { toast } from "sonner";

import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import AddGoalDialog from "./AddGoalDialog";
import ConfirmationDialog from "./ConfirmationDialog";

export default function GoalsTable({
    goals,
    selectedGoal,
    setSelectedGoal,
    fetchGoals,
    searchQuery,
    setSearchQuery,
}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editGoalData, setEditGoalData] = useState(null);

    // Confirmation dialog state for delete and edit confirm
    const [confirmAction, setConfirmAction] = useState(null);

    // Temporarily hold form data for submit confirmation
    const [pendingUpdateData, setPendingUpdateData] = useState(null);

    const handleAddClick = () => {
        setEditGoalData(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (goal) => {
        setEditGoalData(goal);
        setIsDialogOpen(true);
    };

    const handleDeleteClick = (goal) => {
        setConfirmAction({ type: "delete", goal });
    };

    // On submit from AddGoalDialog (Add or Edit form)
    const handleSubmit = (formData) => {
        if (editGoalData) {
            // For update, show confirmation dialog before API call
            setPendingUpdateData(formData);
            setConfirmAction({ type: "submitUpdate", goal: editGoalData });
        } else {
            // For add, submit immediately
            createGoal(formData);
        }
        // Close the AddGoalDialog for now
        setIsDialogOpen(false);
    };

    const createGoal = async (formData) => {
        try {
            await api.post("/goals", formData);
            toast.success("Goal created!");
            fetchGoals();
        } catch (err) {
            console.error(err);
            toast.error("Failed to create goal");
        }
    };

    // Confirmed submission of update after confirmation dialog
    const submitUpdateConfirmed = async () => {
        try {
            await api.patch(
                `/goals/${pendingUpdateData._id || confirmAction.goal._id}`,
                pendingUpdateData
            );
            toast.success("Goal updated!");
            fetchGoals();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update goal");
        } finally {
            setConfirmAction(null);
            setPendingUpdateData(null);
            setEditGoalData(null);
        }
    };

    const handleDeleteConfirmed = async () => {
        try {
            await api.delete(`/goals/${confirmAction.goal._id}`);
            toast.success("Goal deleted!");
            if (selectedGoal?._id === confirmAction.goal._id) setSelectedGoal(null);
            fetchGoals();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete goal");
        } finally {
            setConfirmAction(null);
        }
    };

    return (
        <Card className="max-w-5xl mx-auto">
            <CardContent className="p-4 overflow-x-auto">
                <div className="mb-4 text-center">
                    <h2 className="text-xl">Goals Tracker</h2>
                </div>

                <div className="relative mb-4 min-h-[40px]">
                    <div className="w-64">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                {/* Search icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                                    />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search"
                                className="pl-10 pr-3 py-1 border rounded-md w-full focus:outline-none focus:ring focus:ring-blue-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button
                        className="absolute top-0 right-0 bg-blue-600 font-bold hover:bg-blue-700 text-white px-8 py-2"
                        style={{ right: "12px" }}
                        onClick={handleAddClick}
                    >
                        Add Goal
                    </Button>
                </div>

                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            <th className="text-left p-3 w-[20%]">Name</th>
                            <th className="text-left p-3">Goal Amount</th>
                            <th className="text-left p-3">Saved Amount</th>
                            <th className="text-left p-3">Start Date</th>
                            <th className="text-left p-3">Target Date</th>
                            <th className="text-left p-3 w-[20%]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {goals
                            .filter((goal) =>
                                goal.name.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((goal) => (
                                <tr
                                    key={goal._id}
                                    className={`cursor-pointer hover:bg-gray-50 ${
                                        selectedGoal?._id === goal._id
                                            ? "bg-blue-100 font-semibold"
                                            : ""
                                    }`}
                                    onClick={() => setSelectedGoal(goal)}
                                >
                                    <td className="p-3 max-w-[200px] break-words">{goal.name}</td>
                                    <td className="p-3">${goal.targetAmount.toLocaleString()}</td>
                                    <td className="p-3">${goal.currentSaving.toLocaleString()}</td>
                                    <td className="p-3">
                                        {new Date(goal.startDate).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="p-3">
                                        {new Date(goal.targetDate).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                className="w-24 bg-yellow-300 text-yellow-800 hover:bg-yellow-400 font-bold"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(goal);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="w-24 bg-red-300 text-red-700 hover:bg-pink-200 font-bold"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(goal);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                {/* Add/Edit Goal Dialog */}
                <AddGoalDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    onSubmit={handleSubmit}
                    initialData={editGoalData}
                    confirmText={editGoalData ? "Update Goal" : "Add Goal"}
                    onClose={() => {
                        setIsDialogOpen(false);
                        setEditGoalData(null);
                    }}
                />

                {/* Confirmation Dialog */}
                <ConfirmationDialog
                    open={!!confirmAction}
                    title={confirmAction?.type === "delete" ? "Delete Goal" : "Confirm Goal"}
                    description={
                        confirmAction?.type === "delete"
                            ? "Are you sure you want to delete this goal? This action cannot be undone."
                            : "Please confirm the goal details:"
                    }
                    details={
                        confirmAction?.type !== "delete" && (
                            <>
                                <p>
                                    <strong>Name:</strong> {pendingUpdateData?.name}
                                </p>
                                <p>
                                    <strong>Target Amount:</strong> $
                                    {Number(pendingUpdateData?.targetAmount).toLocaleString()}
                                </p>
                                <p>
                                    <strong>Current Saving:</strong> $
                                    {Number(pendingUpdateData?.currentSaving).toLocaleString()}
                                </p>
                                <p>
                                    <strong>Start Date:</strong>{" "}
                                    {new Date(pendingUpdateData?.startDate).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Target Date:</strong>{" "}
                                    {new Date(pendingUpdateData?.targetDate).toLocaleDateString()}
                                </p>
                            </>
                        )
                    }
                    confirmText={confirmAction?.type === "delete" ? "Delete" : "Confirm"}
                    confirmVariant={confirmAction?.type === "delete" ? "destructive" : "default"}
                    onConfirm={() => {
                        if (confirmAction?.type === "delete") {
                            handleDeleteConfirmed();
                        } else {
                            submitUpdateConfirmed();
                        }
                    }}
                    onCancel={() => setConfirmAction(null)}
                />
            </CardContent>
        </Card>
    );
}
