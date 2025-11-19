// src/pages/Home/components/FeaturesSection.tsx
import { Card, CardContent } from '@/components/ui/card';
import { 
    Brain, 
    FileText, 
    TrendingUp, 
    Shield, 
    BarChart3,
    PieChart,
} from 'lucide-react';

const features = [
    {
        icon: Brain,
        title: "IA Coach Personal",
        description: "Análisis inteligente de tus operaciones con recomendaciones personalizadas basadas en tus patrones de trading.",
        color: "text-purple-400"
    },
    {
        icon: FileText,
        title: "Reportes Dinámicos",
        description: "Genera reportes en PDF o Excel usando lenguaje natural. Solo describe lo que necesitas.",
        color: "text-blue-400"
    },
    {
        icon: TrendingUp,
        title: "Análisis de Riesgo",
        description: "Métricas avanzadas como Sharpe Ratio, Sortino Ratio y análisis de volatilidad en tiempo real.",
        color: "text-green-400"
    },
    {
        icon: Shield,
        title: "Gestión de Riesgos",
        description: "Alertas automáticas de concentración, límites de pérdidas y recomendaciones de diversificación.",
        color: "text-red-400"
    },
    {
        icon: PieChart,
        title: "Distribución de Portafolio",
        description: "Visualiza la composición de tus activos con gráficos interactivos y análisis detallado.",
        color: "text-orange-400"
    },
    {
        icon: BarChart3,
        title: "Métricas de Rendimiento",
        description: "Seguimiento completo de P&L, drawdown máximo y retorno ajustado por riesgo.",
        color: "text-cyan-400"
    }
];

export default function FeaturesSection() {
    return (
        <section className="py-20 px-4 bg-white/5 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                        Herramientas <span className="text-transparent bg-linear-to-r from-blue-400 to-purple-600 bg-clip-text">Profesionales</span>
                    </h2>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto">
                        Tecnología de vanguardia combinada con análisis experto para potenciar tu rendimiento en el trading.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 group">
                            <CardContent className="p-6">
                                <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                                <p className="text-white/70 leading-relaxed">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}