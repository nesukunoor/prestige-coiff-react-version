import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Mail, Phone, User, Calendar, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminMessages() {
  const utils = trpc.useUtils();
  const { data: messages, isLoading } = trpc.messages.list.useQuery();
  const updateStatusMutation = trpc.messages.updateStatus.useMutation({
    onSuccess: () => {
      utils.messages.list.invalidate();
      toast.success("Message marqué comme lu");
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p>Chargement...</p>
        </div>
      </DashboardLayout>
    );
  }

  const unreadCount = messages?.filter(m => m.status === 'unread').length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Messages</h1>
          <div className="flex items-center gap-2">
            <Badge variant={unreadCount > 0 ? "default" : "secondary"}>
              {unreadCount} non lu{unreadCount !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>

        <div className="grid gap-4">
          {messages?.map((message) => (
            <Card key={message.id} className={message.status === 'unread' ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {message.name}
                      {message.status === 'unread' && (
                        <Badge variant="default" className="text-xs">Nouveau</Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{message.subject}</p>
                  </div>
                  {message.status === 'unread' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatusMutation.mutate({ id: message.id, status: 'read' })}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marquer comme lu
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  
                  <div className="grid gap-2 text-sm text-muted-foreground border-t pt-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${message.email}`} className="hover:underline">
                        {message.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${message.phone}`} className="hover:underline">
                        {message.phone}
                      </a>
                    </div>
                    {message.createdAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(message.createdAt), "dd/MM/yyyy 'à' HH:mm")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {!messages || messages.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Aucun message pour le moment
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

