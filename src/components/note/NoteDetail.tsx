import { FC } from "react";
import { Note, DEVELOP_TYPE_COLORS, DEVELOP_TYPE_LABELS } from "@/types/note/types";

type NoteDetailProps = {
    note: Note;
    onEdit: () => void;
};

const NoteDetail: FC<NoteDetailProps> = ({ note, onEdit }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (date.toString() === "Invalid Date") {
            return "-";
        }
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="flex flex-col p-6 h-full">
            <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                    <div className="flex gap-3 items-center mb-2">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{note.title}</h2>
                        <span className={`px-3 py-1 text-sm rounded-full ${DEVELOP_TYPE_COLORS[note.developType]}`}>
                            {DEVELOP_TYPE_LABELS[note.developType]}
                        </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        작성일: {formatDate(note.createdAt)}
                        {note.updatedAt !== note.createdAt && (
                            <span className="ml-4">수정일: {formatDate(note.updatedAt)}</span>
                        )}
                    </div>
                </div>
                <button
                    onClick={onEdit}
                    className="px-4 py-2 text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
                >
                    수정
                </button>
            </div>

            <div className="overflow-y-auto flex-1">
                <div className="max-w-none prose dark:prose-invert">
                    <pre className="leading-relaxed text-gray-800 whitespace-pre-wrap dark:text-gray-200">
                        {note.content}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default NoteDetail;
