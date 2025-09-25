import { useLocation } from "react-router-dom";

interface ItemSidebarProps {
    title: string;
    href: string;
    icon: React.ComponentType;
}

export default function ItemSidebar({ title, href, icon: Icon }: ItemSidebarProps) {
    const location = useLocation();
    
    const isActive =
        href === "/"
            ? location.pathname === "/"
            : location.pathname === href || location.pathname.startsWith(href + "/");
    
    return (
        <li className={`flex items-center gap-2 px-4 py-2 rounded 
            hover:bg-accent transition-colors
            ${isActive ? 'bg-accent text-[#eb5e28] font-medium' : 'text-ring hover:text-foreground'}`}>
            <Icon />
            <a href={href} className='text-[13px]'>
                {title.toUpperCase()}
            </a>
        </li>
    )
}