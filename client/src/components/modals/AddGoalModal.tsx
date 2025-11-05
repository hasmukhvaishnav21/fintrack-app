import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Bike, Smartphone, Plane, Home, Briefcase, Heart } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertGoal } from "@shared/schema";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const goalIcons = [
  { id: 'bike', icon: Bike, label: 'Bike', color: '#0066FF' },
  { id: 'phone', icon: Smartphone, label: 'Phone', color: '#D4AF37' },
  { id: 'travel', icon: Plane, label: 'Travel', color: '#8B5CF6' },
  { id: 'house', icon: Home, label: 'House', color: '#10B981' },
  { id: 'business', icon: Briefcase, label: 'Business', color: '#3B82F6' },
  { id: 'other', icon: Heart, label: 'Other', color: '#EC4899' },
];

export default function AddGoalModal({ isOpen, onClose }: AddGoalModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [selectedIcon, setSelectedIcon] = useState('bike');
  const [targetDate, setTargetDate] = useState('');

  const createGoalMutation = useMutation({
    mutationFn: async (data: InsertGoal) => {
      return await apiRequest("POST", "/api/goals", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      toast({
        title: "Goal Created!",
        description: "Your savings goal has been created successfully.",
      });
      onClose();
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      setSelectedIcon('bike');
      setTargetDate('');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create goal",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData: any = {
      name,
      targetAmount: targetAmount.toString(),
      currentAmount: currentAmount || "0",
      icon: selectedIcon,
      targetDate: targetDate || undefined,
    };
    
    createGoalMutation.mutate(goalData);
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
            data-testid="modal-add-goal"
          >
            {/* Header with safe area padding */}
            <div className="flex-shrink-0 px-4 pt-12 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Create Goal</h2>
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
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto px-4 space-y-4">
                {/* Goal Name */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Goal Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., New Bike, Dream Vacation"
                    className="w-full px-4 py-3 rounded-2xl bg-card text-foreground border border-border focus:outline-none focus:border-primary"
                    data-testid="input-name"
                    required
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Choose Icon</label>
                  <div className="grid grid-cols-6 gap-2">
                    {goalIcons.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedIcon(item.id)}
                          className={`p-3 rounded-xl transition-all ${
                            selectedIcon === item.id
                              ? 'bg-primary shadow-md'
                              : 'bg-card hover-elevate active-elevate-2'
                          }`}
                          data-testid={`icon-${item.id}`}
                        >
                          <Icon 
                            className="w-5 h-5" 
                            style={{ color: selectedIcon === item.id ? 'white' : item.color }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target Amount */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Target Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-foreground">₹</span>
                    <input
                      type="number"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-4 text-xl font-bold rounded-2xl bg-card text-foreground border border-border focus:outline-none focus:border-primary"
                      data-testid="input-target"
                      required
                    />
                  </div>
                </div>

                {/* Current Amount */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Already Saved (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-foreground">₹</span>
                    <input
                      type="number"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(e.target.value)}
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-3 text-lg font-bold rounded-2xl bg-card text-foreground border border-border focus:outline-none focus:border-primary"
                      data-testid="input-current"
                    />
                  </div>
                </div>

                {/* Target Date */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Target Date (Optional)</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-card text-foreground border border-border focus:outline-none focus:border-primary"
                    data-testid="input-date"
                  />
                </div>
              </div>

              {/* Footer Action Band */}
              <div className="flex-shrink-0 px-4 pb-4 pt-1 border-t border-border bg-gradient-to-t from-background/50 to-background">
                <button
                  type="submit"
                  disabled={createGoalMutation.isPending}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold shadow-lg hover-elevate active-elevate-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-submit"
                >
                  {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
