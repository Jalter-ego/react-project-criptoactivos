import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getFeedbackColor } from "../utils/tradeUtils";
import { type Feedback } from "@/services/feedbackServices";
import type { CreateTransaction } from "@/services/transactionServices";
import { X, BookOpen, AlertTriangle, DollarSign, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AICoachDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    transactionType: string;
    symbol: string;
    recentTransaction: Partial<CreateTransaction> | null;
    feedbacks: Feedback[];
}

export const AICoachDrawer = ({
    isOpen,
    onClose,
    transactionType,
    symbol,
    recentTransaction,
    feedbacks,
}: AICoachDrawerProps) => {
    const navigate = useNavigate();

    const riskFeedbacks = feedbacks.filter(f => f.type === "RISK_ALERT");
    const behaviorFeedbacks = feedbacks.filter(f => f.type === "BEHAVIORAL_NUDGE");
    const costFeedbacks = feedbacks.filter(f => f.type === "COST_ANALYSIS");

    const hasFeedbacks = feedbacks.length > 0;

    const educationalTips = {
        RISK_ALERT: {
            icon: AlertTriangle,
            title: "Gestión de Riesgo",
            content: "Las alertas de riesgo te ayudan a evitar pérdidas grandes. Recuerda: diversifica y no inviertas más del 5-10% en un solo activo."
        },
        BEHAVIORAL_NUDGE: {
            icon: Brain,
            title: "Sesgos Comportamentales",
            content: "El trading emocional es común. FOMO (miedo a perderse algo) lleva a compras impulsivas; pánico a ventas prematuras. Usa reglas fijas."
        },
        COST_ANALYSIS: {
            icon: DollarSign,
            title: "Eficiencia de Costos",
            content: "Comisiones y slippage reducen ganancias. Usa órdenes limit para minimizar slippage y elige brokers con fees bajos."
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="p-0 max-h-[90vh]">
                <DrawerHeader className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <DrawerTitle className="flex items-center">
                            <BookOpen className="w-5 h-5 mr-2" />
                            IA Coach: Resumen de {transactionType === "BUY" ? "Compra" : "Venta"}
                        </DrawerTitle>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {symbol} | Cantidad: {recentTransaction?.amount?.toFixed(6)} | Precio: ${recentTransaction?.price?.toFixed(2)}
                    </p>
                </DrawerHeader>

                <div className="p-4 space-y-4">
                    {hasFeedbacks ? (
                        <Tabs defaultValue="resumen" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="resumen">Resumen</TabsTrigger>
                                <TabsTrigger value="riesgos" disabled={riskFeedbacks.length === 0}>Riesgos ({riskFeedbacks.length})</TabsTrigger>
                                <TabsTrigger value="comportamiento" disabled={behaviorFeedbacks.length === 0}>Comportamiento ({behaviorFeedbacks.length})</TabsTrigger>
                                <TabsTrigger value="costos" disabled={costFeedbacks.length === 0}>Costos ({costFeedbacks.length})</TabsTrigger>
                            </TabsList>

                            <TabsContent value="resumen" className="space-y-8">
                                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                    <p className="text-green-700 font-medium">¡Transacción confirmada exitosamente!</p>
                                    <p className="text-sm text-green-600 mt-1">Revisa los insights abajo para mejorar tu estrategia.</p>
                                </div>
                                {feedbacks.slice(0, 2).map((fb, i) => (  // Top 2 en resumen
                                    <div key={i} className={`p-3 border rounded-lg ${getFeedbackColor(fb.type)}`}>
                                        <p className="text-sm font-medium">{fb.type}</p>
                                        <p className="text-sm mt-1">{fb.message}</p>
                                    </div>
                                ))}
                                {feedbacks.length > 2 && (
                                    <Button variant="link" onClick={() => { }}>Ver todos los insights</Button>
                                )}
                            </TabsContent>

                            <TabsContent value="riesgos" className="space-y-3">
                                {riskFeedbacks.map((fb, i) => (
                                    <div key={i} className={`p-4 border rounded-lg ${getFeedbackColor(fb.type)}`}>
                                        <p className="text-sm">{fb.message}</p>
                                        <Accordion type="single" collapsible className="mt-2">
                                            <AccordionItem value="tip">
                                                <AccordionTrigger className="text-xs">Aprende más sobre riesgos</AccordionTrigger>
                                                <AccordionContent className="text-xs">
                                                    {educationalTips.RISK_ALERT.content}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>
                                ))}
                            </TabsContent>

                            <TabsContent value="comportamiento" className="space-y-3">
                                {behaviorFeedbacks.map((fb, i) => (
                                    <div key={i} className={`p-4 border rounded-lg ${getFeedbackColor(fb.type)}`}>
                                        <p className="text-sm">{fb.message}</p>
                                        <Accordion type="single" collapsible className="mt-2">
                                            <AccordionItem value="tip">
                                                <AccordionTrigger className="text-xs">Aprende más sobre sesgos</AccordionTrigger>
                                                <AccordionContent className="text-xs">
                                                    {educationalTips.BEHAVIORAL_NUDGE.content}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>
                                ))}
                            </TabsContent>

                            <TabsContent value="costos" className="space-y-3">
                                {costFeedbacks.map((fb, i) => (
                                    <div key={i} className={`p-4 border rounded-lg ${getFeedbackColor(fb.type)}`}>
                                        <p className="text-sm">{fb.message}</p>
                                        <Accordion type="single" collapsible className="mt-2">
                                            <AccordionItem value="tip">
                                                <AccordionTrigger className="text-xs">Optimiza tus costos</AccordionTrigger>
                                                <AccordionContent className="text-xs">
                                                    {educationalTips.COST_ANALYSIS.content}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>
                                ))}
                            </TabsContent>
                        </Tabs>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">¡Excelente decisión! No se detectaron issues.</p>
                            <p className="text-sm text-muted-foreground mt-2">Sigue así – tu score de IA es sólido.</p>
                            <Button variant="outline" onClick={() => navigate("/asesor-ia")} className="mt-4">
                                Ver Coach IA
                            </Button>
                        </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t">
                        <Button onClick={onClose} className="flex-1" variant="outline">
                            Cerrar
                        </Button>
                        <Button onClick={() => navigate("/asesor-ia")} className="flex-1">
                            Abrir Coach IA
                        </Button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};