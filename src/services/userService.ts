import api from "@/api/api";

// 사용자 관련 API
export const UserService = {
    // GitHub 로그인 URL 가져오기
    getLoginUrl: () => api.get("/login"),

    // 사용자 정보 가져오기
    getUser: (githubId: string) => api.get(`/api/user/${githubId}`),

    // D-day 정보 가져오기
    getDDay: (githubId: string) => api.get(`/api/user/${githubId}/d-day`),

    // 복무 날짜 저장
    saveServiceDates: (githubId: string, entryDate: string, dischargeDate: string) =>
        api.post(`/api/user/${githubId}/service-dates?entryDate=${entryDate}&dischargeDate=${dischargeDate}`),
};
