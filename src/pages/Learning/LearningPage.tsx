// src/pages/Learning/LearningPage.tsx
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
    BookOpen, 
    TrendingUp, 
    BarChart3, 
    PieChart, 
    Shield,
    Brain,
    Target,
    Search,
    Clock,
    Award,
    CheckCircle,
    Play,
    Star,
    Lightbulb
} from "lucide-react";

interface Lesson {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: number;
    completed: boolean;
    progress: number;
    icon: any;
    tags: string[];
}

interface Concept {
    id: string;
    title: string;
    summary: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    readTime: number;
    viewed: boolean;
}

export default function LearningPage() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Datos simulados de progreso
    const userProgress = {
        totalLessons: 24,
        completedLessons: 8,
        totalConcepts: 45,
        viewedConcepts: 23,
        currentStreak: 5,
        totalStudyTime: 180 // minutos
    };

    // Lecciones disponibles
    const lessons: Lesson[] = [
        {
            id: "sharpe-ratio",
            title: "Ratio de Sharpe: Medición del Rendimiento Ajustado al Riesgo",
            description: "Aprende cómo el Ratio de Sharpe te ayuda a evaluar si el retorno de tu inversión compensa el riesgo asumido.",
            category: "metrics",
            difficulty: "intermediate",
            estimatedTime: 15,
            completed: true,
            progress: 100,
            icon: Target,
            tags: ["riesgo", "rendimiento", "ratios"]
        },
        {
            id: "sortino-ratio",
            title: "Ratio de Sortino: Enfoque en Pérdidas",
            description: "Descubre por qué el Sortino Ratio es superior al Sharpe cuando se trata de inversiones sensibles a las pérdidas.",
            category: "metrics",
            difficulty: "intermediate",
            estimatedTime: 12,
            completed: false,
            progress: 0,
            icon: Shield,
            tags: ["riesgo", "pérdidas", "ratios"]
        },
        {
            id: "volatility-basics",
            title: "Volatilidad: Entendiendo la Variabilidad del Mercado",
            description: "Conceptos fundamentales sobre volatilidad y cómo afecta tus inversiones cripto.",
            category: "basics",
            difficulty: "beginner",
            estimatedTime: 10,
            completed: true,
            progress: 100,
            icon: BarChart3,
            tags: ["volatilidad", "mercado", "básico"]
        },
        {
            id: "portfolio-diversification",
            title: "Diversificación de Portafolio: No Pongas Todos los Huevos en una Canasta",
            description: "Estrategias efectivas para diversificar tu portafolio cripto y reducir riesgos.",
            category: "strategy",
            difficulty: "intermediate",
            estimatedTime: 18,
            completed: false,
            progress: 45,
            icon: PieChart,
            tags: ["diversificación", "estrategia", "riesgo"]
        },
        {
            id: "technical-analysis",
            title: "Análisis Técnico: Leyendo las Velas y Tendencias",
            description: "Fundamentos del análisis técnico aplicado al trading de criptomonedas.",
            category: "technical",
            difficulty: "beginner",
            estimatedTime: 25,
            completed: false,
            progress: 0,
            icon: TrendingUp,
            tags: ["técnico", "velas", "tendencias"]
        },
        {
            id: "risk-management",
            title: "Gestión de Riesgos: Protegiendo tu Capital",
            description: "Técnicas avanzadas para gestionar riesgos en el trading cripto.",
            category: "strategy",
            difficulty: "advanced",
            estimatedTime: 20,
            completed: false,
            progress: 0,
            icon: Shield,
            tags: ["riesgo", "capital", "gestión"]
        }
    ];

    // Conceptos del glosario
    const concepts: Concept[] = [
        {
            id: "sharpe-ratio",
            title: "Ratio de Sharpe",
            summary: "Mide el rendimiento ajustado al riesgo de una inversión.",
            category: "metrics",
            difficulty: "intermediate",
            readTime: 2,
            viewed: true
        },
        {
            id: "volatility",
            title: "Volatilidad",
            summary: "Medida de la variabilidad de los precios de un activo.",
            category: "basics",
            difficulty: "beginner",
            readTime: 1,
            viewed: true
        },
        {
            id: "diversification",
            title: "Diversificación",
            summary: "Estrategia de repartir inversiones entre diferentes activos.",
            category: "strategy",
            difficulty: "beginner",
            readTime: 2,
            viewed: false
        }
    ];

    const categories = [
        { id: "all", name: "Todas", icon: BookOpen },
        { id: "basics", name: "Básicos", icon: Lightbulb },
        { id: "metrics", name: "Métricas", icon: BarChart3 },
        { id: "technical", name: "Técnico", icon: TrendingUp },
        { id: "strategy", name: "Estrategia", icon: Brain }
    ];

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'text-green-600 bg-green-50';
            case 'intermediate': return 'text-yellow-600 bg-yellow-50';
            case 'advanced': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getDifficultyLabel = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'Principiante';
            case 'intermediate': return 'Intermedio';
            case 'advanced': return 'Avanzado';
            default: return 'General';
        }
    };

    const filteredLessons = lessons.filter(lesson => {
        const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             lesson.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === "all" || lesson.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const completionPercentage = Math.round((userProgress.completedLessons / userProgress.totalLessons) * 100);

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                    Centro de Aprendizaje
                </h1>
                <p className="text-muted-foreground mt-2">
                    Domina los conceptos financieros y mejora tus habilidades de trading
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="lessons">Lecciones</TabsTrigger>
                    <TabsTrigger value="concepts">Glosario</TabsTrigger>
                    <TabsTrigger value="progress">Mi Progreso</TabsTrigger>
                </TabsList>

                {/* Dashboard */}
                <TabsContent value="dashboard" className="space-y-6 mt-6">
                    {/* Estadísticas principales */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <BookOpen className="w-8 h-8 text-blue-600" />
                                    <div>
                                        <div className="text-2xl font-bold">{userProgress.completedLessons}</div>
                                        <div className="text-sm text-muted-foreground">Lecciones Completadas</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <Brain className="w-8 h-8 text-purple-600" />
                                    <div>
                                        <div className="text-2xl font-bold">{userProgress.viewedConcepts}</div>
                                        <div className="text-sm text-muted-foreground">Conceptos Vistos</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <Award className="w-8 h-8 text-yellow-600" />
                                    <div>
                                        <div className="text-2xl font-bold">{userProgress.currentStreak}</div>
                                        <div className="text-sm text-muted-foreground">Racha de Estudio</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-8 h-8 text-green-600" />
                                    <div>
                                        <div className="text-2xl font-bold">{userProgress.totalStudyTime}</div>
                                        <div className="text-sm text-muted-foreground">Minutos de Estudio</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Barra de progreso general */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tu Progreso de Aprendizaje</CardTitle>
                            <CardDescription>
                                {userProgress.completedLessons} de {userProgress.totalLessons} lecciones completadas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Progreso General</span>
                                    <span>{completionPercentage}%</span>
                                </div>
                                <Progress value={completionPercentage} className="h-3" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lecciones recientes y recomendadas */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Continuar Estudiando</CardTitle>
                                <CardDescription>Lecciones que dejaste a medias</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {lessons.filter(l => l.progress > 0 && l.progress < 100).map(lesson => (
                                    <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <lesson.icon className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <div className="font-medium text-sm">{lesson.title}</div>
                                                <div className="text-xs text-muted-foreground">{lesson.progress}% completado</div>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline">
                                            <Play className="w-3 h-3 mr-1" />
                                            Continuar
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recomendado para Ti</CardTitle>
                                <CardDescription>Basado en tu nivel y progreso</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {lessons.filter(l => !l.completed).slice(0, 3).map(lesson => (
                                    <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <lesson.icon className="w-5 h-5 text-green-600" />
                                            <div>
                                                <div className="font-medium text-sm">{lesson.title}</div>
                                                <Badge className={`text-xs ${getDifficultyColor(lesson.difficulty)}`}>
                                                    {getDifficultyLabel(lesson.difficulty)}
                                                </Badge>
                                            </div>
                                        </div>
                                        <Button size="sm">
                                            <Play className="w-3 h-3 mr-1" />
                                            Empezar
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Lecciones */}
                <TabsContent value="lessons" className="space-y-6 mt-6">
                    {/* Filtros */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Buscar lecciones..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {categories.map(category => (
                                <Button
                                    key={category.id}
                                    variant={selectedCategory === category.id ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category.id)}
                                    className="flex items-center gap-2"
                                >
                                    <category.icon className="w-3 h-3" />
                                    {category.name}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Lista de lecciones */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLessons.map(lesson => (
                            <Card key={lesson.id} className={`hover:shadow-lg transition-shadow ${lesson.completed ? 'border-green-200 bg-green-50/50' : ''}`}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <lesson.icon className={`w-8 h-8 ${lesson.completed ? 'text-green-600' : 'text-blue-600'}`} />
                                        {lesson.completed && <CheckCircle className="w-5 h-5 text-green-600" />}
                                    </div>
                                    <CardTitle className="text-lg leading-tight">{lesson.title}</CardTitle>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge className={`text-xs ${getDifficultyColor(lesson.difficulty)}`}>
                                            {getDifficultyLabel(lesson.difficulty)}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {lesson.estimatedTime}min
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="mb-4 leading-relaxed">
                                        {lesson.description}
                                    </CardDescription>
                                    
                                    {lesson.progress > 0 && lesson.progress < 100 && (
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>Progreso</span>
                                                <span>{lesson.progress}%</span>
                                            </div>
                                            <Progress value={lesson.progress} className="h-2" />
                                        </div>
                                    )}

                                    <Button 
                                        className="w-full" 
                                        variant={lesson.completed ? "outline" : "default"}
                                    >
                                        {lesson.completed ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Repasar
                                            </>
                                        ) : lesson.progress > 0 ? (
                                            <>
                                                <Play className="w-4 h-4 mr-2" />
                                                Continuar
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-4 h-4 mr-2" />
                                                Empezar Lección
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Glosario de Conceptos */}
                <TabsContent value="concepts" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Glosario de Conceptos Financieros</CardTitle>
                            <CardDescription>
                                Referencia rápida de términos y conceptos importantes en el trading
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {concepts.map(concept => (
                                    <div 
                                        key={concept.id} 
                                        className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                                            concept.viewed ? 'border-green-200 bg-green-50/50' : ''
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold text-sm">{concept.title}</h4>
                                            {concept.viewed && <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                                            {concept.summary}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <Badge className={`text-xs ${getDifficultyColor(concept.difficulty)}`}>
                                                {getDifficultyLabel(concept.difficulty)}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {concept.readTime}min
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Progreso Personal */}
                <TabsContent value="progress" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mi Trayectoria de Aprendizaje</CardTitle>
                            <CardDescription>
                                Tu progreso y logros en el aprendizaje de conceptos financieros
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold mb-3">Estadísticas Generales</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm">Lecciones completadas</span>
                                                <span className="font-medium">{userProgress.completedLessons}/{userProgress.totalLessons}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Conceptos estudiados</span>
                                                <span className="font-medium">{userProgress.viewedConcepts}/{userProgress.totalConcepts}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Tiempo total de estudio</span>
                                                <span className="font-medium">{userProgress.totalStudyTime} minutos</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Racha actual</span>
                                                <span className="font-medium">{userProgress.currentStreak} días</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-3">Logros Recientes</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <Award className="w-5 h-5 text-yellow-600" />
                                                <div>
                                                    <div className="font-medium text-sm">Primer Ratio de Sharpe</div>
                                                    <div className="text-xs text-muted-foreground">Completado hace 2 días</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <Star className="w-5 h-5 text-blue-600" />
                                                <div>
                                                    <div className="font-medium text-sm">5 días de estudio continuo</div>
                                                    <div className="text-xs text-muted-foreground">¡Mantén la racha!</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-3">Progreso por Categoría</h4>
                                    <div className="space-y-4">
                                        {categories.slice(1).map(category => (
                                            <div key={category.id}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <category.icon className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{category.name}</span>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">
                                                        {Math.floor(Math.random() * 8) + 2}/10 completado
                                                    </span>
                                                </div>
                                                <Progress value={Math.floor(Math.random() * 60) + 20} className="h-2" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}