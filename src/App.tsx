import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { routes, RouteConfig } from "./route";

function App() {
    return (
        <Router>
            <Routes>
                {routes.map((route: RouteConfig, index: number) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
