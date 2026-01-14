import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { theme, toggleTheme } = useTheme();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    // Close settings when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="min-h-screen bg-white transition-colors duration-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* 설정 버튼 (우측 상단) */}
            <div className="absolute top-4 right-4 z-50" ref={settingsRef}>
                <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="p-2 text-gray-600 rounded-full transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    aria-label="설정"
                >
                    {/* Gear Icon SVG */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </button>

                {isSettingsOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
                        <div className="py-1">
                            <button
                                onClick={() => {
                                    toggleTheme();
                                }}
                                className="flex items-center justify-between px-4 py-2 w-full text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                <span>다크 모드</span>
                                <div
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        theme === "dark" ? "bg-indigo-600" : "bg-gray-200"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            theme === "dark" ? "translate-x-6" : "translate-x-1"
                                        }`}
                                    />
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {children}
        </div>
    );
};

export default Layout;
