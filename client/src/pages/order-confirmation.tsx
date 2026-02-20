import { useRoute, Link } from "wouter";
import { useOrder } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, ArrowRight, Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";

export default function OrderConfirmation() {
  const [, params] = useRoute("/order-confirmation/:id");
  const id = parseInt(params?.id || "0");
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
      </div>
    );
  }

  if (!order) return <NotFound />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-border/50 max-w-2xl w-full text-center animate-in fade-in zoom-in duration-500">
        <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
          Thank you for your order!
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          We've received your order #{order.id} and sent a confirmation email to <span className="font-medium text-foreground">{order.customerEmail}</span>.
        </p>

        <div className="bg-muted/30 rounded-xl p-6 mb-8 text-left border border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Order Details</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium capitalize text-green-600">{order.status}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Order Date</p>
              <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Shipping To</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Amount</p>
              <p className="font-medium">${(order.totalAmount / 100).toFixed(2)}</p>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p className="mb-1 font-medium text-foreground">Shipping Address:</p>
            <p className="whitespace-pre-line leading-relaxed">{order.customerAddress}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="h-12 px-8">
            <Link href="/">
              Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-12 px-8">
            View Order Status
          </Button>
        </div>
      </div>
    </div>
  );
}
