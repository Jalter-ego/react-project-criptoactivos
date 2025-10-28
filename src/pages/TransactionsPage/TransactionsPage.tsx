import { useState, useEffect } from "react";
import { usePortafolio } from "@/hooks/PortafolioContext";
import { transactionServices, type Transaction, type TransactionType } from "@/services/transactionServices";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Filter } from "lucide-react";
import { format, parseISO } from "date-fns";
import Layout from "@/Layout";
import { toast } from "sonner";
import { activeIcons } from "@/lib/activeIcons";

export default function TransactionsPage() {
    const { currentPortafolio } = usePortafolio();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!currentPortafolio?.id) return;
        fetchTransactions();
    }, [currentPortafolio?.id]);

    if (!currentPortafolio) return null;

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError(null);
            const txs = await transactionServices.findAllByPortafolio(currentPortafolio.id);
            const sortedTxs = txs.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
            setTransactions(sortedTxs);
        } catch (err) {
            setError("No se pudieron cargar las transacciones.");
            toast("No se pudieron cargar las transacciones.");
        } finally {
            setLoading(false);
        }
    };

    const getTypeBadge = (type: TransactionType) => {
        return (
            <Badge variant={type === "BUY" ? "default" : "destructive"} className={type === "BUY" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {type}
            </Badge>
        );
    };

    const getTotalValue = (tx: Transaction) => {
        return (tx.amount * tx.price).toFixed(2);
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "N/A";
        try {
            return format(parseISO(dateString), "dd/MM/yyyy HH:mm");
        } catch {
            return "N/A";
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <p>Cargando transacciones...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto p-6 space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">Transacciones del Portafolio</CardTitle>
                            <p className="text-muted-foreground">{currentPortafolio?.name || "Portafolio Actual"} • Total: {transactions.length} transacciones</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Filter className="w-4 h-4 mr-2" />
                                Filtros
                            </Button>
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Exportar
                            </Button>
                            <Button variant="outline" size="sm" onClick={fetchTransactions}>
                                <Calendar className="w-4 h-4 mr-2" />
                                Actualizar
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {error && <p className="text-destructive mb-4">{error}</p>}
                        {transactions.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No hay transacciones en este portafolio.</p>
                                <Button variant="link" className="mt-2">Ir a Trading</Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Símbolo</TableHead>
                                        <TableHead>Cantidad</TableHead>
                                        <TableHead>Precio</TableHead>
                                        <TableHead>Valor Total (USD)</TableHead>
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((tx) => (
                                        <TableRow key={tx.id}>
                                            <TableCell>{formatDate(tx.createdAt)}</TableCell>
                                            <TableCell>{getTypeBadge(tx.type)}</TableCell>
                                            <TableCell className="font-medium flex gap-2">
                                                <img
                                                    src={activeIcons[tx.activeSymbol]}
                                                    alt={tx.activeSymbol}
                                                    className="w-5 h-5 rounded-full"
                                                />
                                                {tx.activeSymbol}

                                            </TableCell>
                                            <TableCell>{tx.amount.toFixed(6)}</TableCell>
                                            <TableCell>${tx.price.toFixed(2)}</TableCell>
                                            <TableCell className="font-medium">${getTotalValue(tx)}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm">Ver Detalle</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}