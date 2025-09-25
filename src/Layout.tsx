import Sidebar from "./components/Layout/Sidebar/Sidebar";
import UserMenu from "@/components/Header/UserMenu";
import React, { useState } from "react";
import { IconMenu } from "./lib/icons";
import { useLocation } from "react-router-dom";

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const pathName = location.pathname.replace('/', '');

    return (
        <div className='flex min-h-screen'>
            <Sidebar className="hidden md:flex" />
            <Sidebar
                className={`fixed top-0 left-0 h-screen z-50 bg-sidebar transition-transform duration-300 md:hidden
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                onClose={() => setSidebarOpen(false)}
            />
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className='flex-1 flex flex-col min-h-screen'>
                <div className='sticky top-0 z-30'>
                    <header className="flex items-center justify-between  lg:px-8 lg:py-4 px-2">
                        <button
                            className="md:hidden p-2"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Abrir menú"
                        >
                            <IconMenu />
                        </button>
                        <h1 className="text-xl text-gray-600 font-medium">
                            {pathName}
                        </h1>
                        <UserMenu setShowLogin={() => { }} />
                    </header>
                </div>
                <div className="border-b border-1"></div>
                <main className='flex-1 overflow-y-auto md:px-4 md:py-2 px-2'>
                    {children}
                </main>
            </div>
        </div>
    );
}