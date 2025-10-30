import { activeIcons } from "@/lib/activeIcons";
import type { Transaction, TransactionType } from "@/services/transactionServices"
import { ArrowDownRight, ArrowUpRight, Clock } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { format, parseISO } from "date-fns";

function formatDate(dateString: string | undefined): string {
    if (!dateString) return "N/A";
    try {
        return format(parseISO(dateString), "dd/MM/yyyy HH:mm");
    } catch {
        return "N/A";
    }
}

interface TransactionsHistoryProps {
    transactions: Transaction[];
}

export default function TransactionsHistory({ transactions }: TransactionsHistoryProps) {
    const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    const getTypeBadge = (type: TransactionType) => {
        const variant = type === "BUY" ? "default" : "destructive";
        const icon = type === "BUY" ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />;
        return (
            <Badge variant={variant} className={type === "BUY" ? "bg-green-500 text-green-50" : "bg-red-500 text-red-50"}>
                {icon} {type}
            </Badge>
        );
    };

    const getTotalValue = (tx: Transaction) => {
        return (tx.amount * tx.price).toFixed(2);
    };

    if (sortedTransactions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Historial de Transacciones
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No hay transacciones recientes en este activo.</p>
                    <p className="text-sm text-muted-foreground mt-1">¡Realiza tu primera compra o venta!</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Historial de Transacciones ({sortedTransactions.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Activo</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Precio (USD)</TableHead>
                                <TableHead>Valor Total (USD)</TableHead>
                                <TableHead>Fecha</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedTransactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell className="font-medium">{getTypeBadge(tx.type)}</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <img
                                            src={activeIcons[tx.activeSymbol] || "https://via.placeholder.com/24"}
                                            alt={tx.activeSymbol}
                                            className="w-5 h-5 rounded-full"
                                        />
                                        <span>{tx.activeSymbol}</span>
                                    </TableCell>
                                    <TableCell className="">{tx.amount.toFixed(6)}</TableCell>
                                    <TableCell className="">${tx.price.toFixed(2)}</TableCell>
                                    <TableCell className="font-medium">
                                        ${getTotalValue(tx)}
                                        {tx.type === "BUY" ? (
                                            <span className="text-green-600 text-xs ml-1">+Compra</span>
                                        ) : (
                                            <span className="text-red-600 text-xs ml-1">-Venta</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDate(tx.createdAt)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}