import { activeIcons } from "@/lib/activeIcons";
import type { Transaction } from "@/services/transactionServices"

function timeAgo(date: Date): string {
    const now = new Date();
    const diff = (date.getTime() - now.getTime()) / 1000;
    const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

    const divisions: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
        { amount: 60, name: "second" },
        { amount: 60, name: "minute" },
        { amount: 24, name: "hour" },
        { amount: 7, name: "day" },
        { amount: 4.34524, name: "week" },
        { amount: 12, name: "month" },
        { amount: Number.POSITIVE_INFINITY, name: "year" },
    ];

    let duration = diff;
    for (let i = 0; i < divisions.length; i++) {
        if (Math.abs(duration) < divisions[i].amount) {
            return rtf.format(Math.round(duration), divisions[i].name);
        }
        duration /= divisions[i].amount;
    }
    return "";
}

interface TransactionsHistoryProps {
    transactions: Transaction[];
}

export default function TransactionsHistory({ transactions }: TransactionsHistoryProps) {
    console.log(transactions);
    
    return (
        <div className="mt-8">
            {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-card2 rounded-2xl">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Tipo</th>
                                <th className="py-2 px-4 border-b">Moneda</th>
                                <th className="py-2 px-4 border-b">Cantidad</th>
                                <th className="py-2 px-4 border-b">Precio</th>
                                <th className="py-2 px-4 border-b">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td
                                        className={`py-2 px-4 border-b text-center font-semibold
                                            ${tx.type === "BUY" ? "text-green-500" : "text-red-500"}`}
                                    >
                                        {tx.type}
                                    </td>

                                    <td className="py-2 px-4 border-b flex items-center justify-center gap-1">
                                        <img
                                            src={activeIcons[tx.activeSymbol]}
                                            alt={tx.activeSymbol}
                                            className="w-5 h-5 rounded-full"
                                        />
                                        <p className="text-sm">
                                            {tx.activeSymbol}
                                        </p>
                                    </td>
                                    <td className="py-2 px-4 border-b text-center">{tx.amount.toFixed(6)}</td>
                                    <td className="py-2 px-4 border-b text-center">${tx.price.toFixed(2)}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        {tx.createdAt ? timeAgo(new Date(tx.createdAt)) : "-"}
                                    </td>                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No hay transacciones recientes.</p>
            )}
        </div>
    )
}