function CircularProgress({ size = 160, strokeWidth = 14, progress, color, label }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg
            width={size}
            height={size}
            className="mx-auto drop-shadow-md"
            role="img"
            aria-label={`Progress: ${label}`}
        >
            {/* Background circle */}
            <circle
                stroke="url(#bgGradient)"
                fill="none"
                strokeWidth={strokeWidth}
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            {/* Progress circle */}
            <circle
                stroke={color}
                fill="none"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                r={radius}
                cx={size / 2}
                cy={size / 2}
                style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
            <defs>
                <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f3f4f6" />
                    <stop offset="100%" stopColor="#e5e7eb" />
                </linearGradient>
            </defs>
            {/* Centered label */}
            <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontWeight="700"
                fontSize={size / 7}
                fill={color}
                style={{
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    userSelect: "none",
                }}
            >
                {label}
            </text>
        </svg>
    );
}

function TimeRemainingCard({ daysLeft }) {
    return (
        <div className="w-60 bg-white shadow-lg px-6 py-4 rounded-lg border border-gray-200 flex flex-col items-center select-none">
            <p className="text-sm text-gray-500 mb-1 tracking-wide uppercase font-semibold">
                Time Remaining
            </p>
            <p className="text-red-600 font-extrabold text-xl">{daysLeft} days</p>
        </div>
    );
}

export default function GoalSummary({ currentSaving, daysRemaining, progressPercent }) {
    return (
        <div className="flex flex-col md:flex-row justify-center items-center gap-40 px-4 md:px-0">
            <div className="text-center">
                <p className="text-sm text-gray-500 mb-3 uppercase font-semibold tracking-wide">
                    Current Savings
                </p>
                <CircularProgress
                    progress={100}
                    color="#16a34a"
                    label={`$${currentSaving.toLocaleString()}`}
                    size={160}
                    strokeWidth={14}
                />
            </div>

            <TimeRemainingCard daysLeft={daysRemaining} />

            <div className="text-center">
                <p className="text-sm text-gray-500 mb-3 uppercase font-semibold tracking-wide">
                    Savings Progress
                </p>
                <CircularProgress
                    progress={progressPercent}
                    color="#2563eb"
                    label={`${progressPercent}%`}
                    size={160}
                    strokeWidth={14}
                />
            </div>
        </div>
    );
}
