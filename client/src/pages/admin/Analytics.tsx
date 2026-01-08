import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { TrendingUp, Package, ShoppingCart, Users, Calendar } from "lucide-react";

export default function AdminAnalytics() {
  const currentMonth = new Date().getFullYear() * 100 + (new Date().getMonth() + 1);
  
  const { data: revenue } = trpc.revenue.byMonth.useQuery({ month: currentMonth });
  const { data: orders } = trpc.orders.byMonth.useQuery({ month: currentMonth });
  const { data: appointments } = trpc.appointments.byMonth.useQuery({ month: currentMonth });
  const { data: products } = trpc.products.list.useQuery();

  const stats = [
    {
      title: "Revenu du Mois",
      value: `${revenue?.reduce((sum, r) => sum + r.amount, 0) || 0} TND`,
      icon: TrendingUp,
      description: "Revenu total ce mois",
    },
    {
      title: "Commandes",
      value: orders?.length || 0,
      icon: ShoppingCart,
      description: "Commandes ce mois",
    },
    {
      title: "Rendez-vous",
      value: appointments?.length || 0,
      icon: Calendar,
      description: "Rendez-vous ce mois",
    },
    {
      title: "Produits",
      value: products?.length || 0,
      icon: Package,
      description: "Produits en catalogue",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analyses</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques Mensuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Commandes Livrées</p>
                  <p className="text-2xl font-bold">
                    {orders?.filter(o => o.status === 'delivered').length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">En Cours</p>
                  <p className="text-2xl font-bold">
                    {orders?.filter(o => o.status === 'confirmed' || o.status === 'shipped').length || 0}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">RDV Confirmés</p>
                  <p className="text-2xl font-bold">
                    {appointments?.filter(a => a.status === 'confirmed').length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">RDV Terminés</p>
                  <p className="text-2xl font-bold">
                    {appointments?.filter(a => a.status === 'completed').length || 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

