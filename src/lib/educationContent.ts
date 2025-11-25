import type { LucideIcon } from "lucide-react";
import { Activity, BookOpen, Compass, Layers, Lightbulb, ShieldCheck, Target, TrendingUp } from "lucide-react";

export interface LearningModule {
    title: string;
    description: string;
    icon: LucideIcon;
    focus: string[];
    tag: string;
}

export const learningModules: LearningModule[] = [
    {
        title: "Fundamentos de Criptoactivos",
        description: "Comprende la base tecnológica antes de asignar capital.",
        icon: BookOpen,
        focus: [
            "Un criptoactivo es un registro digital en una blockchain que puede representar dinero (ej. Bitcoin), utilidad (ej. Ether) o derechos (ej. tokens de gobernanza).",
            "La red blockchain valida transacciones sin un intermediario único mediante consenso distribuido. Evalúa la solidez del protocolo, su comunidad y los nodos que lo sostienen.",
            "La tokenómica describe emisión, distribución e incentivos. Revisa oferta circulante, calendarios de desbloqueo, mecanismos de quema y roles de los validadores.",
        ],
        tag: "Base Técnica",
    },
    {
        title: "Gestión del Portafolio Cripto",
        description: "Diversifica para amortiguar la volatilidad extrema del mercado.",
        icon: Target,
        focus: [
            "Define una asignación estratégica: activos núcleo de alta capitalización, satélites con mayor riesgo y stablecoins para liquidez operativa.",
            "Evalúa correlaciones: muchos tokens siguen el movimiento de BTC/ETH; incorpora activos con casos de uso distintos (infraestructura, DeFi, gaming) para balancear.",
            "Rebalancea periódicamente: fija umbrales (ej. ±5%) y ejecuta ajustes automáticos para mantener tu perfil de riesgo.",
        ],
        tag: "Estrategia",
    },
    {
        title: "Indicadores Clave de Inversión",
        description: "Usa señales cuantitativas y cualitativas antes de entrar.",
        icon: TrendingUp,
        focus: [
            "Liquidez: analiza volumen promedio, profundidad del libro y spreads para evitar slippage elevado.",
            "On-chain metrics: wallets activas, direcciones ballena y flujos hacia exchanges anticipan presión de compra o venta.",
            "Narrativa y regulación: identifica catalizadores (upgrades, adopción institucional) y riesgos legales que puedan afectar el precio.",
        ],
        tag: "Research",
    },
    {
        title: "Riesgo Operacional Web3",
        description: "Evalúa riesgos fuera del precio para proteger capital.",
        icon: ShieldCheck,
        focus: [
            "Auditorías de smart contracts: revisa reportes externos, historial de vulnerabilidades y planes de contingencia.",
            "Riesgo de contraparte: exchanges centralizados implican custodia; verifica reservas, solvencia y condiciones de retiro.",
            "Ciberseguridad personal: usa hardware wallets, MFA y segmenta dispositivos para reducir vectores de ataque.",
        ],
        tag: "Control",
    },
];

export interface BehavioralNudge {
    title: string;
    type: "warning" | "info" | "success" | "danger";
    description: string;
}

export const behavioralNudges: BehavioralNudge[] = [
    {
        title: "Pausa deliberada antes de confirmar",
        type: "warning",
        description: "Si detectas euforia por ganancias recientes, introduce un temporizador de 2 minutos antes de ejecutar la orden y reevalúa el tamaño.",
    },
    {
        title: "Define reglas escritas de salida",
        type: "info",
        description: "Documenta objetivos de take-profit y stop-loss basados en niveles técnicos o porcentajes fijos. Revísalos semanalmente.",
    },
    {
        title: "Registra el motivo de cada trade",
        type: "success",
        description: "Anota la hipótesis de mercado y métricas que la respaldan. Esto facilita retroalimentación futura del Coach IA.",
    },
    {
        title: "Controla la exposición por activo",
        type: "danger",
        description: "Establece un límite máximo de % sobre el portafolio por token para limitar pérdidas en eventos adversos.",
    },
    {
        title: "Reduce el ruido informativo",
        type: "info",
        description: "Selecciona 3 fuentes confiables y establece horarios fijos para revisar noticias y no operar bajo titulares de último minuto.",
    },
];

export interface QuickCheck {
    label: string;
    detail: string;
}

export const quickChecks: QuickCheck[] = [
    {
        label: "Horizonte temporal claro",
        detail: "¿Cuánto planeas mantener la posición? Alinea la liquidez del token a ese plazo.",
    },
    {
        label: "Impacto en cash-flow",
        detail: "Valida que comisiones, tasas de financiación y staking no erosionen tu rendimiento esperado.",
    },
    {
        label: "Escenarios de riesgo",
        detail: "Simula caídas de -20%, -40% y -60% para validar si tu tolerancia psicológica y capital cubren ese estrés.",
    },
    {
        label: "Gestión fiscal",
        detail: "Documenta precios de entrada y salida; muchos países consideran cripto como activo sujeto a impuesto por plusvalía.",
    },
];

interface PreTradeConcept {
    badge: string;
    title: string;
    focus: string[];
    reminder: string;
}

export const preTradeConcepts: Record<"BUY" | "SELL", PreTradeConcept> = {
    BUY: {
        badge: "Entrada",
        title: "Checklist rápido antes de comprar",
        focus: [
            "Confirma posición de liquidez: volumen 24h y spread < 0.40% evitan slippage alto.",
            "Evalúa narrativa actual: ¿sigue vigente la tesis que respalda la subida? Busca confirmación en métricas on-chain.",
            "Define tamaño máximo: asigna un % del portafolio y respeta stop-loss calculado.",
        ],
        reminder: "Consejo: Escala entradas en tramos para reducir impacto de volatilidad.",
    },
    SELL: {
        badge: "Salida",
        title: "Checklist rápido antes de vender",
        focus: [
            "Revisa razones de salida: ¿es toma de ganancia planificada o respuesta emocional a la volatilidad?",
            "Analiza liquidez: confirma profundidad para no provocar caída adicional con tu orden.",
            "Evalúa impacto fiscal y de portafolio: ¿mantienes diversificación y reservas de liquidez tras la venta?",
        ],
        reminder: "Consejo: Usa órdenes limitadas escalonadas para capturar precio promedio competitivo.",
    },
};

export interface ChartConcept {
    icon: LucideIcon;
    title: string;
    detail: string;
}

export const chartConcepts: ChartConcept[] = [
    {
        icon: Activity,
        title: "Contextualiza la volatilidad",
        detail: "Compara rangos diarios contra promedio semanal. Movimientos extremos suelen revertir parcialmente; evita operar al centro del spike.",
    },
    {
        icon: Layers,
        title: "Capas de análisis",
        detail: "Combina temporalidades: identifica tendencia macro en 1D/4H y ejecuta en marcos menores. No contradictorio = mayor probabilidad.",
    },
    {
        icon: Compass,
        title: "Liquidez visible e invisible",
        detail: "Observa niveles de volumen histórico y order blocks en el gráfico. Coinciden con zonas donde market makers defienden precios.",
    },
    {
        icon: Lightbulb,
        title: "Confirma con sentimiento",
        detail: "Cruza datos del gráfico con métricas externas (funding rate, open interest). Divergencias pueden anticipar giros.",
    },
    {
        icon: Target,
        title: "Planifica escenarios",
        detail: "Define qué harías si el precio rompe soporte/resistencia clave antes de abrir la posición. Evita improvisación.",
    },
];

export interface ChartQuickPrompt {
    title: string;
    bullets: string[];
}

export const confirmPrompts: Record<"BUY" | "SELL", ChartQuickPrompt> = {
    BUY: {
        title: "Antes de confirmar tu compra, pregúntate:",
        bullets: [
            "¿Este nivel respeta tu plan de riesgo/recompensa (>2:1)?",
            "¿Existe un disparador claro (ruptura, pullback, noticia) que valide la entrada?",
            "¿Sabes dónde cerrarás si el mercado se mueve en tu contra?",
        ],
    },
    SELL: {
        title: "Antes de confirmar tu venta, revisa:",
        bullets: [
            "¿Esta salida está alineada a tu plan (take-profit o stop)?",
            "¿Dejas correr una parte para capturar tendencia si el impulso continúa?",
            "¿Cómo reinvertirás o resguardarás la liquidez liberada?",
        ],
    },
};


