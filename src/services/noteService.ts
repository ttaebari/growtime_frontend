import api from "@/api/api";
import { CreateNoteRequest, UpdateNoteRequest } from "@/types/note/types";

// 회고 관련 API
export const NoteService = {
    // 회고 목록 가져오기 (페이징)
    getNotes: (githubId: string, page: number = 0, size: number = 10) =>
        api.get(`/api/notes/${githubId}?page=${page}&size=${size}`),

    // 회고 상세 조회
    getNote: (githubId: string, noteId: string) => api.get(`/api/notes/${githubId}/${noteId}`),

    // 회고 작성
    createNote: (githubId: string, data: CreateNoteRequest) => api.post(`/api/notes/${githubId}`, data),

    // 회고 수정
    updateNote: (githubId: string, noteId: string, data: UpdateNoteRequest) =>
        api.put(`/api/notes/${githubId}/${noteId}`, data),

    // 회고 삭제
    deleteNote: (githubId: string, noteId: string) => api.delete(`/api/notes/${githubId}/${noteId}`),

    // 회고 검색
    searchNotes: (githubId: string, keyword: string) =>
        api.get(`/api/notes/${githubId}/search?keyword=${encodeURIComponent(keyword)}`),

    // 회고 개수 조회
    getNoteCount: (githubId: string) => api.get(`/api/notes/${githubId}/count`),
};
