import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import type { Session, SessionData } from "express-session";
import { storage } from "./storage";
import { insertTransactionSchema, insertInvestmentSchema, insertGoalSchema, insertGoalTransactionSchema, insertSplitBillSchema, insertSplitBillParticipantSchema, insertUserSchema, investments } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Extend session data
declare module "express-session" {
  interface SessionData {
    userId?: string;
    phoneNumber?: string;
  }
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      session: Session & Partial<SessionData>;
    }
  }
}

// Helper function to generate OTP (6 digits)
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  
  // Send OTP to phone number
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const schema = z.object({
        phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
      });
      
      const { phoneNumber } = schema.parse(req.body);
      
      // Generate OTP
      const otp = generateOTP();
      
      // Save OTP session
      await storage.createOtpSession(phoneNumber, otp);
      
      // In development, return OTP in response
      // In production, send via SMS using Twilio
      if (process.env.NODE_ENV === 'development') {
        console.log(`[AUTH] OTP for ${phoneNumber}: ${otp}`);
        res.json({ success: true, message: "OTP sent successfully", dev_otp: otp });
      } else {
        // TODO: Integrate Twilio to send SMS
        res.json({ success: true, message: "OTP sent successfully" });
      }
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });
  
  // Verify OTP and create/login user
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const schema = z.object({
        phoneNumber: z.string().min(10),
        otp: z.string().length(6),
        name: z.string().min(1).optional(), // Required for new users during signup
      });
      
      const { phoneNumber, otp, name } = schema.parse(req.body);
      
      // Get OTP session first WITHOUT marking as verified
      const otpSession = await storage.getOtpSession(phoneNumber);
      if (!otpSession || otpSession.otp !== otp) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }
      
      // Check if already verified (prevent reuse)
      if (otpSession.verified) {
        return res.status(400).json({ error: "OTP already used" });
      }
      
      // Check if user exists
      let user = await storage.getUserByPhoneNumber(phoneNumber);
      
      if (!user) {
        // New user - require name
        if (!name) {
          // Don't mark OTP as verified yet, allow retry with name
          return res.status(400).json({ error: "Name is required for new users" });
        }
        
        // Create new user
        user = await storage.createUser({
          phoneNumber,
          name,
        });
      }
      
      // Only mark OTP as verified after successful user handling
      await storage.verifyOtp(phoneNumber, otp);
      
      // Set session
      req.session.userId = user.id;
      req.session.phoneNumber = user.phoneNumber;
      
      res.json({
        success: true,
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          name: user.name,
        },
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  });
  
  // Check if user is authenticated
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: "User not found" });
    }
    
    res.json({
      id: user.id,
      phoneNumber: user.phoneNumber,
      name: user.name,
    });
  });
  
  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });
  
  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    const transactions = await storage.getTransactions();
    res.json(transactions);
  });

  app.get("/api/transactions/:id", async (req, res) => {
    const transaction = await storage.getTransaction(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validated = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction({
        ...validated,
        description: validated.description ?? null
      });
      res.json(transaction);
    } catch (error: any) {
      const validationError = fromZodError(error);
      res.status(400).json({ error: validationError.message });
    }
  });

  app.patch("/api/transactions/:id", async (req, res) => {
    try {
      const validated = insertTransactionSchema.partial().parse(req.body);
      const transaction = await storage.updateTransaction(req.params.id, validated);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error: any) {
      const validationError = fromZodError(error);
      res.status(400).json({ error: validationError.message });
    }
  });

  app.delete("/api/transactions/:id", async (req, res) => {
    const deleted = await storage.deleteTransaction(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ success: true });
  });

  // Investment routes
  app.get("/api/investments", async (req, res) => {
    const investments = await storage.getInvestments();
    res.json(investments);
  });

  app.get("/api/investments/:id", async (req, res) => {
    const investment = await storage.getInvestment(req.params.id);
    if (!investment) {
      return res.status(404).json({ error: "Investment not found" });
    }
    res.json(investment);
  });

  app.post("/api/investments", async (req, res) => {
    try {
      const validated = insertInvestmentSchema.parse(req.body);
      const investment = await storage.createInvestment({
        ...validated,
        carat: validated.carat ?? null
      });
      res.json(investment);
    } catch (error: any) {
      const validationError = fromZodError(error);
      res.status(400).json({ error: validationError.message });
    }
  });

  app.patch("/api/investments/:id", async (req, res) => {
    try {
      // Load existing investment to validate the merged result
      const existing = await storage.getInvestment(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Investment not found" });
      }

      // Parse and validate the partial update
      const updateInvestmentSchema = createInsertSchema(investments)
        .omit({ id: true, createdAt: true })
        .extend({ date: z.coerce.date().optional() })
        .partial();
      
      const validated = updateInvestmentSchema.parse(req.body);
      
      // Merge with existing to check final state
      const merged = { ...existing, ...validated };
      
      // Validate that gold investments have carat in the final state
      if (merged.type === "gold" && (!merged.carat || merged.carat === null)) {
        return res.status(400).json({ 
          error: "Gold investment must include carat (22K or 24K)" 
        });
      }
      
      const investment = await storage.updateInvestment(req.params.id, validated);
      res.json(investment);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      console.error("Error updating investment:", error);
      res.status(400).json({ error: error.message || "Failed to update investment" });
    }
  });

  app.delete("/api/investments/:id", async (req, res) => {
    const deleted = await storage.deleteInvestment(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Investment not found" });
    }
    res.json({ success: true });
  });

  // Goal routes
  app.get("/api/goals", async (req, res) => {
    const goals = await storage.getGoals();
    res.json(goals);
  });

  app.get("/api/goals/:id", async (req, res) => {
    const goal = await storage.getGoal(req.params.id);
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }
    res.json(goal);
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const validated = insertGoalSchema.parse(req.body);
      const goal = await storage.createGoal({
        ...validated,
        currentAmount: validated.currentAmount ?? "0",
        icon: validated.icon ?? "bike",
        targetDate: validated.targetDate ?? null
      });
      res.json(goal);
    } catch (error: any) {
      const validationError = fromZodError(error);
      res.status(400).json({ error: validationError.message });
    }
  });

  app.patch("/api/goals/:id", async (req, res) => {
    try {
      const validated = insertGoalSchema.partial().parse(req.body);
      const goal = await storage.updateGoal(req.params.id, validated);
      if (!goal) {
        return res.status(404).json({ error: "Goal not found" });
      }
      res.json(goal);
    } catch (error: any) {
      const validationError = fromZodError(error);
      res.status(400).json({ error: validationError.message });
    }
  });

  app.delete("/api/goals/:id", async (req, res) => {
    const deleted = await storage.deleteGoal(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Goal not found" });
    }
    res.json({ success: true });
  });

  // Goal transaction routes
  app.get("/api/goals/:goalId/transactions", async (req, res) => {
    const transactions = await storage.getGoalTransactions(req.params.goalId);
    res.json(transactions);
  });

  app.post("/api/goals/:goalId/transactions", async (req, res) => {
    try {
      const validated = insertGoalTransactionSchema.parse({
        ...req.body,
        goalId: req.params.goalId
      });
      
      // Get current goal
      const goal = await storage.getGoal(req.params.goalId);
      if (!goal) {
        return res.status(404).json({ error: "Goal not found" });
      }

      // Create transaction
      const transaction = await storage.createGoalTransaction({
        ...validated,
        date: new Date(),
        description: validated.description ?? null
      });

      // Update goal currentAmount based on transaction type
      const currentAmount = parseFloat(goal.currentAmount);
      const transactionAmount = parseFloat(validated.amount);
      let newAmount = currentAmount;

      if (validated.type === "add_funds") {
        newAmount = currentAmount + transactionAmount;
      } else if (validated.type === "withdraw" || validated.type === "payment") {
        newAmount = currentAmount - transactionAmount;
      }

      // Update goal with new amount
      await storage.updateGoal(req.params.goalId, {
        currentAmount: newAmount.toString()
      });

      res.json(transaction);
    } catch (error: any) {
      const validationError = fromZodError(error);
      res.status(400).json({ error: validationError.message });
    }
  });

  // Split bill routes
  app.get("/api/split-bills", async (req, res) => {
    const bills = await storage.getSplitBills();
    res.json(bills);
  });

  app.get("/api/split-bills/:id", async (req, res) => {
    const bill = await storage.getSplitBill(req.params.id);
    if (!bill) {
      return res.status(404).json({ error: "Split bill not found" });
    }
    res.json(bill);
  });

  app.post("/api/split-bills", async (req, res) => {
    try {
      const validated = insertSplitBillSchema.parse(req.body);
      const bill = await storage.createSplitBill({
        ...validated,
        settled: validated.settled ?? false
      });
      res.json(bill);
    } catch (error: any) {
      const validationError = fromZodError(error);
      res.status(400).json({ error: validationError.message });
    }
  });

  app.patch("/api/split-bills/:id", async (req, res) => {
    try {
      const validated = insertSplitBillSchema.partial().parse(req.body);
      const bill = await storage.updateSplitBill(req.params.id, validated);
      if (!bill) {
        return res.status(404).json({ error: "Split bill not found" });
      }
      res.json(bill);
    } catch (error: any) {
      const validationError = fromZodError(error);
      res.status(400).json({ error: validationError.message });
    }
  });

  // Split bill participant routes
  app.get("/api/split-bills/:billId/participants", async (req, res) => {
    const participants = await storage.getBillParticipants(req.params.billId);
    res.json(participants);
  });

  app.post("/api/split-bills/:billId/participants", async (req, res) => {
    try {
      const validated = insertSplitBillParticipantSchema.parse({
        ...req.body,
        billId: req.params.billId
      });
      const participant = await storage.createBillParticipant({
        ...validated,
        settled: validated.settled ?? false
      });
      res.json(participant);
    } catch (error: any) {
      const validationError = fromZodError(error);
      res.status(400).json({ error: validationError.message });
    }
  });

  app.patch("/api/split-bills/participants/:id", async (req, res) => {
    try {
      const validated = insertSplitBillParticipantSchema.partial().parse(req.body);
      const participant = await storage.updateBillParticipant(req.params.id, validated);
      if (!participant) {
        return res.status(404).json({ error: "Participant not found" });
      }
      res.json(participant);
    } catch (error: any) {
      const validationError = fromZodError(error);
      res.status(400).json({ error: validationError.message });
    }
  });

  // ==================== COMMUNITY ROUTES ====================
  
  // Get user's communities
  app.get("/api/communities", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const communities = await storage.getCommunities(req.session.userId);
    
    // Fallback to demo data if database is empty (for demo/offline mode)
    if (communities.length === 0) {
      const { demoCommunities } = await import("@shared/demoData");
      return res.json(demoCommunities);
    }
    
    res.json(communities);
  });

  // Get single community details
  app.get("/api/communities/:id", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const community = await storage.getCommunity(req.params.id);
    
    // Fallback to demo data if not found in database
    if (!community) {
      const { demoCommunities } = await import("@shared/demoData");
      const demoCommunity = demoCommunities.find(c => c.id === req.params.id);
      if (demoCommunity) {
        return res.json(demoCommunity);
      }
      return res.status(404).json({ error: "Community not found" });
    }
    
    // Check if user is a member (skip check for demo communities)
    const member = await storage.getCommunityMember(req.params.id, req.session.userId);
    if (!member) {
      return res.status(403).json({ error: "Not a member of this community" });
    }
    
    res.json(community);
  });

  // Create new community
  app.post("/api/communities", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const schema = z.object({
        name: z.string().min(1).max(50),
        description: z.string().max(200).optional(),
        approvalMode: z.enum(['admin_only', 'simple_majority', 'weighted']).default('admin_only')
      });
      
      const validated = schema.parse(req.body);
      const community = await storage.createCommunity({
        name: validated.name,
        description: validated.description || null,
        approvalMode: validated.approvalMode,
        adminId: req.session.userId
      });
      
      res.json(community);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to create community" });
    }
  });

  // Update community
  app.patch("/api/communities/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      // Check if user is admin
      const community = await storage.getCommunity(req.params.id);
      if (!community) {
        return res.status(404).json({ error: "Community not found" });
      }
      
      if (community.adminId !== req.session.userId) {
        return res.status(403).json({ error: "Only admin can update community" });
      }
      
      const schema = z.object({
        name: z.string().min(1).max(50).optional(),
        description: z.string().max(200).optional(),
        approvalMode: z.enum(['admin_only', 'simple_majority', 'weighted']).optional()
      });
      
      const validated = schema.parse(req.body);
      const updated = await storage.updateCommunity(req.params.id, validated);
      res.json(updated);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to update community" });
    }
  });

  // Delete community
  app.delete("/api/communities/:id", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Check if user is admin
    const community = await storage.getCommunity(req.params.id);
    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }
    
    if (community.adminId !== req.session.userId) {
      return res.status(403).json({ error: "Only admin can delete community" });
    }
    
    const deleted = await storage.deleteCommunity(req.params.id);
    res.json({ success: true });
  });

  // Get community members
  app.get("/api/communities/:id/members", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const members = await storage.getCommunityMembers(req.params.id);
    
    // Fallback to demo data if community not found in database
    if (members.length === 0) {
      const { demoCommunityMembers } = await import("@shared/demoData");
      const demoMembers = demoCommunityMembers.filter(m => m.communityId === req.params.id);
      if (demoMembers.length > 0) {
        return res.json(demoMembers);
      }
    }
    
    // Check if user is a member (skip check for demo communities)
    const member = members.find(m => m.userId === req.session.userId);
    if (!member) {
      return res.status(403).json({ error: "Not a member of this community" });
    }
    
    res.json(members);
  });

  // Add member to community
  app.post("/api/communities/:id/members", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      // Check if user is admin
      const community = await storage.getCommunity(req.params.id);
      if (!community) {
        return res.status(404).json({ error: "Community not found" });
      }
      
      if (community.adminId !== req.session.userId) {
        return res.status(403).json({ error: "Only admin can add members" });
      }
      
      const schema = z.object({
        userId: z.string().min(1),
        role: z.enum(['admin', 'treasurer', 'member']).default('member')
      });
      
      const validated = schema.parse(req.body);
      const member = await storage.addCommunityMember({
        communityId: req.params.id,
        ...validated
      });
      res.json(member);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to add member" });
    }
  });

  // Remove member from community
  app.delete("/api/communities/members/:id", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Get member by ID
    const member = await storage.getCommunityMemberById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    
    // Check if user is admin
    const community = await storage.getCommunity(member.communityId);
    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }
    
    if (community.adminId !== req.session.userId) {
      return res.status(403).json({ error: "Only admin can remove members" });
    }
    
    const deleted = await storage.removeCommunityMember(req.params.id);
    res.json({ success: true });
  });

  // Get community wallet
  app.get("/api/communities/:id/wallet", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const wallet = await storage.getCommunityWallet(req.params.id);
    
    // Fallback to demo data if wallet not found in database
    if (!wallet) {
      const { demoCommunityWallets } = await import("@shared/demoData");
      const demoWallet = demoCommunityWallets.find(w => w.communityId === req.params.id);
      if (demoWallet) {
        return res.json(demoWallet);
      }
      return res.status(404).json({ error: "Wallet not found" });
    }
    
    // Check if user is a member (skip check for demo communities)
    const member = await storage.getCommunityMember(req.params.id, req.session.userId);
    if (!member) {
      return res.status(403).json({ error: "Not a member of this community" });
    }
    
    res.json(wallet);
  });

  // Get community positions (holdings)
  app.get("/api/communities/:id/positions", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const positions = await storage.getCommunityPositions(req.params.id);
    
    // Fallback to demo data if positions not found in database
    if (positions.length === 0) {
      const { demoCommunityPositions } = await import("@shared/demoData");
      const demoPositions = demoCommunityPositions.filter(p => p.communityId === req.params.id);
      if (demoPositions.length > 0) {
        return res.json(demoPositions);
      }
    }
    
    // Check if user is a member (skip check for demo communities)
    const member = await storage.getCommunityMember(req.params.id, req.session.userId);
    if (!member) {
      return res.status(403).json({ error: "Not a member of this community" });
    }
    
    res.json(positions);
  });

  // Get community orders
  app.get("/api/communities/:id/orders", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const orders = await storage.getCommunityOrders(req.params.id);
    
    // Fallback to demo data if orders not found in database
    if (orders.length === 0) {
      const { demoCommunityOrders } = await import("@shared/demoData");
      const demoOrders = demoCommunityOrders.filter(o => o.communityId === req.params.id);
      if (demoOrders.length > 0) {
        return res.json(demoOrders);
      }
    }
    
    // Check if user is a member (skip check for demo communities)
    const member = await storage.getCommunityMember(req.params.id, req.session.userId);
    if (!member) {
      return res.status(403).json({ error: "Not a member of this community" });
    }
    
    res.json(orders);
  });

  // Create order proposal
  app.post("/api/communities/:id/orders", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      // Check if user is a member
      const member = await storage.getCommunityMember(req.params.id, req.session.userId);
      if (!member) {
        return res.status(403).json({ error: "Not a member of this community" });
      }
      
      const schema = z.object({
        orderType: z.enum(['buy', 'sell']),
        metalType: z.enum(['gold', 'silver']),
        carat: z.enum(['22K', '24K']).optional(),
        quantity: z.coerce.number().positive(),
        pricePerUnit: z.coerce.number().positive()
      }).refine(
        (data) => {
          if (data.metalType === 'gold') {
            return data.carat !== undefined;
          }
          return true;
        },
        { message: "Carat is required for gold orders" }
      );
      
      const validated = schema.parse(req.body);
      const totalAmount = (validated.quantity * validated.pricePerUnit).toFixed(2);
      
      const order = await storage.createCommunityOrder({
        communityId: req.params.id,
        proposedBy: req.session.userId,
        orderType: validated.orderType,
        metalType: validated.metalType,
        carat: validated.carat || null,
        quantity: validated.quantity.toString(),
        pricePerUnit: validated.pricePerUnit.toString(),
        totalAmount,
        deadline: null
      });
      
      res.json(order);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Update order status
  app.patch("/api/communities/orders/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const order = await storage.getCommunityOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      // Check if user is admin
      const community = await storage.getCommunity(order.communityId);
      if (!community || community.adminId !== req.session.userId) {
        return res.status(403).json({ error: "Only admin can update order status" });
      }
      
      const schema = z.object({
        status: z.enum(['proposed', 'voting', 'approved', 'rejected', 'executed']).optional()
      });
      
      const validated = schema.parse(req.body);
      const updated = await storage.updateCommunityOrder(req.params.id, validated);
      res.json(updated);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  // Get votes for an order
  app.get("/api/communities/orders/:id/votes", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const order = await storage.getCommunityOrder(req.params.id);
    if (!order) {
      // Try demo data fallback
      const { demoCommunityOrders, demoVoteRecords } = await import("@shared/demoData");
      const demoOrder = demoCommunityOrders.find(o => o.id === req.params.id);
      if (demoOrder) {
        const demoVotes = demoVoteRecords.filter(v => v.orderId === req.params.id);
        return res.json(demoVotes);
      }
      return res.status(404).json({ error: "Order not found" });
    }
    
    // Check if user is a member
    const member = await storage.getCommunityMember(order.communityId, req.session.userId);
    if (!member) {
      return res.status(403).json({ error: "Not a member of this community" });
    }
    
    const votes = await storage.getOrderVotes(req.params.id);
    res.json(votes);
  });

  // Vote on order
  app.post("/api/communities/orders/:id/vote", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const order = await storage.getCommunityOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      // Check if user is a member
      const member = await storage.getCommunityMember(order.communityId, req.session.userId);
      if (!member) {
        return res.status(403).json({ error: "Not a member of this community" });
      }
      
      // Check if user already voted
      const existingVote = await storage.getUserVote(req.params.id, req.session.userId);
      if (existingVote) {
        return res.status(400).json({ error: "You have already voted on this order" });
      }
      
      const schema = z.object({
        vote: z.enum(['for', 'against'])
      });
      
      const validated = schema.parse(req.body);
      const voteRecord = await storage.createVote({
        orderId: req.params.id,
        userId: req.session.userId,
        vote: validated.vote
      });
      
      // Get updated order
      const updatedOrder = await storage.getCommunityOrder(req.params.id);
      res.json({ vote: voteRecord, order: updatedOrder });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to vote" });
    }
  });

  // Execute approved order
  app.post("/api/communities/orders/:id/execute", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const order = await storage.getCommunityOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      // Check if user is admin or treasurer
      const community = await storage.getCommunity(order.communityId);
      if (!community) {
        return res.status(404).json({ error: "Community not found" });
      }
      
      const member = await storage.getCommunityMember(order.communityId, req.session.userId);
      if (!member || (member.role !== 'admin' && member.role !== 'treasurer')) {
        return res.status(403).json({ error: "Only admin or treasurer can execute orders" });
      }
      
      if (order.status !== 'approved') {
        return res.status(400).json({ error: "Order must be approved before execution" });
      }
      
      // Update order status to executed
      await storage.updateCommunityOrder(order.id, {
        status: 'executed',
        executedAt: new Date()
      });
      
      if (order.orderType === 'buy') {
        // Find or create position
        let position = await storage.getCommunityPosition(order.communityId, order.metalType, order.carat || undefined);
        
        if (position) {
          // Update existing position
          const newQuantity = parseFloat(position.quantity) + parseFloat(order.quantity);
          const newTotalInvested = parseFloat(position.totalInvested) + parseFloat(order.totalAmount);
          const newAvgPrice = newTotalInvested / newQuantity;
          
          await storage.updateCommunityPosition(position.id, {
            quantity: newQuantity.toString(),
            avgPricePerUnit: newAvgPrice.toFixed(2),
            totalInvested: newTotalInvested.toFixed(2)
          });
        } else {
          // Create new position
          await storage.createCommunityPosition({
            communityId: order.communityId,
            type: order.metalType,
            carat: order.carat,
            quantity: order.quantity,
            avgPricePerUnit: order.pricePerUnit,
            totalInvested: order.totalAmount
          });
        }
        
        // Deduct from wallet
        const wallet = await storage.getCommunityWallet(order.communityId);
        if (wallet) {
          const newBalance = parseFloat(wallet.balance) - parseFloat(order.totalAmount);
          await storage.updateCommunityWallet(order.communityId, Math.max(0, newBalance).toFixed(2));
        }
      } else if (order.orderType === 'sell') {
        // Find position
        const position = await storage.getCommunityPosition(order.communityId, order.metalType, order.carat || undefined);
        
        if (position) {
          // Update position
          const newQuantity = parseFloat(position.quantity) - parseFloat(order.quantity);
          const soldProportion = parseFloat(order.quantity) / parseFloat(position.quantity);
          const newTotalInvested = parseFloat(position.totalInvested) * (1 - soldProportion);
          
          await storage.updateCommunityPosition(position.id, {
            quantity: Math.max(0, newQuantity).toString(),
            totalInvested: Math.max(0, newTotalInvested).toFixed(2)
          });
          
          // Add to wallet
          const wallet = await storage.getCommunityWallet(order.communityId);
          if (wallet) {
            const newBalance = parseFloat(wallet.balance) + parseFloat(order.totalAmount);
            await storage.updateCommunityWallet(order.communityId, newBalance.toFixed(2));
          }
        }
      }
      
      const updatedOrder = await storage.getCommunityOrder(order.id);
      res.json(updatedOrder);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to execute order" });
    }
  });

  // Get community contributions
  app.get("/api/communities/:id/contributions", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const contributions = await storage.getCommunityContributions(req.params.id);
    
    // Fallback to demo data if no contributions found
    if (contributions.length === 0) {
      const { demoCommunityContributions } = await import("@shared/demoData");
      const demoContribs = demoCommunityContributions.filter(c => c.communityId === req.params.id);
      if (demoContribs.length > 0) {
        return res.json(demoContribs);
      }
    }
    
    // Check if user is a member (skip for demo communities)
    const member = await storage.getCommunityMember(req.params.id, req.session.userId);
    if (!member && contributions.length > 0) {
      return res.status(403).json({ error: "Not a member of this community" });
    }
    
    res.json(contributions);
  });

  // Get user contributions
  app.get("/api/communities/:id/contributions/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const contributions = await storage.getUserContributions(req.params.id, req.session.userId);
    
    // Fallback to demo data if no contributions found
    if (contributions.length === 0) {
      const { demoCommunityContributions } = await import("@shared/demoData");
      const demoContribs = demoCommunityContributions.filter(c => 
        c.communityId === req.params.id && c.userId === req.session.userId
      );
      if (demoContribs.length > 0) {
        return res.json(demoContribs);
      }
    }
    
    // Check if user is a member (skip for demo communities)
    const member = await storage.getCommunityMember(req.params.id, req.session.userId);
    if (!member && contributions.length > 0) {
      return res.status(403).json({ error: "Not a member of this community" });
    }
    
    res.json(contributions);
  });

  // Create contribution (deposit/withdrawal)
  app.post("/api/communities/:id/contributions", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      // Check if user is a member
      const member = await storage.getCommunityMember(req.params.id, req.session.userId);
      if (!member) {
        return res.status(403).json({ error: "Not a member of this community" });
      }
      
      const schema = z.object({
        amount: z.coerce.number().positive(),
        type: z.enum(['deposit', 'withdrawal'])
      });
      
      const validated = schema.parse(req.body);
      const contribution = await storage.createContribution({
        communityId: req.params.id,
        userId: req.session.userId,
        orderId: null,
        amount: validated.amount.toString(),
        type: validated.type
      });
      
      res.json(contribution);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to create contribution" });
    }
  });

  // Get member share calculation
  app.get("/api/communities/:id/my-share", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      // Check if this is a demo community
      const isDemoCommunity = req.params.id.startsWith('demo-comm-');
      
      if (isDemoCommunity) {
        // Return demo share data for demo communities
        const demoShareInfo = {
          totalContributed: "25000.00",
          sharePercentage: 20.5,
          withdrawalAmount: "26500.00",
          communityTotalValue: "129000.00"
        };
        return res.json(demoShareInfo);
      }
      
      // Check if user is a member
      const member = await storage.getCommunityMember(req.params.id, req.session.userId);
      if (!member) {
        return res.status(403).json({ error: "Not a member of this community" });
      }
      
      // Check if member has already exited
      if (member.status === 'exited') {
        return res.status(400).json({ error: "You have already exited this community" });
      }
      
      const shareInfo = await storage.calculateMemberShare(req.params.id, req.session.userId);
      res.json(shareInfo);
    } catch (error: any) {
      console.error('Error calculating share:', error);
      res.status(500).json({ error: "Failed to calculate share" });
    }
  });

  // Process member withdrawal
  app.post("/api/communities/:id/withdraw", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      // Check if this is a demo community
      const isDemoCommunity = req.params.id.startsWith('demo-comm-');
      
      if (isDemoCommunity) {
        // Return success response for demo communities (read-only)
        return res.json({
          withdrawalAmount: "26500.00",
          success: true
        });
      }
      
      // Check if user is a member
      const member = await storage.getCommunityMember(req.params.id, req.session.userId);
      if (!member) {
        return res.status(403).json({ error: "Not a member of this community" });
      }
      
      // Check if member has already exited
      if (member.status === 'exited') {
        return res.status(400).json({ error: "You have already exited this community" });
      }
      
      // Check if user is the only admin
      const community = await storage.getCommunity(req.params.id);
      if (community && community.adminId === req.session.userId) {
        const members = await storage.getCommunityMembers(req.params.id);
        const activeMembers = members.filter(m => m.status === 'active');
        
        if (activeMembers.length > 1) {
          return res.status(400).json({ 
            error: "As admin, you must transfer admin rights before withdrawing. Please assign another active member as admin." 
          });
        }
      }
      
      const result = await storage.processMemberWithdrawal(req.params.id, req.session.userId);
      
      if (!result.success) {
        return res.status(400).json({ error: "Failed to process withdrawal" });
      }
      
      res.json(result);
    } catch (error: any) {
      console.error('Error processing withdrawal:', error);
      res.status(500).json({ error: "Failed to process withdrawal" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
