import React, { useState } from "react";
import { useQuickLinks } from "@/hooks/useQuickLinks";
import QuickLinkCard from "./QuickLinkCard";

interface Props {
    githubId: string | undefined;
}

const LeftSidebar: React.FC<Props> = ({ githubId }) => {
    const { quickLinks, isLoading, error, addQuickLink, deleteQuickLink } = useQuickLinks(githubId);

    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !url.trim()) return;

        setIsSubmitting(true);
        // URL에 프로토콜이 없으면 자동으로 추가
        let formattedUrl = url.trim();
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = `https://${formattedUrl}`;
        }

        const success = await addQuickLink({ title: title.trim(), url: formattedUrl });
        setIsSubmitting(false);

        if (success) {
            setTitle("");
            setUrl("");
            setIsAdding(false);
        }
    };

    if (!githubId) return null;

    return (
        <aside className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full max-h-[calc(100vh-120px)]">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-green-50 to-transparent dark:from-green-900/20">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <span>🔗</span> Quick Links
                </h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className={`p-1.5 rounded-md transition-colors ${
                        isAdding
                            ? "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                    }`}
                    aria-label="링크 추가"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform duration-200 ${isAdding ? "rotate-45" : ""}`}
                    >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isAdding && (
                    <form
                        onSubmit={handleSubmit}
                        className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-in slide-in-from-top-2 fade-in duration-200 border border-gray-200 dark:border-gray-600"
                    >
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="사이트 이름 (예: GitHub)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                autoFocus
                            />
                            <input
                                type="text"
                                placeholder="URL (예: github.com)"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/50 font-mono"
                            />
                            <button
                                type="submit"
                                disabled={!title.trim() || !url.trim() || isSubmitting}
                                className="w-full py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? "추가 중..." : "추가하기"}
                            </button>
                        </div>
                    </form>
                )}

                {isLoading && <div className="text-center py-4 text-gray-400 text-sm">Loading links...</div>}

                {error && <div className="text-center py-2 text-red-500 text-xs">{error}</div>}

                {!isLoading && !error && quickLinks.length === 0 && !isAdding && (
                    <div className="text-center py-8 text-gray-400">
                        <p className="text-sm">저장된 링크가 없습니다.</p>
                        <p className="text-xs mt-1">상단 버튼을 눌러 추가해보세요!</p>
                    </div>
                )}

                <div className="space-y-2">
                    {quickLinks.map((link) => (
                        <QuickLinkCard key={link.id} link={link} onDelete={deleteQuickLink} />
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default LeftSidebar;
