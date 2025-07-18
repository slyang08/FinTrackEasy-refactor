import { useState } from "react";
import { toast } from "sonner";

import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import AddSavingDialog from "./AddSavingDialog";
import ConfirmationDialog from "./ConfirmationDialog";

export default function SavingsDetail({ selectedGoal, fetchGoals, onEditSaving, onDeleteSaving }) {
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editSaving, setEditSaving] = useState(null);
    const [deleteSavingId, setDeleteSavingId] = useState(null);

    // Confirmation for add saving
    const [pendingAddData, setPendingAddData] = useState(null);
    const [confirmAddOpen, setConfirmAddOpen] = useState(false);

    // Confirmation for edit saving
    const [pendingEditData, setPendingEditData] = useState(null);
    const [confirmEditOpen, setConfirmEditOpen] = useState(false);

    if (!selectedGoal) return null;

    const handleAddSaving = (data) => {
        setPendingAddData(data);
        setConfirmAddOpen(true);
    };

    const confirmAddSaving = async () => {
        try {
            await api.post(`/goals/${selectedGoal._id}/savings`, {
                name: pendingAddData.name,
                amount: Number(pendingAddData.amount),
            });
            toast.success("Saving added!");
            fetchGoals();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add saving");
        } finally {
            setPendingAddData(null);
            setConfirmAddOpen(false);
        }
    };

    const handleUpdateSaving = (data) => {
        if (!editSaving) return;
        setPendingEditData({ id: editSaving._id, data });
        setConfirmEditOpen(true);
    };

    const confirmEditSaving = async () => {
        if (!pendingEditData) return;

        try {
            await onEditSaving(pendingEditData.id, pendingEditData.data);
            toast.success("Saving updated!");
            fetchGoals();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update saving");
        } finally {
            setConfirmEditOpen(false);
            setPendingEditData(null);
            setEditSaving(null);
        }
    };

    return (
        <Card className="max-w-5xl mx-auto">
            <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <p className="font-medium max-w-[300px] break-words leading-tight ml-3">
                        {selectedGoal.name}
                    </p>

                    <div className="flex items-center">
                        <p
                            className="w-[100px] text-left text-black text-md"
                            style={{ marginLeft: "-350px" }}
                        >
                            ${selectedGoal.targetAmount.toLocaleString()}
                        </p>

                        <Button
                            className="ml-27 bg-green-700 text-white font-bold hover:bg-green-800 px-6 py-2 rounded-md"
                            onClick={() => setAddDialogOpen(true)}
                        >
                            Add Savings
                        </Button>
                    </div>
                </div>

                <table className="w-full text-md ">
                    <tbody>
                        {selectedGoal.savings?.length > 0 ? (
                            selectedGoal.savings.map((saving, index) => (
                                <tr key={saving._id || index}>
                                    <td className="p-3">
                                        <div className="max-w-[130px] break-words whitespace-normal">
                                            {saving.name}
                                        </div>
                                    </td>
                                    <td
                                        className="p-3 text-left min-w-[150px]"
                                        style={{ paddingLeft: "calc(100% - 624.5px)" }}
                                    >
                                        ${saving.amount.toLocaleString()}
                                    </td>
                                    <td className="p-3 flex justify-end gap-2">
                                        <Button
                                            size="sm"
                                            className="w-24 bg-yellow-300 text-yellow-800 hover:bg-yellow-400 font-bold"
                                            onClick={() => setEditSaving(saving)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="w-24 bg-red-300 text-red-700 hover:bg-pink-300 font-bold"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteSavingId(saving._id);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="p-3" colSpan={3}>
                                    No savings added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="w-[967px] h-[2px] bg-gray-300 my-4 mx-auto"></div>

                <div className="flex font-semibold">
                    <p className="ml-3">Saved Amount</p>
                    <p className="pl-185">${selectedGoal.currentSaving.toLocaleString()}</p>
                </div>

                <AddSavingDialog
                    open={addDialogOpen}
                    onClose={() => setAddDialogOpen(false)}
                    onSubmit={handleAddSaving}
                />

                {editSaving && (
                    <AddSavingDialog
                        open={true}
                        onClose={() => setEditSaving(null)}
                        initialData={editSaving}
                        onSubmit={handleUpdateSaving}
                        confirmText="Update Saving"
                    />
                )}

                <ConfirmationDialog
                    open={!!deleteSavingId}
                    title="Delete Saving"
                    description="Are you sure you want to delete this saving? This action cannot be undone."
                    onConfirm={() => {
                        onDeleteSaving(deleteSavingId);
                        setDeleteSavingId(null);
                    }}
                    onCancel={() => setDeleteSavingId(null)}
                    confirmText="Delete"
                    confirmVariant="destructive"
                />

                <ConfirmationDialog
                    open={confirmAddOpen}
                    title="Add Saving"
                    description="Confirm adding this saving:"
                    details={
                        <>
                            <p>
                                <strong>Name:</strong> {pendingAddData?.name}
                            </p>
                            <p>
                                <strong>Amount:</strong> $
                                {Number(pendingAddData?.amount).toLocaleString()}
                            </p>
                        </>
                    }
                    onConfirm={confirmAddSaving}
                    onCancel={() => setConfirmAddOpen(false)}
                    confirmText="Add Saving"
                />

                <ConfirmationDialog
                    open={confirmEditOpen}
                    title="Update Saving"
                    description="Confirm updating this saving:"
                    details={
                        <>
                            <p>
                                <strong>Name:</strong> {pendingEditData?.data.name}
                            </p>
                            <p>
                                <strong>Amount:</strong> $
                                {Number(pendingEditData?.data.amount).toLocaleString()}
                            </p>
                        </>
                    }
                    onConfirm={confirmEditSaving}
                    onCancel={() => setConfirmEditOpen(false)}
                    confirmText="Update Saving"
                />
            </CardContent>
        </Card>
    );
}
