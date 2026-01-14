import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { routes, RouteConfig } from "./route";

import ConfirmModal from "@/components/modals/ConfirmModal";
import AlertModal from "@/components/modals/AlertModal";

function App() {
    return (
        <Router>
            <div className="App">
                <ConfirmModal />
                <AlertModal />
                <Routes>
                    {routes.map((route: RouteConfig, index: number) => (
                        <Route key={index} path={route.path} element={route.element} />
                    ))}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
