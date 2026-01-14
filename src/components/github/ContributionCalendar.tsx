import { FC } from "react";
import { GitHubContributions } from "@/types/github/types";

interface Props {
    contributions: GitHubContributions | null;
    isLoading?: boolean;
}

const ContributionCalendar: FC<Props> = ({ contributions, isLoading }) => {
    // 레벨별 색상 (GitHub 스타일) - Tailwind 클래스
    const getLevelClass = (level: number) => {
        switch (level) {
            case 1:
                return "bg-green-200 dark:bg-green-900";
            case 2:
                return "bg-green-400 dark:bg-green-700";
            case 3:
                return "bg-green-600 dark:bg-green-500";
            case 4:
                return "bg-green-800 dark:bg-green-300";
            default:
                return "bg-gray-100 dark:bg-gray-700"; // 다크모드에서 잘 보이도록 수정
        }
    };

    if (isLoading) {
        return (
            <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
                <span className="text-gray-400">잔디를 심고 있어요... 🌱</span>
            </div>
        );
    }

    if (!contributions) {
        return null;
    }

    return (
        <div className="w-full p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <span>📅</span> 최근 12주 활동
            </h3>

            <div className="flex gap-2 justify-center">
                {/* 요일 라벨 */}
                <div className="flex flex-col gap-1 text-[10px] text-gray-400 font-sans">
                    <div className="h-3"></div> {/* 일 */}
                    <div className="h-3 flex items-center">Mon</div>
                    <div className="h-3"></div> {/* 화 */}
                    <div className="h-3 flex items-center">Wed</div>
                    <div className="h-3"></div> {/* 목 */}
                    <div className="h-3 flex items-center">Fri</div>
                    <div className="h-3"></div> {/* 토 */}
                </div>

                {/* 잔디 그리드 */}
                <div className="flex gap-1 pb-2 w-full justify-center">
                    {contributions.weeks.map((week, wIndex) => (
                        <div key={wIndex} className="flex flex-col gap-1">
                            {week.days.map((day, dIndex) => (
                                <div
                                    key={dIndex}
                                    className={`w-3 h-3 rounded-sm ${getLevelClass(
                                        day.level
                                    )} transition-colors duration-200 relative group cursor-pointer`}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 font-sans">
                                        {day.count} contributions on {day.date}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-400">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-700"></div>
                <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900"></div>
                <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700"></div>
                <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500"></div>
                <div className="w-3 h-3 rounded-sm bg-green-800 dark:bg-green-300"></div>
                <span>More</span>
            </div>
        </div>
    );
};

export default ContributionCalendar;
