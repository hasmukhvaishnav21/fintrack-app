import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  icon: LucideIcon;
  target: number;
  current: number;
  color: string;
}

interface GoalProgressProps {
  goals: Goal[];
}

export default function GoalProgress({ goals }: GoalProgressProps) {
  return (
    <div className="mb-6 px-4" data-testid="section-goals">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-foreground">Savings Goals</h2>
        <button className="text-sm text-primary font-medium hover-elevate active-elevate-2" data-testid="button-view-all-goals">
          See All
        </button>
      </div>
      <div className="space-y-3">
        {goals.map((goal, index) => {
          const percentage = Math.min((goal.current / goal.target) * 100, 100);
          const Icon = goal.icon;
          const remaining = goal.target - goal.current;
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="rounded-2xl bg-card p-4 shadow-md hover-elevate active-elevate-2"
              data-testid={`card-goal-${goal.id}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${goal.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: goal.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-foreground">{goal.name}</h3>
                    <span className="text-xs font-bold text-foreground">{Math.round(percentage)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>₹{goal.current.toLocaleString('en-IN')} saved</span>
                    <span>₹{remaining.toLocaleString('en-IN')} to go</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 + (0.1 * index), ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{ 
                        background: `linear-gradient(90deg, ${goal.color}, ${goal.color}dd)`
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Target Info */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">Target Amount</span>
                <span className="text-sm font-bold" style={{ color: goal.color }}>
                  ₹{goal.target.toLocaleString('en-IN')}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
