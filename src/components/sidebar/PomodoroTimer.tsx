import React from "react";
import { usePomodoro } from "@/hooks/usePomodoro";

const PomodoroTimer: React.FC = () => {
    const { mode, timeLeft, isRunning, progress, formatTime, switchMode, toggleTimer, resetTimer } = usePomodoro();

    // 원형 진행바 계산
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    const getModeColor = () => {
        switch (mode) {
            case "focus":
                return "text-red-500 stroke-red-500";
            case "shortBreak":
                return "text-teal-500 stroke-teal-500";
            case "longBreak":
                return "text-blue-500 stroke-blue-500";
            default:
                return "text-gray-500 stroke-gray-500";
        }
    };

    const getModeBg = (currentMode: string) => {
        if (mode === currentMode) {
            switch (mode) {
                case "focus":
                    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
                case "shortBreak":
                    return "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300";
                case "longBreak":
                    return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
            }
        }
        return "bg-transparent text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700";
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            {/* 모드 선택 */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 w-full">
                <button
                    onClick={() => switchMode("focus")}
                    className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${getModeBg("focus")}`}
                >
                    Focus
                </button>
                <button
                    onClick={() => switchMode("shortBreak")}
                    className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${getModeBg("shortBreak")}`}
                >
                    Short
                </button>
                <button
                    onClick={() => switchMode("longBreak")}
                    className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${getModeBg("longBreak")}`}
                >
                    Long
                </button>
            </div>

            {/* 타이머 디스플레이 */}
            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* SVG Circle Progress */}
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        className="fill-none stroke-gray-200 dark:stroke-gray-700 stroke-[4]" // 6px width
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        className={`fill-none stroke-[4] transition-all duration-1000 ease-linear ${getModeColor()}`}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Time Text */}
                <div className="absolute flex flex-col items-center">
                    <span className={`text-5xl font-bold font-mono ${getModeColor().split(" ")[0]}`}>
                        {formatTime(timeLeft)}
                    </span>
                    <span className="text-sm text-gray-400 mt-1 uppercase tracking-wider">
                        {isRunning ? "Running" : "Paused"}
                    </span>
                </div>
            </div>

            {/* 컨트롤 버튼 */}
            <div className="flex gap-4 w-full justify-center">
                <button
                    onClick={toggleTimer}
                    className={`px-8 py-2 rounded-full font-bold text-white transition-transform hover:scale-105 active:scale-95 shadow-lg ${
                        mode === "focus"
                            ? "bg-red-500 hover:bg-red-600"
                            : mode === "shortBreak"
                            ? "bg-teal-500 hover:bg-teal-600"
                            : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                    {isRunning ? "PAUSE" : "START"}
                </button>
                <button
                    onClick={resetTimer}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Reset"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                        <path d="M3 3v5h5"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default PomodoroTimer;
