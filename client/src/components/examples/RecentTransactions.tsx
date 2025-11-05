import RecentTransactions from '../RecentTransactions';
import { ShoppingBag, Utensils, Car } from 'lucide-react';

export default function RecentTransactionsExample() {
  const transactions = [
    {
      id: 'tx1',
      name: 'Shopping',
      date: 'Today, 2:30 PM',
      amount: 2500,
      type: 'debit' as const,
      icon: ShoppingBag,
      category: 'Shopping',
      iconBg: '#EF4444'
    },
    {
      id: 'tx2',
      name: 'Restaurant',
      date: 'Yesterday, 7:45 PM',
      amount: 850,
      type: 'debit' as const,
      icon: Utensils,
      category: 'Food',
      iconBg: '#F59E0B'
    },
    {
      id: 'tx3',
      name: 'Fuel',
      date: 'Nov 1, 9:15 AM',
      amount: 3000,
      type: 'debit' as const,
      icon: Car,
      category: 'Transport',
      iconBg: '#3B82F6'
    }
  ];

  return <RecentTransactions transactions={transactions} />;
}
