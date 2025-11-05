import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpCircle } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const expenseCategories = [
  { id: 'food', label: 'Food', emoji: '🍔', color: '#F59E0B' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️', color: '#EF4444' },
  { id: 'transport', label: 'Transport', emoji: '🚗', color: '#3B82F6' },
  { id: 'bills', label: 'Bills', emoji: '📱', color: '#8B5CF6' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬', color: '#EC4899' },
  { id: 'health', label: 'Health', emoji: '💊', color: '#10B981' },
  { id: 'education', label: 'Education', emoji: '📚', color: '#6366F1' },
  { id: 'travel', label: 'Travel', emoji: '✈️', color: '#14B8A6' },
  { id: 'other', label: 'Other', emoji: '💸', color: '#6B7280' },
];

export default function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  const addExpenseMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/transactions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Expense added",
        description: "Your expense has been recorded successfully.",
      });
      onClose();
      setAmount('');
      setCategory('');
      setDescription('');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpenseMutation.mutate({
      type: "expense",
      category,
      amount: parseFloat(amount),
      description,
      date: new Date(date).toISOString(),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-50"
            data-testid="modal-backdrop"
          />

          {/* Full-Screen Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            data-testid="modal-add-expense"
          >
            <div className="w-full max-w-md bg-background rounded-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                      <ArrowUpCircle className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Add Expense</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover-elevate active-elevate-2"
                    data-testid="button-close"
                  >
                    <X className="w-5 h-5 text-foreground" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-foreground">₹</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        className="w-full pl-12 pr-4 py-4 text-2xl font-bold rounded-2xl bg-card text-foreground border border-border focus:outline-none focus:border-primary"
                        data-testid="input-amount"
                        required
                      />
                    </div>
                  </div>

                  {/* Category with Emojis */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-3 block">Category</label>
                    <div className="grid grid-cols-3 gap-3">
                      {expenseCategories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`p-4 rounded-2xl text-center transition-all flex flex-col items-center gap-2 ${
                            category === cat.id
                              ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                              : 'bg-card text-foreground hover-elevate active-elevate-2'
                          }`}
                          data-testid={`category-${cat.id}`}
                        >
                          <span className="text-3xl">{cat.emoji}</span>
                          <span className="text-xs font-medium">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Description (Optional)</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter description..."
                      className="w-full px-4 py-3 rounded-2xl bg-card text-foreground border border-border focus:outline-none focus:border-primary"
                      data-testid="input-description"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-card text-foreground border border-border focus:outline-none focus:border-primary"
                      data-testid="input-date"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={addExpenseMutation.isPending}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg hover-elevate active-elevate-2 disabled:opacity-50"
                    data-testid="button-submit"
                  >
                    {addExpenseMutation.isPending ? "Adding..." : "Add Expense"}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
