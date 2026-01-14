import { create } from "zustand";

interface ConfirmState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
    openConfirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => void;
    closeConfirm: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
    openConfirm: (title, message, onConfirm, onCancel) =>
        set({
            isOpen: true,
            title,
            message,
            onConfirm,
            onCancel: onCancel || null,
        }),
    closeConfirm: () =>
        set({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: null,
            onCancel: null,
        }),
}));
