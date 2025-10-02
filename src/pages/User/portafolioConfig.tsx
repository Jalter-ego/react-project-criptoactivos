import React, { useEffect, useState } from "react";
import F1Bg from "../../assets/backgroungPortafolio.png";
import { portafolioServices } from "../../services/portafolioServices";
import type { PortafolioWithHoldings, CreatePortafolio, UpdatePortafolio } from "../../services/portafolioServices";
import { useUser } from "../../hooks/useContext";
import { usePortafolio } from "@/hooks/PortafolioContext";
import { useNavigate } from "react-router-dom";

const PortafolioConfig: React.FC = () => {
	const { user } = useUser();
	const [portafolios, setPortafolios] = useState<PortafolioWithHoldings[]>([]);
	const [form, setForm] = useState<CreatePortafolio>({ name: "", cash: 0, userId: user?.id || "" });
	const [editId, setEditId] = useState<string | null>(null);
	const [editForm, setEditForm] = useState<UpdatePortafolio>({ name: "", cash: 0 });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { setCurrentPortafolio } = usePortafolio();
	const navigate = useNavigate();

	useEffect(() => {
		if (user?.id) {
			fetchPortafolios();
		}
	}, [user]);

	const fetchPortafolios = async () => {
		setLoading(true);
		try {
			const data = await portafolioServices.findAllByUser(user!.id);
			setPortafolios(data);
		} catch (err) {
			setError("Error al cargar portafolios");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditForm({ ...editForm, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			await portafolioServices.create({ ...form, cash: Number(form.cash), userId: user!.id });
			setForm({ name: "", cash: 0, userId: user!.id });
			fetchPortafolios();
		} catch (err) {
			setError("Error al crear portafolio");
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (portafolio: PortafolioWithHoldings) => {
		setEditId(portafolio.id);
		setEditForm({ name: portafolio.name, cash: portafolio.cash });
	};

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editId) return;
		setLoading(true);
		setError(null);
		try {
			await portafolioServices.update(editId, { ...editForm, cash: Number(editForm.cash) });
			setEditId(null);
			setEditForm({ name: "", cash: 0 });
			fetchPortafolios();
		} catch (err) {
			setError("Error al actualizar portafolio");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		setLoading(true);
		setError(null);
		try {
			await portafolioServices.remove(id);
			fetchPortafolios();
		} catch (err) {
			setError("Error al eliminar portafolio");
		} finally {
			setLoading(false);
		}
	};

	const handleSelectPortafolio = (p: PortafolioWithHoldings) => {
		setCurrentPortafolio(p);
		navigate("/dashboard");
	};

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
			<div className="max-w-2xl w-full p-8 bg-white/80 dark:bg-gray-900/80 rounded-lg shadow-lg backdrop-blur-md">
				<h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100 tracking-tight">Configuracion de Portafolios</h2>
				{error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
				<form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-4">
					<input
						type="text"
						name="name"
						value={form.name}
						onChange={handleChange}
						placeholder="Nombre del portafolio"
						className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
						required
					/>
					<input
						type="number"
						name="cash"
						value={form.cash.toFixed(2)}
						onChange={handleChange}
						placeholder="Dinero inicial"
						className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
						required
					/>
					<button
						type="submit"
						className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition font-medium"
						disabled={loading}
					>
						{loading ? "Creando..." : "Crear Portafolio"}
					</button>
				</form>

				<h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Tus Portafolios</h3>
				{loading ? (
					<div className="text-gray-500">Cargando...</div>
				) : (
					<ul className="space-y-4">
						{portafolios.map((p) => (
							<li key={p.id} className="border border-gray-200 dark:border-gray-700 rounded p-4 flex flex-col md:flex-row md:items-center justify-between bg-gray-100 dark:bg-gray-800/80">
								{editId === p.id ? (
									<form onSubmit={handleUpdate} className="flex flex-col md:flex-row gap-2 w-full">
										<input
											type="text"
											name="name"
											value={editForm.name}
											onChange={handleEditChange}
											className="px-2 py-1 border border-gray-300 rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
											required
										/>
										<input
											type="number"
											name="cash"
											value={editForm.cash?.toFixed(2)}
											onChange={handleEditChange}
											className="px-2 py-1 border border-gray-300 rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
											required
										/>
										<button type="submit" className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800">Guardar</button>
										<button type="button" onClick={() => setEditId(null)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancelar</button>
									</form>
								) : (
									<div className="flex flex-col md:flex-row md:items-center w-full justify-between">
										<div>
											<span className="font-semibold text-gray-900 dark:text-gray-100">{p.name}</span>
											<span className="ml-4 text-gray-700 dark:text-gray-300">${p.cash.toFixed(2)}</span>
										</div>
										<div className="flex gap-2 mt-2 md:mt-0">
											<button
												onClick={() => handleSelectPortafolio(p)}
												className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
											>
												Entrar
											</button>
											<button onClick={() => handleEdit(p)} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">Editar</button>
											<button onClick={() => handleDelete(p.id)} className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-900">Eliminar</button>
										</div>
									</div>
								)}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default PortafolioConfig;
