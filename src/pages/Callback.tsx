import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/authService";

const Callback = () => {
    const navigate = useNavigate();

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
                await AuthService.login(code);
                // 로그인 성공 시 메인 페이지로 이동
                navigate("/main");
            } catch (error) {
                // 에러가 발생했더라도, 쿠키에 토큰이 있다면 로그인 성공으로 간주 (이중 요청 방지)
                if (AuthService.isAuthenticated()) {
                    navigate("/main");
                    return;
                }
                console.error("로그인 실패:", error);
                alert("로그인 처리에 실패했습니다.");
                navigate("/");
            }
        };

        handleLogin();
    }, [navigate]);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="text-xl font-semibold">로그인 처리 중...</div>
            <div className="mt-2 text-gray-500">잠시만 기다려주세요.</div>
        </div>
    );
};

export default Callback;
