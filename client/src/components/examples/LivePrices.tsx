import LivePrices from '../LivePrices';

export default function LivePricesExample() {
  const prices = [
    { name: 'Gold', symbol: 'GOLD', price: 62500, change: 2.3, icon: '🥇' },
    { name: 'Silver', symbol: 'SILVER', price: 74800, change: -0.8, icon: '🥈' },
    { name: 'Bitcoin', symbol: 'BTC', price: 3250000, change: 5.2, icon: '₿' }
  ];

  return <LivePrices prices={prices} />;
}
