"use client";
import { useState } from "react";

import Login from "@/pages/login";
import { useUser } from "@/hooks/useContext";
import UserMenu from "./UserMenu";

export default function Header() {
    const { user } = useUser();
    const [showLogin, setShowLogin] = useState(false);

    return (
        <>
            <header className="w-full h-16 flex items-center justify-between px-4">
                <div>
                    <h1 className="text-2xl font-medium">TradingView</h1>
                </div>
                <div className="flex gap-x-6 text-md font-semibold">
                    <p>
                        Productos
                    </p>
                    <p>
                        Comunidad
                    </p>
                    <p>
                        Más
                    </p>
                </div>
                <div>
                    <UserMenu
                        setShowLogin={setShowLogin}
                    />
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
