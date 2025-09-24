import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import LiveAreaPage from "./pages/LiveArea";

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path = "/live-area" element={<LiveAreaPage/>}/>
        </Routes>
    )
}