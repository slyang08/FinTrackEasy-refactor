import { PopoverTrigger } from "@radix-ui/react-popover";
import { useEffect, useState } from "react";

import { Calendar } from "../ui/calendar";
import { Popover } from "../ui/popover";

export default function BudgetCalendar({ dateRange, setDateRange }) {
    const [selectedDate, setSelectedDate] = useState(
        new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), 1)
    );
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setDateRange({
            from: selectedDate,
            to: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0),
        });
    }, [selectedDate, setDateRange]);

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild></PopoverTrigger>
            </Popover>
            <Calendar
                mode="single"
                defaultMonth={selectedDate}
                onMonthChange={(month) => setSelectedDate(month)}
                captionLayout="dropdown"
                className="[&_.rdp-root]: p-0 [&_.rdp-weekdays]:hidden [&_.rdp-weeks]:hidden"
            />
        </>
    );
}
