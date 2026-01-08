import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ShoppingCart, Calendar, Star, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Home() {
  const { data: featuredProducts, isLoading: productsLoading } = trpc.products.featured.useQuery();
  const { data: services, isLoading: servicesLoading } = trpc.services.active.useQuery();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 border-b border-primary-foreground/10">
        <div className="container">
          <div className="flex items-center justify-between h-20">
            <Link href="/">
              <img src="/logo1.png" alt="Prestige Coiff & Co" className="h-16 cursor-pointer" />
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#accueil" className="hover:text-accent transition-colors">Accueil</a>
              <a href="#apropos" className="hover:text-accent transition-colors">À Propos</a>
              <a href="#produits" className="hover:text-accent transition-colors">Produits</a>
              <a href="#services" className="hover:text-accent transition-colors">Services</a>
              <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/rendez-vous">
                <Button variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Calendar className="w-4 h-4 mr-2" />
                  Rendez-vous
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="accueil" className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              L'Art du Style au Masculin
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              Découvrez l'excellence du soin capillaire et de la cosmétique masculine. 
              Prestige Coiff & Co allie tradition et innovation pour votre style unique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                <a href="#produits">Découvrir Nos Produits</a>
              </Button>
              <Link href="/rendez-vous">
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8">
                  Prendre Rendez-vous
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="apropos" className="py-20 bg-card">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">À Propos de Nous</h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                Prestige Coiff & Co est rapidement devenu une référence dans le domaine de la coiffure 
                et de la cosmétique masculine en Tunisie. Notre philosophie repose sur l'excellence, 
                l'innovation et le service personnalisé.
              </p>
              <p>
                Nous croyons que chaque homme mérite de se sentir confiant et élégant. C'est pourquoi 
                nous sélectionnons soigneusement nos produits et formons continuellement notre équipe 
                pour vous offrir une expérience unique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="produits" className="py-20 bg-secondary">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Nos Produits</h2>
            <p className="text-xl text-muted-foreground">Découvrez notre sélection de produits premium</p>
          </div>
          
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <Card key={i} className="animate-pulse">
                  <div className="h-64 bg-muted"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted mb-2"></div>
                    <div className="h-4 bg-muted"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.slice(0, 4).map(product => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative overflow-hidden bg-muted h-64 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <ShoppingCart className="w-20 h-20 text-muted-foreground/30" />
                    )}
                    {product.promotionActive && product.promotionPrice && (
                      <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold">
                        Promo
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        {product.promotionActive && product.promotionPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-accent">{(product.promotionPrice / 1000).toFixed(3)} TND</span>
                            <span className="text-sm line-through text-muted-foreground">{(product.price / 1000).toFixed(3)} TND</span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold">{(product.price / 1000).toFixed(3)} TND</span>
                        )}
                      </div>
                      <Link href={`/produit/${product.id}`}>
                        <Button size="sm">Voir</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/produits">
              <Button size="lg" variant="outline">
                Voir Tous les Produits
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Nos Services</h2>
            <p className="text-xl text-muted-foreground">Des prestations professionnelles pour votre style</p>
          </div>

          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-8">
                    <div className="h-12 w-12 bg-muted rounded-full mb-4"></div>
                    <div className="h-6 bg-muted mb-2"></div>
                    <div className="h-4 bg-muted"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {services?.slice(0, 3).map(service => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-xl mb-2">{service.name}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <div className="text-2xl font-bold text-accent mb-2">
                      {(service.price / 1000).toFixed(3)} TND
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {service.duration} min
                    </div>
                    <Link href="/rendez-vous">
                      <Button className="w-full">Réserver</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-secondary">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Contactez-Nous</h2>
            <p className="text-xl text-muted-foreground">Nous sommes à votre écoute</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Nos Coordonnées</h3>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Adresse</h4>
                  <p className="text-muted-foreground">Location</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Téléphone</h4>
                  <p className="text-muted-foreground">00 000 000</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Email</h4>
                  <p className="text-muted-foreground">contact@prestigecoiff.tn</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Horaires</h4>
                  <p className="text-muted-foreground">Lun - Sam: 9h00 - 19h00</p>
                  <p className="text-muted-foreground">Dimanche: Fermé</p>
                </div>
              </div>
            </div>

            <div>
              <Link href="/contact">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4">Envoyez-nous un Message</h3>
                    <p className="text-muted-foreground mb-6">
                      Vous avez une question ou souhaitez prendre rendez-vous ? 
                      N'hésitez pas à nous contacter.
                    </p>
                    <Button className="w-full" size="lg">
                      Formulaire de Contact
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <img src="/logo1.png" alt="Prestige Coiff & Co" className="h-16 mb-4" />
              <p className="text-primary-foreground/80">
                L'art du style au masculin
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Liens Rapides</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#accueil" className="hover:text-accent transition-colors">Accueil</a></li>
                <li><a href="#produits" className="hover:text-accent transition-colors">Produits</a></li>
                <li><a href="#services" className="hover:text-accent transition-colors">Services</a></li>
                <li><a href="#contact" className="hover:text-accent transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Location</li>
                <li>00 000 000</li>
                <li>contact@prestigecoiff.tn</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/60">
            <p>&copy; {new Date().getFullYear()} Prestige Coiff & Co. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

