import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: text("phone_number").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// OTP sessions for verification
export const otpSessions = pgTable("otp_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: text("phone_number").notNull(),
  otp: text("otp").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertOtpSessionSchema = createInsertSchema(otpSessions).omit({ id: true, createdAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type OtpSession = typeof otpSessions.$inferSelect;

// Transactions table for income and expenses
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'income' or 'expense'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Investments table for gold and silver
export const investments = pgTable("investments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'gold' or 'silver'
  carat: text("carat"), // '22K' or '24K' for gold, null for silver
  quantity: decimal("quantity", { precision: 10, scale: 3 }).notNull(),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Goals table
export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  icon: text("icon").notNull().default("bike"),
  targetDate: timestamp("target_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Goal transactions (add funds, withdraw, payments)
export const goalTransactions = pgTable("goal_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  goalId: varchar("goal_id").notNull(),
  type: text("type").notNull(), // 'add_funds', 'withdraw', 'payment'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  date: timestamp("date").defaultNow().notNull(),
});

// Split bills table
export const splitBills = pgTable("split_bills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  description: text("description").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  settled: boolean("settled").notNull().default(false),
});

// Split bill participants
export const splitBillParticipants = pgTable("split_bill_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  billId: varchar("bill_id").notNull(),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  share: decimal("share", { precision: 10, scale: 2 }).notNull(),
  settled: boolean("settled").notNull().default(false),
});

// TypeScript types
export type Transaction = typeof transactions.$inferSelect;
export type Investment = typeof investments.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type GoalTransaction = typeof goalTransactions.$inferSelect;
export type SplitBill = typeof splitBills.$inferSelect;
export type SplitBillParticipant = typeof splitBillParticipants.$inferSelect;

// Insert schemas
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true });
export const insertInvestmentSchema = createInsertSchema(investments).omit({ id: true, createdAt: true }).extend({
  date: z.coerce.date(),
}).refine(
  (data) => {
    // If type is gold, carat must be provided
    if (data.type === "gold") {
      return data.carat !== undefined && data.carat !== null;
    }
    return true;
  },
  {
    message: "Gold investment must include carat (22K or 24K)",
    path: ["carat"],
  }
);
export const insertGoalSchema = createInsertSchema(goals).omit({ id: true, createdAt: true }).extend({
  targetDate: z.coerce.date().optional().nullable(),
});
export const insertGoalTransactionSchema = createInsertSchema(goalTransactions).omit({ id: true, date: true });
export const insertSplitBillSchema = createInsertSchema(splitBills).omit({ id: true, createdAt: true });
export const insertSplitBillParticipantSchema = createInsertSchema(splitBillParticipants).omit({ id: true });

// Form schemas
export const addTransactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
});

export const addInvestmentFormSchema = z.object({
  type: z.enum(["gold", "silver"]),
  carat: z.enum(["22K", "24K"]).optional(),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  date: z.string().min(1, "Date is required"),
}).refine(
  (data) => {
    // If type is gold, carat must be provided
    if (data.type === "gold") {
      return data.carat !== undefined;
    }
    return true;
  },
  {
    message: "Please select carat for gold investment",
    path: ["carat"],
  }
);

export const addGoalFormSchema = z.object({
  name: z.string().min(1, "Goal name is required").max(50, "Name too long"),
  targetAmount: z.coerce.number().positive("Target amount must be greater than 0"),
  currentAmount: z.coerce.number().min(0, "Current amount cannot be negative").default(0),
  icon: z.string().default("bike"),
  targetDate: z.string().optional(),
});

export const goalTransactionFormSchema = z.object({
  type: z.enum(["add_funds", "withdraw", "payment"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  description: z.string().optional(),
});

export const splitBillFormSchema = z.object({
  description: z.string().min(1, "Description is required"),
  totalAmount: z.coerce.number().positive("Amount must be greater than 0"),
  participants: z.array(z.object({
    name: z.string().min(1, "Name is required"),
    phoneNumber: z.string().min(10, "Valid phone number required"),
    share: z.coerce.number().min(0, "Share cannot be negative"),
  })).min(2, "At least two participants required"),
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type InsertGoalTransaction = z.infer<typeof insertGoalTransactionSchema>;
export type InsertSplitBill = z.infer<typeof insertSplitBillSchema>;
export type InsertSplitBillParticipant = z.infer<typeof insertSplitBillParticipantSchema>;
