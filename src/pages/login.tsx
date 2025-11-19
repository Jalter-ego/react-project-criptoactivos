// src/pages/Login.tsx
import { GoogleLogin } from "@react-oauth/google";
import React, { useState } from "react";

import { login, googleLogin, register } from "../services/auth";
import loginImg from "../assets/login.png";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { setUserData } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) =>{
    e.preventDefault()
    try {
      const res = await register(username, email, password);
      setUserData(res.access_token);
      setIsLogin(true);
    } catch (error: any) {
      alert(error.message);
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      setUserData(res.access_token);
      navigate("/user/portafolio-config")
    } catch (err: any) {
      console.log(err);
      alert(err.message);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const res = await googleLogin(credentialResponse.credential);
      setUserData(res.access_token);
      navigate("/user/portafolio-config")
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
          TRADEBOX
        </h1>

        <div>
          {
            isLogin && (
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
                  <p className="text-sm text-muted-foreground">
                    ¿Olvidaste tu contraseña?
                  </p>
                  <Button type="submit" className="w-full mt-4 h-10">
                    Iniciar Sesion
                  </Button>
                  <p className="mt-2 text-sm text-center text-foreground">
                    ¿No tienes cuenta?{" "}
                    <button
                      type="button"
                      className="text-blue-500 underline"
                      onClick={() => setIsLogin(false)}
                    >
                      Regístrate
                    </button>
                  </p>

                </form>
              </section>
            )
          }:{
            !isLogin && (
              <section>
                <h2 className="text-2xl font-bold text-center text-foreground mb-6">
                  Registrarse
                </h2>
                <form onSubmit={handleRegister} className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    nombre de usuario
                  </p>
                  <input 
                    type="text"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-foreground
              focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                  />
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
                    Registrarse
                  </Button>
                  <p className="mt-2 text-sm text-center text-foreground">
                    ¿Ya tienes cuenta?{" "}
                    <button
                      type="button"
                      className="text-blue-500 underline"
                      onClick={() => setIsLogin(true)}
                    >
                      Inicia sesión
                    </button>
                  </p>
                </form>
              </section>
            )
          }

          <div className="flex items-center my-6">
            <div className="grow h-px bg-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">o</span>
            <div className="grow h-px bg-gray-300"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              width={330}
              onSuccess={handleGoogleLogin}
              onError={() => console.log("Error con Google")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
