import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Minus,
  CreditCard,
  Check,
  TrendingUp,
  Calendar,
  Target,
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Goal, GoalTransaction } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const iconOptions = [
  { value: "bike", label: "Bike", icon: "🏍️" },
  { value: "car", label: "Car", icon: "🚗" },
  { value: "home", label: "Home", icon: "🏠" },
  { value: "plane", label: "Vacation", icon: "✈️" },
  { value: "education", label: "Education", icon: "🎓" },
  { value: "wedding", label: "Wedding", icon: "💍" },
];

type PaymentStep = "select" | "amount" | "confirm" | "processing" | "success";

export default function GoalDetail() {
  const [_, setLocation] = useLocation();
  const [match, params] = useRoute("/goals/:id");
  const { toast } = useToast();

  const [paymentFlow, setPaymentFlow] = useState<PaymentStep | null>(null);
  const [transactionType, setTransactionType] = useState<"add_funds" | "withdraw" | "payment" | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const goalId = params?.id || "";

  const { data: goal, isLoading: goalLoading } = useQuery<Goal>({
    queryKey: ["/api/goals", goalId],
    queryFn: async () => {
      const res = await fetch(`/api/goals/${goalId}`);
      if (!res.ok) throw new Error("Failed to fetch goal");
      return res.json();
    },
    enabled: !!goalId,
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<GoalTransaction[]>({
    queryKey: ["/api/goals", goalId, "transactions"],
    queryFn: async () => {
      const res = await fetch(`/api/goals/${goalId}/transactions`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return res.json();
    },
    enabled: !!goalId,
  });

  const transactionMutation = useMutation({
    mutationFn: (data: { type: string; amount: string; description?: string }) => {
      console.log("Mutation function called with:", data);
      return apiRequest("POST", `/api/goals/${goalId}/transactions`, data);
    },
    onSuccess: (data) => {
      console.log("Transaction success!", data);
      queryClient.invalidateQueries({ queryKey: ["/api/goals", goalId] });
      queryClient.invalidateQueries({ queryKey: ["/api/goals", goalId, "transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      setPaymentFlow("success");
      setTimeout(() => {
        resetFlow();
      }, 2000);
    },
    onError: (error) => {
      console.error("Transaction error:", error);
      toast({
        title: "Error",
        description: "Transaction failed. Please try again.",
        variant: "destructive",
      });
      resetFlow();
    },
  });

  const resetFlow = () => {
    setPaymentFlow(null);
    setTransactionType(null);
    setAmount("");
    setDescription("");
  };

  const startTransaction = (type: "add_funds" | "withdraw" | "payment") => {
    setTransactionType(type);
    setPaymentFlow("amount");
  };

  const handleAmountSubmit = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    if (transactionType === "withdraw" || transactionType === "payment") {
      const currentAmount = parseFloat(goal?.currentAmount || "0");
      if (numAmount > currentAmount) {
        toast({
          title: "Insufficient funds",
          description: "Amount exceeds available balance in goal.",
          variant: "destructive",
        });
        return;
      }
    }

    setPaymentFlow("confirm");
  };

  const handleConfirm = () => {
    console.log("handleConfirm called", { transactionType, amount, description });
    setPaymentFlow("processing");
    setTimeout(() => {
      console.log("About to call mutation with:", { type: transactionType, amount, description });
      transactionMutation.mutate({
        type: transactionType!,
        amount,
        description: description || undefined,
      });
    }, 1500);
  };

  if (!match || goalLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Goal not found</p>
      </div>
    );
  }

  const goalIcon = iconOptions.find((opt) => opt.value === goal.icon);
  const progress = (parseFloat(goal.currentAmount) / parseFloat(goal.targetAmount)) * 100;
  const remaining = parseFloat(goal.targetAmount) - parseFloat(goal.currentAmount);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setLocation("/")}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover-elevate active-elevate-2"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Goal Details</h1>
          <div className="w-10" />
        </div>

        {/* Goal Info Card */}
        <Card className="bg-card border-0 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
              {goalIcon?.icon || "🎯"}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{goal.name}</h2>
              {goal.targetDate && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(goal.targetDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-bold text-primary">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>

          {/* Amount Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Current</p>
              <p className="text-xl font-bold text-foreground">
                ₹{parseFloat(goal.currentAmount).toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Target</p>
              <p className="text-xl font-bold text-foreground">
                ₹{parseFloat(goal.targetAmount).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="bg-primary/10 rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Remaining</p>
            <p className="text-lg font-bold text-primary">₹{remaining.toLocaleString("en-IN")}</p>
          </div>
        </Card>
      </div>

      <div className="p-6 space-y-6">
        {/* Action Buttons */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => startTransaction("add_funds")}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-green-500/10 hover-elevate active-elevate-2"
              data-testid="button-add-funds"
            >
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Plus className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-xs font-medium text-foreground text-center">Add Funds</span>
            </button>
            <button
              onClick={() => startTransaction("withdraw")}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-orange-500/10 hover-elevate active-elevate-2"
              data-testid="button-withdraw"
            >
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Minus className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-xs font-medium text-foreground text-center">Withdraw</span>
            </button>
            <button
              onClick={() => startTransaction("payment")}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-blue-500/10 hover-elevate active-elevate-2"
              data-testid="button-payment"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs font-medium text-foreground text-center">Payment</span>
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Transaction History</h2>
          {transactionsLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => {
                const isCredit = tx.type === "add_funds";
                return (
                  <Card key={tx.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCredit ? "bg-green-500/10" : "bg-red-500/10"
                          }`}
                        >
                          {tx.type === "add_funds" && <Plus className="w-5 h-5 text-green-500" />}
                          {tx.type === "withdraw" && <Minus className="w-5 h-5 text-orange-500" />}
                          {tx.type === "payment" && <CreditCard className="w-5 h-5 text-blue-500" />}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground capitalize">
                            {tx.type.replace("_", " ")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {tx.description && (
                            <p className="text-xs text-muted-foreground">{tx.description}</p>
                          )}
                        </div>
                      </div>
                      <p className={`font-bold ${isCredit ? "text-green-500" : "text-red-500"}`}>
                        {isCredit ? "+" : "-"}₹{parseFloat(tx.amount).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Payment Flow Modal */}
      <AnimatePresence>
        {paymentFlow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end"
            onClick={() => !["processing", "success"].includes(paymentFlow) && resetFlow()}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-t-3xl w-full max-w-md mx-auto p-6"
            >
              {paymentFlow === "amount" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground capitalize">
                    {transactionType?.replace("_", " ")}
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-4 py-3 rounded-2xl bg-card border border-border text-foreground focus:outline-none focus:border-primary"
                      data-testid="input-amount"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add a note..."
                      className="w-full px-4 py-3 rounded-2xl bg-card border border-border text-foreground focus:outline-none focus:border-primary"
                      data-testid="input-description"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={resetFlow} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleAmountSubmit} className="flex-1" data-testid="button-continue">
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {paymentFlow === "confirm" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">Confirm Transaction</h2>
                  <Card className="p-4 bg-muted/50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span className="text-sm font-semibold text-foreground capitalize">
                          {transactionType?.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Amount</span>
                        <span className="text-lg font-bold text-foreground">
                          ₹{parseFloat(amount).toLocaleString("en-IN")}
                        </span>
                      </div>
                      {description && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Note</span>
                          <span className="text-sm text-foreground">{description}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setPaymentFlow("amount")} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={handleConfirm} className="flex-1" data-testid="button-confirm">
                      Confirm
                    </Button>
                  </div>
                </div>
              )}

              {paymentFlow === "processing" && (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="text-lg font-semibold text-foreground">Processing...</p>
                  <p className="text-sm text-muted-foreground">Please wait</p>
                </div>
              )}

              {paymentFlow === "success" && (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>
                  <p className="text-lg font-bold text-foreground">Success!</p>
                  <p className="text-sm text-muted-foreground">Transaction completed</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
