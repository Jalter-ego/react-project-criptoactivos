import { listIcons } from "@/lib/listIcons"
import ItemSidebar from "./Item"
import { IconSquareX } from "@/lib/icons";
import iconTradeBox from "../../../assets/Icon_TradeBox.jpg"

interface sidebarProps{
    className: string;
    onClose?: ()=> void;
}

export default function Sidebar({className,onClose}:sidebarProps) {
    return (
        <aside className={`w-64 bg-sidebar flex flex-col h-screen shadow-lg ${className} border-b border`}>
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
                <img src={iconTradeBox} alt="logo de Trade_Box" width={90}/>
                <h2 className="text-2xl font-light">TRADEBOX</h2>
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