// src/pages/PortafolioConfig/PortafolioConfig.tsx (o donde esté)
import React, { useEffect, useState } from "react";
import F1Bg from "../../assets/backgroungPortafolio.png";
import { portafolioServices, type PortafolioWithHoldings, type CreatePortafolio, type UpdatePortafolio } from "../../services/portafolioServices";
import { useUser } from "../../hooks/useContext";
import { usePortafolio } from "@/hooks/PortafolioContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";

const PortafolioConfig: React.FC = () => {
	const { user } = useUser();
	const { setCurrentPortafolio } = usePortafolio();
	const navigate = useNavigate();
	const [portfolios, setPortfolios] = useState<PortafolioWithHoldings[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showAddDialog, setShowAddDialog] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [editingPortfolio, setEditingPortfolio] = useState<PortafolioWithHoldings | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [newPortfolioName, setNewPortfolioName] = useState("");
	const [newPortfolioCash, setNewPortfolioCash] = useState(0);
	const [editingName, setEditingName] = useState("");

	useEffect(() => {
		if (user?.id) {
			fetchPortfolios();
		}
	}, [user?.id]);

	const fetchPortfolios = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await portafolioServices.findAllByUser(user!.id);
			setPortfolios(data);
		} catch (err) {
			setError("Error al cargar portafolios");
			toast("Error al cargar portafolios");
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
				userId: user!.id,
			};
			const created = await portafolioServices.create(data);
			setPortfolios([...portfolios, { ...created, holdings: [] }]);
			setNewPortfolioName("");
			setNewPortfolioCash(0);
			setShowAddDialog(false);
			toast.success("Portafolio creado.");
		} catch (err) {
			toast.error("Error al crear portafolio");
		}
	};

	const handleEdit = (portfolio: PortafolioWithHoldings) => {
		setEditingPortfolio(portfolio);
		setEditingName(portfolio.name);
		setShowEditDialog(true);
	};

	const handleUpdate = async () => {
		if (!editingPortfolio || !editingName.trim()) return;
		try {
			const data: UpdatePortafolio = {
				name: editingName,
			};
			await portafolioServices.update(editingPortfolio.id, data);
			setPortfolios(portfolios.map(p => p.id === editingPortfolio.id ? { ...p, name: editingName } : p));
			setShowEditDialog(false);
			setEditingPortfolio(null);
			setEditingName("");
			toast.success("Portafolio actualizado.");
		} catch (err) {
			toast.error("Error al actualizar portafolio");
		}
	};

	const handleDeleteConfirm = async () => {
		if (!deletingId) return;
		try {
			await portafolioServices.remove(deletingId);
			setPortfolios(portfolios.filter(p => p.id !== deletingId));
			setDeletingId(null);
			setShowDeleteDialog(false);
			toast.success("Portafolio eliminado.");
		} catch (err) {
			toast.error("Error al eliminar portafolio");
		}
	};

	const handleSelectPortafolio = (portfolio: PortafolioWithHoldings) => {
		setCurrentPortafolio(portfolio);
		navigate("/dashboard");
	};

	if (loading) {
		return (
			<div
				className="min-h-screen flex items-center justify-center"
				style={{
					backgroundImage: `url(${F1Bg})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			>
				<div className="text-center">
					<p className="text-foreground">Cargando portafolios...</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className="min-h-screen flex items-center justify-center"
			style={{
				backgroundImage: `url(${F1Bg})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
		>
			<div className="max-w-4xl w-full p-6 bg-card/90 backdrop-blur-md rounded-xl shadow-xl border border-border">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold text-foreground">Configuración de Portafolios</h1>
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

				{error && <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md text-destructive">{error}</div>}

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{portfolios.map((portfolio) => (
						<Card key={portfolio.id}>
							<CardHeader>
								<CardTitle className="flex justify-between items-start">
									{portfolio.name}
								</CardTitle>
								<CardDescription>
									Saldo disponible: ${portfolio.cash.toFixed(2)}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="text-2xl font-bold text-primary">${portfolio.cash.toFixed(2)}</div>
								<div className="flex gap-2">
									<Button
										onClick={() => handleSelectPortafolio(portfolio)}
										className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
									>
										Entrar
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleEdit(portfolio)}
									>
										<Edit3 className="w-4 h-4" />
									</Button>
									<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
										<DialogTrigger asChild>
											<Button variant="destructive" size="sm" onClick={() => setDeletingId(portfolio.id)}>
												<Trash2 className="w-4 h-4" />
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Eliminar Portafolio</DialogTitle>
												<DialogDescription>
													¿Estás seguro? Esto eliminará el portafolio "{portfolio.name}" permanentemente.
												</DialogDescription>
											</DialogHeader>
											<DialogFooter>
												<Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
												<Button variant="destructive" onClick={handleDeleteConfirm}>Eliminar</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				<Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
					<DialogContent className="bg-background/80">
						<DialogHeader>
							<DialogTitle>Editar Portafolio</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<div>
								<Label htmlFor="edit-name">Nombre</Label>
								<Input
									id="edit-name"
									value={editingName}
									onChange={(e) => setEditingName(e.target.value)}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancelar</Button>
							<Button onClick={handleUpdate}>Actualizar</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};

export default PortafolioConfig;