import { FC } from "react";
import { Note, DevelopType, DEVELOP_TYPE_COLORS, DEVELOP_TYPE_LABELS } from "@/types/note/types";

type NoteListPanelProps = {
    notes: Note[];
    loading: boolean;
    error: string | null;
    selectedNoteId: number | null;
    searchKeyword: string;
    selectedFilter: DevelopType | "ALL";
    onSearchKeywordChange: (value: string) => void;
    onSearch: (keyword: string) => void;
    onFilterChange: (filter: DevelopType | "ALL") => void;
    onRetry: () => void;
    onSelectNote: (note: Note) => void;
    onNewNote: () => void;
};

const NoteListPanel: FC<NoteListPanelProps> = ({
    notes,
    loading,
    error,
    selectedNoteId,
    searchKeyword,
    selectedFilter,
    onSearchKeywordChange,
    onSearch,
    onFilterChange,
    onRetry,
    onSelectNote,
    onNewNote,
}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getContentPreview = (content: string) => {
        return content.length > 50 ? `${content.substring(0, 50)}...` : content;
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSearch(searchKeyword);
    };

    return (
        <div className="flex flex-col w-80 bg-white rounded-xl border border-gray-200 shadow-xl dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="flex gap-2 items-center text-lg font-bold text-gray-800 dark:text-gray-100">
                        <span role="img" aria-label="list">
                            📋
                        </span>
                        회고 목록
                    </h2>

                    <div className="flex gap-2 items-center">
                        <label htmlFor="filter-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            필터:
                        </label>
                        <select
                            id="filter-select"
                            value={selectedFilter}
                            onChange={(e) => onFilterChange(e.target.value as DevelopType | "ALL")}
                            className="px-3 py-2 text-sm bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="ALL">전체</option>
                            {Object.values(DevelopType).map((type) => (
                                <option key={type} value={type}>
                                    {DEVELOP_TYPE_LABELS[type]}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(event) => onSearchKeywordChange(event.target.value)}
                        placeholder="회고 검색..."
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        className="px-3 py-2 text-sm text-white bg-gray-500 rounded-lg transition-colors hover:bg-gray-600"
                    >
                        검색
                    </button>
                </form>
            </div>

            <div className="overflow-y-auto flex-1 p-2">
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="w-8 h-8 rounded-full border-b-2 border-blue-600 animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="p-4 text-center text-red-500">
                        <p>{error}</p>
                        <button
                            onClick={onRetry}
                            className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
                        >
                            다시 시도
                        </button>
                    </div>
                ) : notes.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <div className="mb-2 text-4xl">📝</div>
                        <p className="mb-4">아직 작성된 회고가 없습니다.</p>
                        <button
                            onClick={onNewNote}
                            className="px-4 py-2 text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
                        >
                            첫 회고 작성하기
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {notes.map((note) => (
                            <button
                                key={note.id}
                                onClick={() => onSelectNote(note)}
                                className={`w-full text-left p-3 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                    selectedNoteId === note.id
                                        ? "bg-blue-50 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800"
                                        : "border border-gray-200 dark:border-gray-700"
                                }`}
                                type="button"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-medium text-gray-800 line-clamp-1 dark:text-gray-200">
                                        {note.title}
                                    </h3>
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full ${
                                            DEVELOP_TYPE_COLORS[note.developType]
                                        }`}
                                    >
                                        {DEVELOP_TYPE_LABELS[note.developType]}
                                    </span>
                                </div>
                                <p className="mb-2 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
                                    {getContentPreview(note.content)}
                                </p>
                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                    {formatDate(note.createdAt)}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoteListPanel;
