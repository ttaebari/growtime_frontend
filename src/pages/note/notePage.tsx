import { useState, useEffect, FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { noteAPI } from "../../api/api";
import { Note, DevelopType, DEVELOP_TYPE_LABELS, DEVELOP_TYPE_COLORS } from "../../types/note/types";

interface NotePageProps {
    githubId?: string;
    selectedNote?: Note | null;
    onSave?: () => void;
    onCancel?: () => void;
}

const NotePage: FC<NotePageProps> = ({ githubId, selectedNote: initialNote, onSave, onCancel }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // 회고 목록 관련 상태
    const [notes, setNotes] = useState<Note[]>([]);
    const [loadingNotes, setLoadingNotes] = useState(true);
    const [notesError, setNotesError] = useState<string | null>(null);
    const [searchKeyword, setSearchKeyword] = useState("");

    // 선택된 회고 및 편집 상태
    const [selectedNote, setSelectedNote] = useState<Note | null>(initialNote || null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // 폼 상태
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // 개발 타입 상태
    const [developType, setDevelopType] = useState<DevelopType>(DevelopType.FRONTEND);

    // URL에서 githubId 가져오기
    const getGitHubId = () => {
        return githubId || searchParams.get("githubId") || "";
    };

    // 회고 목록 로드
    const loadNotes = async (keyword?: string) => {
        try {
            setLoadingNotes(true);
            setNotesError(null);

            const currentGitHubId = getGitHubId();
            if (!currentGitHubId) return;

            let response;
            if (keyword && keyword.trim()) {
                response = await noteAPI.searchNotes(currentGitHubId, keyword);
            } else {
                response = await noteAPI.getNotes(currentGitHubId);
            }
            setNotes(response.data.notes);
        } catch (err: any) {
            console.error("회고 목록 로드 실패:", err);
            setNotesError("회고 목록을 불러올 수 없습니다.");
        } finally {
            setLoadingNotes(false);
        }
    };

    // 검색 처리
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadNotes(searchKeyword);
    };

    // 회고 선택
    const handleNoteClick = (note: Note) => {
        setSelectedNote(note);
        setIsEditing(false);
        setIsCreating(false);
        setTitle(note.title);
        setContent(note.content);
        setDevelopType(note.developType);
        setSaveError(null);
    };

    // 새 회고 작성 시작
    const handleNewNote = () => {
        setSelectedNote(null);
        setIsEditing(false);
        setIsCreating(true);
        setTitle("");
        setContent("");
        setDevelopType(DevelopType.FRONTEND);
        setSaveError(null);
    };

    // 편집 모드 시작
    const handleEditNote = () => {
        if (selectedNote) {
            setIsEditing(true);
            setIsCreating(false);
            setTitle(selectedNote.title);
            setContent(selectedNote.content);
            setDevelopType(selectedNote.developType);
            setSaveError(null);
        }
    };

    // 편집/생성 취소
    const handleCancel = () => {
        setIsEditing(false);
        setIsCreating(false);
        setSaveError(null);
        if (selectedNote) {
            setTitle(selectedNote.title);
            setContent(selectedNote.content);
            setDevelopType(selectedNote.developType);
        } else {
            setTitle("");
            setContent("");
            setDevelopType(DevelopType.FRONTEND);
        }
    };

    // 회고 저장
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError(null);

        try {
            const currentGitHubId = getGitHubId();
            if (!currentGitHubId) {
                setSaveError("사용자 정보를 찾을 수 없습니다.");
                return;
            }

            if (isCreating) {
                // 새 회고 작성
                const response = await noteAPI.createNote(currentGitHubId, {
                    title: title.trim(),
                    content: content.trim(),
                    developType: developType,
                });

                // 목록 새로고침
                await loadNotes();

                // 새로 생성된 회고 선택
                const newNote = response.data;
                setSelectedNote(newNote);
                setIsCreating(false);
            } else if (isEditing && selectedNote) {
                // 회고 수정
                await noteAPI.updateNote(currentGitHubId, selectedNote.id.toString(), {
                    title: title.trim(),
                    content: content.trim(),
                    developType: developType,
                });

                // 목록 새로고침
                await loadNotes();

                // 수정된 회고 정보 업데이트
                const updatedNote = {
                    ...selectedNote,
                    title: title.trim(),
                    content: content.trim(),
                    developType: developType,
                };
                setSelectedNote(updatedNote);
                setIsEditing(false);
            }

            if (onSave) {
                onSave();
            }
        } catch (err: any) {
            console.error("회고 저장 실패:", err);
            setSaveError(err.response?.data?.error || "회고 저장에 실패했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    // 뒤로가기
    const handleBack = () => {
        if (onCancel) {
            onCancel();
        } else {
            const currentGitHubId = getGitHubId();
            navigate("/main?githubId=" + currentGitHubId);
        }
    };

    // 날짜 포맷팅
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

    // 내용 미리보기
    const getContentPreview = (content: string) => {
        return content.length > 50 ? content.substring(0, 50) + "..." : content;
    };

    useEffect(() => {
        const currentGitHubId = getGitHubId();
        if (currentGitHubId) {
            loadNotes();
        }
    }, [githubId]);

    useEffect(() => {
        if (initialNote) {
            setSelectedNote(initialNote);
            setTitle(initialNote.title);
            setContent(initialNote.content);
            setDevelopType(initialNote.developType);
        }
    }, [initialNote]);

    return (
        <div className="min-h-screen bg-white">
            {/* 헤더 */}
            <div className="bg-white border-b border-gray-200">
                <div className="container px-4 py-4 mx-auto">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={handleBack}
                            className="flex gap-2 items-center text-gray-700 transition-colors hover:text-gray-900"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            <span className="font-medium">뒤로가기</span>
                        </button>

                        <h1 className="flex gap-2 items-center text-2xl font-bold text-gray-800">
                            <span role="img" aria-label="notebook">
                                📝
                            </span>
                            회고 관리
                        </h1>

                        <button
                            onClick={handleNewNote}
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

            {/* 메인 콘텐츠 */}
            <div className="container flex gap-6 px-4 py-6 mx-auto bg-white" style={{ height: "calc(100vh - 120px)" }}>
                {/* 왼쪽: 회고 목록 */}
                <div className="flex flex-col w-80 bg-white rounded-xl border border-gray-200 shadow-xl">
                    {/* 검색 헤더 */}
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="flex gap-2 items-center mb-3 text-lg font-bold text-gray-800">
                            <span role="img" aria-label="list">
                                📋
                            </span>
                            회고 목록
                        </h2>

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
                        {loadingNotes ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="w-8 h-8 rounded-full border-b-2 border-blue-600 animate-spin"></div>
                            </div>
                        ) : notesError ? (
                            <div className="p-4 text-center text-red-500">
                                <p>{notesError}</p>
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
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {notes.map((note) => (
                                    <div
                                        key={note.id}
                                        onClick={() => handleNoteClick(note)}
                                        className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                                            selectedNote?.id === note.id
                                                ? "bg-blue-50 border border-blue-200"
                                                : "border border-gray-200"
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-medium text-gray-800 line-clamp-1">{note.title}</h3>
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    DEVELOP_TYPE_COLORS[note.developType]
                                                }`}
                                            >
                                                {DEVELOP_TYPE_LABELS[note.developType]}
                                            </span>
                                        </div>
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

                {/* 오른쪽: 회고 상세/편집 */}
                <div className="flex flex-col flex-1 bg-white rounded-xl border border-gray-200 shadow-xl">
                    {isCreating || isEditing ? (
                        // 작성/편집 폼
                        <div className="flex flex-col p-6 h-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {isCreating ? "새 회고 작성" : "회고 수정"}
                                </h2>
                                <button
                                    onClick={handleCancel}
                                    className="text-gray-500 transition-colors hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
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

                            <form onSubmit={handleSave} className="flex flex-col flex-1">
                                <div className="mb-4">
                                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">
                                        제목
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="px-4 py-3 w-full rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="회고 제목을 입력하세요"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label
                                        htmlFor="developType"
                                        className="block mb-2 text-sm font-medium text-gray-700"
                                    >
                                        개발 타입
                                    </label>
                                    <select
                                        id="developType"
                                        value={developType}
                                        onChange={(e) => setDevelopType(e.target.value as DevelopType)}
                                        className="px-4 py-3 w-full rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {Object.values(DevelopType).map((type) => (
                                            <option key={type} value={type}>
                                                {DEVELOP_TYPE_LABELS[type]}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col flex-1 mb-4">
                                    <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-700">
                                        내용
                                    </label>
                                    <textarea
                                        id="content"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="flex-1 px-4 py-3 w-full rounded-lg border border-gray-300 transition-all resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="오늘의 회고를 작성해보세요..."
                                        required
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex-1 px-6 py-3 text-gray-700 rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
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
                    ) : selectedNote ? (
                        // 회고 상세 보기
                        <div className="flex flex-col p-6 h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex-1">
                                    <div className="flex gap-3 items-center mb-2">
                                        <h2 className="text-2xl font-bold text-gray-800">{selectedNote.title}</h2>
                                        <span
                                            className={`px-3 py-1 text-sm rounded-full ${
                                                DEVELOP_TYPE_COLORS[selectedNote.developType]
                                            }`}
                                        >
                                            {DEVELOP_TYPE_LABELS[selectedNote.developType]}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        작성일: {formatDate(selectedNote.createdAt)}
                                        {selectedNote.updatedAt !== selectedNote.createdAt && (
                                            <span className="ml-4">수정일: {formatDate(selectedNote.updatedAt)}</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleEditNote}
                                    className="px-4 py-2 text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
                                >
                                    수정
                                </button>
                            </div>

                            <div className="overflow-y-auto flex-1">
                                <div className="max-w-none prose">
                                    <pre className="leading-relaxed text-gray-800 whitespace-pre-wrap">
                                        {selectedNote.content}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // 기본 상태 (회고 선택 전)
                        <div className="flex flex-1 justify-center items-center text-gray-500">
                            <div className="text-center">
                                <div className="mb-4 text-6xl">📝</div>
                                <h3 className="mb-2 text-xl font-medium">회고를 선택하세요</h3>
                                <p>왼쪽 목록에서 회고를 클릭하거나</p>
                                <p>상단의 "새 회고 작성" 버튼을 눌러보세요</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotePage;
