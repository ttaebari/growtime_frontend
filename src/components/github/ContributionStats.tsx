import { FC } from "react";
import { ContributionStats as StatsType } from "@/types/github/types";

interface Props {
    stats: StatsType | null;
}

const ContributionStats: FC<Props> = ({ stats }) => {
    if (!stats) return null;

    const cards = [
        {
            label: "총 기여",
            value: stats.totalCommits,
            icon: "📊",
            desc: "지난 12주간",
        },
        {
            label: "현재 연속",
            value: `${stats.currentStreak}일`,
            icon: "🔥",
            desc: `최장 ${stats.longestStreak}일`,
        },
        {
            label: "평균 기여",
            value: stats.averagePerDay,
            icon: "📈",
            desc: "일일 평균",
        },
        {
            label: "활동 요일",
            value: stats.mostActiveDay,
            icon: "📅",
            desc: "가장 활발함",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center transition hover:shadow-md"
                >
                    <div className="text-2xl mb-2">{card.icon}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{card.label}</div>
                    <div className="text-xl font-bold text-gray-800 dark:text-gray-100">{card.value}</div>
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1 bg-green-50 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                        {card.desc}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ContributionStats;
