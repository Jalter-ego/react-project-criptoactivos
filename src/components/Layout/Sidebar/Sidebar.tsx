import { listIcons } from "@/lib/listIcons"
import ItemSidebar from "./Item"
import { IconSquareX } from "@/lib/icons";

interface sidebarProps{
    className: string;
    onClose?: ()=> void;
}

export default function Sidebar({className,onClose}:sidebarProps) {
    return (
        <aside className={`w-64 bg-sidebar flex flex-col h-screen shadow-lg ${className} border-b border-1`}>
            <div className="flex flex-col items-center justify-center h-44 border-b relative">
                {onClose && (
                    <button
                        className="absolute right-4 top-4 md:hidden"
                        onClick={onClose}
                        aria-label="Cerrar menú"
                    >
                        <IconSquareX />
                    </button>
                )}
                <svg width="76" height="68" viewBox="0 0 36 28" xmlns="http://www.w3.org/2000/svg"><path d="M14 22H7V11H0V4h14v18zM28 22h-8l7.5-18h8L28 22z" fill="currentColor"></path><circle cx="20" cy="8" r="4" fill="currentColor"></circle></svg>
                <h2 className="text-2xl font-light">TRADINGVIEW</h2>
                <h3 className="text-lg font-light">SIMULATOR</h3>
            </div>
            <nav>
                <ul className='flex flex-col p-4 gap-2'>
                    {listIcons.map((item) => (
                        <ItemSidebar
                            key={item.name}
                            title={item.name}
                            href={`/${item.name}`}
                            icon={item.icon}
                        />
                    ))}
                </ul>
            </nav>
        </aside>
    )
}