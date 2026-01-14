import api from "@/api/api";
import { User, DDayInfo } from "@/types/user/types";
import { ApiResponse } from "@/types/common";

// 사용자 관련 API
export const UserService = {
    // GitHub 로그인 URL 가져오기
    getLoginUrl: async () => {
        const response = await api.get<ApiResponse<Map<string, string>>>("/login");
        return response.data.data;
    },

    // 사용자 정보 가져오기
    getUser: async (githubId: string) => {
        const response = await api.get<ApiResponse<User>>(`/api/user/${githubId}`);
        return response.data.data;
    },

    // D-day 정보 가져오기
    getDDay: async (githubId: string) => {
        const response = await api.get<ApiResponse<DDayInfo>>(`/api/user/${githubId}/d-day`);
        return response.data.data;
    },

    // 복무 날짜 저장
    saveServiceDates: async (githubId: string, entryDate: string, dischargeDate: string) => {
        const response = await api.post<ApiResponse<User>>(`/api/user/${githubId}/service-dates`, {
            entryDate,
            dischargeDate,
        });
        return response.data.data;
    },
};
