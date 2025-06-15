import { Card, CardContent,CardHeader, CardTitle } from "@/components/ui/card";

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
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className={`text-sm font-bold ${color}`}>
                    {sign}
                    {Math.abs(value).toFixed(2)} CAD
                </p>
            </CardContent>
        </Card>
    );
}
