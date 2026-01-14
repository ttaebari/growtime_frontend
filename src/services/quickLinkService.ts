import api from "../api/api";
import { CreateQuickLinkRequest, QuickLink } from "@/types/quicklink/types";
import { ApiResponse } from "@/types/common";

export const QuickLinkService = {
    // 퀵 링크 목록 조회
    getQuickLinks: async (githubId: string) => {
        const response = await api.get<ApiResponse<QuickLink[]>>(`/api/user/${githubId}/quick-links`);
        return response.data.data;
    },

    // 퀵 링크 생성
    createQuickLink: async (githubId: string, request: CreateQuickLinkRequest) => {
        const response = await api.post<ApiResponse<QuickLink>>(`/api/user/${githubId}/quick-links`, request);
        return response.data.data;
    },

    // 퀵 링크 삭제
    deleteQuickLink: async (githubId: string, linkId: number) => {
        await api.delete<ApiResponse<void>>(`/api/user/${githubId}/quick-links/${linkId}`);
    },
};
