import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  products, InsertProduct,
  services, InsertService,
  customers, InsertCustomer,
  orders, InsertOrder,
  orderItems, InsertOrderItem,
  appointments, InsertAppointment,
  messages, InsertMessage,
  revenue, InsertRevenue,
  notifications, InsertNotification
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ PRODUCTS ============
export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products).orderBy(desc(products.createdAt));
}

export async function getFeaturedProducts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products).where(eq(products.featured, true));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(product);
  return result;
}

export async function updateProduct(id: number, product: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set({ ...product, updatedAt: new Date() }).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(products).where(eq(products.id, id));
}

// ============ SERVICES ============
export async function getAllServices() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(services).orderBy(desc(services.createdAt));
}

export async function getActiveServices() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(services).where(eq(services.active, true));
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createService(service: InsertService) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(services).values(service);
  return result;
}

export async function updateService(id: number, service: Partial<InsertService>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(services).set(service).where(eq(services.id, id));
}

export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(services).where(eq(services.id, id));
}

// ============ CUSTOMERS ============
export async function getAllCustomers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(customers).orderBy(desc(customers.createdAt));
}

export async function getCustomerById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getCustomerByPhone(phone: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(customers).where(eq(customers.phone, phone)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createCustomer(customer: InsertCustomer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(customers).values(customer);
  return result;
}

// ============ ORDERS ============
export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrdersByMonth(month: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders).where(eq(orders.month, month)).orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getOrderByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(orders).where(eq(orders.orderCode, code)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(order);
  return result;
}

export async function updateOrderStatus(id: number, status: string, paymentStatus?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: any = { status };
  if (status === 'shipped') updateData.shippedAt = new Date();
  if (status === 'delivered') updateData.deliveredAt = new Date();
  if (paymentStatus) updateData.paymentStatus = paymentStatus;
  await db.update(orders).set(updateData).where(eq(orders.id, id));
}

// ============ ORDER ITEMS ============
export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

export async function createOrderItem(item: InsertOrderItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orderItems).values(item);
  return result;
}

// ============ APPOINTMENTS ============
export async function getAllAppointments() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(appointments).orderBy(desc(appointments.appointmentDate));
}

export async function getAppointmentsByMonth(month: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(appointments).where(eq(appointments.month, month)).orderBy(desc(appointments.appointmentDate));
}

export async function getAppointmentById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createAppointment(appointment: InsertAppointment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(appointments).values(appointment);
  return result;
}

export async function updateAppointmentStatus(id: number, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(appointments).set({ status }).where(eq(appointments.id, id));
}

// ============ MESSAGES ============
export async function getAllMessages() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(messages).orderBy(desc(messages.createdAt));
}

export async function getMessagesByMonth(month: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(messages).where(eq(messages.month, month)).orderBy(desc(messages.createdAt));
}

export async function createMessage(message: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(messages).values(message);
  return result;
}

export async function updateMessageStatus(id: number, status: 'unread' | 'read' | 'replied') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(messages).set({ status }).where(eq(messages.id, id));
}

// ============ REVENUE ============
export async function getRevenueByMonth(month: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(revenue).where(eq(revenue.month, month));
}

export async function getTotalRevenueByMonth(month: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ total: sql<number>`SUM(${revenue.amount})` })
    .from(revenue)
    .where(eq(revenue.month, month));
  return result[0]?.total || 0;
}

export async function createRevenue(rev: InsertRevenue) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(revenue).values(rev);
  return result;
}

export async function deleteRevenue(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(revenue).where(eq(revenue.id, id));
}

// ============ NOTIFICATIONS ============
export async function getAllNotifications() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notifications).orderBy(desc(notifications.createdAt));
}

export async function getUnreadNotifications() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notifications).where(eq(notifications.isRead, false)).orderBy(desc(notifications.createdAt));
}

export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(notifications).values(notification);
  return result;
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
}

// ============ STATISTICS ============
export async function getStatsByMonth(month: number) {
  const db = await getDb();
  if (!db) return null;
  
  const totalOrders = await db.select({ count: sql<number>`COUNT(*)` })
    .from(orders)
    .where(eq(orders.month, month));
  
  const totalRevenue = await getTotalRevenueByMonth(month);
  
  const totalAppointments = await db.select({ count: sql<number>`COUNT(*)` })
    .from(appointments)
    .where(eq(appointments.month, month));
  
  const totalMessages = await db.select({ count: sql<number>`COUNT(*)` })
    .from(messages)
    .where(eq(messages.month, month));
  
  return {
    orders: totalOrders[0]?.count || 0,
    revenue: totalRevenue,
    appointments: totalAppointments[0]?.count || 0,
    messages: totalMessages[0]?.count || 0,
  };
}

