import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api, createOrderInputSchema } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.products.list.path, async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get(api.products.get.path, async (req, res) => {
    try {
      const product = await storage.getProduct(Number(req.params.id));
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error(`Error fetching product ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post(api.orders.create.path, async (req, res) => {
    try {
      const input = createOrderInputSchema.parse(req.body);
      
      // Calculate total and priceAtTime for items
      let totalAmount = 0;
      const orderItemsData = [];
      
      for (const item of input.items) {
        const product = await storage.getProduct(item.productId);
        if (!product) {
          return res.status(400).json({ message: `Product ${item.productId} not found` });
        }
        totalAmount += product.price * item.quantity;
        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          priceAtTime: product.price,
        });
      }

      const orderData = {
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerAddress: input.customerAddress,
        totalAmount,
      };

      const order = await storage.createOrder(orderData, orderItemsData);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Error creating order:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.orders.get.path, async (req, res) => {
    try {
      const order = await storage.getOrder(Number(req.params.id));
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      console.error(`Error fetching order ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Seed data function to ensure we have products to display
  await seedProducts().catch(console.error);

  return httpServer;
}

async function seedProducts() {
  const existing = await storage.getProducts();
  if (existing.length === 0) {
    console.log("Seeding products into database...");
    const { db } = await import("./db");
    const { products } = await import("@shared/schema");
    
    await db.insert(products).values([
      {
        name: "Wireless Noise-Cancelling Headphones",
        description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life.",
        price: 29999, // $299.99
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        category: "Audio",
        inStock: true,
      },
      {
        name: "Smart Watch Series 8",
        description: "Advanced health tracking, cellular connectivity, and always-on retina display.",
        price: 39900,
        imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
        category: "Wearables",
        inStock: true,
      },
      {
        name: "Mechanical Keyboard",
        description: "Customizable mechanical keyboard with tactile switches and RGB backlighting.",
        price: 14950,
        imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
        category: "Accessories",
        inStock: true,
      },
      {
        name: "4K Monitor 27-inch",
        description: "Ultra-sharp 4K resolution monitor with color accuracy perfect for creators.",
        price: 45000,
        imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
        category: "Displays",
        inStock: true,
      },
      {
        name: "Ergonomic Office Chair",
        description: "Fully adjustable ergonomic chair designed for all-day comfort and support.",
        price: 59999,
        imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80",
        category: "Furniture",
        inStock: true,
      },
      {
        name: "Portable SSD 1TB",
        description: "Lightning-fast portable solid state drive for backing up your important files.",
        price: 12999,
        imageUrl: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&q=80",
        category: "Storage",
        inStock: true,
      }
    ]);
    console.log("Seeding complete.");
  }
}
