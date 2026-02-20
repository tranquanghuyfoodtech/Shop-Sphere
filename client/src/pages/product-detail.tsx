import { useRoute } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Truck, ShieldCheck, RefreshCw, Minus, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import NotFound from "@/pages/not-found";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = parseInt(params?.id || "0");
  const { data: product, isLoading } = useProduct(id);
  const { addItem, setIsOpen } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
      </div>
    );
  }

  if (!product) return <NotFound />;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsOpen(true);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        {/* Image Gallery (Simulated) */}
        <div className="product-image-gallery space-y-4">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-muted border border-border/50">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform hover:scale-105 duration-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Simulation of additional images - in a real app these would be multiple images */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-lg bg-muted border border-border/50 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                <img
                  src={product.imageUrl}
                  alt={`${product.name} view ${i}`}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-10 px-0 sm:mt-16 sm:px-0 lg:mt-0">
          <div className="mb-6">
            <Badge variant="secondary" className="mb-3 uppercase tracking-wider text-xs font-semibold px-3 py-1">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-display font-bold tracking-tight text-foreground sm:text-4xl mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-medium tracking-tight text-foreground">
              ${(product.price / 100).toFixed(2)}
            </p>
          </div>

          <Separator className="my-6" />

          <div className="prose prose-sm text-muted-foreground leading-relaxed">
            <p>{product.description}</p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md h-10 w-32">
                <button
                  className="flex-1 h-full flex items-center justify-center hover:bg-muted/50 transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  className="flex-1 h-full flex items-center justify-center hover:bg-muted/50 transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full h-14 text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {product.inStock ? (
                <>
                  <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
                </>
              ) : (
                "Out of Stock"
              )}
            </Button>

            {!product.inStock && (
              <p className="text-destructive text-sm font-medium text-center">
                This item is currently out of stock. Check back later!
              </p>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 gap-4 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30">
                <Truck className="h-5 w-5 text-foreground" />
                <span>Free shipping on all orders over $150</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30">
                <RefreshCw className="h-5 w-5 text-foreground" />
                <span>30-day easy returns & exchanges</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30">
                <ShieldCheck className="h-5 w-5 text-foreground" />
                <span>2-year warranty on all products</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
