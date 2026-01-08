import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Appointment() {
  const [, setLocation] = useLocation();
  const { data: services, isLoading } = trpc.services.active.useQuery();
  const createAppointment = trpc.appointments.create.useMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceId: "",
    date: "",
    time: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.serviceId || !formData.date || !formData.time) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const selectedService = services?.find(s => s.id === parseInt(formData.serviceId));
    if (!selectedService) {
      toast.error("Service invalide");
      return;
    }

    const appointmentDateTime = `${formData.date}T${formData.time}:00`;

    try {
      await createAppointment.mutateAsync({
        customerName: formData.name,
        customerEmail: formData.email || undefined,
        customerPhone: formData.phone,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        appointmentDate: appointmentDateTime,
        notes: formData.notes || undefined,
      });

      toast.success("Rendez-vous créé avec succès! Nous vous contacterons pour confirmation.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        serviceId: "",
        date: "",
        time: "",
        notes: "",
      });
      
      // Redirect to home after 2 seconds
      setTimeout(() => setLocation("/"), 2000);
    } catch (error) {
      toast.error("Erreur lors de la création du rendez-vous");
      console.error(error);
    }
  };

  // Generate time slots from 9:00 to 18:00
  const timeSlots = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 border-b border-primary-foreground/10">
        <div className="container">
          <div className="flex items-center justify-between h-20">
            <Link href="/">
              <img src="/logo1.png" alt="Prestige Coiff & Co" className="h-16 cursor-pointer" />
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Prendre Rendez-vous</h1>
            <p className="text-xl text-muted-foreground">
              Réservez votre créneau pour une expérience unique
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Services List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Nos Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-6 bg-muted mb-2"></div>
                          <div className="h-4 bg-muted"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    services?.map(service => (
                      <div key={service.id} className="border-b pb-4 last:border-0">
                        <h3 className="font-bold mb-1">{service.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            {service.duration} min
                          </span>
                          <span className="font-bold text-accent">
                            {(service.price / 1000).toFixed(3)} TND
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de réservation</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Votre nom"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="00 000 000"
                      />
                    </div>

                    {/* Service Selection */}
                    <div>
                      <Label htmlFor="service">Service *</Label>
                      <Select
                        value={formData.serviceId}
                        onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
                        required
                      >
                        <SelectTrigger id="service">
                          <SelectValue placeholder="Sélectionnez un service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services?.map(service => (
                            <SelectItem key={service.id} value={service.id.toString()}>
                              {service.name} - {(service.price / 1000).toFixed(3)} TND
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          required
                          min={today}
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Heure *</Label>
                        <Select
                          value={formData.time}
                          onValueChange={(value) => setFormData({ ...formData, time: value })}
                          required
                        >
                          <SelectTrigger id="time">
                            <SelectValue placeholder="Sélectionnez une heure" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map(time => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes">Notes (optionnel)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Des demandes spéciales ou des informations supplémentaires..."
                        rows={3}
                      />
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> Votre rendez-vous sera confirmé par notre équipe dans les plus brefs délais. 
                        Nous vous contacterons par téléphone pour confirmer votre réservation.
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={createAppointment.isPending}
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      {createAppointment.isPending ? "Réservation en cours..." : "Réserver"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

