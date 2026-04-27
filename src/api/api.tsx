import axios from "axios";
import { Cookies } from "react-cookie";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8196";
const configuredApiTimeout = Number(import.meta.env.VITE_API_TIMEOUT_MS);
export const apiTimeout =
    Number.isFinite(configuredApiTimeout) && configuredApiTimeout > 0 ? configuredApiTimeout : 180000;

const clearAuthCookies = () => {
    const cookies = new Cookies();
    cookies.remove("accessToken", { path: "/" });
    cookies.remove("refreshToken", { path: "/" });
    cookies.remove("githubId", { path: "/" });
};

// axios 인스턴스 생성
const api = axios.create({
    baseURL: apiBaseURL,
    timeout: apiTimeout,
    headers: {
        "Content-Type": "application/json",
    },
});

// 요청 인터셉터 (요청 전에 실행)
api.interceptors.request.use(
    (config: any) => {
        const cookies = new Cookies();
        const accessToken = cookies.get("accessToken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error: any) => {
        console.error("API 요청 에러:", error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터 (응답 후에 실행)
api.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
        const status = error.response?.status;
        if ((status === 401 || status === 403) && window.location.pathname !== "/") {
            clearAuthCookies();
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

// 사용자 관련 API

export default api;
