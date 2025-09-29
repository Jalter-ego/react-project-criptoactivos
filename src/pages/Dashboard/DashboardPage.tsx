import CardHeaders from "@/components/Dashboard/CardHeaders";
import CardListActives from "@/components/Dashboard/CardListActives";
import { Input } from "@/components/ui/input";
import Layout from "@/Layout";



export default function DashboardPage() {
    return (
        <Layout>
            <div className="w-full flex flex-col">
                <CardHeaders/>
                <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 py-2">
                    <div className="lg:col-span-2 h-64 bg-card rounded-md p-4 border shadow-lg">
                        <div className="border-b pb-4">
                            <h2 className="text-xl">Actividad</h2>
                            <p className="text-muted-foreground text-sm">Ultimas operaciones</p>
                        </div>
                        <Input type="text" placeholder="buscar..." />
                    </div>

                    <CardListActives/>
                </section>
            </div>
        </Layout>
    );
}
