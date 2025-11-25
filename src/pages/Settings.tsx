// src/pages/Settings.tsx
import { useState } from "react";
import { useUser } from "@/hooks/useContext";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
    User, 
    Bell, 
    Shield, 
    Palette, 
    Save,
    Globe,
    CheckCircle,
    Info,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
    const { user } = useUser();
    const [darkMode, setDarkMode] = useDarkMode();
    
    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        picture: user?.picture ||''
    });
    
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        pushNotifications: false,
        tradeAlerts: true,
        marketAlerts: false,
        weeklyReports: true
    });
    
    const [preferences, setPreferences] = useState({
        currency: 'USD',
        language: 'es',
        timezone: 'America/La_Paz',
        theme: darkMode ? 'dark' : 'light',
        chartStyle: 'candlestick',
        defaultTimeframe: '1h'
    });
    
    const [security, setSecurity] = useState({
        twoFactorEnabled: false,
        sessionTimeout: 30,
        loginAlerts: true,
        apiKeysVisible: false
    });

    // Simular guardado
    const handleSave = async (section: string) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            toast.success(`${section} guardado exitosamente`);
        } catch (error) {
            toast.error(`Error al guardar ${section}`);
            console.error(error);
        }
    };

    const handleThemeChange = (theme: string) => {
        setPreferences(prev => ({ ...prev, theme }));
        if (theme === 'dark' && !darkMode) {
            setDarkMode(false);
        } else if (theme === 'light' && darkMode) {
            setDarkMode(true);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <User className="w-8 h-8" />
                    Configuraciones
                </h1>
                <p className="text-muted-foreground mt-2">
                    Personaliza tu experiencia de trading y gestiona tu cuenta
                </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">Perfil</TabsTrigger>
                    <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
                    <TabsTrigger value="preferences">Preferencias</TabsTrigger>
                    <TabsTrigger value="security">Seguridad</TabsTrigger>
                </TabsList>

                {/* Perfil */}
                <TabsContent value="profile" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Información Personal
                            </CardTitle>
                            <CardDescription>
                                Actualiza tu información personal y foto de perfil
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6 w-full">
                                <div className="w-20 h-20 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    {user?.picture ? (
                                        <img
                                            src={user.picture}
                                            alt="avatar"
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-10 h-10 text-white" />
                                    )}
                                </div>
                                <div className="w-[80%] grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre Completo</Label>
                                        <Input
                                            id="name"
                                            value={profile.name}
                                            onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Tu nombre completo"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Correo Electrónico</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className="flex gap-4">
                                <Button onClick={() => handleSave('perfil')}>
                                    <Save className="w-4 h-4 mr-2" />
                                    Guardar Cambios
                                </Button>
                                <Button variant="outline">
                                    Cancelar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notificaciones */}
                <TabsContent value="notifications" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5" />
                                Preferencias de Notificaciones
                            </CardTitle>
                            <CardDescription>
                                Controla qué notificaciones quieres recibir
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <div className="font-medium">Alertas por Email</div>
                                        <div className="text-sm text-muted-foreground">
                                            Recibe notificaciones importantes por correo
                                        </div>
                                    </div>
                                    <Switch
                                        checked={notifications.emailAlerts}
                                        onCheckedChange={(checked) => 
                                            setNotifications(prev => ({ ...prev, emailAlerts: checked }))
                                        }
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <div className="font-medium">Notificaciones Push</div>
                                        <div className="text-sm text-muted-foreground">
                                            Recibe notificaciones en tiempo real en tu navegador
                                        </div>
                                    </div>
                                    <Switch
                                        checked={notifications.pushNotifications}
                                        onCheckedChange={(checked) => 
                                            setNotifications(prev => ({ ...prev, pushNotifications: checked }))
                                        }
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <div className="font-medium">Alertas de Trading</div>
                                        <div className="text-sm text-muted-foreground">
                                            Notificaciones cuando se ejecuten tus órdenes
                                        </div>
                                    </div>
                                    <Switch
                                        checked={notifications.tradeAlerts}
                                        onCheckedChange={(checked) => 
                                            setNotifications(prev => ({ ...prev, tradeAlerts: checked }))
                                        }
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <div className="font-medium">Alertas de Mercado</div>
                                        <div className="text-sm text-muted-foreground">
                                            Notificaciones sobre cambios importantes en el mercado
                                        </div>
                                    </div>
                                    <Switch
                                        checked={notifications.marketAlerts}
                                        onCheckedChange={(checked) => 
                                            setNotifications(prev => ({ ...prev, marketAlerts: checked }))
                                        }
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <div className="font-medium">Reportes Semanales</div>
                                        <div className="text-sm text-muted-foreground">
                                            Recibe un resumen semanal de tu actividad
                                        </div>
                                    </div>
                                    <Switch
                                        checked={notifications.weeklyReports}
                                        onCheckedChange={(checked) => 
                                            setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button onClick={() => handleSave('notificaciones')}>
                                    <Save className="w-4 h-4 mr-2" />
                                    Guardar Preferencias
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>


                {/* Preferencias */}
                <TabsContent value="preferences" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Palette className="w-5 h-5" />
                                    Apariencia
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Tema</Label>
                                    <select
                                        value={preferences.theme}
                                        onChange={(e) => handleThemeChange(e.target.value)}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="light">Claro</option>
                                        <option value="dark">Oscuro</option>
                                        <option value="system">Sistema</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Estilo de Gráficos</Label>
                                    <select
                                        value={preferences.chartStyle}
                                        onChange={(e) => setPreferences(prev => ({ ...prev, chartStyle: e.target.value }))}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="candlestick">Velas Japonesas</option>
                                        <option value="line">Línea</option>
                                        <option value="area">Área</option>
                                        <option value="heikin-ashi">Heikin-Ashi</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Timeframe por Defecto</Label>
                                    <select
                                        value={preferences.defaultTimeframe}
                                        onChange={(e) => setPreferences(prev => ({ ...prev, defaultTimeframe: e.target.value }))}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="1m">1 Minuto</option>
                                        <option value="5m">5 Minutos</option>
                                        <option value="15m">15 Minutos</option>
                                        <option value="1h">1 Hora</option>
                                        <option value="4h">4 Horas</option>
                                        <option value="1d">1 Día</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="w-5 h-5" />
                                    Regional
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Moneda Base</Label>
                                    <select
                                        value={preferences.currency}
                                        onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="USD">USD - Dólar Americano</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="BTC">BTC - Bitcoin</option>
                                        <option value="BOB">BOB - Boliviano</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Idioma</Label>
                                    <select
                                        value={preferences.language}
                                        onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="es">Español</option>
                                        <option value="en">English</option>
                                        <option value="pt">Português</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Zona Horaria</Label>
                                    <select
                                        value={preferences.timezone}
                                        onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="America/La_Paz">La Paz (UTC-4)</option>
                                        <option value="America/New_York">Nueva York (UTC-5)</option>
                                        <option value="Europe/London">Londres (UTC+0)</option>
                                        <option value="Europe/Madrid">Madrid (UTC+1)</option>
                                        <option value="Asia/Tokyo">Tokio (UTC+9)</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex gap-4">
                        <Button onClick={() => handleSave('preferencias')}>
                            <Save className="w-4 h-4 mr-2" />
                            Guardar Preferencias
                        </Button>
                    </div>
                </TabsContent>

                {/* Seguridad */}
                <TabsContent value="security" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Seguridad de la Cuenta
                            </CardTitle>
                            <CardDescription>
                                Gestiona la seguridad de tu cuenta y autenticación
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <div className="font-medium">Autenticación de Dos Factores (2FA)</div>
                                        <div className="text-sm text-muted-foreground">
                                            Añade una capa extra de seguridad a tu cuenta
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={security.twoFactorEnabled ? "default" : "secondary"}>
                                            {security.twoFactorEnabled ? "Activado" : "Desactivado"}
                                        </Badge>
                                        <Switch
                                            checked={security.twoFactorEnabled}
                                            onCheckedChange={(checked) => 
                                                setSecurity(prev => ({ ...prev, twoFactorEnabled: checked }))
                                            }
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <div className="font-medium">Alertas de Inicio de Sesión</div>
                                        <div className="text-sm text-muted-foreground">
                                            Recibe notificaciones cuando inicies sesión desde un nuevo dispositivo
                                        </div>
                                    </div>
                                    <Switch
                                        checked={security.loginAlerts}
                                        onCheckedChange={(checked) => 
                                            setSecurity(prev => ({ ...prev, loginAlerts: checked }))
                                        }
                                    />
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label>Timeout de Sesión (minutos)</Label>
                                    <select
                                        value={security.sessionTimeout.toString()}
                                        onChange={(e) => setSecurity(prev => ({ 
                                            ...prev, 
                                            sessionTimeout: parseInt(e.target.value) 
                                        }))}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="15">15 minutos</option>
                                        <option value="30">30 minutos</option>
                                        <option value="60">1 hora</option>
                                        <option value="240">4 horas</option>
                                        <option value="0">Nunca</option>
                                    </select>
                                    <p className="text-xs text-muted-foreground">
                                        Tiempo de inactividad antes de cerrar automáticamente la sesión
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="font-semibold">API Keys</h4>
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertDescription>
                                        Las claves API te permiten conectar servicios externos. 
                                        Mantén esta información segura y no la compartas.
                                    </AlertDescription>
                                </Alert>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <div className="font-medium">Mostrar Claves API</div>
                                        <div className="text-sm text-muted-foreground">
                                            Visualizar tus claves API actuales (no recomendado)
                                        </div>
                                    </div>
                                    <Switch
                                        checked={security.apiKeysVisible}
                                        onCheckedChange={(checked) => 
                                            setSecurity(prev => ({ ...prev, apiKeysVisible: checked }))
                                        }
                                    />
                                </div>

                                {security.apiKeysVisible && (
                                    <div className="space-y-2">
                                        <div className="p-3 bg-muted rounded-lg">
                                            <div className="text-sm font-medium mb-1">API Key Pública</div>
                                            <div className="font-mono text-xs">pk_live_******************************</div>
                                        </div>
                                        <div className="p-3 bg-muted rounded-lg">
                                            <div className="text-sm font-medium mb-1">API Key Privada</div>
                                            <div className="font-mono text-xs">sk_live_******************************</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <Button onClick={() => handleSave('configuración de seguridad')}>
                                    <Save className="w-4 h-4 mr-2" />
                                    Guardar Configuración
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="w-5 h-5" />
                                Información del Sistema
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-muted-foreground">Versión:</span>
                                    <div className="mt-1">TradingView AI v2.1.0</div>
                                </div>
                                <div>
                                    <span className="font-medium text-muted-foreground">Última actualización:</span>
                                    <div className="mt-1">{new Date().toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <span className="font-medium text-muted-foreground">Estado de conexión:</span>
                                    <div className="mt-1 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        Conectado
                                    </div>
                                </div>
                                <div>
                                    <span className="font-medium text-muted-foreground">ID de usuario:</span>
                                    <div className="mt-1 font-mono text-xs">{user?.id}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}