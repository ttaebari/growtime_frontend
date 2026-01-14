import { FC, useEffect, useRef } from "react";
import { useConfirmStore } from "@/store/confirmStore";

const ConfirmModal: FC = () => {
    const { isOpen, title, message, onConfirm, onCancel, closeConfirm } = useConfirmStore();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        closeConfirm();
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        closeConfirm();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div
                ref={modalRef}
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all scale-100 opacity-100 overflow-hidden"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-sky-50/50 dark:bg-sky-900/10">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="text-sky-500 text-xl">✨</span>
                        {title}
                    </h3>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{message}</p>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 rounded-b-xl">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
