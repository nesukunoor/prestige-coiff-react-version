import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

// Helper to generate unique order code
function generateOrderCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PC-${timestamp}-${random}`;
}

// Helper to get current month in YYYYMM format
function getCurrentMonth(): number {
  const now = new Date();
  return now.getFullYear() * 100 + (now.getMonth() + 1);
}

// Admin procedure - authentication handled by frontend LocalAuth
// Backend procedures are public since auth is client-side
const adminProcedure = publicProcedure;

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Products router
  products: router({
    list: publicProcedure.query(async () => {
      return await db.getAllProducts();
    }),
    
    featured: publicProcedure.query(async () => {
      return await db.getFeaturedProducts();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number(),
        category: z.string(),
        imageUrl: z.string().optional(),
        stock: z.number().default(0),
        inStock: z.boolean().default(true),
        featured: z.boolean().default(false),
      }))
      .mutation(async ({ input }) => {
        await db.createProduct(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        category: z.string().optional(),
        imageUrl: z.string().optional(),
        stock: z.number().optional(),
        inStock: z.boolean().optional(),
        featured: z.boolean().optional(),
        promotionPrice: z.number().optional(),
        promotionActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateProduct(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProduct(input.id);
        return { success: true };
      }),
  }),

  // Services router
  services: router({
    list: publicProcedure.query(async () => {
      return await db.getAllServices();
    }),
    
    active: publicProcedure.query(async () => {
      return await db.getActiveServices();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getServiceById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number(),
        duration: z.number(),
        active: z.boolean().default(true),
      }))
      .mutation(async ({ input }) => {
        await db.createService(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        duration: z.number().optional(),
        active: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateService(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteService(input.id);
        return { success: true };
      }),
  }),

  // Orders router
  orders: router({
    list: adminProcedure.query(async () => {
      return await db.getAllOrders();
    }),
    
    byMonth: adminProcedure
      .input(z.object({ month: z.number() }))
      .query(async ({ input }) => {
        return await db.getOrdersByMonth(input.month);
      }),
    
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const order = await db.getOrderById(input.id);
        if (!order) return null;
        const items = await db.getOrderItems(input.id);
        return { ...order, items };
      }),
    
    create: publicProcedure
      .input(z.object({
        customerName: z.string(),
        customerEmail: z.string().email().optional(),
        customerPhone: z.string(),
        customerAddress: z.string(),
        items: z.array(z.object({
          productId: z.number(),
          productName: z.string(),
          quantity: z.number(),
          price: z.number(),
        })),
        totalAmount: z.number(),
      }))
      .mutation(async ({ input }) => {
        // Check or create customer
        let customer = await db.getCustomerByPhone(input.customerPhone);
        if (!customer) {
          await db.createCustomer({
            name: input.customerName,
            email: input.customerEmail,
            phone: input.customerPhone,
            address: input.customerAddress,
          });
          customer = await db.getCustomerByPhone(input.customerPhone);
        }
        
        const orderCode = generateOrderCode();
        const month = getCurrentMonth();
        
        // Create order
        const orderResult = await db.createOrder({
          orderCode,
          customerId: customer!.id,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          customerAddress: input.customerAddress,
          totalAmount: input.totalAmount,
          status: 'pending',
          paymentMethod: 'cash',
          paymentStatus: 'pending',
          month,
        });
        
        const orderId = Number((orderResult as any).insertId);
        
        // Create order items
        for (const item of input.items) {
          await db.createOrderItem({
            orderId,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.price * item.quantity,
          });
        }
        
        // Create notification
        await db.createNotification({
          title: 'Nouvelle Commande',
          message: `Nouvelle commande ${orderCode} de ${input.customerName}`,
          type: 'order',
          relatedId: orderId,
          isRead: false,
        });
        
        return { success: true, orderCode };
      }),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned']),
        paymentStatus: z.enum(['pending', 'paid', 'refunded']).optional(),
      }))
      .mutation(async ({ input }) => {
        const order = await db.getOrderById(input.id);
        if (!order) throw new TRPCError({ code: 'NOT_FOUND' });
        
        await db.updateOrderStatus(input.id, input.status, input.paymentStatus);
        
        // Handle revenue tracking
        if (input.status === 'delivered' && input.paymentStatus === 'paid') {
          // Add to revenue
          await db.createRevenue({
            orderId: input.id,
            amount: order.totalAmount,
            type: 'order',
            description: `Commande ${order.orderCode}`,
            month: order.month,
          });
        } else if ((input.status === 'cancelled' || input.status === 'returned') && order.status === 'delivered') {
          // Remove from revenue if previously delivered
          const revenues = await db.getRevenueByMonth(order.month);
          const orderRevenue = revenues.find(r => r.orderId === input.id);
          if (orderRevenue) {
            await db.deleteRevenue(orderRevenue.id);
          }
        }
        
        return { success: true };
      }),
  }),

  // Appointments router
  appointments: router({
    list: adminProcedure.query(async () => {
      return await db.getAllAppointments();
    }),
    
    byMonth: adminProcedure
      .input(z.object({ month: z.number() }))
      .query(async ({ input }) => {
        return await db.getAppointmentsByMonth(input.month);
      }),
    
    create: publicProcedure
      .input(z.object({
        customerName: z.string(),
        customerEmail: z.string().email().optional(),
        customerPhone: z.string(),
        serviceId: z.number(),
        serviceName: z.string(),
        appointmentDate: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Check or create customer
        let customer = await db.getCustomerByPhone(input.customerPhone);
        if (!customer) {
          await db.createCustomer({
            name: input.customerName,
            email: input.customerEmail,
            phone: input.customerPhone,
          });
          customer = await db.getCustomerByPhone(input.customerPhone);
        }
        
        const appointmentDate = new Date(input.appointmentDate);
        const month = appointmentDate.getFullYear() * 100 + (appointmentDate.getMonth() + 1);
        
        const result = await db.createAppointment({
          customerId: customer!.id,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          serviceId: input.serviceId,
          serviceName: input.serviceName,
          appointmentDate,
          status: 'pending',
          notes: input.notes,
          month,
        });
        
        const appointmentId = Number((result as any).insertId);
        
        // Create notification
        await db.createNotification({
          title: 'Nouveau Rendez-vous',
          message: `Nouveau rendez-vous de ${input.customerName} pour ${input.serviceName}`,
          type: 'appointment',
          relatedId: appointmentId,
          isRead: false,
        });
        
        return { success: true };
      }),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
      }))
      .mutation(async ({ input }) => {
        await db.updateAppointmentStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  // Messages router
  messages: router({
    list: adminProcedure.query(async () => {
      return await db.getAllMessages();
    }),
    
    byMonth: adminProcedure
      .input(z.object({ month: z.number() }))
      .query(async ({ input }) => {
        return await db.getMessagesByMonth(input.month);
      }),
    
    create: publicProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        subject: z.string().optional(),
        message: z.string(),
      }))
      .mutation(async ({ input }) => {
        const month = getCurrentMonth();
        
        const result = await db.createMessage({
          ...input,
          status: 'unread',
          month,
        });
        
        const messageId = Number((result as any).insertId);
        
        // Create notification
        await db.createNotification({
          title: 'Nouveau Message',
          message: `Nouveau message de ${input.name}`,
          type: 'message',
          relatedId: messageId,
          isRead: false,
        });
        
        return { success: true };
      }),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['unread', 'read', 'replied']),
      }))
      .mutation(async ({ input }) => {
        await db.updateMessageStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  // Customers router
  customers: router({
    list: adminProcedure.query(async () => {
      return await db.getAllCustomers();
    }),
  }),

  // Revenue router
  revenue: router({
    byMonth: adminProcedure
      .input(z.object({ month: z.number() }))
      .query(async ({ input }) => {
        return await db.getRevenueByMonth(input.month);
      }),
    
    totalByMonth: adminProcedure
      .input(z.object({ month: z.number() }))
      .query(async ({ input }) => {
        return await db.getTotalRevenueByMonth(input.month);
      }),
    
    create: adminProcedure
      .input(z.object({
        amount: z.number(),
        description: z.string(),
        month: z.number(),
      }))
      .mutation(async ({ input }) => {
        await db.createRevenue({
          amount: input.amount,
          type: 'adjustment',
          description: input.description,
          month: input.month,
        });
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteRevenue(input.id);
        return { success: true };
      }),
  }),

  // Notifications router
  notifications: router({
    list: adminProcedure.query(async () => {
      return await db.getAllNotifications();
    }),
    
    unread: adminProcedure.query(async () => {
      return await db.getUnreadNotifications();
    }),
    
    markAsRead: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.id);
        return { success: true };
      }),
  }),

  // Statistics router
  stats: router({
    byMonth: adminProcedure
      .input(z.object({ month: z.number() }))
      .query(async ({ input }) => {
        return await db.getStatsByMonth(input.month);
      }),
    
    dashboard: adminProcedure.query(async () => {
      const currentMonth = getCurrentMonth();
      const stats = await db.getStatsByMonth(currentMonth);
      const unreadNotifications = await db.getUnreadNotifications();
      const recentOrders = await db.getOrdersByMonth(currentMonth);
      const recentAppointments = await db.getAppointmentsByMonth(currentMonth);
      
      return {
        stats,
        unreadNotificationsCount: unreadNotifications.length,
        recentOrders: recentOrders.slice(0, 5),
        recentAppointments: recentAppointments.slice(0, 5),
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;

