import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Users, Mail, Phone, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function AdminClients() {
  const { data: customers, isLoading } = trpc.customers.list.useQuery();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Clients</h1>
          <p>Chargement...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Clients</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-5 w-5" />
            <span>{customers?.length || 0} clients</span>
          </div>
        </div>

        <div className="grid gap-4">
          {customers?.map((customer) => (
            <Card key={customer.id}>
              <CardHeader>
                <CardTitle className="text-lg">{customer.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                  {customer.address && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{customer.address}</span>
                    </div>
                  )}
                  {customer.createdAt && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Client depuis: {format(new Date(customer.createdAt), "dd/MM/yyyy")}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {!customers || customers.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Aucun client pour le moment
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

