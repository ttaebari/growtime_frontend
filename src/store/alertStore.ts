import { create } from "zustand";

export type AlertType = "info" | "warn" | "error";

interface AlertState {
    isOpen: boolean;
    type: AlertType;
    title?: string;
    message: string;
    openAlert: (type: AlertType, message: string, title?: string) => void;
    closeAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
    isOpen: false,
    type: "info",
    title: undefined,
    message: "",
    openAlert: (type, message, title) =>
        set({
            isOpen: true,
            type,
            message,
            title,
        }),
    closeAlert: () =>
        set({
            isOpen: false,
            message: "",
            title: undefined,
        }),
}));
