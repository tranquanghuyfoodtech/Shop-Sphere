import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";

export function CartSheet() {
  const { items, removeItem, updateQuantity, cartTotal, isOpen, setIsOpen } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    setIsOpen(false);
    setLocation("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-border/40 shadow-2xl">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2 font-display text-2xl">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">Your bag is empty</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button 
              onClick={() => setIsOpen(false)} 
              className="mt-4 min-w-[150px]"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="py-6 space-y-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    {/* Image */}
                    <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium">
                        <h3 className="line-clamp-2 pr-4 font-display text-lg">
                          <Link href={`/product/${item.product.id}`} onClick={() => setIsOpen(false)}>
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="ml-4">${(item.product.price / 100).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground capitalize">{item.product.category}</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border rounded-md h-8">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 h-full hover:bg-muted/50 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 h-full hover:bg-muted/50 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive p-0 h-auto font-normal text-xs hover:bg-transparent"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1.5" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t bg-muted/20 p-6 space-y-4">
              <div className="flex justify-between text-base font-medium">
                <p>Subtotal</p>
                <p>${(cartTotal / 100).toFixed(2)}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="mt-6">
                <Button className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20" onClick={handleCheckout}>
                  Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <div className="mt-4 flex justify-center text-center text-sm text-muted-foreground">
                  <p>
                    or{" "}
                    <button
                      type="button"
                      className="font-medium text-primary hover:text-primary/80"
                      onClick={() => setIsOpen(false)}
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
