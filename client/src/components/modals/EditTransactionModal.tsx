import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EditTransactionModalProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditTransactionModal({
  transaction,
  isOpen,
  onClose,
}: EditTransactionModalProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState(transaction.amount);
  const [category, setCategory] = useState(transaction.category);
  const [description, setDescription] = useState(transaction.description || "");
  const [date, setDate] = useState(
    new Date(transaction.date).toISOString().split("T")[0]
  );

  const incomeCategories = ["Salary", "Freelance", "Business", "Investment", "Bonus", "Other"];
  const expenseCategories = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Utilities",
    "Rent",
    "Healthcare",
    "Education",
    "Other",
  ];

  const categories = transaction.type === "income" ? incomeCategories : expenseCategories;

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Transaction>) =>
      apiRequest("PATCH", `/api/transactions/${transaction.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Transaction updated",
        description: "Your changes have been saved successfully.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!amount || !category || !date) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate({
      amount: amount.toString(),
      category,
      description: description || null,
      date: new Date(date),
    });
  };

  useEffect(() => {
    if (isOpen) {
      setAmount(transaction.amount);
      setCategory(transaction.category);
      setDescription(transaction.description || "");
      setDate(new Date(transaction.date).toISOString().split("T")[0]);
    }
  }, [isOpen, transaction]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background rounded-t-3xl w-full max-w-md mx-auto p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Edit {transaction.type === "income" ? "Income" : "Expense"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover-elevate active-elevate-2"
                data-testid="button-close"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Amount */}
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
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-card border border-border text-foreground focus:outline-none focus:border-primary"
                  data-testid="select-category"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description (Optional)
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

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-card border border-border text-foreground focus:outline-none focus:border-primary"
                  data-testid="input-date"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={updateMutation.isPending}
                  className="flex-1"
                  data-testid="button-save"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
