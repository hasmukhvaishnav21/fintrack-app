import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  Target,
  Users,
  Building2,
  Eye,
  EyeOff,
  Bell,
  ChevronRight,
  Sparkles,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import type { Transaction, Investment, Goal } from "@shared/schema";
import AddIncomeModal from "@/components/modals/AddIncomeModal";
import AddExpenseModal from "@/components/modals/AddExpenseModal";
import AddInvestmentModal from "@/components/modals/AddInvestmentModal";
import SplitBillModal from "@/components/modals/SplitBillModal";
import LinkBankModal from "@/components/modals/LinkBankModal";

const iconOptions = [
  { value: "bike", label: "Bike", icon: "🏍️" },
  { value: "car", label: "Car", icon: "🚗" },
  { value: "home", label: "Home", icon: "🏠" },
  { value: "plane", label: "Vacation", icon: "✈️" },
  { value: "education", label: "Education", icon: "🎓" },
  { value: "wedding", label: "Wedding", icon: "💍" },
];

export default function Home() {
  const [_, setLocation] = useLocation();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddInvestment, setShowAddInvestment] = useState(false);
  const [showSplitBill, setShowSplitBill] = useState(false);
  const [showLinkBank, setShowLinkBank] = useState(false);

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: investments = [] } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
  });

  const { data: goals = [] } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });

  // Calculate total income, expenses, and balance
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalBalance = totalIncome - totalExpenses;

  // Calculate investment summary with carat-specific pricing
  const current22KPrice = 5850;
  const current24KPrice = 6350;
  const currentSilverPrice = 92;

  const goldInvestments = investments.filter((i) => i.type === "gold");
  const silverInvestments = investments.filter((i) => i.type === "silver");

  // Separate 22K and 24K gold
  const gold22KInvestments = goldInvestments.filter((i) => i.carat === "22K");
  const gold24KInvestments = goldInvestments.filter((i) => i.carat === "24K");

  // Calculate 22K gold metrics
  const total22KQuantity = gold22KInvestments.reduce((sum, i) => sum + parseFloat(i.quantity), 0);
  const total22KCost = gold22KInvestments.reduce((sum, i) => sum + parseFloat(i.totalAmount), 0);
  const current22KValue = total22KQuantity * current22KPrice;
  const gold22KPL = current22KValue - total22KCost;

  // Calculate 24K gold metrics
  const total24KQuantity = gold24KInvestments.reduce((sum, i) => sum + parseFloat(i.quantity), 0);
  const total24KCost = gold24KInvestments.reduce((sum, i) => sum + parseFloat(i.totalAmount), 0);
  const current24KValue = total24KQuantity * current24KPrice;
  const gold24KPL = current24KValue - total24KCost;

  // Calculate silver metrics
  const totalSilverQuantity = silverInvestments.reduce((sum, i) => sum + parseFloat(i.quantity), 0);
  const totalSilverCost = silverInvestments.reduce((sum, i) => sum + parseFloat(i.totalAmount), 0);
  const currentSilverValue = totalSilverQuantity * currentSilverPrice;
  const silverPL = currentSilverValue - totalSilverCost;

  // Total investment metrics
  const totalInvestmentValue = current22KValue + current24KValue + currentSilverValue;
  const totalInvestmentCost = total22KCost + total24KCost + totalSilverCost;
  const investmentPL = totalInvestmentValue - totalInvestmentCost;
  const investmentPLPercent = totalInvestmentCost > 0
    ? ((investmentPL / totalInvestmentCost) * 100)
    : 0;

  // Recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);

  const quickActions = [
    {
      id: "income",
      label: "Add Income",
      icon: ArrowUpCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
      onClick: () => setShowAddIncome(true),
    },
    {
      id: "expense",
      label: "Add Expense",
      icon: ArrowDownCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      onClick: () => setShowAddExpense(true),
    },
    {
      id: "investment",
      label: "Investment",
      icon: TrendingUp,
      color: "text-yellow-600",
      bg: "bg-yellow-500/10",
      onClick: () => setLocation("/investments"),
    },
    {
      id: "goal",
      label: "Add Goal",
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      onClick: () => setLocation("/goals"),
    },
    {
      id: "split",
      label: "Split Bill",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      onClick: () => setShowSplitBill(true),
    },
    {
      id: "bank",
      label: "Link Bank",
      icon: Building2,
      color: "text-primary",
      bg: "bg-primary/10",
      onClick: () => setShowLinkBank(true),
    },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Fixed Header Section: Hero + Quick Actions (ensures scroll-only content reveal) */}
      <section className="flex-shrink-0 min-h-[65vh] max-h-[70vh] overflow-hidden">
        {/* Header with extra top padding for mobile */}
        <div className="bg-primary text-primary-foreground px-6 pb-6 pt-12 rounded-b-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm opacity-90 flex items-center gap-2">
                👋 Welcome back
              </p>
              <h1 className="text-2xl font-bold" data-testid="text-username">Hasmukh Vaishnav</h1>
            </div>
            <button
              className="p-2 rounded-full bg-white/20 hover-elevate active-elevate-2"
              data-testid="button-notifications"
            >
              <Bell className="w-6 h-6" />
            </button>
          </div>

          {/* Total Balance Card */}
          <Card className="bg-card border-0 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <button
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="p-1 hover-elevate active-elevate-2 rounded-full"
                data-testid="button-toggle-balance"
              >
                {balanceVisible ? (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-total-balance">
              {balanceVisible ? `₹${totalBalance.toLocaleString("en-IN")}` : "₹ ••••••"}
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLocation("/transactions?filter=income")}
                className="flex items-center gap-2 hover-elevate active-elevate-2 p-2 rounded-xl transition-all"
                data-testid="button-income-summary"
              >
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <ArrowUpCircle className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Income</p>
                  <p className="text-sm font-semibold text-foreground" data-testid="text-total-income">
                    ₹{totalIncome.toLocaleString("en-IN")}
                  </p>
                </div>
              </button>
              <button
                onClick={() => setLocation("/transactions?filter=expense")}
                className="flex items-center gap-2 hover-elevate active-elevate-2 p-2 rounded-xl transition-all"
                data-testid="button-expense-summary"
              >
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <ArrowDownCircle className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expenses</p>
                  <p className="text-sm font-semibold text-foreground" data-testid="text-total-expenses">
                    ₹{totalExpenses.toLocaleString("en-IN")}
                  </p>
                </div>
              </button>
            </div>
          </Card>
        </div>

        {/* Quick Actions - Part of Fixed Header */}
        <div className="px-6 py-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={action.onClick}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card hover-elevate active-elevate-2"
                data-testid={`button-${action.id}`}
              >
                <div className={`w-12 h-12 rounded-full ${action.bg} flex items-center justify-center`}>
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <span className="text-xs font-medium text-foreground text-center">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Scrollable Content Section: Investments, Goals, Transactions */}
      <main className="flex-1 overflow-y-auto px-6 space-y-6 pb-24">

        {/* Investment Summary */}
        {investments.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Investments</h2>
              <Link href="/investments">
                <button className="text-sm text-primary font-medium flex items-center gap-1" data-testid="link-view-all-investments">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            
            <Card className="p-4">
              {/* Total Summary */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{totalInvestmentValue.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${investmentPL >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {investmentPL >= 0 ? "+" : ""}₹{investmentPL.toLocaleString("en-IN")}
                  </p>
                  <p className={`text-xs ${investmentPL >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {investmentPLPercent >= 0 ? "+" : ""}{investmentPLPercent.toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Compact Metal Breakdown */}
              <div className="space-y-2 pt-3 border-t border-border">
                {/* 22K Gold Row */}
                {total22KQuantity > 0 && (
                  <div className="flex items-center justify-between py-2 rounded-lg bg-yellow-500/5" data-testid="investment-22k">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                        <Award className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-foreground">22K</span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-700 dark:text-yellow-300">91.6%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{total22KQuantity.toFixed(1)}g · ₹{current22KValue.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                    <p className={`text-xs font-bold ${gold22KPL >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {gold22KPL >= 0 ? "+" : ""}₹{gold22KPL.toLocaleString("en-IN")}
                    </p>
                  </div>
                )}

                {/* 24K Gold Row */}
                {total24KQuantity > 0 && (
                  <div className="flex items-center justify-between py-2 rounded-lg bg-amber-500/5" data-testid="investment-24k">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-foreground">24K</span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300">99.9%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{total24KQuantity.toFixed(1)}g · ₹{current24KValue.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                    <p className={`text-xs font-bold ${gold24KPL >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {gold24KPL >= 0 ? "+" : ""}₹{gold24KPL.toLocaleString("en-IN")}
                    </p>
                  </div>
                )}

                {/* Silver Row */}
                {totalSilverQuantity > 0 && (
                  <div className="flex items-center justify-between py-2 rounded-lg bg-slate-500/5" data-testid="investment-silver">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-foreground">Silver</span>
                        <p className="text-xs text-muted-foreground">{totalSilverQuantity.toFixed(1)}g · ₹{currentSilverValue.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                    <p className={`text-xs font-bold ${silverPL >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {silverPL >= 0 ? "+" : ""}₹{silverPL.toLocaleString("en-IN")}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Goals */}
        {goals.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Savings Goals</h2>
              <Link href="/goals">
                <button className="text-sm text-primary font-medium flex items-center gap-1" data-testid="link-view-all-goals">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="space-y-3">
              {goals.slice(0, 3).map((goal) => {
                const progress = (parseFloat(goal.currentAmount) / parseFloat(goal.targetAmount)) * 100;
                const goalIcon = iconOptions.find((opt) => opt.value === goal.icon);
                
                return (
                  <Link key={goal.id} href={`/goals/${goal.id}`}>
                    <Card className="p-3 hover-elevate active-elevate-2 cursor-pointer" data-testid={`card-goal-${goal.id}`}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                          {goalIcon?.icon || "🎯"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-sm truncate">{goal.name}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="truncate">₹{parseFloat(goal.currentAmount).toLocaleString("en-IN")}</span>
                            <span>/</span>
                            <span className="truncate">₹{parseFloat(goal.targetAmount).toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-primary">{progress.toFixed(0)}%</p>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Recent Transactions</h2>
              <Link href="/transactions">
                <button className="text-sm text-primary font-medium flex items-center gap-1" data-testid="link-view-all-transactions">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <Card
                  key={transaction.id}
                  className="p-3 hover-elevate active-elevate-2"
                  data-testid={`card-transaction-${transaction.id}`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        transaction.type === "income"
                          ? "bg-green-500/10"
                          : "bg-red-500/10"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpCircle className="w-4.5 h-4.5 text-green-500" />
                      ) : (
                        <ArrowDownCircle className="w-4.5 h-4.5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{transaction.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <p
                      className={`font-bold text-sm flex-shrink-0 ${
                        transaction.type === "income" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}₹
                      {parseFloat(transaction.amount).toLocaleString("en-IN")}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddIncomeModal isOpen={showAddIncome} onClose={() => setShowAddIncome(false)} />
      <AddExpenseModal isOpen={showAddExpense} onClose={() => setShowAddExpense(false)} />
      <AddInvestmentModal isOpen={showAddInvestment} onClose={() => setShowAddInvestment(false)} />
      <SplitBillModal isOpen={showSplitBill} onClose={() => setShowSplitBill(false)} />
      <LinkBankModal isOpen={showLinkBank} onClose={() => setShowLinkBank(false)} />
    </div>
  );
}
