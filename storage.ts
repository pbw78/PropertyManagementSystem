import {
  users,
  properties,
  tenants,
  contracts,
  invoices,
  maintenanceRequests,
  payments,
  type User,
  type InsertUser,
  type Property,
  type InsertProperty,
  type Tenant,
  type InsertTenant,
  type Contract,
  type InsertContract,
  type Invoice,
  type InsertInvoice,
  type MaintenanceRequest,
  type InsertMaintenanceRequest,
  type Payment,
  type InsertPayment,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  getAllUsers(): Promise<User[]>;

  // Property operations
  getProperty(id: number): Promise<Property | undefined>;
  getPropertyWithRelations(id: number): Promise<any>;
  getAllProperties(): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property>;
  deleteProperty(id: number): Promise<void>;

  // Tenant operations
  getTenant(id: number): Promise<Tenant | undefined>;
  getAllTenants(): Promise<Tenant[]>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  updateTenant(id: number, tenant: Partial<InsertTenant>): Promise<Tenant>;
  deleteTenant(id: number): Promise<void>;

  // Contract operations
  getContract(id: number): Promise<Contract | undefined>;
  getContractWithRelations(id: number): Promise<any>;
  getAllContracts(): Promise<any[]>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: number, contract: Partial<InsertContract>): Promise<Contract>;
  deleteContract(id: number): Promise<void>;

  // Invoice operations
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoiceWithRelations(id: number): Promise<any>;
  getAllInvoices(): Promise<any[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice>;
  deleteInvoice(id: number): Promise<void>;

  // Maintenance operations
  getMaintenanceRequest(id: number): Promise<MaintenanceRequest | undefined>;
  getMaintenanceRequestWithRelations(id: number): Promise<any>;
  getAllMaintenanceRequests(): Promise<any[]>;
  createMaintenanceRequest(request: InsertMaintenanceRequest): Promise<MaintenanceRequest>;
  updateMaintenanceRequest(id: number, request: Partial<InsertMaintenanceRequest>): Promise<MaintenanceRequest>;
  deleteMaintenanceRequest(id: number): Promise<void>;

  // Payment operations
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentWithRelations(id: number): Promise<any>;
  getAllPayments(): Promise<any[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment>;
  deletePayment(id: number): Promise<void>;

  // Dashboard stats
  getDashboardStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...user, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  // Property operations
  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
  }

  async getPropertyWithRelations(id: number): Promise<any> {
    const result = await db.query.properties.findFirst({
      where: eq(properties.id, id),
      with: {
        contracts: {
          with: {
            tenant: true,
          },
        },
        maintenanceRequests: {
          with: {
            tenant: true,
          },
        },
      },
    });
    return result;
  }

  async getAllProperties(): Promise<Property[]> {
    return await db.select().from(properties).orderBy(desc(properties.createdAt));
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db.insert(properties).values(property).returning();
    return newProperty;
  }

  async updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property> {
    const [updatedProperty] = await db
      .update(properties)
      .set({ ...property, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<void> {
    await db.delete(properties).where(eq(properties.id, id));
  }

  // Tenant operations
  async getTenant(id: number): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant || undefined;
  }

  async getAllTenants(): Promise<Tenant[]> {
    return await db.select().from(tenants).orderBy(desc(tenants.createdAt));
  }

  async createTenant(tenant: InsertTenant): Promise<Tenant> {
    const [newTenant] = await db.insert(tenants).values(tenant).returning();
    return newTenant;
  }

  async updateTenant(id: number, tenant: Partial<InsertTenant>): Promise<Tenant> {
    const [updatedTenant] = await db
      .update(tenants)
      .set({ ...tenant, updatedAt: new Date() })
      .where(eq(tenants.id, id))
      .returning();
    return updatedTenant;
  }

  async deleteTenant(id: number): Promise<void> {
    await db.delete(tenants).where(eq(tenants.id, id));
  }

  // Contract operations
  async getContract(id: number): Promise<Contract | undefined> {
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, id));
    return contract || undefined;
  }

  async getContractWithRelations(id: number): Promise<any> {
    const result = await db.query.contracts.findFirst({
      where: eq(contracts.id, id),
      with: {
        property: true,
        tenant: true,
        invoices: true,
      },
    });
    return result;
  }

  async getAllContracts(): Promise<any[]> {
    const result = await db.query.contracts.findMany({
      with: {
        property: true,
        tenant: true,
      },
      orderBy: [desc(contracts.createdAt)],
    });
    return result;
  }

  async createContract(contract: InsertContract): Promise<Contract> {
    const [newContract] = await db.insert(contracts).values(contract).returning();
    
    // Update property status to rented
    await db
      .update(properties)
      .set({ status: "rented", updatedAt: new Date() })
      .where(eq(properties.id, contract.propertyId));
    
    return newContract;
  }

  async updateContract(id: number, contract: Partial<InsertContract>): Promise<Contract> {
    const [updatedContract] = await db
      .update(contracts)
      .set({ ...contract, updatedAt: new Date() })
      .where(eq(contracts.id, id))
      .returning();
    return updatedContract;
  }

  async deleteContract(id: number): Promise<void> {
    // Get contract to update property status
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, id));
    
    await db.delete(contracts).where(eq(contracts.id, id));
    
    // Update property status to available
    if (contract) {
      await db
        .update(properties)
        .set({ status: "available", updatedAt: new Date() })
        .where(eq(properties.id, contract.propertyId));
    }
  }

  // Invoice operations
  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice || undefined;
  }

  async getInvoiceWithRelations(id: number): Promise<any> {
    const result = await db.query.invoices.findFirst({
      where: eq(invoices.id, id),
      with: {
        contract: {
          with: {
            property: true,
            tenant: true,
          },
        },
        payments: true,
      },
    });
    return result;
  }

  async getAllInvoices(): Promise<any[]> {
    const result = await db.query.invoices.findMany({
      with: {
        contract: {
          with: {
            property: true,
            tenant: true,
          },
        },
      },
      orderBy: [desc(invoices.createdAt)],
    });
    return result;
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [newInvoice] = await db.insert(invoices).values(invoice).returning();
    return newInvoice;
  }

  async updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice> {
    const [updatedInvoice] = await db
      .update(invoices)
      .set({ ...invoice, updatedAt: new Date() })
      .where(eq(invoices.id, id))
      .returning();
    return updatedInvoice;
  }

  async deleteInvoice(id: number): Promise<void> {
    await db.delete(invoices).where(eq(invoices.id, id));
  }

  // Maintenance operations
  async getMaintenanceRequest(id: number): Promise<MaintenanceRequest | undefined> {
    const [request] = await db.select().from(maintenanceRequests).where(eq(maintenanceRequests.id, id));
    return request || undefined;
  }

  async getMaintenanceRequestWithRelations(id: number): Promise<any> {
    const result = await db.query.maintenanceRequests.findFirst({
      where: eq(maintenanceRequests.id, id),
      with: {
        property: true,
        tenant: true,
      },
    });
    return result;
  }

  async getAllMaintenanceRequests(): Promise<any[]> {
    const result = await db.query.maintenanceRequests.findMany({
      with: {
        property: true,
        tenant: true,
      },
      orderBy: [desc(maintenanceRequests.createdAt)],
    });
    return result;
  }

  async createMaintenanceRequest(request: InsertMaintenanceRequest): Promise<MaintenanceRequest> {
    const [newRequest] = await db.insert(maintenanceRequests).values(request).returning();
    return newRequest;
  }

  async updateMaintenanceRequest(id: number, request: Partial<InsertMaintenanceRequest>): Promise<MaintenanceRequest> {
    const [updatedRequest] = await db
      .update(maintenanceRequests)
      .set({ ...request, updatedAt: new Date() })
      .where(eq(maintenanceRequests.id, id))
      .returning();
    return updatedRequest;
  }

  async deleteMaintenanceRequest(id: number): Promise<void> {
    await db.delete(maintenanceRequests).where(eq(maintenanceRequests.id, id));
  }

  // Payment operations
  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment || undefined;
  }

  async getPaymentWithRelations(id: number): Promise<any> {
    const result = await db.query.payments.findFirst({
      where: eq(payments.id, id),
      with: {
        invoice: {
          with: {
            contract: {
              with: {
                property: true,
                tenant: true,
              },
            },
          },
        },
      },
    });
    return result;
  }

  async getAllPayments(): Promise<any[]> {
    const result = await db.query.payments.findMany({
      with: {
        invoice: {
          with: {
            contract: {
              with: {
                property: true,
                tenant: true,
              },
            },
          },
        },
      },
      orderBy: [desc(payments.createdAt)],
    });
    return result;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    
    // Update invoice status to paid if payment amount equals invoice amount
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, payment.invoiceId));
    if (invoice && parseFloat(payment.amount.toString()) >= parseFloat(invoice.amount.toString())) {
      await db
        .update(invoices)
        .set({ status: "paid", updatedAt: new Date() })
        .where(eq(invoices.id, payment.invoiceId));
    }
    
    return newPayment;
  }

  async updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment> {
    const [updatedPayment] = await db
      .update(payments)
      .set({ ...payment, updatedAt: new Date() })
      .where(eq(payments.id, id))
      .returning();
    return updatedPayment;
  }

  async deletePayment(id: number): Promise<void> {
    await db.delete(payments).where(eq(payments.id, id));
  }

  // Dashboard stats
  async getDashboardStats(): Promise<any> {
    const totalProperties = await db.select({ count: sql<number>`count(*)` }).from(properties);
    const activeTenants = await db.select({ count: sql<number>`count(*)` }).from(tenants).where(eq(tenants.isActive, true));
    const activeContracts = await db.select({ count: sql<number>`count(*)` }).from(contracts).where(eq(contracts.status, "active"));
    const pendingMaintenance = await db.select({ count: sql<number>`count(*)` }).from(maintenanceRequests).where(eq(maintenanceRequests.status, "pending"));
    
    // Monthly revenue calculation
    const currentMonth = new Date();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const monthlyRevenue = await db
      .select({ total: sql<number>`sum(${payments.amount})` })
      .from(payments)
      .where(
        and(
          gte(payments.paymentDate, firstDay),
          lte(payments.paymentDate, lastDay),
          eq(payments.status, "completed")
        )
      );

    return {
      totalProperties: totalProperties[0].count,
      activeTenants: activeTenants[0].count,
      activeContracts: activeContracts[0].count,
      pendingMaintenance: pendingMaintenance[0].count,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
    };
  }
}

export const storage = new DatabaseStorage();
