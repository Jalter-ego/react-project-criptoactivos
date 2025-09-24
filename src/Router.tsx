import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import LiveAreaPage from "./pages/LiveArea";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import SettingsPage from "./pages/Settings";

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path = "/live-area" element={<LiveAreaPage/>}/>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
        </Routes>
    )
}