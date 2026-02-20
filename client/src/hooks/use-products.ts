import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateOrderInput } from "@shared/routes";

// GET /api/products
export function useProducts(category?: string, search?: string) {
  return useQuery({
    queryKey: [api.products.list.path, category, search],
    queryFn: async () => {
      const url = new URL(window.location.origin + api.products.list.path);
      if (category) url.searchParams.append("category", category);
      if (search) url.searchParams.append("search", search);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      
      const data = await res.json();
      return api.products.list.responses[200].parse(data);
    },
  });
}

// GET /api/products/:id
export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch product");
      
      const data = await res.json();
      return api.products.get.responses[200].parse(data);
    },
    enabled: !!id,
  });
}

// POST /api/orders
export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateOrderInput) => {
      // Validate with shared schema before sending
      const validated = api.orders.create.input.parse(data);
      
      const res = await fetch(api.orders.create.path, {
        method: api.orders.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.orders.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create order");
      }
      
      return api.orders.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      // Invalidate products in case stock changed (if we were tracking stock decrement)
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
    },
  });
}

// GET /api/orders/:id
export function useOrder(id: number) {
  return useQuery({
    queryKey: [api.orders.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.orders.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch order");
      
      return await res.json(); // Complex type, let's trust the backend structure for now or define a specific schema if needed
    },
    enabled: !!id,
  });
}
