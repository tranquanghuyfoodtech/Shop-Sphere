import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { CartSheet } from "./cart-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { itemCount, setIsOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = [
    { href: "/", label: "Shop All" },
    { href: "/?category=clothing", label: "Clothing" },
    { href: "/?category=accessories", label: "Accessories" },
    { href: "/?category=home", label: "Home" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Promo Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-center text-xs font-medium tracking-wide">
        FREE SHIPPING ON ORDERS OVER $150
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile Menu Trigger */}
            <div className="flex lg:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="-ml-2">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.href} 
                        href={link.href}
                        className="text-lg font-medium hover:text-accent transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <div className="flex lg:flex-1">
              <Link href="/" className="-m-1.5 p-1.5 font-display text-2xl font-bold tracking-tight">
                LUMIÈRE
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex lg:gap-x-12">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="text-sm font-medium leading-6 text-foreground/90 hover:text-accent transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex flex-1 items-center justify-end gap-x-4">
              <form onSubmit={handleSearch} className="hidden sm:flex relative w-full max-w-[200px]">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="h-9 w-full rounded-full bg-muted/50 px-4 pr-8 text-sm focus:bg-background transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground">
                  <Search className="h-4 w-4" />
                </button>
              </form>

              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-accent/10 hover:text-accent transition-colors relative"
                  onClick={() => setIsOpen(true)}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span className="sr-only">Items in cart, view bag</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-sm animate-in zoom-in duration-300">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground pt-16 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-1">
              <span className="font-display text-2xl font-bold">LUMIÈRE</span>
              <p className="mt-4 text-primary-foreground/70 text-sm leading-relaxed">
                Curating the finest goods for your modern lifestyle. Quality, sustainability, and design in every piece.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Shop</h3>
              <ul className="space-y-3 text-sm text-primary-foreground/70">
                <li><Link href="/" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link href="/?category=clothing" className="hover:text-white transition-colors">Clothing</Link></li>
                <li><Link href="/?category=accessories" className="hover:text-white transition-colors">Accessories</Link></li>
                <li><Link href="/?category=home" className="hover:text-white transition-colors">Home Goods</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-3 text-sm text-primary-foreground/70">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Newsletter</h3>
              <p className="text-sm text-primary-foreground/70 mb-4">Subscribe for exclusive offers and new arrivals.</p>
              <div className="flex gap-2">
                <Input placeholder="Email address" className="bg-primary-foreground/10 border-primary-foreground/20 text-white placeholder:text-primary-foreground/50 h-10" />
                <Button variant="secondary" className="h-10 px-4">Subscribe</Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
            <p>&copy; {new Date().getFullYear()} Lumière Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Pinterest</a>
            </div>
          </div>
        </div>
      </footer>

      <CartSheet />
    </div>
  );
}
