import React from "react";

interface DDayInfo {
    ddayCount: number;
    serviceDays: number;
    totalServiceDays: number;
    entryDate: string;
    dischargeDate: string;
    progressPercentage: number;
}

interface DDayDisplayProps {
    dDayInfo: DDayInfo;
}

const DDayDisplay: React.FC<DDayDisplayProps> = ({ dDayInfo }) => {
    console.log("dDayInfo", dDayInfo);
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getDDayText = (dDay: number) => {
        if (dDay > 0) {
            return `D-${dDay}`;
        } else if (dDay === 0) {
            return "D-Day";
        } else {
            return `D+${Math.abs(dDay)}`;
        }
    };

    const getDDayColor = (dDay: number) => {
        if (dDay > 30) return "text-green-600";
        if (dDay > 7) return "text-yellow-600";
        if (dDay > 0) return "text-orange-600";
        if (dDay === 0) return "text-red-600";
        return "text-gray-600";
    };

    return (
        <div className="p-8 w-full max-w-2xl bg-white rounded-2xl shadow-xl dark:bg-gray-800">
            {/* D-Day 메인 표시 */}
            <div className="mb-8 text-center">
                <div className={`text-6xl font-bold mb-2 ${getDDayColor(dDayInfo.ddayCount)}`}>
                    {getDDayText(dDayInfo.ddayCount)}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                    {dDayInfo.ddayCount > 0 ? "제대까지 남은 일수" : "제대 후 경과일"}
                </div>
            </div>

            {/* 진행률 바 */}
            <div className="mb-6">
                <div className="flex justify-between mb-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>복무 진행률</span>
                    <span>{dDayInfo.progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full dark:bg-gray-700">
                    <div
                        className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${dDayInfo.progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            {/* 복무 정보 */}
            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
                <div className="p-4 text-center bg-blue-50 rounded-lg dark:bg-blue-900/30">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dDayInfo.serviceDays}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">복무 경과일</div>
                </div>
                <div className="p-4 text-center bg-purple-50 rounded-lg dark:bg-purple-900/30">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {dDayInfo.totalServiceDays}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">전체 복무일</div>
                </div>
                <div className="p-4 text-center bg-green-50 rounded-lg dark:bg-green-900/30">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {dDayInfo.totalServiceDays - dDayInfo.serviceDays}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">남은 복무일</div>
                </div>
            </div>

            {/* 날짜 정보 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                    <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">입영일</div>
                    <div className="font-semibold dark:text-gray-200">{formatDate(dDayInfo.entryDate)}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                    <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">제대일</div>
                    <div className="font-semibold dark:text-gray-200">{formatDate(dDayInfo.dischargeDate)}</div>
                </div>
            </div>
        </div>
    );
};

export default DDayDisplay;
