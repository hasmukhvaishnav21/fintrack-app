import { motion } from "framer-motion";
import { Wallet, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface SummaryCardProps {
  totalBalance: number;
}

export default function SummaryCard({ totalBalance }: SummaryCardProps) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mx-4 mb-6 rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-blue-700 p-6 shadow-xl"
      data-testid="card-summary"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary-foreground/80" />
          <p className="text-sm text-primary-foreground/80 font-medium">Total Balance</p>
        </div>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover-elevate active-elevate-2"
          data-testid="button-toggle-balance"
        >
          {showBalance ? (
            <Eye className="w-4 h-4 text-primary-foreground" />
          ) : (
            <EyeOff className="w-4 h-4 text-primary-foreground" />
          )}
        </button>
      </div>
      <p className="text-4xl font-bold text-primary-foreground mb-2" data-testid="text-balance">
        {showBalance ? `₹${totalBalance.toLocaleString('en-IN')}` : '₹ • • • • • •'}
      </p>
      <p className="text-xs text-primary-foreground/70">Available to spend</p>
    </motion.div>
  );
}
