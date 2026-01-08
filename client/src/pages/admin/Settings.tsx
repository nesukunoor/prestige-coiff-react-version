import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings as SettingsIcon, User, Lock } from "lucide-react";

export default function AdminSettings() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Paramètres</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations du Compte
              </CardTitle>
              <CardDescription>
                Gérez les informations de votre compte administrateur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Nom d'utilisateur</p>
                  <p className="text-sm text-muted-foreground">admin</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Rôle</p>
                  <p className="text-sm text-muted-foreground">Administrateur</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Sécurité
              </CardTitle>
              <CardDescription>
                Paramètres de sécurité et d'authentification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Authentification</p>
                  <p className="text-sm text-muted-foreground">
                    Authentification locale activée
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Mot de passe</p>
                  <p className="text-sm text-muted-foreground">
                    Pour modifier le mot de passe, veuillez éditer le fichier LocalAuthContext.tsx
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Configuration du Site
              </CardTitle>
              <CardDescription>
                Paramètres généraux du site web
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Nom du site</p>
                  <p className="text-sm text-muted-foreground">Prestige Coiff & Co</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Devise</p>
                  <p className="text-sm text-muted-foreground">Dinar Tunisien (TND)</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Mode de paiement</p>
                  <p className="text-sm text-muted-foreground">Paiement à la livraison</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

