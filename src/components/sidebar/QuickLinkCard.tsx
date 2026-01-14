import { FC } from "react";
import { QuickLink } from "@/types/quicklink/types";
import { useConfirmStore } from "@/store/confirmStore";

interface Props {
    link: QuickLink;
    onDelete: (id: number) => void;
}

const QuickLinkCard: FC<Props> = ({ link, onDelete }) => {
    const { openConfirm } = useConfirmStore();

    return (
        <div className="group relative flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600">
            <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 flex-1 min-w-0"
            >
                <div className="w-8 h-8 flex-shrink-0 bg-gray-50 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
                    {link.faviconUrl ? (
                        <img
                            src={link.faviconUrl}
                            alt={link.title}
                            className="w-5 h-5 object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                            }}
                        />
                    ) : null}
                    <span className={`text-lg ${link.faviconUrl ? "hidden" : ""}`}>🔗</span>
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {link.title}
                    </h4>
                    <p className="text-xs text-gray-400 truncate">{new URL(link.url).hostname}</p>
                </div>
            </a>

            <button
                onClick={() => {
                    openConfirm("링크 삭제", "이 링크를 삭제하시겠습니까?", () => onDelete(link.id));
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                aria-label="삭제"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    );
};

export default QuickLinkCard;
