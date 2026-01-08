import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Package, ShoppingCart, Calendar, MessageSquare, TrendingUp, AlertCircle } from "lucide-react";
import { useMemo } from "react";

export default function AdminDashboard() {
  const { data: dashboardData, isLoading } = trpc.stats.dashboard.useQuery();

  const currentMonth = useMemo(() => {
    const now = new Date();
    return now.getFullYear() * 100 + (now.getMonth() + 1);
  }, []);

  const formatMonth = (month: number) => {
    const year = Math.floor(month / 100);
    const monthNum = month % 100;
    const date = new Date(year, monthNum - 1);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const stats = [
    {
      title: "Commandes du Mois",
      value: dashboardData?.stats?.orders || 0,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Revenus du Mois",
      value: `${((dashboardData?.stats?.revenue || 0) / 1000).toFixed(3)} TND`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Rendez-vous",
      value: dashboardData?.stats?.appointments || 0,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Messages",
      value: dashboardData?.stats?.messages || 0,
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord</h1>
          <p className="text-muted-foreground mt-2">
            Vue d'ensemble de votre activité - {formatMonth(currentMonth)}
          </p>
        </div>

        {/* Notifications Alert */}
        {dashboardData && dashboardData.unreadNotificationsCount > 0 && (
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-900 dark:text-orange-100">
                    Vous avez {dashboardData.unreadNotificationsCount} notification(s) non lue(s)
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Consultez vos notifications pour rester à jour
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold mt-2">{stat.value}</p>
                      </div>
                      <div className={`${stat.bgColor} p-3 rounded-full`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Commandes Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : dashboardData?.recentOrders && dashboardData.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{order.orderCode}</p>
                        <p className="text-sm text-muted-foreground">{order.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{(order.totalAmount / 1000).toFixed(3)} TND</p>
                        <p className={`text-xs ${
                          order.status === 'delivered' ? 'text-green-600' :
                          order.status === 'cancelled' ? 'text-red-600' :
                          'text-orange-600'
                        }`}>
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Aucune commande récente
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Rendez-vous Récents</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : dashboardData?.recentAppointments && dashboardData.recentAppointments.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentAppointments.map(appointment => (
                    <div key={appointment.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{appointment.customerName}</p>
                        <p className="text-sm text-muted-foreground">{appointment.serviceName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          {new Date(appointment.appointmentDate).toLocaleDateString('fr-FR')}
                        </p>
                        <p className={`text-xs ${
                          appointment.status === 'completed' ? 'text-green-600' :
                          appointment.status === 'cancelled' ? 'text-red-600' :
                          appointment.status === 'confirmed' ? 'text-blue-600' :
                          'text-orange-600'
                        }`}>
                          {appointment.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Aucun rendez-vous récent
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

