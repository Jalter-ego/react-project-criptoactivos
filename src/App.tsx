// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<h1 className="text-3xl font-bold">🏠 Bienvenido al Home</h1>} />
    </Routes>
  );
}

export default App;
