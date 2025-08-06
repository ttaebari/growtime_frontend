import React from "react";
import { userAPI } from "../../api/api";

// 로그인 페이지 컴포넌트
const LoginPage: React.FC = () => {
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        // URL 파라미터에서 에러 확인
        const urlParams = new URLSearchParams(window.location.search);
        const errorCode = urlParams.get("error");

        if (errorCode) {
            const errorMessages: { [key: string]: string } = {
                server_error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
                no_auth_code: "인증 코드를 받지 못했습니다. 다시 로그인해주세요.",
                no_token: "액세스 토큰을 받지 못했습니다. 다시 로그인해주세요.",
                no_user_info: "사용자 정보를 받지 못했습니다. 다시 로그인해주세요.",
            };

            setError(errorMessages[errorCode] || "알 수 없는 오류가 발생했습니다.");

            // 에러 파라미터 제거
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const handleLogin = async () => {
        try {
            const response = await userAPI.getLoginUrl();
            if (response.data.authUrl) {
                window.location.href = response.data.authUrl;
            } else {
                setError("로그인 URL을 가져올 수 없습니다.");
            }
        } catch (e: any) {
            setError("로그인 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-400 to-purple-500">
            <div className="p-8 w-full max-w-md text-center bg-white rounded-2xl shadow-2xl">
                <div className="flex gap-2 justify-center items-center mb-2 text-3xl font-bold text-gray-800">
                    <span role="img" aria-label="seedling">
                        🌱
                    </span>{" "}
                    GrowTime
                </div>
                <div className="mb-6 text-gray-600">산업기능요원 복무 관리 시스템</div>

                {/* 에러 메시지 표시 */}
                {error && (
                    <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg border border-red-400">
                        <div className="flex gap-2 items-center">
                            <span className="text-lg">⚠️</span>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                <button
                    className="flex gap-2 justify-center items-center py-3 mb-4 w-full font-semibold text-white bg-gray-900 rounded-lg transition hover:bg-gray-800"
                    onClick={handleLogin}
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.419-1.305.763-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.824 1.102.824 2.222v3.293c0 .319.192.694.801.576C20.565 21.797 24 17.299 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub로 로그인
                </button>
                <div className="mb-2 text-sm text-gray-500">
                    산업기능요원 복무기간을 관리하고 회고를 작성할 수 있습니다.
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
