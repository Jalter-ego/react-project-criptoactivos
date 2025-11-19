// src/pages/Home/components/HeroSection.tsx
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useContext';
import { useState } from 'react';
import Login from '../../login';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';

export default function HeroSection() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [showLogin, setShowLogin] = useState(false);

    const handleNavigation = () => {
        if (user) {
            navigate("/dashboard");
        } else {
            setShowLogin(true);
        }
    };

    return (
        <>
            <section className="min-h-screen flex items-center justify-center px-4">
                <div className="max-w-6xl pt-8 min-h-dvh text-center">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium">Plataforma #1 de Trading Inteligente</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                            Domina el Mercado con
                            <span className="text-transparent bg-linear-to-r from-blue-400 to-purple-600 bg-clip-text"> IA Avanzada</span>
                        </h1>
                        <p className="text-xl lg:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                            "Las mejores operaciones requieren primero investigación, y después determinación." 
                            <br />
                            <span className="text-white/60 text-lg">Potencia tu trading con análisis inteligente y reportes automatizados.</span>
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <Button
                            onClick={handleNavigation}
                            size="lg"
                            className="bg-white text-black hover:bg-white/90 px-8 py-4 text-lg 
                                font-semibold rounded-xl shadow-2xl hover:shadow-white/20 transition-all 
                                duration-300 group cursor-pointer"
                        >
                            Comenzar Gratis
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 text-sm text-white/60">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-400" />
                            <span>Sin tarjeta de crédito</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-400" />
                            <span>Configuración en 2 minutos</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-purple-400" />
                            <span>Soporte 24/7</span>
                        </div>
                    </div>
                </div>
            </section>

            {showLogin && !user && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <button
                            onClick={() => setShowLogin(false)}
                            className="absolute top-4 right-4 text-foreground text-2xl font-bold"
                        >
                            ✕
                        </button>
                        <Login />
                    </div>
                </div>
            )}
        </>
    );
}