import { motion } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

interface IncomeExpenseSummaryProps {
  income: number;
  expense: number;
}

export default function IncomeExpenseSummary({ income, expense }: IncomeExpenseSummaryProps) {
  return (
    <div className="mb-6 px-4" data-testid="section-income-expense">
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-4 shadow-lg"
          data-testid="card-income"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowDownCircle className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-white/90 font-medium">Income</p>
          </div>
          <p className="text-2xl font-bold text-white" data-testid="text-income">
            ₹{income.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-white/70 mt-1">This month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-2xl bg-gradient-to-br from-red-500 to-red-600 p-4 shadow-lg"
          data-testid="card-expense"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowUpCircle className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-white/90 font-medium">Expense</p>
          </div>
          <p className="text-2xl font-bold text-white" data-testid="text-expense">
            ₹{expense.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-white/70 mt-1">This month</p>
        </motion.div>
      </div>
    </div>
  );
}
