import React from "react";

function App() {
  // 로그인 버튼 클릭 시 백엔드에서 GitHub OAuth URL을 받아 리다이렉트
  const handleLogin = async () => {
    try {
      const res = await fetch("/login");
      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        alert("로그인 URL을 가져올 수 없습니다.");
      }
    } catch (e) {
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-3xl font-bold mb-2 text-gray-800 flex items-center justify-center gap-2">
          <span role="img" aria-label="seedling">🌱</span> GrowTime
        </div>
        <div className="text-gray-600 mb-6">산업기능요원 복무 관리 시스템</div>
        <button
          className="flex items-center justify-center gap-2 w-full py-3 mb-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition"
          onClick={handleLogin}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.419-1.305.763-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.824 1.102.824 2.222v3.293c0 .319.192.694.801.576C20.565 21.797 24 17.299 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub로 로그인
        </button>
        <div className="text-gray-500 text-sm mb-2">
          산업기능요원 복무기간을 관리하고 회고를 작성할 수 있습니다.
        </div>
      </div>
    </div>
  );
}

export default App;
