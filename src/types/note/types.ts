export type Note = {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
};

export type NotePageProps = {
    githubId?: string;
    selectedNote?: Note | null;
    onSave?: () => void;
    onCancel?: () => void;
};
