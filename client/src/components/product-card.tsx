import { type Product } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ShoppingBag, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, setIsOpen } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setIsOpen(true);
  };

  return (
    <div className="group relative flex flex-col h-full bg-card rounded-xl overflow-hidden border border-border/40 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-border/80 hover:-translate-y-1">
      {/* Image Container */}
      <Link href={`/product/${product.id}`} className="aspect-[4/5] bg-muted relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button 
            size="icon" 
            variant="secondary" 
            className="rounded-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="sr-only">Add to cart</span>
          </Button>
          <Button 
            size="icon" 
            variant="secondary" 
            className="rounded-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View Details</span>
          </Button>
        </div>

        {!product.inStock && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{product.category}</p>
        </div>
        <Link href={`/product/${product.id}`} className="block group-hover:text-accent transition-colors">
          <h3 className="font-display font-semibold text-lg leading-tight text-foreground">{product.name}</h3>
        </Link>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <p className="text-lg font-medium text-foreground">
            ${(product.price / 100).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
