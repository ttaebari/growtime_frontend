import { FC } from "react";

type MainPageErrorProps = {
    message: string;
    onRetry: () => void;
};

const MainPageError: FC<MainPageErrorProps> = ({ message, onRetry }) => (
    <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="p-8 w-full max-w-md text-center bg-white rounded-2xl shadow-xl">
            <div className="mb-4 text-6xl text-red-500">⚠️</div>
            <h2 className="mb-2 text-xl font-bold text-gray-800">오류 발생</h2>
            <p className="mb-4 text-gray-600">{message}</p>
            <button
                onClick={onRetry}
                className="px-6 py-2 text-white bg-blue-500 rounded-lg transition hover:bg-blue-600"
            >
                다시 시도
            </button>
        </div>
    </div>
);

export default MainPageError;
