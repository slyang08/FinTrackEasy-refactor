import { useEffect, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function formatDateRange(range) {
    if (!range?.from) return "Select date range";
    const options = { year: "numeric", month: "long", day: "numeric" };
    if (!range.to) return range.from.toLocaleDateString(undefined, options);

    return `${range.from.toLocaleDateString(undefined, options)} - ${range.to.toLocaleDateString(undefined, options)}`;
}

export default function TransactionDateFilter({ dateRange, onChange }) {
    const [dateText, setDateText] = useState("Select date");

    useEffect(() => {
        setDateText(formatDateRange(dateRange));
    }, [dateRange]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="px-4 py-2 border rounded-md shadow-sm text-sm">
                    {dateText}
                </button>
            </PopoverTrigger>
            <PopoverContent className="p-4 rounded-lg border shadow-lg bg-white w-auto">
                <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={onChange}
                    numberOfMonths={2}
                    className="rounded-md border"
                />
            </PopoverContent>
        </Popover>
    );
}
