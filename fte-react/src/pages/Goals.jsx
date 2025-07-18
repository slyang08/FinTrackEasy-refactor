import { useEffect, useState } from "react";
import { toast } from "sonner";

import api from "@/api/axios";

import AddGoalDialog from "../components/goals/AddGoalDialog";
import ConfirmationDialog from "../components/goals/ConfirmationDialog";
import GoalsTable from "../components/goals/GoalsTable";
import GoalSummary from "../components/goals/GoalSummary";
import SavingsDetail from "../components/goals/SavingsDetail";

export default function Goals() {
    const [goals, setGoals] = useState([]);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [editGoal, setEditGoal] = useState(null);
    const [createGoalData, setCreateGoalData] = useState(null);
    const [showCreateConfirm, setShowCreateConfirm] = useState(false);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const res = await api.get("/goals");
            setGoals(res.data);
            setSelectedGoal(res.data[0] || null);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load goals");
        }
    };

    const currentSaving = selectedGoal ? selectedGoal.currentSaving : 0;
    const targetAmount = selectedGoal ? selectedGoal.targetAmount : 1;
    const progressPercent = Math.min((currentSaving / targetAmount) * 100, 100).toFixed(0);

    const daysRemaining = selectedGoal
        ? Math.max(
              0,
              Math.ceil((new Date(selectedGoal.targetDate) - new Date()) / (1000 * 60 * 60 * 24))
          )
        : "N/A";

    // Create handler with confirmation
    const handleCreate = (data) => {
        setCreateGoalData(data);
        setShowCreateConfirm(true);
    };

    const confirmCreateGoal = async () => {
        try {
            const payload = {
                name: createGoalData.name,
                targetAmount: Number(createGoalData.targetAmount),
                currentSaving: Number(createGoalData.currentSaving),
                startDate: createGoalData.startDate,
                targetDate: createGoalData.targetDate,
            };
            await api.post("/goals", payload);
            toast.success("Goal created!");
            fetchGoals();
        } catch (err) {
            console.error(err);
            toast.error("Failed to create goal");
        } finally {
            setCreateGoalData(null);
            setShowCreateConfirm(false);
        }
    };

    // Update handler
    const handleUpdate = async (data) => {
        try {
            const payload = {
                name: data.name,
                targetAmount: Number(data.targetAmount),
                currentSaving: Number(data.currentSaving),
                startDate: data.startDate,
                targetDate: data.targetDate,
            };
            await api.patch(`/goals/${editGoal._id}`, payload);
            toast.success("Goal updated!");
            setEditGoal(null);
            fetchGoals();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update goal");
        }
    };

    // Delete handler
    const handleDelete = async (goal) => {
        try {
            await api.delete(`/goals/${goal._id}`);
            toast.success("Goal deleted!");
            if (selectedGoal?._id === goal._id) setSelectedGoal(null);
            fetchGoals();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete goal");
        }
    };

    const handleEditSaving = async (savingId, data) => {
        try {
            const payload = {
                name: data.name,
                amount: Number(data.amount),
            };
            await api.patch(`/goals/${selectedGoal._id}/savings/${savingId}`, payload);
            toast.success("Saving updated!");
            fetchGoals();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update saving");
        }
    };

    const handleDeleteSaving = async (savingId) => {
        try {
            await api.delete(`/goals/${selectedGoal._id}/savings/${savingId}`);
            toast.success("Saving deleted!");
            fetchGoals();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete saving");
        }
    };

    return (
        <div className="p-6 space-y-8">
            <GoalSummary
                currentSaving={currentSaving}
                daysRemaining={daysRemaining}
                progressPercent={progressPercent}
            />

            <GoalsTable
                goals={goals}
                selectedGoal={selectedGoal}
                setSelectedGoal={setSelectedGoal}
                fetchGoals={fetchGoals}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onEdit={(goal) => setEditGoal(goal)}
                onDelete={handleDelete}
            />

            {selectedGoal && (
                <SavingsDetail
                    selectedGoal={selectedGoal}
                    fetchGoals={fetchGoals}
                    onEditSaving={handleEditSaving}
                    onDeleteSaving={handleDeleteSaving}
                />
            )}

            {/* Add Goal Dialog */}
            {!editGoal && <AddGoalDialog onSubmit={handleCreate} />}

            {/* Edit Goal Dialog */}
            {editGoal && (
                <AddGoalDialog
                    initialData={editGoal}
                    confirmText="Update"
                    onSubmit={handleUpdate}
                    onClose={() => setEditGoal(null)}
                />
            )}

            {/* Create Goal Confirmation Dialog */}
            <ConfirmationDialog
                open={showCreateConfirm}
                title="Confirm Goal Creation"
                description="Please confirm the goal details below:"
                details={
                    <>
                        <p>
                            <strong>Name:</strong> {createGoalData?.name}
                        </p>
                        <p>
                            <strong>Target Amount:</strong> $
                            {Number(createGoalData?.targetAmount).toLocaleString()}
                        </p>
                        <p>
                            <strong>Current Saving:</strong> $
                            {Number(createGoalData?.currentSaving).toLocaleString()}
                        </p>
                        <p>
                            <strong>Start Date:</strong>{" "}
                            {new Date(createGoalData?.startDate).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Target Date:</strong>{" "}
                            {new Date(createGoalData?.targetDate).toLocaleDateString()}
                        </p>
                    </>
                }
                confirmText="Create Goal"
                onConfirm={confirmCreateGoal}
                onCancel={() => {
                    setShowCreateConfirm(false);
                    setCreateGoalData(null);
                }}
            />
        </div>
    );
}
