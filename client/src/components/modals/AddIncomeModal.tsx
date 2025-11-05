import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowDownCircle } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const incomeCategories = [
  { id: 'salary', label: 'Salary', emoji: '💼', color: '#10B981' },
  { id: 'freelance', label: 'Freelance', emoji: '💻', color: '#3B82F6' },
  { id: 'business', label: 'Business', emoji: '🏢', color: '#8B5CF6' },
  { id: 'investment', label: 'Investment', emoji: '📈', color: '#F59E0B' },
  { id: 'gift', label: 'Gift', emoji: '🎁', color: '#EC4899' },
  { id: 'other', label: 'Other', emoji: '💰', color: '#6B7280' },
];

export default function AddIncomeModal({ isOpen, onClose }: AddIncomeModalProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  const addIncomeMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/transactions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Income added",
        description: "Your income has been recorded successfully.",
      });
      onClose();
      setAmount('');
      setCategory('');
      setDescription('');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add income. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addIncomeMutation.mutate({
      type: "income",
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
            className="fixed inset-0 bg-black/70 z-[100]"
            data-testid="modal-backdrop"
          />

          {/* Full-Screen Modal */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 max-w-md w-full mx-auto flex flex-col bg-background z-[110]"
            data-testid="modal-add-income"
          >
            {/* Header with safe area padding */}
            <div className="flex-shrink-0 px-4 pt-12 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <ArrowDownCircle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Add Income</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-card flex items-center justify-center hover-elevate active-elevate-2"
                  data-testid="button-close"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-3">
                {/* Amount */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-bold text-foreground">₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-3 text-xl font-bold rounded-xl bg-card text-foreground border border-border focus:outline-none focus:border-primary"
                      data-testid="input-amount"
                      required
                    />
                  </div>
                </div>

                {/* Category with Emojis */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {incomeCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-3 rounded-xl text-center transition-all flex flex-col items-center gap-1.5 ${
                          category === cat.id
                            ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                            : 'bg-card text-foreground hover-elevate active-elevate-2'
                        }`}
                        data-testid={`category-${cat.id}`}
                      >
                        <span className="text-2xl">{cat.emoji}</span>
                        <span className="text-xs font-medium">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Description (Optional)</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description..."
                    className="w-full px-3 py-2.5 rounded-xl bg-card text-foreground border border-border focus:outline-none focus:border-primary text-sm"
                    data-testid="input-description"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-card text-foreground border border-border focus:outline-none focus:border-primary text-sm"
                    data-testid="input-date"
                    required
                  />
                </div>
              </div>

              {/* Fixed Submit Button */}
              <div className="sticky bottom-0 bg-background px-4 pt-2 pb-6 shadow-[0_-1px_0_0_var(--border)]">
                <button
                  type="submit"
                  disabled={addIncomeMutation.isPending}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg hover-elevate active-elevate-2 disabled:opacity-50"
                  data-testid="button-submit"
                >
                  {addIncomeMutation.isPending ? "Adding..." : "Add Income"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
