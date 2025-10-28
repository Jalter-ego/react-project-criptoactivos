import { useState, useEffect } from "react";
import { usePortafolio } from "@/hooks/PortafolioContext";
import { portafolioServices, type PortafolioWithHoldings, type CreatePortafolio, type UpdatePortafolio, type Holding } from "@/services/portafolioServices";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit3, Plus } from "lucide-react";
import { useUser } from "@/hooks/useContext";
import { toast } from "sonner";
import PerformanceChart from "../Dashboard/components/PerformanceChart";
import SpinnerComponent from "@/components/Shared/Spinner";

export default function PortfolioPage() {
  const { currentPortafolio, setCurrentPortafolio } = usePortafolio();
  const { user } = useUser();
  const [portfolios, setPortfolios] = useState<PortafolioWithHoldings[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPortfolio, setEditingPortfolio] = useState<PortafolioWithHoldings | null>(null);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [newPortfolioCash, setNewPortfolioCash] = useState(0);
  const [editingName, setEditingName] = useState("");
  const [editingCash, setEditingCash] = useState(0);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    fetchPortfolios();
  }, [user?.id]);
  if (!user) return null;



  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const userPortfolios = await portafolioServices.findAllByUser(user.id);
      setPortfolios(userPortfolios);
    } catch (err) {
      toast.error("No se pudieron cargar los portafolios.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newPortfolioName.trim()) return;
    try {
      const data: CreatePortafolio = {
        name: newPortfolioName,
        cash: newPortfolioCash,
        userId: user.id,
      };
      const created = await portafolioServices.create(data);
      setPortfolios([...portfolios, { ...created, holdings: [] }]);
      setNewPortfolioName("");
      setNewPortfolioCash(0);
      setShowAddDialog(false);
      toast.success("Portafolio creado.");
    } catch (err) {
      toast.error("No se pudo crear el portafolio.");
    }
  };

  const handleUpdate = async () => {
    if (!editingPortfolio || !editingName.trim()) return;
    try {
      const data: UpdatePortafolio = {
        name: editingName,
        cash: editingCash,
      };
      const updated = await portafolioServices.update(editingPortfolio.id, data);
      setPortfolios(portfolios.map(p => p.id === editingPortfolio.id ? { ...updated, holdings: editingPortfolio.holdings } : p));
      if (currentPortafolio?.id === editingPortfolio.id) {
        setCurrentPortafolio({ ...currentPortafolio, name: editingName, cash: editingCash });
      }
      setEditingPortfolio(null);
      setEditingName("");
      setEditingCash(0);
      setShowEditDialog(false);
      toast.success("Portafolio actualizado.");
    } catch (err) {
      toast.error("No se pudo actualizar el portafolio.");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    if (currentPortafolio?.id === deletingId) {
      toast.warning("No puedes eliminar el portafolio actual.");
      return;
    }
    try {
      await portafolioServices.remove(deletingId);
      setPortfolios(portfolios.filter(p => p.id !== deletingId));
      setDeletingId(null);
      setShowDeleteDialog(false);
      toast.success("Portafolio eliminado.");
    } catch (err) {
      toast.error("No se pudo eliminar el portafolio.");
    }
  };

  const handleSelect = (portfolio: PortafolioWithHoldings) => {
    setCurrentPortafolio(portfolio);
    toast(`Ahora usando "${portfolio.name}".`);
  };

  const getTotalHoldingsValue = (holdings: Holding[]) => {
    return holdings.reduce((sum, h) => sum + h.quantity, 0);
  };

  if (loading) {
    return (
      <SpinnerComponent />
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mis Portafolios</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Agregar Portafolio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Portafolio</DialogTitle>
              <DialogDescription>
                Ingresa el nombre y saldo inicial en USD.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={newPortfolioName}
                  onChange={(e) => setNewPortfolioName(e.target.value)}
                  placeholder="Ej. Portafolio Crecimiento"
                />
              </div>
              <div>
                <Label htmlFor="cash">Saldo Inicial (USD)</Label>
                <Input
                  id="cash"
                  type="number"
                  value={newPortfolioCash}
                  onChange={(e) => setNewPortfolioCash(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancelar</Button>
              <Button onClick={handleCreate}>Crear</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => {
          const totalHoldings = portfolio.holdings.length;
          const holdingsValue = getTotalHoldingsValue(portfolio.holdings);
          const isCurrent = currentPortafolio?.id === portfolio.id;

          return (
            <Card key={portfolio.id} className={isCurrent ? "ring-2 ring-primary" : ""}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  {portfolio.name}
                  {isCurrent && <Badge variant="secondary">Activo</Badge>}
                </CardTitle>
                <CardDescription>
                  {totalHoldings} activos • Valor holdings: ${holdingsValue.toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold">${portfolio.cash.toFixed(2)}</div>
                <div className="flex gap-2">
                  <Button
                    variant={isCurrent ? "secondary" : "default"}
                    size="sm"
                    onClick={() => handleSelect(portfolio)}
                    className="flex-1"
                  >
                    {isCurrent ? "Usando" : "Seleccionar"}
                  </Button>
                  <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar {portfolio.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="edit-name">Nombre</Label>
                          <Input
                            id="edit-name"
                            value={editingName || portfolio.name}
                            onChange={(e) => setEditingName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-cash">Saldo (USD)</Label>
                          <Input
                            id="edit-cash"
                            type="number"
                            value={editingCash || portfolio.cash}
                            onChange={(e) => setEditingCash(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => { setShowEditDialog(false); setEditingPortfolio(null); }}>Cancelar</Button>
                        <Button onClick={handleUpdate}>Actualizar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Eliminar Portafolio</DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro? Esto eliminará el portafolio "{portfolio.name}" y todas sus transacciones.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {currentPortafolio && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Rendimiento del Portafolio Actual</h2>
          <PerformanceChart portafolioId={currentPortafolio.id} />
        </div>
      )}
    </div>
  );
}