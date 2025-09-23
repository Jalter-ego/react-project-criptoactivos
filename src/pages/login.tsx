// src/pages/Login.tsx
import { GoogleLogin } from "@react-oauth/google";
import React, { useState } from "react";

import { login, googleLogin } from "../api/auth";
import loginImg from "../assets/login.png";
import { Button } from "@/components/ui/button";

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
    <div className="flex justify-between w-full h-full bg-background p-8 lg:p-2">
      <div className="w-[50%] flex justify-center">
        <img
          src={loginImg}
          alt="Logo"
          className="w-full h-auto rounded-3xl"
        />
      </div>
      <div className="w-[50%] flex flex-col items-center justify-between lg:px-52 lg:pt-8 lg:pb-40">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          TradingView
        </h1>
        <section>

          <h2 className="text-2xl font-bold text-center text-foreground mb-6">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleLogin} className="space-y-1">
            <p className="text-sm text-muted-foreground">
              correo electrónico
            </p>
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-foreground
              focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <p className="text-sm text-muted-foreground">
              contraseña
            </p>

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-foreground
              focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <Button type="submit" className="w-full mt-4 h-10">
              Iniciar Sesion
            </Button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">o</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log("Error con Google")}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
