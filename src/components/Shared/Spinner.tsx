import { Spinner } from "../ui/spinner";

export default function SpinnerComponent() {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="flex items-center justify-center w-80 gap-2">
                <Spinner className="size-44 text-[#eb5e28]" />
            </div>
        </div>
    )
}