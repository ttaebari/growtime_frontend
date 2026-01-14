import React from "react";
import PomodoroTimer from "./PomodoroTimer";

const RightSidebar: React.FC = () => {
    return (
        <aside className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full max-h-[calc(100vh-120px)]">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-red-50 to-transparent dark:from-red-900/20">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <span>🍅</span> Pomodoro Timer
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-800/50">
                <PomodoroTimer />
            </div>
        </aside>
    );
};

export default RightSidebar;
