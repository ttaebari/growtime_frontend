# GrowTime Frontend

산업기능요원 복무 관리와 회고 작성을 위한 GrowTime 프론트엔드입니다. React, TypeScript, Vite 기반으로 동작하며 Vercel에 배포합니다.

## 주요 기능

- GitHub OAuth 로그인
- 복무 시작일/전역일 등록과 D-Day 확인
- 회고 작성, 조회, 수정, 삭제
- GitHub 활동 캘린더와 빠른 링크 관리
- 다크 모드와 포모도로 타이머

## 기술 스택

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Zustand
- React Router

## 로컬 실행

```bash
npm install
npm run dev
```

기본 개발 서버는 `http://localhost:3000`입니다.

## 환경 변수

`.env.local`에 API 서버 주소를 설정합니다.

```bash
VITE_API_BASE_URL=http://localhost:8196
```

배포 환경에서는 Render 백엔드 주소를 사용합니다.

```bash
VITE_API_BASE_URL=https://growtime-backend.onrender.com
```

## 빌드

```bash
npm run build
```

Vercel Output Directory는 `build`입니다.

## 배포

- Production URL: https://growtime-frontend-nine.vercel.app/
- `master` 브랜치에 병합 후 GitHub Actions 또는 Vercel 배포가 실행됩니다.
- GitHub OAuth App의 callback URL에는 Vercel 프론트 주소 기준 `/callback`을 등록해야 합니다.
