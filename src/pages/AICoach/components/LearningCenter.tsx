import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Activity, Lightbulb, ShieldCheck } from "lucide-react";
import { behavioralNudges, learningModules, quickChecks } from "@/lib/educationContent";

const alertStyles: Record<string, string> = {
    warning: "border-yellow-200 bg-yellow-50",
    info: "border-blue-200 bg-blue-50",
    success: "border-emerald-200 bg-emerald-50",
    danger: "border-red-200 bg-red-50"
};

export default function LearningCenter() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-indigo-500" />
                        Centro de Lecciones
                    </CardTitle>
                    <CardDescription>
                        Revisa conceptos clave para interpretar mejor los insights del Coach IA.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {learningModules.map((module) => (
                            <Card key={module.title} className="h-full">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <module.icon className="w-6 h-6 text-primary" />
                                        <Badge variant="outline">{module.tag}</Badge>
                                    </div>
                                    <CardTitle>{module.title}</CardTitle>
                                    <CardDescription>{module.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        {module.focus.map((point) => (
                                            <li key={point} className="leading-relaxed">
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        Nudges de Comportamiento
                    </CardTitle>
                    <CardDescription>
                        Tips accionables para evitar sesgos y mantener disciplina operativa.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {behavioralNudges.map((nudge) => (
                        <Alert key={nudge.title} className={alertStyles[nudge.type]}>
                            <AlertTitle>{nudge.title}</AlertTitle>
                            <AlertDescription className="text-sm leading-relaxed">
                                {nudge.description}
                            </AlertDescription>
                        </Alert>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-sky-600" />
                        Checklist antes de invertir
                    </CardTitle>
                    <CardDescription>
                        Usa este repaso rápido antes de ejecutar una nueva posición.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {quickChecks.map((item) => (
                        <div key={item.label}>
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">{item.label}</span>
                                <Badge variant="secondary">Revisión</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.detail}
                            </p>
                            <Separator className="my-3" />
                        </div>
                    ))}
                    <p className="text-xs text-muted-foreground">
                        Integra estas verificaciones en tu bitácora de trading para mantener consistencia y reducir decisiones impulsivas.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

