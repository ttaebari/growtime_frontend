import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (요청 전에 실행)
api.interceptors.request.use(
  (config: any) => {
    console.log('API 요청:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error: any) => {
    console.error('API 요청 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (응답 후에 실행)
api.interceptors.response.use(
  (response: any) => {
    console.log('API 응답:', response.status, response.config.url);
    return response;
  },
  (error: any) => {
    console.error('API 응답 에러:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// 사용자 관련 API
export const userAPI = {
  // GitHub 로그인 URL 가져오기
  getLoginUrl: () => api.get('/login'),
  
  // 사용자 정보 가져오기
  getUser: (githubId: string) => api.get(`/api/user/${githubId}`),
  
  // D-day 정보 가져오기
  getDDay: (githubId: string) => api.get(`/api/user/${githubId}/d-day`),
  
  // 복무 날짜 저장
  saveServiceDates: (githubId: string, entryDate: string, dischargeDate: string) => 
    api.post(`/api/user/${githubId}/service-dates?entryDate=${entryDate}&dischargeDate=${dischargeDate}`),
};

// 회고 관련 API
export const noteAPI = {
  // 회고 목록 가져오기 (페이징)
  getNotes: (githubId: string, page: number = 0, size: number = 10) => 
    api.get(`/api/notes/${githubId}?page=${page}&size=${size}`),
  
  // 회고 상세 조회
  getNote: (githubId: string, noteId: string) => 
    api.get(`/api/notes/${githubId}/${noteId}`),
  
  // 회고 작성
  createNote: (githubId: string, data: { title: string; content: string }) => 
    api.post(`/api/notes/${githubId}`, data),
  
  // 회고 수정
  updateNote: (githubId: string, noteId: string, data: { title: string; content: string }) => 
    api.put(`/api/notes/${githubId}/${noteId}`, data),
  
  // 회고 삭제
  deleteNote: (githubId: string, noteId: string) => 
    api.delete(`/api/notes/${githubId}/${noteId}`),
  
  // 회고 검색
  searchNotes: (githubId: string, keyword: string) => 
    api.get(`/api/notes/${githubId}/search?keyword=${encodeURIComponent(keyword)}`),
  
  // 회고 개수 조회
  getNoteCount: (githubId: string) => 
    api.get(`/api/notes/${githubId}/count`),
};



// 에러 타입 정의
export interface ApiError {
  message: string;
  status?: number;
}

// API 응답 타입 정의
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export default api; 