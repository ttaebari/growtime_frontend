import { FC } from "react";

const MainPageLoading: FC = () => (
    <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="p-8 text-center bg-white rounded-2xl shadow-xl">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 border-blue-600 animate-spin"></div>
            <div className="text-gray-600">로딩 중...</div>
        </div>
    </div>
);

export default MainPageLoading;
