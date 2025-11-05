import type { Transaction, Investment, Goal } from "@shared/schema";

// Demo data for standalone APK mode
export const demoTransactions: Transaction[] = [
  {
    id: "demo-tx-1",
    type: 'income',
    amount: '50000',
    category: 'Salary',
    description: 'Monthly salary - October',
    date: new Date('2024-10-01'),
    createdAt: new Date('2024-10-01')
  },
  {
    id: "demo-tx-2",
    type: 'income',
    amount: '15000',
    category: 'Freelance',
    description: 'Web development project',
    date: new Date('2024-10-15'),
    createdAt: new Date('2024-10-15')
  },
  {
    id: "demo-tx-3",
    type: 'income',
    amount: '20000',
    category: 'Bonus',
    description: 'Quarterly performance bonus',
    date: new Date('2024-10-20'),
    createdAt: new Date('2024-10-20')
  },
  {
    id: "demo-tx-4",
    type: 'expense',
    amount: '15000',
    category: 'Rent',
    description: 'Monthly rent payment',
    date: new Date('2024-10-05'),
    createdAt: new Date('2024-10-05')
  },
  {
    id: "demo-tx-5",
    type: 'expense',
    amount: '3500',
    category: 'Food',
    description: 'Groceries and dining',
    date: new Date('2024-10-10'),
    createdAt: new Date('2024-10-10')
  },
  {
    id: "demo-tx-6",
    type: 'expense',
    amount: '2500',
    category: 'Transport',
    description: 'Fuel and cab expenses',
    date: new Date('2024-10-12'),
    createdAt: new Date('2024-10-12')
  },
  {
    id: "demo-tx-7",
    type: 'expense',
    amount: '8500',
    category: 'Shopping',
    description: 'Clothing and electronics',
    date: new Date('2024-10-18'),
    createdAt: new Date('2024-10-18')
  },
  {
    id: "demo-tx-8",
    type: 'expense',
    amount: '1200',
    category: 'Entertainment',
    description: 'Movie tickets and streaming',
    date: new Date('2024-10-22'),
    createdAt: new Date('2024-10-22')
  },
];

export const demoInvestments: Investment[] = [
  {
    id: "demo-inv-1",
    type: 'gold',
    carat: '22K',
    quantity: '10',
    pricePerUnit: '5800',
    totalAmount: '58000',
    date: new Date('2024-09-15'),
    createdAt: new Date('2024-09-15')
  },
  {
    id: "demo-inv-2",
    type: 'gold',
    carat: '24K',
    quantity: '5',
    pricePerUnit: '6300',
    totalAmount: '31500',
    date: new Date('2024-10-05'),
    createdAt: new Date('2024-10-05')
  },
  {
    id: "demo-inv-3",
    type: 'silver',
    carat: null,
    quantity: '50',
    pricePerUnit: '85',
    totalAmount: '4250',
    date: new Date('2024-09-20'),
    createdAt: new Date('2024-09-20')
  },
  {
    id: "demo-inv-4",
    type: 'silver',
    carat: null,
    quantity: '30',
    pricePerUnit: '87',
    totalAmount: '2610',
    date: new Date('2024-10-10'),
    createdAt: new Date('2024-10-10')
  },
];

export const demoGoals: Goal[] = [
  {
    id: "demo-goal-1",
    name: 'New Bike',
    targetAmount: '100000',
    currentAmount: '45000',
    icon: 'bike',
    targetDate: new Date('2025-06-01'),
    createdAt: new Date('2024-08-01')
  },
  {
    id: "demo-goal-2",
    name: 'Vacation Fund',
    targetAmount: '75000',
    currentAmount: '28000',
    icon: 'plane',
    targetDate: new Date('2025-03-01'),
    createdAt: new Date('2024-09-01')
  },
  {
    id: "demo-goal-3",
    name: 'Emergency Fund',
    targetAmount: '150000',
    currentAmount: '65000',
    icon: 'home',
    targetDate: new Date('2025-12-31'),
    createdAt: new Date('2024-07-01')
  },
];
