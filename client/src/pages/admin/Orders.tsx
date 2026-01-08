import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Eye, Package } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export default function AdminOrders() {
  const utils = trpc.useUtils();
  const { data: orders, isLoading } = trpc.orders.list.useQuery();
  const updateOrderStatus = trpc.orders.updateStatus.useMutation();

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: orderDetails } = trpc.orders.getById.useQuery(
    { id: selectedOrder?.id || 0 },
    { enabled: !!selectedOrder }
  );

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (filterStatus === "all") return orders;
    return orders.filter(order => order.status === filterStatus);
  }, [orders, filterStatus]);

  const handleStatusChange = async (orderId: number, status: string, paymentStatus?: string) => {
    try {
      await updateOrderStatus.mutateAsync({
        id: orderId,
        status: status as any,
        paymentStatus: paymentStatus as any,
      });
      toast.success("Statut mis à jour avec succès");
      utils.orders.list.invalidate();
      utils.orders.getById.invalidate({ id: orderId });
      utils.stats.dashboard.invalidate();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'confirmed': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'shipped': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      case 'delivered': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'returned': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'shipped': return 'Expédié';
      case 'delivered': return 'Livré';
      case 'cancelled': return 'Annulé';
      case 'returned': return 'Retourné';
      default: return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Commandes</h1>
            <p className="text-muted-foreground mt-2">
              Suivez et gérez toutes les commandes
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-4 items-center">
          <span className="text-sm font-medium">Filtrer par statut:</span>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmé</SelectItem>
              <SelectItem value="shipped">Expédié</SelectItem>
              <SelectItem value="delivered">Livré</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
              <SelectItem value="returned">Retourné</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-bold text-lg">{order.orderCode}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === 'paid' ? 'text-green-600 bg-green-100' :
                          order.paymentStatus === 'refunded' ? 'text-red-600 bg-red-100' :
                          'text-orange-600 bg-orange-100'
                        }`}>
                          {order.paymentStatus === 'paid' ? 'Payé' :
                           order.paymentStatus === 'refunded' ? 'Remboursé' :
                           'Non payé'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Client:</span>
                          <p className="font-medium">{order.customerName}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Téléphone:</span>
                          <p className="font-medium">{order.customerPhone}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Date:</span>
                          <p className="font-medium">
                            {new Date(order.createdAt!).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total:</span>
                          <p className="font-bold text-lg">{(order.totalAmount / 1000).toFixed(3)} TND</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Détails
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Aucune commande</h3>
              <p className="text-muted-foreground">
                {filterStatus === "all" 
                  ? "Aucune commande pour le moment"
                  : `Aucune commande avec le statut "${getStatusLabel(filterStatus)}"`
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Order Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Détails de la commande {selectedOrder?.orderCode}</DialogTitle>
            </DialogHeader>
            {orderDetails && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold mb-3">Informations client</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Nom:</span>
                      <p className="font-medium">{orderDetails.customerName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium">{orderDetails.customerEmail || "-"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Téléphone:</span>
                      <p className="font-medium">{orderDetails.customerPhone}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Adresse:</span>
                      <p className="font-medium">{orderDetails.customerAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-3">Articles</h3>
                  <div className="space-y-2">
                    {orderDetails.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantité: {item.quantity} × {(item.price / 1000).toFixed(3)} TND
                          </p>
                        </div>
                        <p className="font-bold">{(item.totalPrice / 1000).toFixed(3)} TND</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 text-lg font-bold">
                    <span>Total:</span>
                    <span>{(orderDetails.totalAmount / 1000).toFixed(3)} TND</span>
                  </div>
                </div>

                {/* Status Management */}
                <div>
                  <h3 className="font-semibold mb-3">Gestion du statut</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Statut de la commande</label>
                      <Select
                        value={orderDetails.status}
                        onValueChange={(value) => handleStatusChange(orderDetails.id, value, orderDetails.paymentStatus)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="confirmed">Confirmé</SelectItem>
                          <SelectItem value="shipped">Expédié</SelectItem>
                          <SelectItem value="delivered">Livré</SelectItem>
                          <SelectItem value="cancelled">Annulé</SelectItem>
                          <SelectItem value="returned">Retourné</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Statut du paiement</label>
                      <Select
                        value={orderDetails.paymentStatus}
                        onValueChange={(value) => handleStatusChange(orderDetails.id, orderDetails.status, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="paid">Payé</SelectItem>
                          <SelectItem value="refunded">Remboursé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

