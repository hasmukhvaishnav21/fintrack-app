import { motion } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle, Users, Building2, TrendingUp, Target } from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  icon: typeof ArrowDownCircle;
  gradient: string;
}

interface QuickActionsProps {
  onActionClick?: (actionId: string) => void;
}

export default function QuickActions({ onActionClick }: QuickActionsProps) {
  const actions: QuickAction[] = [
    { id: 'add-income', label: 'Add Income', icon: ArrowDownCircle, gradient: 'from-green-500 to-green-600' },
    { id: 'add-expense', label: 'Add Expense', icon: ArrowUpCircle, gradient: 'from-red-500 to-red-600' },
    { id: 'add-investment', label: 'Add Investment', icon: TrendingUp, gradient: 'from-blue-500 to-blue-600' },
    { id: 'add-goal', label: 'Add Goal', icon: Target, gradient: 'from-purple-500 to-purple-600' },
    { id: 'split-bill', label: 'Split Bill', icon: Users, gradient: 'from-pink-500 to-pink-600' },
    { id: 'link-bank', label: 'Link Bank', icon: Building2, gradient: 'from-indigo-500 to-indigo-600' },
  ];

  const handleClick = (actionId: string) => {
    onActionClick?.(actionId);
    console.log(`${actionId} action triggered`);
  };

  return (
    <div className="mb-6 px-4" data-testid="section-quick-actions">
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              onClick={() => handleClick(action.id)}
              className="flex flex-col items-center gap-2 hover-elevate active-elevate-2"
              data-testid={`button-${action.id}`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-foreground text-center leading-tight">{action.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
