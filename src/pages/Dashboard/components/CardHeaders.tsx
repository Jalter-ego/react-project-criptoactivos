import { usePortafolio } from "@/hooks/PortafolioContext";
import { IconCard, IconChartBar, IconRefresh, IconTrophy } from "@/lib/icons";
import { portafolioServices } from "@/services/portafolioServices";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export default function CardHeaders(){
    const { currentPortafolio } = usePortafolio()
    const [totalValue,setTotalValue] = useState<number>(0);
    useEffect(()=>{
        initFetch();
    },[])

    const initFetch = async() => {
        try {
            const total = await portafolioServices.findTotalValueOfPortafolio(currentPortafolio?.id||'')
            setTotalValue(total.totalValue)
        } catch (err) {
            toast.error("error al traer el valor total")
            console.log(err);
        }
    }
    return(
        <section className="w-full flex max-md:flex-col gap-6 py-2">
                    <div className="w-full h-32 bg-card rounded-md p-3 border shadow-lg">
                        <div className="flex items-center justify-between border-b pb-2.5">
                            <div className="text-[#7ac29a]">
                                <IconCard size={58} />
                            </div>
                            <div>
                                <p className="text-right">Capital total</p>
                                <p className="text-3xl">${currentPortafolio?.cash.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex items-center mt-2 text-sm gap-1 text-muted-foreground">
                            <IconRefresh />
                            <p>
                                Actualizado cada minuto (
                                <button
                                    type="button"
                                    className="text-blue-300 cursor-pointer"
                                >
                                    reload
                                </button>
                                )
                            </p>
                        </div>
                    </div>

                    <div className="w-full h-32 bg-card rounded-md p-3 border shadow-lg">
                        <div className="flex items-center justify-between border-b pb-2.5">
                            <div className="text-[#68b3c8]">
                                <IconChartBar size={58} />
                            </div>
                            <div>
                                <p className="text-right">Valor Total</p>
                                <p className="text-3xl">${totalValue.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex items-center mt-2 text-sm gap-1 text-muted-foreground">
                            💰
                            <p>Invertido: $ {currentPortafolio?.invested} | Disponible: ${currentPortafolio?.cash.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="w-full h-32 bg-card rounded-md p-3 border shadow-lg">
                        <div className="flex items-center justify-between border-b pb-2.5">
                            <div className="text-[#f3bb45]">
                                <IconTrophy size={58} />
                            </div>
                            <div>
                                <p className="text-right">P&L Total</p>
                                <p className="text-3xl text-green-500">+2,450.80</p>
                            </div>
                        </div>
                        <div className="flex items-center mt-2 text-sm gap-1 text-muted-foreground">
                            📈
                            <p>Win Rate: 68% | Mejor Trade: +1,200.50</p>
                        </div>
                    </div>
                </section>
    )
}