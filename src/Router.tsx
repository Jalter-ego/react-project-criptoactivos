import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import LiveAreaPage from "./pages/LiveArea";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import SettingsPage from "./pages/Settings";
import Prueba from "./pages/prueba";
import PortafolioConfig from "./pages/User/portafolioConfig";
import TradePage from "./pages/TradePage/TradePage";
import DetailedActivesTable from "./pages/AssetsPage";
import PortfolioPage from "./pages/Portafolio/PortafolioPage";
import TransactionsPage from "./pages/TransactionsPage/TransactionsPage";
import Layout from "./Layout";
import AICoachPage from "./pages/AICoach/AICoachPage";

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />

            <Route element={<Layout />}>
                <Route path="/live-area/:symbol" element={<LiveAreaPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/activos" element={<DetailedActivesTable />} />
                <Route path="/portafolios" element={<PortfolioPage />} />
                <Route path="/transacciones" element={<TransactionsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/trade/:id" element={<TradePage />} />
                <Route path="/asesor-ia" element={<AICoachPage />} />
            </Route>


            <Route path="/prueba" element={<Prueba />} />
            <Route path="/user/portafolio-config" element={<PortafolioConfig />} />
        </Routes>
    );
}