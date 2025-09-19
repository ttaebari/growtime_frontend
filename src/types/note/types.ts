export type Note = {
    id: number;
    title: string;
    content: string;
    developType: DevelopType;
    createdAt: string;
    updatedAt: string;
};

export type CreateNoteRequest = {
    title: string;
    content: string;
    developType: DevelopType;
};

export type UpdateNoteRequest = {
    title: string;
    content: string;
    developType: DevelopType;
};

export enum DevelopType {
    FRONTEND = "FRONTEND",
    BACKEND = "BACKEND",
    FULLSTACK = "FULLSTACK",
    DEVOPS = "DEVOPS",
}

export const DEVELOP_TYPE_LABELS: Record<DevelopType, string> = {
    [DevelopType.FRONTEND]: "프론트엔드",
    [DevelopType.BACKEND]: "백엔드",
    [DevelopType.FULLSTACK]: "풀스택",
    [DevelopType.DEVOPS]: "데브옵스",
};

export const DEVELOP_TYPE_COLORS: Record<DevelopType, string> = {
    [DevelopType.FRONTEND]: "bg-blue-100 text-blue-800",
    [DevelopType.BACKEND]: "bg-green-100 text-green-800",
    [DevelopType.FULLSTACK]: "bg-purple-100 text-purple-800",
    [DevelopType.DEVOPS]: "bg-orange-100 text-orange-800",
};

export type NotePageProps = {
    githubId?: string;
    selectedNote?: Note | null;
    onSave?: () => void;
    onCancel?: () => void;
};
