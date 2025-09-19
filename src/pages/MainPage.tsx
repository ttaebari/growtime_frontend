import { useState, useEffect, FC } from "react";
import DDayDisplay from "../components/DDayDisplay";
import ServiceDateForm from "../components/ServiceDateForm";
import MenuButton from "../components/MenuButton";
import { User, DDayInfo } from "../types/user/types";
import { useNavigate } from "react-router-dom";

const MainPage: FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [dDayInfo, setDDayInfo] = useState<DDayInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    // URL에서 GitHub ID 추출 (실제로는 로그인 후 세션에서 가져와야 함)
    const getGitHubId = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("githubId") || "test-user"; // 임시로 테스트용
    };

    // 사용자 정보 로드
    const loadUserInfo = async () => {
        try {
            const githubId = getGitHubId();
            const response = await fetch(`/api/user/${githubId}`);

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);

                // 복무 날짜가 설정되어 있으면 D-day 정보도 로드
                if (userData.entryDate && userData.dischargeDate) {
                    await loadDDayInfo(githubId);
                }
            } else {
                setError("사용자 정보를 불러올 수 없습니다.");
            }
        } catch (err) {
            setError("서버 연결에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // D-day 정보 로드
    const loadDDayInfo = async (githubId: string) => {
        try {
            const response = await fetch(`/api/user/${githubId}/d-day`);

            if (response.ok) {
                const dDayData = await response.json();
                setDDayInfo(dDayData);
            } else {
                setError("D-day 정보를 불러올 수 없습니다.");
            }
        } catch (err) {
            setError("D-day 정보 로드에 실패했습니다.");
        }
    };

    // 복무 날짜 저장
    const handleSaveServiceDates = async (entryDate: string, dischargeDate: string) => {
        setIsSaving(true);
        setError("");

        try {
            const githubId = getGitHubId();
            const params = new URLSearchParams({
                entryDate,
                dischargeDate,
            });

            const response = await fetch(`/api/user/${githubId}/service-dates?${params}`, {
                method: "POST",
            });

            if (response.ok) {
                const result = await response.json();
                setUser(result);
                await loadDDayInfo(githubId);
            } else {
                const errorData = await response.json();
                setError(errorData.error || "복무 정보 저장에 실패했습니다.");
            }
        } catch (err) {
            setError("서버 연결에 실패했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        loadUserInfo();
    }, []);

    // 메뉴 아이템 정의
    const menuItems = [
        {
            id: "note",
            label: "회고 작성",
            icon: "📝",
            onClick: () => navigate("/note?githubId=" + getGitHubId()),
        },
        // 향후 더 많은 메뉴 아이템을 여기에 추가할 수 있습니다
    ];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="p-8 text-center bg-white rounded-2xl shadow-xl">
                    <div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 border-blue-600 animate-spin"></div>
                    <div className="text-gray-600">로딩 중...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="p-8 w-full max-w-md text-center bg-white rounded-2xl shadow-xl">
                    <div className="mb-4 text-6xl text-red-500">⚠️</div>
                    <h2 className="mb-2 text-xl font-bold text-gray-800">오류 발생</h2>
                    <p className="mb-4 text-gray-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 text-white bg-blue-500 rounded-lg transition hover:bg-blue-600"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 min-h-screen bg-white">
            {/* 메뉴 버튼 */}
            <MenuButton items={menuItems} />

            <div className="container px-4 mx-auto">
                {/* 헤더 */}
                <div className="mb-8 text-center">
                    <h1 className="flex gap-2 justify-center items-center mb-2 text-4xl font-bold text-gray-800">
                        <span role="img" aria-label="seedling">
                            🌱
                        </span>{" "}
                        GrowTime
                    </h1>
                    {user && (
                        <div className="flex gap-3 justify-center items-center text-gray-700">
                            <img src={user.avatarUrl} alt={user.name || user.login} className="w-8 h-8 rounded-full" />
                            <span className="font-medium">{user.name || user.login}</span>
                        </div>
                    )}
                </div>

                {/* 메인 콘텐츠 */}
                <div className="flex justify-center items-start">
                    {/* D-day 또는 복무 날짜 입력 */}
                    <div className="w-full max-w-2xl">
                        {dDayInfo ? (
                            <DDayDisplay dDayInfo={dDayInfo} />
                        ) : (
                            <ServiceDateForm onSubmit={handleSaveServiceDates} isLoading={isSaving} />
                        )}
                    </div>
                </div>

                {/* 하단 안내 */}
                <div className="mt-8 text-sm text-center text-gray-600">
                    <p>산업기능요원 복무 관리 시스템</p>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
