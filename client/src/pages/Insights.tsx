import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, TrendingDown, ShoppingBag, Utensils, Car, Zap, Home as HomeIcon } from "lucide-react";
import { useLocation } from "wouter";
import BottomNav from "@/components/BottomNav";

export default function Insights() {
  const [, setLocation] = useLocation();

  const spendingByCategory = [
    { category: 'Shopping', amount: 8500, icon: ShoppingBag, color: '#EF4444', percentage: 35 },
    { category: 'Food & Dining', amount: 6200, icon: Utensils, color: '#F59E0B', percentage: 26 },
    { category: 'Transport', amount: 4500, icon: Car, color: '#3B82F6', percentage: 19 },
    { category: 'Bills', amount: 3200, icon: Zap, color: '#8B5CF6', percentage: 13 },
    { category: 'Housing', amount: 1950, icon: HomeIcon, color: '#10B981', percentage: 7 },
  ];

  const monthlyComparison = [
    { month: 'Aug', income: 82000, expense: 38000 },
    { month: 'Sep', income: 85000, expense: 41000 },
    { month: 'Oct', income: 85000, expense: 42350 },
    { month: 'Nov', income: 97000, expense: 45000 },
  ];

  const totalIncome = 85000;
  const totalExpense = 42350;
  const savingsRate = ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary via-blue-600 to-blue-700 p-6 pb-8">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setLocation('/')}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover-elevate active-elevate-2"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">Financial Insights</h1>
            <div className="w-10" />
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <p className="text-xs text-white/80 mb-1">Savings Rate</p>
              <p className="text-2xl font-bold text-white">{savingsRate}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <p className="text-xs text-white/80 mb-1">Income</p>
              <p className="text-lg font-bold text-white">₹{(totalIncome/1000).toFixed(0)}k</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <p className="text-xs text-white/80 mb-1">Expense</p>
              <p className="text-lg font-bold text-white">₹{(totalExpense/1000).toFixed(0)}k</p>
            </div>
          </div>
        </div>

        {/* Spending by Category */}
        <div className="px-4 py-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Spending by Category</h2>
          <div className="space-y-3">
            {spendingByCategory.map((item, index) => {
              const Icon = item.icon;
              // Map display category to transaction category
              const categoryFilter = item.category === 'Food & Dining' ? 'food' 
                : item.category === 'Transport' ? 'transport'
                : item.category === 'Bills' ? 'bills'
                : item.category === 'Housing' ? 'home'
                : item.category.toLowerCase();
              
              return (
                <motion.button
                  key={item.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                  onClick={() => setLocation(`/transactions?category=${categoryFilter}`)}
                  className="w-full rounded-2xl bg-card p-4 shadow-md hover-elevate active-elevate-2 text-left"
                  data-testid={`category-${item.category}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-foreground">{item.category}</p>
                        <span className="text-xs font-bold text-foreground">{item.percentage}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">₹{item.amount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 + (0.1 * index), ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="px-4 pb-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Monthly Trends</h2>
          <div className="rounded-2xl bg-card p-4 shadow-md">
            <div className="space-y-4">
              {monthlyComparison.map((month, index) => {
                const savings = month.income - month.expense;
                const isPositive = savings > 0;
                
                return (
                  <motion.div
                    key={month.month}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className={`pb-4 ${index !== monthlyComparison.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-foreground">{month.month} 2024</p>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span className="text-xs font-semibold">
                          {isPositive ? '+' : ''}₹{savings.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Income: ₹{month.income.toLocaleString('en-IN')}</span>
                      <span>Expense: ₹{month.expense.toLocaleString('en-IN')}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <BottomNav activeTab="insights" />
      </div>
    </div>
  );
}
