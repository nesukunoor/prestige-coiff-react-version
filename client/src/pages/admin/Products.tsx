import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Package, Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminProducts() {
  const utils = trpc.useUtils();
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const createProduct = trpc.products.create.useMutation();
  const updateProduct = trpc.products.update.useMutation();
  const deleteProduct = trpc.products.delete.useMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
    featured: false,
    promotionPrice: "",
    promotionActive: false,
  });

  const handleOpenDialog = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || "",
        price: (product.price / 1000).toString(),
        category: product.category,
        stock: product.stock.toString(),
        imageUrl: product.imageUrl || "",
        featured: product.featured,
        promotionPrice: product.promotionPrice ? (product.promotionPrice / 1000).toString() : "",
        promotionActive: product.promotionActive,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        imageUrl: "",
        featured: false,
        promotionPrice: "",
        promotionActive: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceInMillimes = Math.round(parseFloat(formData.price) * 1000);
    const promotionPriceInMillimes = formData.promotionPrice 
      ? Math.round(parseFloat(formData.promotionPrice) * 1000) 
      : undefined;

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          name: formData.name,
          description: formData.description,
          price: priceInMillimes,
          category: formData.category,
          stock: parseInt(formData.stock),
          imageUrl: formData.imageUrl || undefined,
          featured: formData.featured,
          inStock: parseInt(formData.stock) > 0,
          promotionPrice: promotionPriceInMillimes,
          promotionActive: formData.promotionActive,
        });
        toast.success("Produit mis à jour avec succès");
      } else {
        await createProduct.mutateAsync({
          name: formData.name,
          description: formData.description,
          price: priceInMillimes,
          category: formData.category,
          stock: parseInt(formData.stock),
          imageUrl: formData.imageUrl || undefined,
          featured: formData.featured,
          inStock: parseInt(formData.stock) > 0,
        });
        toast.success("Produit créé avec succès");
      }

      utils.products.list.invalidate();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement du produit");
      console.error(error);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) return;

    try {
      await deleteProduct.mutateAsync({ id });
      toast.success("Produit supprimé avec succès");
      utils.products.list.invalidate();
    } catch (error) {
      toast.error("Erreur lors de la suppression du produit");
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Produits</h1>
            <p className="text-muted-foreground mt-2">
              Gérez votre catalogue de produits
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Produit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Modifier le produit" : "Nouveau produit"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Catégorie *</Label>
                    <Input
                      id="category"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Prix (TND) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.001"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                      id="stock"
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="imageUrl">URL de l'image</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="featured" className="cursor-pointer">Produit vedette</Label>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Promotion</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="promotionActive"
                      checked={formData.promotionActive}
                      onChange={(e) => setFormData({ ...formData, promotionActive: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="promotionActive" className="cursor-pointer">Activer la promotion</Label>
                  </div>
                  {formData.promotionActive && (
                    <div>
                      <Label htmlFor="promotionPrice">Prix promotionnel (TND)</Label>
                      <Input
                        id="promotionPrice"
                        type="number"
                        step="0.001"
                        value={formData.promotionPrice}
                        onChange={(e) => setFormData({ ...formData, promotionPrice: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
                    {editingProduct ? "Mettre à jour" : "Créer"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted"></div>
                <CardContent className="p-4">
                  <div className="h-6 bg-muted mb-2"></div>
                  <div className="h-4 bg-muted"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <Card key={product.id}>
                <div className="relative bg-muted h-48 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-16 h-16 text-muted-foreground/30" />
                  )}
                  {product.featured && (
                    <div className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-bold">
                      Vedette
                    </div>
                  )}
                  {product.promotionActive && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      Promo
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      {product.promotionActive && product.promotionPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-accent">
                            {(product.promotionPrice / 1000).toFixed(3)} TND
                          </span>
                          <span className="text-sm line-through text-muted-foreground">
                            {(product.price / 1000).toFixed(3)} TND
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold">{(product.price / 1000).toFixed(3)} TND</span>
                      )}
                    </div>
                    <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      Stock: {product.stock}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenDialog(product)} className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deleteProduct.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Aucun produit</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter votre premier produit
              </p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un produit
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

