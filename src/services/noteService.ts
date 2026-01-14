import api from "@/api/api";
import { CreateNoteRequest, UpdateNoteRequest, Note } from "@/types/note/types";
import { ApiResponse } from "@/types/common";

export interface NoteListResponse {
    notes: Note[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
}

export interface NoteSearchResponse {
    notes: Note[];
    totalCount: number;
}

export interface NoteCountResponse {
    count: number;
}

// 회고 관련 API
export const NoteService = {
    // 회고 목록 가져오기 (페이징)
    getNotes: async (githubId: string, page: number = 0, size: number = 10) => {
        // Backend returns NoteListResponse wrapped in ApiResponse
        const response = await api.get<ApiResponse<NoteListResponse>>(
            `/api/notes/${githubId}?page=${page}&size=${size}`
        );
        return response.data.data;
    },

    // 회고 상세 조회
    getNote: async (githubId: string, noteId: string) => {
        const response = await api.get<ApiResponse<Note>>(`/api/notes/${githubId}/${noteId}`);
        return response.data.data;
    },

    // 회고 작성
    createNote: async (githubId: string, data: CreateNoteRequest) => {
        const response = await api.post<ApiResponse<Note>>(`/api/notes/${githubId}`, data);
        return response.data.data;
    },

    // 회고 수정
    updateNote: async (githubId: string, noteId: string, data: UpdateNoteRequest) => {
        const response = await api.put<ApiResponse<Note>>(`/api/notes/${githubId}/${noteId}`, data);
        return response.data.data;
    },

    // 회고 삭제
    deleteNote: async (githubId: string, noteId: string) => {
        const response = await api.delete<ApiResponse<void>>(`/api/notes/${githubId}/${noteId}`);
        return response.data.data;
    },

    // 회고 검색
    searchNotes: async (githubId: string, keyword: string) => {
        const response = await api.get<ApiResponse<NoteSearchResponse>>(
            `/api/notes/${githubId}/search?keyword=${encodeURIComponent(keyword)}`
        );
        return response.data.data;
    },

    // 회고 개수 조회
    getNoteCount: async (githubId: string) => {
        const response = await api.get<ApiResponse<NoteCountResponse>>(`/api/notes/${githubId}/count`);
        return response.data.data;
    },
};
