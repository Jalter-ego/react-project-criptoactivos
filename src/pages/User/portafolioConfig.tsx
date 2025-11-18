// src/pages/User/portafolioConfig.tsx
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
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, Trash2, PieChart, Eye, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import SpinnerComponent from "@/components/Shared/Spinner";

const PortafolioConfig: React.FC = () => {
	const { user } = useUser();
	const { currentPortafolio, setCurrentPortafolio } = usePortafolio();
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
			toast.error("Error al cargar portafolios");
			console.error(err);
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
			toast.success("Portafolio creado exitosamente");
		} catch (err) {
			console.error(err);
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
			toast.success("Portafolio actualizado exitosamente");
		} catch (err) {
			console.error(err);
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
			toast.success("Portafolio eliminado exitosamente");
		} catch (err) {
			console.error(err);
			toast.error("Error al eliminar portafolio");
		}
	};

	const handleSelectPortafolio = (portfolio: PortafolioWithHoldings) => {
		setCurrentPortafolio(portfolio);
		toast.success(`Portafolio "${portfolio.name}" seleccionado`);
		navigate("/dashboard");
	};

	const handleViewDetails = (portfolio: PortafolioWithHoldings) => {
		navigate(`/portafolios/${portfolio.id}`);
	};

	const totalPortfolios = portfolios.length;
	const totalValue = portfolios.reduce((sum, p) => sum + p.cash + p.invested, 0);
	const activePortfolios = portfolios.filter(p => p.id === currentPortafolio?.id).length;

	if (loading) {
		return (
			<div
				className="min-h-screen flex items-center justify-center"
				style={{
					backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)),url(${F1Bg}) `,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			>
				<SpinnerComponent />
			</div>
		);
	}

	return (
		<div
			className="min-h-screen py-8 px-4"
			style={{
				backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)),url(${F1Bg}) `,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
		>
			<div className="max-w-7xl mx-auto space-y-6">
				<Card className="bg-card/90 backdrop-blur-md border-border/50">
					<CardHeader>
						<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
							<div>
								<CardTitle className="text-3xl font-bold text-foreground">
									Configuración de Portafolios
								</CardTitle>
								<CardDescription className="text-base">
									Gestiona todos tus portafolios de inversión desde un solo lugar
								</CardDescription>
							</div>
							<div className="flex gap-3">
								<Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
									<DialogTrigger asChild>
										<Button size="lg" className="bg-primary hover:bg-primary/90">
											<Plus className="w-4 h-4 mr-2" />
											Nuevo Portafolio
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Crear Nuevo Portafolio</DialogTitle>
											<DialogDescription>
												Configura tu nuevo portafolio de inversión
											</DialogDescription>
										</DialogHeader>
										<div className="space-y-4">
											<div>
												<Label htmlFor="name">Nombre del Portafolio</Label>
												<Input
													id="name"
													value={newPortfolioName}
													onChange={(e) => setNewPortfolioName(e.target.value)}
													placeholder="Ej. Portafolio de Crecimiento"
												/>
											</div>
											<div>
												<Label htmlFor="cash">Saldo Inicial (USD)</Label>
												<Input
													id="cash"
													type="number"
													value={newPortfolioCash}
													onChange={(e) => setNewPortfolioCash(parseFloat(e.target.value) || 0)}
													placeholder="10000.00"
												/>
											</div>
										</div>
										<DialogFooter>
											<Button variant="outline" onClick={() => setShowAddDialog(false)}>
												Cancelar
											</Button>
											<Button onClick={handleCreate}>Crear Portafolio</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</div>
						</div>
					</CardHeader>

					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
							<div className="bg-primary/10 rounded-lg p-4 text-center">
								<div className="text-2xl font-bold text-primary">{totalPortfolios}</div>
								<div className="text-sm text-muted-foreground">Total Portafolios</div>
							</div>
							<div className="bg-green-500/10 rounded-lg p-4 text-center">
								<div className="text-2xl font-bold text-green-600">${totalValue.toFixed(2)}</div>
								<div className="text-sm text-muted-foreground">Valor Total</div>
							</div>
							<div className="bg-blue-500/10 rounded-lg p-4 text-center">
								<div className="text-2xl font-bold text-blue-600">{activePortfolios}</div>
								<div className="text-sm text-muted-foreground">Portafolio Activo</div>
							</div>
							<div className="bg-purple-500/10 rounded-lg p-4 text-center">
								<div className="text-2xl font-bold text-purple-600">
									{portfolios.reduce((sum, p) => sum + p.holdings.length, 0)}
								</div>
								<div className="text-sm text-muted-foreground">Total Activos</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-card/90 backdrop-blur-md border-border/50">
					<CardHeader>
						<CardTitle>Tus Portafolios</CardTitle>
						<CardDescription>
							Lista completa de todos tus portafolios de inversión
						</CardDescription>
					</CardHeader>
					<CardContent>
						{error && (
							<div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md text-destructive text-center">
								{error}
							</div>
						)}

						<div className="overflow-x-auto">
							<table className="w-full border-collapse">
								<thead>
									<tr className="border-b border-border">
										<th className="text-left p-4 font-semibold">Nombre</th>
										<th className="text-left p-4 font-semibold">Saldo Disponible</th>
										<th className="text-left p-4 font-semibold">Valor Invertido</th>
										<th className="text-left p-4 font-semibold">Valor Total</th>
										<th className="text-left p-4 font-semibold">Activos</th>
										<th className="text-left p-4 font-semibold">Estado</th>
										<th className="text-right p-4 font-semibold">Acciones</th>
									</tr>
								</thead>
								<tbody>
									{portfolios.map((portfolio) => {
										const totalHoldingsValue = portfolio.holdings.length;
										const portfolioTotalValue = portfolio.cash + portfolio.invested;
										const isCurrent = currentPortafolio?.id === portfolio.id;

										return (
											<tr key={portfolio.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${isCurrent ? "bg-primary/5" : ""}`}>
												<td className="p-4">
													<div className="flex items-center gap-3">
														<div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
															<PieChart className="w-5 h-5 text-white" />
														</div>
														<div>
															<div className="font-semibold">{portfolio.name}</div>
															{isCurrent && <Badge variant="secondary" className="mt-1 text-xs">Activo</Badge>}
														</div>
													</div>
												</td>
												<td className="p-4">
													<span className="font-mono text-green-600 font-medium">
														${portfolio.cash.toFixed(2)}
													</span>
												</td>
												<td className="p-4">
													<span className="font-mono text-blue-600 font-medium">
														${portfolio.invested.toFixed(2)}
													</span>
												</td>
												<td className="p-4">
													<span className="font-mono text-purple-600 font-bold text-lg">
														${portfolioTotalValue.toFixed(2)}
													</span>
												</td>
												<td className="p-4">
													<div className="flex items-center gap-2">
														<BarChart3 className="w-4 h-4 text-muted-foreground" />
														<span className="font-medium">{totalHoldingsValue}</span>
														<span className="text-sm text-muted-foreground">activos</span>
													</div>
												</td>
												<td className="p-4">
													{isCurrent ? (
														<Badge variant="default" className="bg-green-600">
															Seleccionado
														</Badge>
													) : (
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleSelectPortafolio(portfolio)}
															className="text-xs"
														>
															Seleccionar
														</Button>
													)}
												</td>
												<td className="p-4">
													<div className="flex justify-end gap-1">
														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleViewDetails(portfolio)}
															title="Ver detalles"
															className="text-muted-foreground hover:text-foreground"
														>
															<Eye className="w-4 h-4" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleEdit(portfolio)}
															title="Editar"
															className="text-muted-foreground hover:text-foreground"
														>
															<Edit3 className="w-4 h-4" />
														</Button>
														<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
															<DialogTrigger asChild>
																<Button
																	variant="ghost"
																	size="sm"
																	className="text-muted-foreground hover:text-destructive"
																	onClick={() => setDeletingId(portfolio.id)}
																	title="Eliminar"
																>
																	<Trash2 className="w-4 h-4" />
																</Button>
															</DialogTrigger>
															<DialogContent>
																<DialogHeader>
																	<DialogTitle>Eliminar Portafolio</DialogTitle>
																	<DialogDescription>
																		¿Estás seguro de que quieres eliminar el portafolio <strong>"{portfolio.name}"</strong>?
																		Esta acción no se puede deshacer y eliminará todas las transacciones asociadas.
																	</DialogDescription>
																</DialogHeader>
																<DialogFooter>
																	<Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
																		Cancelar
																	</Button>
																	<Button variant="destructive" onClick={handleDeleteConfirm}>
																		Eliminar Portafolio
																	</Button>
																</DialogFooter>
															</DialogContent>
														</Dialog>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>

						{portfolios.length === 0 && (
							<div className="text-center py-12">
								<PieChart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
								<h3 className="text-lg font-semibold mb-2">No tienes portafolios aún</h3>
								<p className="text-muted-foreground mb-4">
									Crea tu primer portafolio para comenzar a gestionar tus inversiones
								</p>
								<Button onClick={() => setShowAddDialog(true)}>
									<Plus className="w-4 h-4 mr-2" />
									Crear Primer Portafolio
								</Button>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Diálogo de edición */}
				<Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Editar Portafolio</DialogTitle>
							<DialogDescription>
								Modifica el nombre de tu portafolio
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							<div>
								<Label htmlFor="edit-name">Nombre del Portafolio</Label>
								<Input
									id="edit-name"
									value={editingName}
									onChange={(e) => setEditingName(e.target.value)}
									placeholder="Nuevo nombre"
								/>
							</div>
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={() => setShowEditDialog(false)}>
								Cancelar
							</Button>
							<Button onClick={handleUpdate}>Guardar Cambios</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};

export default PortafolioConfig;