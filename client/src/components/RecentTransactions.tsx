import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  icon: LucideIcon;
  category: string;
  iconBg: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="mb-6 px-4" data-testid="section-transactions">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-foreground">Recent Transactions</h2>
        <button className="text-sm text-primary font-medium hover-elevate active-elevate-2" data-testid="button-view-all-transactions">
          See All
        </button>
      </div>
      <div className="space-y-2">
        {transactions.map((transaction, index) => {
          const Icon = transaction.icon;
          
          return (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-card hover-elevate active-elevate-2"
              data-testid={`transaction-${transaction.id}`}
            >
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: transaction.iconBg }}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{transaction.name}</p>
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`} data-testid={`amount-${transaction.id}`}>
                  {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
