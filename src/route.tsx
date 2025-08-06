import React from "react";
import MainPage from "./pages/MainPage";
import NotePage from "./pages/note/notePage";
import LoginPage from "./pages/note/loginPage";

// 라우트 타입 정의
export interface RouteConfig {
    path: string;
    element: React.ReactElement;
}

// 라우트 설정
export const routes: RouteConfig[] = [
    {
        path: "/",
        element: <LoginPage />,
    },
    {
        path: "/main",
        element: <MainPage />,
    },
    {
        path: "/note",
        element: <NotePage />,
    },
];
