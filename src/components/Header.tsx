import { IconUsers } from "@/lib/icons";

export default function Header() {
    return (
        <header className="w-full h-16 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-medium">
                    TradingView
                </h1>
            </div>
            <div>
                <IconUsers />
            </div>
        </header>
    )
}