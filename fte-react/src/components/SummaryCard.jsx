export default function SummaryCard({ label, value, type }) {
    const color =
        type === "income"
            ? "text-green-600"
            : type === "expense"
              ? "text-red-600"
              : value >= 0
                ? "text-green-600"
                : "text-red-600";

    const sign = type === "income" ? "+" : type === "expense" ? "-" : value >= 0 ? "+" : "-";

    return (
        <div className="bg-white shadow rounded p-4 border border-black">
            <p className="text-sm">{label}</p>
            <p className={`font-bold ${color}`}>
                {sign}
                {Math.abs(value).toFixed(2)} CAD
            </p>
        </div>
    );
}
