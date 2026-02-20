import { db } from "./db";
import {
  products,
  orders,
  orderItems,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createOrder(order: InsertOrder, items: Omit<InsertOrderItem, 'orderId'>[]): Promise<Order & { items: (OrderItem & { product: Product })[] }>;
  getOrder(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createOrder(
    orderData: InsertOrder,
    itemsData: Omit<InsertOrderItem, 'orderId'>[]
  ): Promise<Order & { items: (OrderItem & { product: Product })[] }> {
    return await db.transaction(async (tx) => {
      const [order] = await tx.insert(orders).values(orderData).returning();

      const createdItems = [];
      for (const item of itemsData) {
        const [createdItem] = await tx.insert(orderItems).values({ ...item, orderId: order.id }).returning();
        const [product] = await tx.select().from(products).where(eq(products.id, item.productId));
        createdItems.push({ ...createdItem, product });
      }

      return { ...order, items: createdItems };
    });
  }

  async getOrder(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
    
    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const [product] = await db.select().from(products).where(eq(products.id, item.productId));
        return { ...item, product };
      })
    );

    return { ...order, items: itemsWithProducts };
  }
}

export const storage = new DatabaseStorage();
