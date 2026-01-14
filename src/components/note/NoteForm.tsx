import { FC } from "react";
import { DevelopType, DEVELOP_TYPE_LABELS } from "@/types/note/types";

type NoteFormProps = {
    isCreating: boolean;
    title: string;
    content: string;
    developType: DevelopType;
    isSaving: boolean;
    saveError: string | null;
    onTitleChange: (value: string) => void;
    onContentChange: (value: string) => void;
    onDevelopTypeChange: (value: DevelopType) => void;
    onCancel: () => void;
    onSubmit: (event: React.FormEvent) => void;
};

const NoteForm: FC<NoteFormProps> = ({
    isCreating,
    title,
    content,
    developType,
    isSaving,
    saveError,
    onTitleChange,
    onContentChange,
    onDevelopTypeChange,
    onCancel,
    onSubmit,
}) => (
    <div className="flex flex-col p-6 h-full">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {isCreating ? "새 회고 작성" : "회고 수정"}
            </h2>
            <button
                onClick={onCancel}
                className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {saveError && (
            <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg border border-red-400">
                <div className="flex gap-2 items-center">
                    <span className="text-lg">⚠️</span>
                    <span>{saveError}</span>
                </div>
            </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col flex-1">
            <div className="mb-4">
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    제목
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(event) => onTitleChange(event.target.value)}
                    className="px-4 py-3 w-full rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="회고 제목을 입력하세요"
                    required
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="developType"
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    개발 타입
                </label>
                <select
                    id="developType"
                    value={developType}
                    onChange={(event) => onDevelopTypeChange(event.target.value as DevelopType)}
                    className="px-4 py-3 w-full rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    {Object.values(DevelopType).map((type) => (
                        <option key={type} value={type}>
                            {DEVELOP_TYPE_LABELS[type]}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col flex-1 mb-4">
                <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    내용
                </label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(event) => onContentChange(event.target.value)}
                    className="flex-1 px-4 py-3 w-full rounded-lg border border-gray-300 transition-all resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="오늘의 회고를 작성해보세요..."
                    required
                />
            </div>

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-6 py-3 text-gray-700 rounded-lg border border-gray-300 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                    취소
                </button>
                <button
                    type="submit"
                    disabled={isSaving || !title.trim() || !content.trim()}
                    className="flex-1 px-6 py-3 text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <div className="flex gap-2 justify-center items-center">
                            <div className="w-5 h-5 rounded-full border-b-2 border-white animate-spin"></div>
                            저장 중...
                        </div>
                    ) : (
                        "저장하기"
                    )}
                </button>
            </div>
        </form>
    </div>
);

export default NoteForm;
