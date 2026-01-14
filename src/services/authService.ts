import { Cookies } from "react-cookie";
import api from "../api/api";
import { User } from "@/types/user/types";

import { ApiResponse } from "@/types/common";

interface LoginResponse {
    accessToken: string;
    refreshToken: string | null;
    githubId: string;
}

const cookies = new Cookies();

export const AuthService = {
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
        cookies.remove("accessToken", { path: "/" });
        cookies.remove("refreshToken", { path: "/" });
        cookies.remove("githubId", { path: "/" });
        window.location.href = "/";
    },

    // 토큰 가져오기
    getAccessToken: () => cookies.get("accessToken"),
    getRefreshToken: () => cookies.get("refreshToken"),
    getGithubId: () => cookies.get("githubId"),

    // 로그인 여부 확인
    isAuthenticated: () => !!cookies.get("accessToken"),
};
