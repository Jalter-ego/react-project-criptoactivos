import { Spinner } from "../ui/spinner";

interface SpinnerProps{
    size?: string
}

export default function SpinnerComponent({size}:SpinnerProps) {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="flex items-center justify-center w-80 gap-2">
                <Spinner 
                    className={`text-[#eb5e28] ${size ? `size-${size}` : "size-44"}`}                
                />
            </div>
        </div>
    )
}