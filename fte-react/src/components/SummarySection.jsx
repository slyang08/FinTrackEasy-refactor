import SummaryCard from "./SummaryCard";

export default function SummarySection({ balance, income, expenses }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryCard label="Current Balance" value={balance} />
            <SummaryCard label="Total Period Expenses" value={expenses} type="expense" />
            <SummaryCard label="Total Period Income" value={income} type="income" />
        </div>
    );
}
