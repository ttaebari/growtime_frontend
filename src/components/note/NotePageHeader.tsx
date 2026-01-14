import { FC } from "react";

type NotePageHeaderProps = {
    onBack: () => void;
    onNewNote: () => void;
};

const NotePageHeader: FC<NotePageHeaderProps> = ({ onBack, onNewNote }) => (
    <div className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="container px-4 py-4 mx-auto">
            <div className="flex justify-between items-center">
                <button
                    onClick={onBack}
                    className="flex gap-2 items-center text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-medium">뒤로가기</span>
                </button>

                <h1 className="flex gap-2 items-center text-2xl font-bold text-gray-800 dark:text-gray-100">
                    <span role="img" aria-label="notebook">
                        📝
                    </span>
                    회고 관리
                </h1>

                <button
                    onClick={onNewNote}
                    className="flex gap-2 items-center px-4 py-2 text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    새 회고 작성
                </button>
            </div>
        </div>
    </div>
);

export default NotePageHeader;
