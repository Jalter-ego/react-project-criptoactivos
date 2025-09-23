// src/pages/Login.tsx
import React, { useState } from "react";
import { login, googleLogin } from "../api/auth";
import { GoogleLogin } from "@react-oauth/google";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      localStorage.setItem("token", res.access_token);
      alert("Login exitoso");
      window.location.href = "/home";
    } catch (err) {
      console.error(err);
      alert("Error al iniciar sesión");
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const res = await googleLogin(credentialResponse.credential);
      localStorage.setItem("token", res.access_token);
      alert("Login con Google exitoso");
      window.location.href = "/home";
    } catch (err) {
      console.error(err);
      alert("Error al iniciar sesión con Google");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h2>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Separador */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">o</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Login con Google */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Error con Google")}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
