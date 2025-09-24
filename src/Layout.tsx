import UserMenu from "@/components/Header/UserMenu";
import React from "react";

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className='flex min-h-screen'>
            <aside className='w-64 bg-sidebar flex flex-col fixed top-0 left-0 h-screen z-40 shadow-lg'>
                <div className="flex flex-col items-center justify-center h-44 border-b">
                    <svg width="76" height="68" viewBox="0 0 36 28" xmlns="http://www.w3.org/2000/svg"><path d="M14 22H7V11H0V4h14v18zM28 22h-8l7.5-18h8L28 22z" fill="currentColor"></path><circle cx="20" cy="8" r="4" fill="currentColor"></circle></svg>
                    <h2 className="text-2xl font-light">TRADINGVIEW</h2>
                    <h3 className="text-lg font-light">SIMULATOR</h3>
                </div>
                <nav>
                    <ul className='flex flex-col p-4 gap-2'>
                        <li>
                            <a href="#" className='block px-4 py-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors'>Dashboard</a>
                        </li>
                        <li>
                            <a href="#" className='block px-4 py-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors'>Settings</a>
                        </li>
                        <li>
                            <a href="#" className='block px-4 py-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors'>Profile</a>
                        </li>
                    </ul>
                </nav>
            </aside>
            <div className='flex-1 ml-64 flex flex-col min-h-screen'>
                <div className='sticky top-0 z-30 bg-background shadow-md'>
                    <header className="flex items-center justify-between lg:px-8 lg:py-2 px-2">
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