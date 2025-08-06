import { useState, useEffect, FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { noteAPI } from "../../api/api";
import { NotePageProps } from "../../types/note/types";

const NotePage: FC<NotePageProps> = ({ githubId, selectedNote, onSave, onCancel }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // URL에서 githubId 가져오기
    const getGitHubId = () => {
        return githubId || searchParams.get("githubId") || "";
    };

    // 선택된 회고가 있으면 폼에 채우기
    useEffect(() => {
        if (selectedNote) {
            setTitle(selectedNote.title);
            setContent(selectedNote.content);
        } else {
            setTitle("");
            setContent("");
        }
    }, [selectedNote]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            const currentGitHubId = getGitHubId();
            if (!currentGitHubId) {
                setError("사용자 정보를 찾을 수 없습니다.");
                return;
            }

            if (selectedNote) {
                // 회고 수정
                await noteAPI.updateNote(currentGitHubId, selectedNote.id.toString(), {
                    title: title.trim(),
                    content: content.trim(),
                });
            } else {
                // 새 회고 작성
                await noteAPI.createNote(currentGitHubId, {
                    title: title.trim(),
                    content: content.trim(),
                });
            }

            // 성공 처리
            if (onSave) {
                onSave();
            } else {
                alert(selectedNote ? "회고가 수정되었습니다!" : "회고가 저장되었습니다!");
                navigate("/main?githubId=" + currentGitHubId);
            }
        } catch (err: any) {
            console.error("회고 저장 실패:", err);
            setError(err.response?.data?.error || "회고 저장에 실패했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleBack = () => {
        if (onCancel) {
            onCancel();
        } else {
            const currentGitHubId = getGitHubId();
            navigate("/main?githubId=" + currentGitHubId);
        }
    };

    return (
        <div className="py-8 min-h-screen bg-gradient-to-br from-indigo-400 to-purple-500">
            <div className="container px-4 mx-auto max-w-4xl">
                {/* 헤더 */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={handleBack}
                        className="flex gap-2 items-center text-white transition-colors hover:text-gray-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-medium">뒤로가기</span>
                    </button>
                    <h1 className="flex gap-2 items-center text-3xl font-bold text-white">
                        <span role="img" aria-label="notebook">
                            📝
                        </span>
                        {selectedNote ? "회고 수정" : "회고 작성"}
                    </h1>
                    <div className="w-24"></div> {/* 균형을 위한 빈 공간 */}
                </div>

                {/* 회고 작성 폼 */}
                <div className="p-8 rounded-2xl shadow-xl backdrop-blur-sm bg-white/95">
                    {/* 에러 메시지 */}
                    {error && (
                        <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg border border-red-400">
                            <div className="flex gap-2 items-center">
                                <span className="text-lg">⚠️</span>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 제목 입력 */}
                        <div>
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

                        {/* 내용 입력 */}
                        <div>
                            <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-700">
                                내용
                            </label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={12}
                                className="px-4 py-3 w-full rounded-lg border border-gray-300 transition-all resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="오늘의 회고를 작성해보세요..."
                                required
                            />
                        </div>

                        {/* 버튼 그룹 */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={handleBack}
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
            </div>
        </div>
    );
};

export default NotePage;
