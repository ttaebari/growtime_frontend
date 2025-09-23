import React, { useState, useEffect } from "react";
import { noteAPI } from "../api/api";

interface Note {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

interface NoteListProps {
    githubId: string;
    onNoteSelect: (note: Note) => void;
    onNewNote: () => void;
}

const NoteList: React.FC<NoteListProps> = ({ githubId, onNoteSelect, onNewNote }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

    // 회고 목록 로드
    const loadNotes = async (keyword?: string) => {
        try {
            setLoading(true);
            setError(null);

            let response;
            if (keyword && keyword.trim()) {
                response = await noteAPI.searchNotes(githubId, keyword);
                setNotes(response.data.notes);
            } else {
                response = await noteAPI.getNotes(githubId);
                setNotes(response.data.notes);
            }
        } catch (err: any) {
            console.error("회고 목록 로드 실패:", err);
            setError("회고 목록을 불러올 수 없습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 검색 처리
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadNotes(searchKeyword);
    };

    // 회고 선택
    const handleNoteClick = (note: Note) => {
        setSelectedNoteId(note.id);
        onNoteSelect(note);
    };

    // 날짜 포맷팅
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

    // 내용 미리보기 (50자 제한)
    const getContentPreview = (content: string) => {
        return content.length > 50 ? content.substring(0, 50) + "..." : content;
    };

    useEffect(() => {
        if (githubId) {
            loadNotes();
        }
    }, [githubId]);

    return (
        <div className="flex flex-col w-80 h-full rounded-xl border shadow-xl backdrop-blur-sm bg-white/95 border-white/20">
            {/* 헤더 */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="flex gap-2 items-center text-lg font-bold text-gray-800">
                        <span role="img" aria-label="notebook">
                            📝
                        </span>
                        회고 목록
                    </h2>
                    <button
                        onClick={onNewNote}
                        className="p-2 text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
                        title="새 회고 작성"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                {/* 검색 */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="회고 검색..."
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        className="px-3 py-2 text-sm text-white bg-gray-500 rounded-lg transition-colors hover:bg-gray-600"
                    >
                        검색
                    </button>
                </form>
            </div>

            {/* 회고 목록 */}
            <div className="overflow-y-auto flex-1 p-2">
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="w-8 h-8 rounded-full border-b-2 border-blue-600 animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="p-4 text-center text-red-500">
                        <p>{error}</p>
                        <button
                            onClick={() => loadNotes()}
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
                            <div
                                key={note.id}
                                onClick={() => handleNoteClick(note)}
                                className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                                    selectedNoteId === note.id
                                        ? "bg-blue-50 border border-blue-200"
                                        : "border border-gray-200"
                                }`}
                            >
                                <h3 className="mb-1 font-medium text-gray-800 line-clamp-1">{note.title}</h3>
                                <p className="mb-2 text-sm text-gray-600 line-clamp-2">
                                    {getContentPreview(note.content)}
                                </p>
                                <div className="text-xs text-gray-400">{formatDate(note.createdAt)}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoteList;
