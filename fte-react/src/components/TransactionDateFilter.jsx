import * as Popover from "@radix-ui/react-popover";
import * as React from "react";

import { Calendar } from "@/components/ui/calendar";

function formatDateRange(range) {
    if (!range?.from) return "Select date range";
    const options = { year: "numeric", month: "long", day: "numeric" };
    if (!range.to) return range.from.toLocaleDateString(undefined, options);

    return `${range.from.toLocaleDateString(undefined, options)} - ${range.to.toLocaleDateString(undefined, options)}`;
}

export default function TransactionDateFilter() {
    const [dateRange, setDateRange] = React.useState({
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 30)),
    });

    const [dateText, setDateText] = React.useState(formatDateRange(dateRange));

    const handleSelect = (range) => {
        setDateRange(range);
        setDateText(formatDateRange(range));
        console.log("Selected range:", range);
    };

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <button className="px-4 py-2 border rounded-md shadow-sm text-sm">
                    {dateText}
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    sideOffset={5}
                    className="p-4 rounded-lg border shadow-lg bg-white z-[9999]"
                >
                    <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                        className="rounded-lg"
                    />
                    <Popover.Close asChild>
                        <button className="mt-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                            Close
                        </button>
                    </Popover.Close>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
