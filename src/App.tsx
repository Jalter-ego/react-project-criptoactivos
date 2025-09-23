// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import HomePage from "./pages/Home/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
}

export default App;
