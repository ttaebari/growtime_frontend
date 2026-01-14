import { useState, useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { NoteService } from "@/services/noteService";
import { AuthService } from "@/services/authService";
import { Note, DevelopType } from "@/types/note/types";
import NotePageHeader from "@/components/note/NotePageHeader";
import NoteListPanel from "@/components/note/NoteListPanel";
import NoteForm from "@/components/note/NoteForm";
import NoteDetail from "@/components/note/NoteDetail";
import NotePlaceholder from "@/components/note/NotePlaceholder";

interface NotePageProps {
    githubId?: string;
    selectedNote?: Note | null;
    onSave?: () => void;
    onCancel?: () => void;
}

const NotePage: FC<NotePageProps> = ({ githubId, selectedNote: initialNote, onSave, onCancel }) => {
    const navigate = useNavigate();

    const [notes, setNotes] = useState<Note[]>([]);
    const [loadingNotes, setLoadingNotes] = useState(true);
    const [notesError, setNotesError] = useState<string | null>(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedFilter, setSelectedFilter] = useState<DevelopType | "ALL">("ALL");

    const [selectedNote, setSelectedNote] = useState<Note | null>(initialNote || null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const [developType, setDevelopType] = useState<DevelopType>(DevelopType.FRONTEND);

    const getGitHubId = () => {
        return githubId || AuthService.getGithubId() || "";
    };

    const getFilteredNotes = () => {
        if (selectedFilter === "ALL") {
            return notes;
        }
        return notes.filter((note) => note.developType === selectedFilter);
    };

    const loadNotes = async (keyword?: string) => {
        try {
            setLoadingNotes(true);
            setNotesError(null);

            const currentGitHubId = getGitHubId();
            if (!currentGitHubId) return;

            let notesData;
            if (keyword && keyword.trim()) {
                const response = await NoteService.searchNotes(currentGitHubId, keyword);
                notesData = response.notes;
            } else {
                const response = await NoteService.getNotes(currentGitHubId);
                notesData = response.notes;
            }
            setNotes(notesData);
        } catch (err: any) {
            console.error("회고 목록 로드 실패:", err);
            setNotesError("회고 목록을 불러올 수 없습니다.");
        } finally {
            setLoadingNotes(false);
        }
    };

    const handleNoteClick = (note: Note) => {
        setSelectedNote(note);
        setIsEditing(false);
        setIsCreating(false);
        setTitle(note.title);
        setContent(note.content);
        setDevelopType(note.developType);
        setSaveError(null);
    };

    const handleNewNote = () => {
        setSelectedNote(null);
        setIsEditing(false);
        setIsCreating(true);
        setTitle("");
        setContent("");
        setDevelopType(DevelopType.FRONTEND);
        setSaveError(null);
    };

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

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSaving(true);
        setSaveError(null);

        try {
            const currentGitHubId = getGitHubId();
            if (!currentGitHubId) {
                setSaveError("사용자 정보를 찾을 수 없습니다.");
                return;
            }

            if (isCreating) {
                const newNote = await NoteService.createNote(currentGitHubId, {
                    title: title.trim(),
                    content: content.trim(),
                    developType: developType,
                });

                await loadNotes();

                setSelectedNote(newNote);
                setIsCreating(false);
            } else if (isEditing && selectedNote) {
                await NoteService.updateNote(currentGitHubId, selectedNote.id.toString(), {
                    title: title.trim(),
                    content: content.trim(),
                    developType: developType,
                });

                await loadNotes();

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

    const handleBack = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate("/main");
        }
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
        <Layout>
            <NotePageHeader onBack={handleBack} onNewNote={handleNewNote} />

            <div className="container flex gap-6 px-4 py-6 mx-auto" style={{ height: "calc(100vh - 120px)" }}>
                <NoteListPanel
                    notes={getFilteredNotes()}
                    loading={loadingNotes}
                    error={notesError}
                    selectedNoteId={selectedNote?.id ?? null}
                    searchKeyword={searchKeyword}
                    selectedFilter={selectedFilter}
                    onSearchKeywordChange={setSearchKeyword}
                    onSearch={(keyword) => loadNotes(keyword)}
                    onFilterChange={setSelectedFilter}
                    onRetry={() => loadNotes()}
                    onSelectNote={handleNoteClick}
                    onNewNote={handleNewNote}
                />

                <div className="flex flex-col flex-1 bg-white rounded-xl border border-gray-200 shadow-xl dark:bg-gray-800 dark:border-gray-700">
                    {isCreating || isEditing ? (
                        <NoteForm
                            isCreating={isCreating}
                            title={title}
                            content={content}
                            developType={developType}
                            isSaving={isSaving}
                            saveError={saveError}
                            onTitleChange={setTitle}
                            onContentChange={setContent}
                            onDevelopTypeChange={setDevelopType}
                            onCancel={handleCancel}
                            onSubmit={handleSave}
                        />
                    ) : selectedNote ? (
                        <NoteDetail note={selectedNote} onEdit={handleEditNote} />
                    ) : (
                        <NotePlaceholder />
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default NotePage;
