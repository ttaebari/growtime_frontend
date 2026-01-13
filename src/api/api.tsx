import axios from "axios";

// axios 인스턴스 생성
const api = axios.create({
    baseURL: "http://localhost:8196",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// 요청 인터셉터 (요청 전에 실행)
api.interceptors.request.use(
    (config: any) => {
        console.log("API 요청:", config.method?.toUpperCase(), config.url);
        return config;
    },
    (error: any) => {
        console.error("API 요청 에러:", error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터 (응답 후에 실행)
api.interceptors.response.use(
    (response: any) => {
        console.log("API 응답:", response.status, response.config.url);
        return response;
    },
    (error: any) => {
        console.error("API 응답 에러:", error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

// 사용자 관련 API

export default api;
