import { IconCard, IconChartBar, IconRefresh, IconTrophy, IconUser } from "@/lib/icons";


export default function CardHeaders(){
    return(
        <section className="w-full flex max-md:flex-col gap-6 py-2">
                    <div className="w-full h-32 bg-card rounded-md p-3 border shadow-lg">
                        <div className="flex items-center justify-between border-b pb-2.5">
                            <div className="text-[#7ac29a]">
                                <IconCard size={58} />
                            </div>
                            <div>
                                <p className="text-right">Capital total</p>
                                <p className="text-3xl">$10000.00</p>
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
                                <p className="text-right">Historial</p>
                            </div>
                        </div>
                        <div className="flex items-center mt-2 text-sm gap-1 text-muted-foreground">
                            📅
                            <p>Ultimo hace 3 dias</p>
                        </div>
                    </div>

                    <div className="w-full h-32 bg-card rounded-md p-3 border shadow-lg">
                        <div className="flex items-center justify-between border-b pb-2.5">
                            <div className="text-[#f3bb45]">
                                <IconTrophy size={58} />
                            </div>
                            <div>
                                <p className="text-right">Ranking</p>
                            </div>
                        </div>
                        <div className="flex items-center mt-2 text-sm gap-1 text-muted-foreground">
                            <IconUser size={20} />
                            <p>107,239 inversores activos</p>
                        </div>
                    </div>
                </section>
    )
}