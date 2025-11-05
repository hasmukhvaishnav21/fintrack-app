import InvestmentPrices from '../InvestmentPrices';

export default function InvestmentPricesExample() {
  const investments = [
    { 
      name: 'Gold', 
      symbol: 'GOLD', 
      price: 62500, 
      change: 2.3, 
      invested: 50000,
      current: 51150,
      profitLoss: 1150
    },
    { 
      name: 'Silver', 
      symbol: 'SILVER', 
      price: 74800, 
      change: -0.8, 
      invested: 30000,
      current: 29760,
      profitLoss: -240
    }
  ];

  return <InvestmentPrices investments={investments} />;
}
