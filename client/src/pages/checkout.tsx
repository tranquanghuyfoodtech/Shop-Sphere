import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrderInputSchema, type CreateOrderInput } from "@shared/routes";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-products";
import { useLocation } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Lock, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderInputSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerAddress: "",
      items: [],
    },
  });

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-lg py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => setLocation("/")}>Go Shopping</Button>
      </div>
    );
  }

  const onSubmit = (data: Omit<CreateOrderInput, "items">) => {
    const orderData = {
      ...data,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    };

    createOrder(orderData, {
      onSuccess: (order) => {
        clearCart();
        toast({
          title: "Order confirmed!",
          description: `Order #${order.id} has been placed successfully.`,
        });
        setLocation(`/order-confirmation/${order.id}`);
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error placing order",
          description: error.message,
        });
      },
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Button variant="ghost" onClick={() => setLocation("/")} className="mb-8 pl-0 hover:bg-transparent hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Return to Shop
        </Button>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Order Summary (Right Column on Desktop, Top on Mobile) */}
          <section className="lg:col-span-5 lg:col-start-8 bg-white rounded-2xl shadow-sm border border-border/50 p-6 mb-8 lg:mb-0 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-foreground mb-6 font-display">Order Summary</h2>
            
            <ul className="divide-y divide-border/40 mb-6">
              {items.map((item) => (
                <li key={item.product.id} className="flex py-4 gap-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <div className="flex justify-between text-sm font-medium text-foreground">
                      <h3 className="line-clamp-1">{item.product.name}</h3>
                      <p>${(item.product.price * item.quantity / 100).toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Qty {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-3 pt-4 border-t border-border/40">
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Subtotal</p>
                <p className="font-medium">${(cartTotal / 100).toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Shipping</p>
                <p className="font-medium">Free</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Taxes</p>
                <p className="font-medium">$0.00</p>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center">
                <p className="text-base font-bold text-foreground">Total</p>
                <p className="text-xl font-bold font-display text-primary">${(cartTotal / 100).toFixed(2)}</p>
              </div>
            </div>
          </section>

          {/* Checkout Form */}
          <section className="lg:col-span-7 lg:row-start-1">
            <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-6 md:p-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold font-display text-foreground">Checkout</h1>
                <p className="text-muted-foreground mt-1">Please enter your details to complete your purchase.</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Doe" {...field} className="h-11" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="customerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="jane@example.com" type="email" {...field} className="h-11" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Shipping Address</h3>
                    <FormField
                      control={form.control}
                      name="customerAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="123 Main St, Apt 4B, New York, NY 10001" 
                              className="min-h-[100px] resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Payment (Mock) */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Payment Method</h3>
                    <div className="border rounded-xl p-4 bg-muted/30">
                      <RadioGroup defaultValue="card">
                        <div className="flex items-center space-x-3 mb-4">
                          <RadioGroupItem value="card" id="card" />
                          <label htmlFor="card" className="flex items-center cursor-pointer font-medium">
                            <CreditCard className="h-4 w-4 mr-2" /> Credit Card
                          </label>
                        </div>
                      </RadioGroup>
                      
                      <div className="grid grid-cols-1 gap-4 pt-2">
                        <div className="relative">
                          <Input placeholder="Card number" className="pl-10 h-11 bg-white" />
                          <div className="absolute left-3 top-3.5 text-muted-foreground">
                            <CreditCard className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Input placeholder="MM / YY" className="h-11 bg-white" />
                          <Input placeholder="CVC" className="h-11 bg-white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Lock className="h-3 w-3 mr-1" /> Payments are secure and encrypted.
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-semibold shadow-lg shadow-primary/25 mt-6"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                      </>
                    ) : (
                      `Pay $${(cartTotal / 100).toFixed(2)}`
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
