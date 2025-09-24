import Sidebar from "./components/Layout/Sidebar/Sidebar";
import UserMenu from "@/components/Header/UserMenu";
import React, { useState } from "react";
import { IconMenu } from "./lib/icons";

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
                <div className='sticky top-0 z-30 bg-background shadow-md'>
                    <header className="flex items-center justify-between lg:px-8 lg:py-2 px-2">
                        <button
                            className="md:hidden p-2"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Abrir menú"
                        >
                            <IconMenu />
                        </button>
                        <UserMenu setShowLogin={() => { }} />
                    </header>
                </div>
                <main className='flex-1 overflow-y-auto p-4 bg-background'>
                    {children}
                </main>
            </div>
        </div>
    );
}