// src/pages/Home/components/Footer.tsx

import { Separator } from "@/components/ui/separator";

export default function Footer() {
    return (
        <footer className="py-12 px-4 border-t border-white/10">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">TradingView AI</h3>
                        <p className="text-white/60 text-sm leading-relaxed">
                            La plataforma definitiva para traders inteligentes. 
                            Combina análisis técnico con IA avanzada.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold mb-4">Producto</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><a href="#" className="hover:text-white transition-colors">IA Coach</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Reportes</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold mb-4">Comunidad</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Tutoriales</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Soporte</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Licencias</a></li>
                        </ul>
                    </div>
                </div>
                
                <Separator className="bg-white/10 mb-8" />
                
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
                    <div>© 2024 TradingView AI. Todos los derechos reservados.</div>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}