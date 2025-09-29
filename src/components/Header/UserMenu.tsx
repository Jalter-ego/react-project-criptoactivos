import { IconUser } from "@/lib/icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";
import { useUser } from "@/hooks/useContext";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useNavigate } from "react-router-dom";

interface UserMenuProps {
    setShowLogin: (value: boolean) => void;
}
export default function UserMenu({
    setShowLogin,
}: UserMenuProps) {
    const { user, logout } = useUser();
    const [darkMode, setDarkMode] = useDarkMode();
    const navigate = useNavigate()


    return (
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
                {user?.name && (
                    <span className="text-sm">{user.name}</span>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 font-medium">
                {!user ? (
                    <DropdownMenuItem onClick={() => setShowLogin(true)} className="text-blue-500">
                        <IconUser size={30} />
                        Iniciar Sesión
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        onClick={() => {
                            logout();  
                            navigate("/");
                        }}
                        className="text-red-500"
                    >
                        <IconUser size={30} />
                        Cerrar Sesión
                    </DropdownMenuItem>

                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>Ayuda</DropdownMenuItem>
                <DropdownMenuItem>Novedades</DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem className="flex items-center justify-between"
                    onSelect={(e) => e.preventDefault()}
                >
                    <p>Modo Oscuro</p>
                    <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}