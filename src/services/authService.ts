import { Cookies } from "react-cookie";
import api, { apiTimeout } from "../api/api";

import { ApiResponse } from "@/types/common";

interface LoginResponse {
    accessToken: string;
    refreshToken: string | null;
    githubId: string;
}

const cookies = new Cookies();

const clearAuthCookies = () => {
    cookies.remove("accessToken", { path: "/" });
    cookies.remove("refreshToken", { path: "/" });
    cookies.remove("githubId", { path: "/" });
};

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const waitForBackendReady = async () => {
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
            await api.get("/actuator/health", { timeout: apiTimeout });
            return;
        } catch (error) {
            if (attempt === maxAttempts) {
                throw error;
            }
            await sleep(3000);
        }
    }
};

export const AuthService = {
    waitForBackendReady,

    // 인가 코드로 로그인 요청
    login: async (code: string) => {
        // 백엔드의 변경될 엔드포인트로 요청
        const response = await api.get<ApiResponse<LoginResponse>>(`/callback?code=${code}`);
        // ApiResponse unwrapping: response (Axios) -> data (ApiResponse) -> data (LoginResponse)
        const { accessToken, refreshToken, githubId } = response.data.data;

        // 쿠키에 토큰 및 사용자 정보 저장
        cookies.set("accessToken", accessToken, { path: "/" });
        if (refreshToken) {
            cookies.set("refreshToken", refreshToken, { path: "/" });
        }
        cookies.set("githubId", githubId, { path: "/" });

        return response.data.data;
    },

    // 로그아웃
    logout: () => {
        clearAuthCookies();
        window.location.href = "/";
    },

    clearAuth: clearAuthCookies,

    // 토큰 가져오기
    getAccessToken: () => cookies.get("accessToken"),
    getRefreshToken: () => cookies.get("refreshToken"),
    getGithubId: () => cookies.get("githubId"),

    // 로그인 여부 확인
    isAuthenticated: () => !!cookies.get("accessToken") && !!cookies.get("githubId"),
};
