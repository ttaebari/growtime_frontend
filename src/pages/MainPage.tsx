import { useState, useEffect, FC, useRef } from "react";
import DDayDisplay from "@/components/DDayDisplay";
import ServiceDateForm from "@/components/ServiceDateForm";
import MenuButton from "@/components/MenuButton";
import { User, DDayInfo } from "@/types/user/types";
import { useNavigate } from "react-router-dom";
import MainPageError from "@/components/MainPageError";
import MainPageLoading from "@/components/MainPageLoading";
import Layout from "@/components/Layout";
import { AuthService } from "@/services/authService";
import { UserService } from "@/services/userService";
import LeftSidebar from "@/components/sidebar/LeftSidebar";
import RightSidebar from "@/components/sidebar/RightSidebar";
import { useGitHubContributions } from "@/hooks/useGitHubContributions";
import ContributionCalendar from "@/components/github/ContributionCalendar";
import ContributionStats from "@/components/github/ContributionStats";

const MainPage: FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [dDayInfo, setDDayInfo] = useState<DDayInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    // GitHub 잔디심기 데이터 로드
    const { contributions, stats, isLoading: isGitHubLoading } = useGitHubContributions(user?.login || null);

    // 사용자 정보 로드
    const loadUserInfo = async () => {
        try {
            const githubId = AuthService.getGithubId();
            if (!githubId) {
                navigate("/");
                return;
            }

            const userData = await UserService.getUser(githubId);
            setUser(userData);

            // 복무 날짜가 설정되어 있으면 D-day 정보도 로드
            if (userData.entryDate && userData.dischargeDate) {
                await loadDDayInfo(githubId);
            }
        } catch (err) {
            console.error("사용자 정보 로드 실패:", err);
            setError("사용자 정보를 불러올 수 없습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // D-day 정보 로드
    const loadDDayInfo = async (githubId: string) => {
        try {
            const dDayData = await UserService.getDDay(githubId);
            setDDayInfo(dDayData);
        } catch (err) {
            console.error("D-day 정보 로드 실패:", err);
            setError("D-day 정보 로드에 실패했습니다.");
        }
    };

    // 복무 날짜 저장
    const handleSaveServiceDates = async (entryDate: string, dischargeDate: string) => {
        setIsSaving(true);
        setError("");

        try {
            const githubId = AuthService.getGithubId();
            if (!githubId) return;

            const updatedUser = await UserService.saveServiceDates(githubId, entryDate, dischargeDate);
            setUser(updatedUser);
            await loadDDayInfo(githubId);
        } catch (err: any) {
            console.error("복무 정보 저장 실패:", err);
            // UserService likely throws an error rejected from api interceptor
            // api interceptor rejects with error object. error.response?.data is ApiResponse error
            const errorMessage = err.response?.data?.error?.message || "복무 정보 저장에 실패했습니다.";
            setError(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    // ServiceDateForm의 onSubmit 핸들러를 위한 래퍼 함수
    const handleServiceDateSubmit = async (entryDate: string, dischargeDate: string) => {
        await handleSaveServiceDates(entryDate, dischargeDate);
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
        <Layout>
            {/* 메뉴 버튼 */}
            <MenuButton items={menuItems} />

            <div className="container relative px-4 mx-auto pt-8">
                {/* 헤더 */}
                <div className="mb-8 text-center">
                    <h1 className="flex gap-2 justify-center items-center mb-2 text-4xl font-bold text-gray-800 dark:text-gray-100">
                        <span role="img" aria-label="seedling">
                            🌱
                        </span>{" "}
                        GrowTime
                    </h1>
                    {user && (
                        <div className="flex gap-3 justify-center items-center text-gray-700 dark:text-gray-300">
                            <img src={user.avatarUrl} alt={user.name || user.login} className="w-8 h-8 rounded-full" />
                            <span className="font-medium">{user.name || user.login}</span>
                            <button
                                onClick={AuthService.logout}
                                className="px-3 py-1 text-sm text-red-500 bg-white rounded-md border border-red-200 shadow-sm transition hover:bg-red-50 dark:bg-gray-800 dark:border-red-900 dark:hover:bg-gray-700"
                            >
                                로그아웃
                            </button>
                        </div>
                    )}
                </div>

                {/* 메인 콘텐츠 */}
                <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Sidebar (Quick Links) */}
                        <div className="hidden lg:block lg:col-span-3 sticky top-24">
                            <LeftSidebar githubId={user?.githubId} />
                        </div>

                        {/* Main Content Center */}
                        <div className="lg:col-span-6 w-full max-w-2xl mx-auto flex flex-col items-center gap-12 order-first lg:order-none">
                            {/* User Info Section */}
                            {user && (
                                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                                    <div className="relative group cursor-pointer">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-200 blur"></div>
                                        <img
                                            src={user.avatarUrl || "https://github.com/identicons/jasonlong.png"}
                                            alt="Profile"
                                            className="relative w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl transform transition duration-200 group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                                            <div className="w-full h-full rounded-full animate-ping bg-green-500 opacity-75 absolute"></div>
                                            <div className="w-2 h-2 bg-white rounded-full relative z-10"></div>
                                        </div>
                                    </div>
                                    <h1 className="mt-6 text-4xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                                        Hello,{" "}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                                            {user.name || user.login}
                                        </span>
                                        <span className="animate-pulse">👋</span>
                                    </h1>
                                    <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">
                                        Have a productive day!
                                    </p>
                                </div>
                            )}

                            {/* D-Day Section */}
                            <div className="w-full transform hover:scale-[1.02] transition-all duration-300">
                                {dDayInfo ? (
                                    <DDayDisplay dDayInfo={dDayInfo} />
                                ) : (
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                                            복무일 계산기
                                        </h2>
                                        <ServiceDateForm onSubmit={handleServiceDateSubmit} isLoading={isSaving} />
                                    </div>
                                )}
                            </div>

                            {/* GitHub Contribution Section */}
                            {user?.login && (contributions || isGitHubLoading) && (
                                <div className="w-full animate-in slide-in-from-bottom-4 fade-in duration-700 delay-150">
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                                                    ></path>
                                                </svg>
                                                Recent Activity
                                            </h3>
                                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                Last 12 weeks
                                            </span>
                                        </div>

                                        {isGitHubLoading ? (
                                            <div className="h-40 flex items-center justify-center text-gray-400">
                                                Loading contributions...
                                            </div>
                                        ) : (
                                            <>
                                                {contributions && (
                                                    <ContributionCalendar contributions={contributions} />
                                                )}
                                                {stats && (
                                                    <div className="mt-6">
                                                        <ContributionStats stats={stats} />
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar (Pomodoro) */}
                        <div className="hidden lg:block lg:col-span-3 sticky top-24">
                            <RightSidebar />
                        </div>

                        {/* Mobile Only Sidebars (Stacked below main content) */}
                        <div className="lg:hidden w-full space-y-6 mt-8 order-last">
                            <LeftSidebar githubId={user?.login} />
                            <RightSidebar />
                        </div>
                    </div>
                </div>

                {/* 하단 안내 */}
                <div className="mt-8 text-sm text-center text-gray-600 dark:text-gray-400">
                    <p>산업기능요원 복무 관리 시스템</p>
                </div>
            </div>
        </Layout>
    );
};

export default MainPage;
