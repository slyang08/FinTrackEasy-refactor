import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Goals() {
    const [showGoalForm, setShowGoalForm] = useState(false);
    const [showSavingForm, setShowSavingForm] = useState(false);

    return (
        <div className="p-6 space-y-8">
            {/* Header Summary */}
            <div className="flex flex-col md:flex-row justify-around items-center gap-4">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-2" />
                    <p className="font-semibold">Current Total Savings</p>
                </div>
                <div className="text-center">
                    <div className="bg-white shadow px-4 py-2 rounded-lg border">
                        <p className="text-red-600 font-bold">191 days</p>
                        <p className="text-sm text-muted-foreground">Time Remaining</p>
                    </div>
                </div>
                <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-2" />
                    <p className="font-semibold">Savings Progress</p>
                </div>
            </div>

            {/* Goals Tracker Table */}
            <Card>
                <CardContent className="p-4 overflow-x-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Goals Tracker</h2>
                        <Dialog open={showGoalForm} onOpenChange={setShowGoalForm}>
                            <DialogTrigger asChild>
                                <Button>Add Goal</Button>
                            </DialogTrigger>
                            <DialogContent className="space-y-4">
                                <h3 className="text-lg font-semibold">Add a Goal</h3>
                                <div className="grid gap-2">
                                    <Label>Goal Name</Label>
                                    <Input />
                                    <Label>Goal Amount</Label>
                                    <Input />
                                    <Label>Current Savings</Label>
                                    <Input />
                                    <Label>Start Date</Label>
                                    <Input type="date" />
                                    <Label>Target Date</Label>
                                    <Input type="date" />
                                </div>
                                <div className="flex justify-between">
                                    <Button variant="ghost" onClick={() => setShowGoalForm(false)}>
                                        Cancel
                                    </Button>
                                    <Button>Add Goal</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Table */}
                    <table className="w-full text-sm border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-2">Name</th>
                                <th className="text-left p-2">Goal Amount</th>
                                <th className="text-left p-2">Saved Amount</th>
                                <th className="text-left p-2">Start Date</th>
                                <th className="text-left p-2">Target Date</th>
                                <th className="text-left p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t">
                                <td className="p-2">Vacation in Japan</td>
                                <td className="p-2">$4,000</td>
                                <td className="p-2">$1,800</td>
                                <td className="p-2">June 20, 2025</td>
                                <td className="p-2">Dec 14, 2025</td>
                                <td className="p-2 space-x-2">
                                    <Button size="sm" variant="secondary">
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="destructive">
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                            {/* Add more rows as needed */}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Goal Details Section (expanded savings per goal) */}
            <Card>
                <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">Vacation in Japan</p>
                        <Dialog open={showSavingForm} onOpenChange={setShowSavingForm}>
                            <DialogTrigger asChild>
                                <Button>Add Savings</Button>
                            </DialogTrigger>
                            <DialogContent className="space-y-4">
                                <h3 className="text-lg font-semibold">Add Saving</h3>
                                <div className="grid gap-2">
                                    <Label>Saving Name</Label>
                                    <Input />
                                    <Label>Saving Amount</Label>
                                    <Input />
                                </div>
                                <div className="flex justify-between">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowSavingForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button>Add Saving</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <table className="w-full text-sm border border-gray-200">
                        <tbody>
                            <tr className="border-t">
                                <td className="p-2">Loans</td>
                                <td className="p-2">$500</td>
                                <td className="p-2 space-x-2">
                                    <Button size="sm" variant="secondary">
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="destructive">
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                            {/* More savings entries */}
                        </tbody>
                    </table>

                    <div className="text-right font-semibold">Saved Amount: $1,800</div>
                </CardContent>
            </Card>
        </div>
    );
}
