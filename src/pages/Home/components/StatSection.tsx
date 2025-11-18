// src/pages/Home/components/StatsSection.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, FileText, Award } from 'lucide-react';

const stats = [
    {
        icon: Users,
        value: "50K+",
        label: "Traders Activos",
        description: "Usuarios confían en nuestra plataforma"
    },
    {
        icon: TrendingUp,
        value: "98.5%",
        label: "Uptime",
        description: "Disponibilidad garantizada"
    },
    {
        icon: FileText,
        value: "1M+",
        label: "Reportes Generados",
        description: "Con IA avanzada"
    },
    {
        icon: Award,
        value: "#1",
        label: "Plataforma de Trading",
        description: "En innovación tecnológica"
    }
];

export default function StatsSection() {
    return (
        <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="bg-linear-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-xl flex items-center justify-center">
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</div>
                                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                                <div className="text-sm text-white/60">{stat.description}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}