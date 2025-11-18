// src/pages/Reports/ReportsPage.tsx
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/hooks/useContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Send, 
    FileText, 
    Download, 
    Bot, 
    User,
    Loader2,
    FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import { reportsService, type GenerateReportRequest } from "@/services/reportsServices";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

interface ChatMessage {
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
    reportUrl?: string;
    filename?: string;
}

export default function ReportsPage() {
    const { user } = useUser();
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            type: 'bot',
            content: '¡Hola! Soy tu asistente de reportes. Puedo generar reportes personalizados en PDF o Excel. Solo dime qué necesitas. Por ejemplo:\n\n• "Genera un reporte PDF de todas mis transacciones del último mes"\n• "Crea un Excel con el rendimiento de mi portafolio"\n• "Análisis de mis costos de trading en PDF"',
            timestamp: new Date()
        }
    ]);

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, isGenerating]);

    const handleGenerateReport = async () => {
        if (!prompt.trim() || !user?.id) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: prompt,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsGenerating(true);

        try {
            const requestData: GenerateReportRequest = {
                prompt: prompt,
                userId: user.id
            };

            const blob = await reportsService.generateReport(requestData);
            
            const url = window.URL.createObjectURL(blob);
            const filename = `reporte_${Date.now()}.${getFileExtension(blob.type)}`;

            const botMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: `¡Perfecto! He generado tu reporte personalizado. Haz clic en el botón de descarga para obtenerlo.`,
                timestamp: new Date(),
                reportUrl: url,
                filename: filename
            };

            setMessages(prev => [...prev, botMessage]);
            setPrompt("");

            toast.success("Reporte generado exitosamente");

        } catch (error) {
            console.error("Error generating report:", error);
            
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: "Lo siento, hubo un error al generar el reporte. Por favor, intenta de nuevo o reformula tu solicitud.",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
            toast.error("Error al generar el reporte");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = (url: string, filename: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Descarga iniciada");
    };

    const getFileExtension = (mimeType: string) => {
        switch (mimeType) {
            case 'application/pdf': return 'pdf';
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': return 'xlsx';
            case 'application/vnd.ms-excel': return 'xls';
            default: return 'file';
        }
    };

    const samplePrompts = [
        "Genera un reporte PDF de todas mis transacciones",
        "Crea un Excel con el análisis de mi portafolio",
        "Reporte de costos de trading del último mes en PDF",
        "Análisis de rendimiento por activo en Excel"
    ];

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Bot className="w-8 h-8 text-blue-600" />
                    Reportes con IA
                </h1>
                <p className="text-muted-foreground mt-2">
                    Genera reportes personalizados usando lenguaje natural
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <Card className="h-[600px] flex flex-col">
                        <CardHeader className="shrink-0">
                            <CardTitle className="flex items-center gap-2">
                                <Bot className="w-5 h-5" />
                                Asistente de Reportes
                            </CardTitle>
                            <CardDescription>
                                Describe el reporte que necesitas y lo generaré automáticamente
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1 p-0 overflow-hidden">
                            <ScrollArea ref={scrollAreaRef} className="h-full">
                                <div className="p-4 space-y-4 min-h-full">
                                    {messages.map((message) => (
                                        <div key={message.id} className={`flex gap-3 ${
                                            message.type === 'user' ? 'justify-end' : 'justify-start'
                                        }`}>
                                            <div className={`flex gap-3 max-w-[80%] ${
                                                message.type === 'user' ? 'flex-row-reverse' : ''
                                            }`}>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                                    message.type === 'user' 
                                                        ? 'bg-blue-600' 
                                                        : 'bg-purple-600'
                                                }`}>
                                                    {message.type === 'user' ? (
                                                        <User className="w-4 h-4 text-white" />
                                                    ) : (
                                                        <Bot className="w-4 h-4 text-white" />
                                                    )}
                                                </div>

                                                <div className={`rounded-lg p-3 ${
                                                    message.type === 'user'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-muted'
                                                }`}>
                                                    <p className="text-sm whitespace-pre-wrap">
                                                        {message.content}
                                                    </p>
                                                    
                                                    {message.type === 'bot' && message.reportUrl && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="mt-3 h-8"
                                                            onClick={() => handleDownload(message.reportUrl!, message.filename!)}
                                                        >
                                                            <Download className="w-3 h-3 mr-2" />
                                                            Descargar {message.filename}
                                                        </Button>
                                                    )}

                                                    <div className="text-xs opacity-70 mt-2">
                                                        {message.timestamp.toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {isGenerating && (
                                        <div className="flex gap-3 justify-start">
                                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                                                <Bot className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="bg-muted rounded-lg p-3">
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span className="text-sm">Generando tu reporte...</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>

                        <div className="p-4 border-t">
                            <div className="flex gap-2">
                                <Textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe el reporte que necesitas..."
                                    className="min-h-[60px] resize-none"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleGenerateReport();
                                        }
                                    }}
                                />
                                <Button 
                                    onClick={handleGenerateReport}
                                    disabled={!prompt.trim() || isGenerating}
                                    className="px-4"
                                >
                                    {isGenerating ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Ejemplos de Reportes</CardTitle>
                            <CardDescription>
                                Haz clic para usar como base
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {samplePrompts.map((sample, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-left h-auto p-3 justify-start"
                                    onClick={() => setPrompt(sample)}
                                >
                                    <div className="text-xs">
                                        {sample}
                                    </div>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Formatos Disponibles</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-red-500" />
                                <div>
                                    <div className="font-medium text-sm">PDF</div>
                                    <div className="text-xs text-muted-foreground">Documentos formateados</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                                <div>
                                    <div className="font-medium text-sm">Excel</div>
                                    <div className="text-xs text-muted-foreground">Datos estructurados</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">💡 Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>• Sé específico sobre fechas y tipos de datos</p>
                            <p>• Menciona el formato deseado (PDF/Excel)</p>
                            <p>• Incluye filtros como "último mes" o "por activo"</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}