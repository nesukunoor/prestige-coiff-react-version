import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Link, useParams, useLocation } from "wouter";
import { ArrowLeft, ShoppingCart, Minus, Plus, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const productId = parseInt(params.id || "0");
  
  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: productId });
  const createOrder = trpc.orders.create.useMutation();

  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, Math.min(product?.stock || 1, quantity + delta)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;

    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const price = product.promotionActive && product.promotionPrice 
      ? product.promotionPrice 
      : product.price;

    try {
      const result = await createOrder.mutateAsync({
        customerName: formData.name,
        customerEmail: formData.email || undefined,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        items: [{
          productId: product.id,
          productName: product.name,
          quantity,
          price,
        }],
        totalAmount: price * quantity,
      });

      toast.success(`Commande créée avec succès! Code: ${result.orderCode}`);
      
      // Reset form
      setFormData({ name: "", email: "", phone: "", address: "" });
      setQuantity(1);
      
      // Redirect to home after 2 seconds
      setTimeout(() => setLocation("/"), 2000);
    } catch (error) {
      toast.error("Erreur lors de la création de la commande");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground sticky top-0 z-50 border-b border-primary-foreground/10">
          <div className="container">
            <div className="flex items-center justify-between h-20">
              <Link href="/">
                <img src="/logo1.png" alt="Prestige Coiff & Co" className="h-16 cursor-pointer" />
              </Link>
            </div>
          </div>
        </header>
        <div className="container py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-muted w-64 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="h-96 bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-12 bg-muted"></div>
                <div className="h-24 bg-muted"></div>
                <div className="h-64 bg-muted"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground sticky top-0 z-50 border-b border-primary-foreground/10">
          <div className="container">
            <div className="flex items-center justify-between h-20">
              <Link href="/">
                <img src="/logo1.png" alt="Prestige Coiff & Co" className="h-16 cursor-pointer" />
              </Link>
            </div>
          </div>
        </header>
        <div className="container py-12 text-center">
          <Package className="w-20 h-20 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Produit non trouvé</h2>
          <Link href="/produits">
            <Button>Retour aux produits</Button>
          </Link>
        </div>
      </div>
    );
  }

  const price = product.promotionActive && product.promotionPrice 
    ? product.promotionPrice 
    : product.price;
  const totalPrice = price * quantity;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 border-b border-primary-foreground/10">
        <div className="container">
          <div className="flex items-center justify-between h-20">
            <Link href="/">
              <img src="/logo1.png" alt="Prestige Coiff & Co" className="h-16 cursor-pointer" />
            </Link>
            
            <Link href="/produits">
              <Button variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="bg-muted rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <ShoppingCart className="w-32 h-32 text-muted-foreground/30" />
                )}
              </div>
              {product.promotionActive && product.promotionPrice && (
                <div className="absolute top-6 right-6 bg-accent text-accent-foreground px-4 py-2 rounded-full font-bold text-lg">
                  -{Math.round((1 - product.promotionPrice / product.price) * 100)}%
                </div>
              )}
            </div>
          </div>

          {/* Product Info & Order Form */}
          <div className="space-y-8">
            <div>
              <div className="text-sm text-muted-foreground uppercase mb-2">{product.category}</div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-baseline gap-4 mb-6">
                {product.promotionActive && product.promotionPrice ? (
                  <>
                    <span className="text-3xl font-bold text-accent">
                      {(product.promotionPrice / 1000).toFixed(3)} TND
                    </span>
                    <span className="text-xl line-through text-muted-foreground">
                      {(product.price / 1000).toFixed(3)} TND
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold">
                    {(product.price / 1000).toFixed(3)} TND
                  </span>
                )}
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              <div className="mt-6 flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  product.inStock 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {product.inStock ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}
                </span>
              </div>
            </div>

            {product.inStock && (
              <Card>
                <CardHeader>
                  <CardTitle>Commander ce produit</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Quantity */}
                    <div>
                      <Label htmlFor="quantity">Quantité</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(1)}
                          disabled={quantity >= product.stock}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Customer Info */}
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

                    <div>
                      <Label htmlFor="address">Adresse de livraison *</Label>
                      <Textarea
                        id="address"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Location"
                        rows={3}
                      />
                    </div>

                    {/* Total */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-2xl font-bold mb-4">
                        <span>Total:</span>
                        <span className="text-accent">{(totalPrice / 1000).toFixed(3)} TND</span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">
                        Paiement à la livraison (espèces)
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={createOrder.isPending}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {createOrder.isPending ? "Commande en cours..." : "Commander"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

