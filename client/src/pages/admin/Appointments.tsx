import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Calendar, Clock, User, Mail, Phone, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminAppointments() {
  const utils = trpc.useUtils();
  const { data: appointments, isLoading } = trpc.appointments.list.useQuery();
  const updateStatusMutation = trpc.appointments.updateStatus.useMutation({
    onSuccess: () => {
      utils.appointments.list.invalidate();
      toast.success("Statut mis à jour");
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Rendez-vous</h1>
          <p>Chargement...</p>
        </div>
      </DashboardLayout>
    );
  }

  const pendingCount = appointments?.filter(a => a.status === 'pending').length || 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'confirmed':
        return <Badge variant="default">Confirmé</Badge>;
      case 'completed':
        return <Badge className="bg-green-600">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Rendez-vous</h1>
          <div className="flex items-center gap-2">
            <Badge variant={pendingCount > 0 ? "default" : "secondary"}>
              {pendingCount} en attente
            </Badge>
          </div>
        </div>

        <div className="grid gap-4">
          {appointments?.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {appointment.customerName}
                      {getStatusBadge(appointment.status)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{appointment.serviceName}</p>
                  </div>
                  {appointment.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => updateStatusMutation.mutate({ id: appointment.id, status: 'confirmed' })}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmer
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateStatusMutation.mutate({ id: appointment.id, status: 'cancelled' })}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 text-sm">
                  {appointment.appointmentDate && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(appointment.appointmentDate), "dd/MM/yyyy")}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(appointment.appointmentDate), "HH:mm")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${appointment.customerEmail}`} className="hover:underline">
                      {appointment.customerEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${appointment.customerPhone}`} className="hover:underline">
                      {appointment.customerPhone}
                    </a>
                  </div>
                  {appointment.notes && (
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <p className="text-sm"><strong>Notes:</strong> {appointment.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {!appointments || appointments.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Aucun rendez-vous pour le moment
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

