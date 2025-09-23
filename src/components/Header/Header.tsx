"use client";
import { useEffect, useState } from "react";
import { IconUser } from "@/lib/icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Login from "@/pages/login";
import { Switch } from "../ui/switch";
import { useUser } from "@/hooks/useContext";

export default function Header() {
    const { user, logout } = useUser();
    const [showLogin, setShowLogin] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

    return (
        <>
            <header className="w-full h-16 flex items-center justify-between px-4">
                <div>
                    <h1 className="text-2xl font-medium">TradingView</h1>
                </div>
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer hover:bg-white/20 p-2 rounded-full transition flex items-center gap-2">
                            {user?.picture ? (
                                <img
                                    src={user.picture}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <IconUser size={30} />
                            )}
                            {user?.email && (
                                <span className="text-sm">{user.email}</span>
                            )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-72 font-medium">
                            {!user ? (
                                <DropdownMenuItem onClick={() => setShowLogin(true)} className="text-blue-500">
                                    <IconUser size={30} />
                                    Iniciar Sesión
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={logout} className="text-red-500">
                                    <IconUser size={30} />
                                    Cerrar Sesión
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Ayuda</DropdownMenuItem>
                            <DropdownMenuItem>Novedades</DropdownMenuItem>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="flex items-center justify-between"
                                onSelect={(e)=> e.preventDefault()}
                            >
                                <p>Modo Oscuro</p>
                                <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {showLogin && !user && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <button
                            onClick={() => setShowLogin(false)}
                            className="absolute top-4 right-4 text-foreground text-2xl font-bold"
                        >
                            ✕
                        </button>
                        <Login />
                    </div>
                </div>
            )}
        </>
    );
}
