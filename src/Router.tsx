import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import LiveAreaPage from "./pages/LiveArea";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import SettingsPage from "./pages/Settings";
import Prueba from "./pages/prueba";
import PortafolioConfig from "./pages/User/portafolioConfig";
import TradePage from "./pages/TradePage";
import DetailedActivesTable from "./pages/AssetsPage";

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path = "/live-area" element={<LiveAreaPage/>}/>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/activos" element={<DetailedActivesTable />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/prueba" element={<Prueba />} />
            <Route path= "/user/portafolio-config" element={<PortafolioConfig/>} />
            <Route path= "/trade/:id" element={<TradePage/>} />
        </Routes>
    )
}