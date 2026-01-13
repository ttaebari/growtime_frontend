import { useState, useEffect, FC } from "react";
import DDayDisplay from "@/components/DDayDisplay";
import ServiceDateForm from "@/components/ServiceDateForm";
import MenuButton from "@/components/MenuButton";
import { User, DDayInfo } from "@/types/user/types";
import { useNavigate } from "react-router-dom";
import MainPageError from "@/components/MainPageError";
import MainPageLoading from "@/components/MainPageLoading";

import { AuthService } from "@/services/authService";

const MainPage: FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [dDayInfo, setDDayInfo] = useState<DDayInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    // 사용자 정보 로드
    const loadUserInfo = async () => {
        try {
            const githubId = AuthService.getGithubId();
            if (!githubId) {
                navigate("/");
                return;
            }

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
            const githubId = AuthService.getGithubId();
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
            onClick: () => navigate("/note"),
        },
        // 향후 더 많은 메뉴 아이템을 여기에 추가할 수 있습니다
    ];

    if (isLoading) {
        return <MainPageLoading />;
    }

    if (error) {
        return <MainPageError message={error} onRetry={() => window.location.reload()} />;
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
                            <button
                                onClick={AuthService.logout}
                                className="px-3 py-1 text-sm text-red-500 bg-white rounded-md border border-red-200 shadow-sm transition hover:bg-red-50"
                            >
                                로그아웃
                            </button>
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
