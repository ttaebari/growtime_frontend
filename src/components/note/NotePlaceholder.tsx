import { FC } from "react";

const NotePlaceholder: FC = () => (
    <div className="flex flex-1 justify-center items-center text-gray-500">
        <div className="text-center">
            <div className="mb-4 text-6xl">📝</div>
            <h3 className="mb-2 text-xl font-medium">회고를 선택하세요</h3>
            <p>왼쪽 목록에서 회고를 클릭하거나</p>
            <p>상단의 "새 회고 작성" 버튼을 눌러보세요</p>
        </div>
    </div>
);

export default NotePlaceholder;
