// src/pages/Home/components/TestimonialsSection.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Carlos M.",
        role: "Day Trader",
        content: "La IA Coach cambió completamente mi forma de operar. Ahora tomo decisiones más inteligentes y reduzco pérdidas innecesarias.",
        rating: 5,
        avatar: "C"
    },
    {
        name: "Ana G.",
        role: "Swing Trader",
        content: "Los reportes dinámicos son increíbles. Puedo generar análisis personalizados en segundos sin tener que hacer cálculos manuales.",
        rating: 5,
        avatar: "A"
    },
    {
        name: "Roberto L.",
        role: "Portfolio Manager",
        content: "Las métricas de riesgo me dan la confianza que necesito. Ahora entiendo exactamente qué tan volátil es mi portafolio.",
        rating: 5,
        avatar: "R"
    }
];

export default function TestimonialsSection() {
    return (
        <section className="py-20 px-4 bg-white/5 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                        Lo que dicen nuestros <span className="text-transparent bg-linear-to-r from-blue-400 to-purple-600 bg-clip-text">usuarios</span>
                    </h2>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto">
                        Miles de traders ya están transformando su rendimiento con nuestra plataforma.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                
                                <Quote className="w-8 h-8 text-white/40 mb-4" />
                                
                                <p className="text-white/80 mb-6 leading-relaxed">
                                    "{testimonial.content}"
                                </p>
                                
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-linear-to-r from-blue-400 to-purple-600 rounded-full flex items-center justify-center font-semibold text-white">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{testimonial.name}</div>
                                        <div className="text-sm text-white/60">{testimonial.role}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}