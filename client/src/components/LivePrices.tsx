import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";

interface PriceData {
  name: string;
  symbol: string;
  price: number;
  change: number;
  icon: string;
}

interface LivePricesProps {
  prices: PriceData[];
}

export default function LivePrices({ prices: initialPrices }: LivePricesProps) {
  const [prices, setPrices] = useState(initialPrices);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(price => {
        const randomChange = (Math.random() - 0.5) * 0.5;
        return {
          ...price,
          change: price.change + randomChange
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-20 px-4" data-testid="section-live-prices">
      <h2 className="text-base font-semibold text-foreground mb-3">Live Prices</h2>
      <div className="rounded-xl bg-card p-4 shadow-md">
        <div className="grid grid-cols-3 gap-4">
          {prices.map((price, index) => (
            <motion.div
              key={price.symbol}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="text-center"
              data-testid={`price-${price.symbol}`}
            >
              <div className="text-2xl mb-1">{price.icon}</div>
              <p className="text-xs font-medium text-muted-foreground mb-1">{price.name}</p>
              <p className="text-sm font-bold text-foreground mb-1">₹{price.price.toLocaleString('en-IN')}</p>
              <motion.div
                key={price.change}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center justify-center gap-1 ${price.change >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {price.change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="text-xs font-medium">
                  {price.change >= 0 ? '+' : ''}{price.change.toFixed(2)}%
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
