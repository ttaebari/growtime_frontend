import { useState, useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/authService";

// 로그인 페이지 컴포넌트
const LoginPage: FC = () => {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (AuthService.isAuthenticated()) {
            navigate("/main");
        }
    }, [navigate]);

    const handleLogin = () => {
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI || "http://localhost:3000/login/oauth/callback";
        const scope = (import.meta.env.VITE_GITHUB_SCOPE || "read:user user:email").replaceAll(",", " ");

        if (!clientId) {
            setError("GitHub Client ID가 설정되지 않았습니다.");
            return;
        }

        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            scope,
        });
        const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
        window.location.href = githubAuthUrl;
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-white transition-colors dark:bg-gray-900">
            <div className="p-8 w-full max-w-md text-center bg-white rounded-2xl shadow-2xl dark:bg-gray-800">
                <div className="flex gap-2 justify-center items-center mb-2 text-3xl font-bold text-gray-800 dark:text-gray-100">
                    <span role="img" aria-label="seedling">
                        🌱
                    </span>{" "}
                    GrowTime
                </div>
                <div className="mb-6 text-gray-600 dark:text-gray-400">산업기능요원 복무 관리 시스템</div>

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
                <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    산업기능요원 복무기간을 관리하고 회고를 작성할 수 있습니다.
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
