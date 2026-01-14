import { FC, useEffect } from "react";
import { useAlertStore, AlertType } from "@/store/alertStore";

const AlertModal: FC = () => {
    const { isOpen, type, title, message, closeAlert } = useAlertStore();

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

    const getIcon = (type: AlertType) => {
        switch (type) {
            case "info":
                return (
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 mx-auto">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                );
            case "warn":
                return (
                    <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-4 mx-auto">
                        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                );
            case "error":
                return (
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 mx-auto">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                );
        }
    };

    const getButtonColor = (type: AlertType) => {
        switch (type) {
            case "info":
                return "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500";
            case "warn":
                return "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500";
            case "error":
                return "bg-red-500 hover:bg-red-600 focus:ring-red-500";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 transform transition-all scale-100 opacity-100 text-center">
                {getIcon(type)}

                {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>}

                <p
                    className={`text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed ${
                        !title ? "text-lg font-medium" : ""
                    }`}
                >
                    {message}
                </p>

                <div className="mt-6">
                    <button
                        onClick={closeAlert}
                        className={`w-full px-4 py-2.5 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${getButtonColor(
                            type
                        )}`}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
