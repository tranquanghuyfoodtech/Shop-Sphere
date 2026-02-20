import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;

  const { data: products, isLoading, error } = useProducts(category, search);

  // Derive categories for filter buttons
  const categories = ["all", "clothing", "accessories", "home"];

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      {!category && !search && (
        <div className="relative isolate overflow-hidden bg-primary py-24 sm:py-32">
          {/* Descriptive comment for Unsplash Image */}
          {/* lifestyle e-commerce fashion minimal studio lighting */}
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
            alt="New Arrivals"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30 mix-blend-multiply"
          />
          <div className="container mx-auto px-6 lg:px-8 text-center">
            <div className="mx-auto max-w-2xl">
              <h1 className="text-4xl font-display font-bold tracking-tight text-white sm:text-6xl">
                Elevate Your Everyday
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Discover our curated collection of premium essentials designed for modern living.
                Quality craftsmanship meets timeless design.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 border-none h-12 px-8 text-base">
                  Shop New Arrivals
                </Button>
                <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10 h-12 px-8 text-base bg-transparent">
                  Learn More <span aria-hidden="true" className="ml-2">→</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 pb-6 border-b border-border/50">
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground">
              {search ? `Results for "${search}"` : category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : "Featured Collection"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {products?.length || 0} items available
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={category === cat || (cat === "all" && !category) ? "default" : "outline"}
                size="sm"
                className="rounded-full capitalize px-6"
                asChild
              >
                <a href={cat === "all" ? "/" : `/?category=${cat}`}>
                  {cat}
                </a>
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center text-destructive">
            <h3 className="font-semibold">Failed to load products</h3>
            <p className="mt-2 text-sm opacity-80">Please check your connection and try again.</p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display font-semibold">No products found</h3>
            <p className="mt-2 text-muted-foreground max-w-sm">
              We couldn't find any products matching your criteria. Try clearing filters or searching for something else.
            </p>
            <Button className="mt-8" variant="outline" asChild>
              <a href="/">Clear Filters</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
