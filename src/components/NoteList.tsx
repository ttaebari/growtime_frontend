import React, { useState, useEffect } from 'react';
import { noteAPI } from '../api/api';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteListProps {
  githubId: string;
  onNoteSelect: (note: Note) => void;
  onNewNote: () => void;
}

const NoteList: React.FC<NoteListProps> = ({ githubId, onNoteSelect, onNewNote }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

  // 회고 목록 로드
  const loadNotes = async (keyword?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (keyword && keyword.trim()) {
        response = await noteAPI.searchNotes(githubId, keyword);
        setNotes(response.data.notes);
      } else {
        response = await noteAPI.getNotes(githubId);
        setNotes(response.data.notes);
      }
    } catch (err: any) {
      console.error('회고 목록 로드 실패:', err);
      setError('회고 목록을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 검색 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadNotes(searchKeyword);
  };

  // 회고 선택
  const handleNoteClick = (note: Note) => {
    setSelectedNoteId(note.id);
    onNoteSelect(note);
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 내용 미리보기 (50자 제한)
  const getContentPreview = (content: string) => {
    return content.length > 50 ? content.substring(0, 50) + '...' : content;
  };

  useEffect(() => {
    if (githubId) {
      loadNotes();
    }
  }, [githubId]);

  return (
    <div className="w-80 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span role="img" aria-label="notebook">📝</span>
            회고 목록
          </h2>
          <button
            onClick={onNewNote}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            title="새 회고 작성"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* 검색 */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="회고 검색..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            검색
          </button>
        </form>
      </div>

      {/* 회고 목록 */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">
            <p>{error}</p>
            <button
              onClick={() => loadNotes()}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center text-gray-500 p-8">
            <div className="text-4xl mb-2">📝</div>
            <p className="mb-4">아직 작성된 회고가 없습니다.</p>
            <button
              onClick={onNewNote}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              첫 회고 작성하기
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => handleNoteClick(note)}
                className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                  selectedNoteId === note.id ? 'bg-blue-50 border border-blue-200' : 'border border-gray-200'
                }`}
              >
                <h3 className="font-medium text-gray-800 mb-1 line-clamp-1">
                  {note.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {getContentPreview(note.content)}
                </p>
                <div className="text-xs text-gray-400">
                  {formatDate(note.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteList; 