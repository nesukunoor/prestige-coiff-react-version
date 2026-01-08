import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocalAuthProvider } from "./contexts/LocalAuthContext";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Appointment from "./pages/Appointment";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminClients from "./pages/admin/Clients";
import AdminAppointments from "./pages/admin/Appointments";
import AdminMessages from "./pages/admin/Messages";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path={"/"} component={Home} />
      <Route path={"/produits"} component={Products} />
      <Route path={"/produit/:id"} component={ProductDetail} />
      <Route path={"/rendez-vous"} component={Appointment} />
      <Route path={"/contact"} component={Contact} />
      
      {/* Admin Login */}
      <Route path={"/admin/login"} component={AdminLogin} />
      
      {/* Admin Routes */}
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/produits"} component={AdminProducts} />
      <Route path={"/admin/commandes"} component={AdminOrders} />
      <Route path={"/admin/clients"} component={AdminClients} />
      <Route path={"/admin/rendez-vous"} component={AdminAppointments} />
      <Route path={"/admin/messages"} component={AdminMessages} />
      <Route path={"/admin/analyses"} component={AdminAnalytics} />
      <Route path={"/admin/parametres"} component={AdminSettings} />
      
      {/* 404 */}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LocalAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LocalAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

