import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";

interface InvestmentData {
  name: string;
  symbol: string;
  price: number;
  change: number;
  profitLoss: number;
  invested: number;
  current: number;
}

interface InvestmentPricesProps {
  investments: InvestmentData[];
}

export default function InvestmentPrices({ investments: initialInvestments }: InvestmentPricesProps) {
  const [investments, setInvestments] = useState(initialInvestments);

  useEffect(() => {
    const interval = setInterval(() => {
      setInvestments(prev => prev.map(inv => {
        const randomChange = (Math.random() - 0.5) * 0.3;
        const newChange = inv.change + randomChange;
        const newCurrent = inv.invested * (1 + newChange / 100);
        const newProfitLoss = newCurrent - inv.invested;
        
        return {
          ...inv,
          change: newChange,
          current: newCurrent,
          profitLoss: newProfitLoss
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-6 px-4" data-testid="section-investments">
      <h2 className="text-base font-semibold text-foreground mb-3">Your Investments</h2>
      <div className="space-y-3">
        {investments.map((investment, index) => (
          <motion.div
            key={investment.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            className="rounded-2xl bg-card p-4 shadow-md hover-elevate active-elevate-2"
            data-testid={`investment-${investment.symbol}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{investment.symbol === 'GOLD' ? '🥇' : '🥈'}</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{investment.name}</p>
                  <p className="text-xs text-muted-foreground">₹{investment.price.toLocaleString('en-IN')}/gm</p>
                </div>
              </div>
              <motion.div
                key={investment.change}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg ${investment.change >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
              >
                {investment.change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="text-xs font-semibold">
                  {investment.change >= 0 ? '+' : ''}{investment.change.toFixed(2)}%
                </span>
              </motion.div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Invested</p>
                <p className="text-sm font-medium text-foreground">₹{investment.invested.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Current</p>
                <p className="text-sm font-medium text-foreground">₹{Math.round(investment.current).toLocaleString('en-IN')}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">P&L</p>
                <p className={`text-sm font-bold ${investment.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {investment.profitLoss >= 0 ? '+' : ''}₹{Math.round(investment.profitLoss).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
