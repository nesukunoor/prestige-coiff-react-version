import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, boolean, datetime } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Products table for barber shop products
 */
export const products = mysqlTable("products", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: int("price").notNull(), // Price in millimes (1 TND = 1000 millimes)
  category: varchar("category", { length: 100 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }),
  stock: int("stock").default(0).notNull(),
  inStock: boolean("inStock").default(true).notNull(),
  featured: boolean("featured").default(false).notNull(),
  promotionPrice: int("promotionPrice"), // Promotional price in millimes
  promotionActive: boolean("promotionActive").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Services table for barber shop services
 */
export const services = mysqlTable("services", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: int("price").notNull(), // Price in millimes
  duration: int("duration").notNull(), // Duration in minutes
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Customers table for tracking customer information
 */
export const customers = mysqlTable("customers", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

/**
 * Orders table for product orders
 */
export const orders = mysqlTable("orders", {
  id: int("id").primaryKey().autoincrement(),
  orderCode: varchar("orderCode", { length: 20 }).notNull().unique(),
  customerId: int("customerId").notNull(),
  customerName: varchar("customerName", { length: 100 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerPhone: varchar("customerPhone", { length: 20 }).notNull(),
  customerAddress: text("customerAddress").notNull(),
  totalAmount: int("totalAmount").notNull(), // Total in millimes
  status: mysqlEnum("status", ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }).default("cash").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "refunded"]).default("pending").notNull(),
  shippedAt: datetime("shippedAt"),
  deliveredAt: datetime("deliveredAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  month: int("month").notNull(), // Month as YYYYMM format
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items table for products in each order
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  quantity: int("quantity").notNull(),
  price: int("price").notNull(), // Price per unit in millimes
  totalPrice: int("totalPrice").notNull(), // Total price in millimes
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Appointments table for service bookings
 */
export const appointments = mysqlTable("appointments", {
  id: int("id").primaryKey().autoincrement(),
  customerId: int("customerId"),
  customerName: varchar("customerName", { length: 100 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerPhone: varchar("customerPhone", { length: 20 }).notNull(),
  serviceId: int("serviceId").notNull(),
  serviceName: varchar("serviceName", { length: 255 }).notNull(),
  appointmentDate: datetime("appointmentDate").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
  month: int("month").notNull(), // Month as YYYYMM format
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

/**
 * Messages/Contact form submissions
 */
export const messages = mysqlTable("messages", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["unread", "read", "replied"]).default("unread").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  month: int("month").notNull(), // Month as YYYYMM format
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Revenue tracking table
 */
export const revenue = mysqlTable("revenue", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("orderId"),
  amount: int("amount").notNull(), // Amount in millimes
  type: mysqlEnum("type", ["order", "adjustment"]).default("order").notNull(),
  description: text("description"),
  month: int("month").notNull(), // Month as YYYYMM format
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Revenue = typeof revenue.$inferSelect;
export type InsertRevenue = typeof revenue.$inferInsert;

/**
 * Notifications table for admin notifications
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["order", "appointment", "message", "stock", "system"]).notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  relatedId: int("relatedId"), // ID of related order/appointment/message
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

