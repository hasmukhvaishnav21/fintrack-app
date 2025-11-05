import GoalProgress from '../GoalProgress';
import { Bike, Smartphone, Plane, Home } from 'lucide-react';

export default function GoalProgressExample() {
  const goals = [
    { id: 'bike', name: 'Bike', icon: Bike, target: 80000, current: 65000, color: '#0066FF' },
    { id: 'phone', name: 'Phone', icon: Smartphone, target: 50000, current: 25000, color: '#D4AF37' },
    { id: 'travel', name: 'Travel', icon: Plane, target: 100000, current: 80000, color: '#8B5CF6' },
    { id: 'house', name: 'House', icon: Home, target: 500000, current: 150000, color: '#10B981' },
  ];

  return <GoalProgress goals={goals} />;
}
