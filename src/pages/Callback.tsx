import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/authService";

const Callback = () => {
    const navigate = useNavigate();
    const [statusMessage, setStatusMessage] = useState("서버 준비 중...");

    const processedRef = useRef(false);

    useEffect(() => {
        const handleLogin = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");

            if (!code) {
                alert("인증 코드가 없습니다.");
                navigate("/");
                return;
            }

            if (processedRef.current) return;
            processedRef.current = true;

            try {
                await AuthService.waitForBackendReady();
                setStatusMessage("로그인 처리 중...");
                await AuthService.login(code);
                // 로그인 성공 시 메인 페이지로 이동
                navigate("/main");
            } catch (error: any) {
                AuthService.clearAuth();
                console.error("로그인 실패:", error);
                const errorMessage =
                    error.response?.data?.error?.message ||
                    error.response?.data?.message ||
                    "로그인 처리에 실패했습니다.";
                alert(errorMessage);
                navigate("/");
            }
        };

        handleLogin();
    }, [navigate]);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="text-xl font-semibold">{statusMessage}</div>
            <div className="mt-2 text-gray-500">무료 서버라 첫 접속은 1-2분 걸릴 수 있습니다.</div>
        </div>
    );
};

export default Callback;
