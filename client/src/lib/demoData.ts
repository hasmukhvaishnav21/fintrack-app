import type { Transaction, Investment, Goal, Community, CommunityMember, CommunityWallet, CommunityPosition, CommunityOrder, VoteRecord, CommunityContribution } from "@shared/schema";

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

// ==================== COMMUNITY DEMO DATA ====================

export const demoCommunities: Community[] = [
  {
    id: "demo-comm-1",
    name: "Family Gold Savings",
    description: "Our family collective gold investment group",
    adminId: "demo-user-1",
    approvalMode: "simple_majority",
    memberCount: 4,
    createdAt: new Date('2024-09-01')
  },
  {
    id: "demo-comm-2",
    name: "Friends Investment Club",
    description: "Monthly gold & silver investment with friends",
    adminId: "demo-user-1",
    approvalMode: "admin_only",
    memberCount: 3,
    createdAt: new Date('2024-10-01')
  }
];

export const demoCommunityMembers: CommunityMember[] = [
  // Family Gold Savings members
  {
    id: "demo-mem-1",
    communityId: "demo-comm-1",
    userId: "demo-user-1",
    role: "admin",
    joinedAt: new Date('2024-09-01')
  },
  {
    id: "demo-mem-2",
    communityId: "demo-comm-1",
    userId: "demo-user-2",
    role: "member",
    joinedAt: new Date('2024-09-02')
  },
  {
    id: "demo-mem-3",
    communityId: "demo-comm-1",
    userId: "demo-user-3",
    role: "member",
    joinedAt: new Date('2024-09-03')
  },
  {
    id: "demo-mem-4",
    communityId: "demo-comm-1",
    userId: "demo-user-4",
    role: "treasurer",
    joinedAt: new Date('2024-09-02')
  },
  // Friends Investment Club members
  {
    id: "demo-mem-5",
    communityId: "demo-comm-2",
    userId: "demo-user-1",
    role: "admin",
    joinedAt: new Date('2024-10-01')
  },
  {
    id: "demo-mem-6",
    communityId: "demo-comm-2",
    userId: "demo-user-5",
    role: "member",
    joinedAt: new Date('2024-10-02')
  },
  {
    id: "demo-mem-7",
    communityId: "demo-comm-2",
    userId: "demo-user-6",
    role: "member",
    joinedAt: new Date('2024-10-03')
  }
];

export const demoCommunityWallets: CommunityWallet[] = [
  {
    id: "demo-wallet-1",
    communityId: "demo-comm-1",
    balance: "125000",
    updatedAt: new Date('2024-11-01')
  },
  {
    id: "demo-wallet-2",
    communityId: "demo-comm-2",
    balance: "85000",
    updatedAt: new Date('2024-11-01')
  }
];

export const demoCommunityPositions: CommunityPosition[] = [
  // Family Gold Savings positions
  {
    id: "demo-pos-1",
    communityId: "demo-comm-1",
    type: "gold",
    carat: "22K",
    quantity: "25.500",
    avgPricePerUnit: "5850.00",
    totalInvested: "149175.00",
    updatedAt: new Date('2024-10-28')
  },
  {
    id: "demo-pos-2",
    communityId: "demo-comm-1",
    type: "gold",
    carat: "24K",
    quantity: "10.000",
    avgPricePerUnit: "6350.00",
    totalInvested: "63500.00",
    updatedAt: new Date('2024-10-20')
  },
  // Friends Investment Club positions
  {
    id: "demo-pos-3",
    communityId: "demo-comm-2",
    type: "gold",
    carat: "22K",
    quantity: "15.000",
    avgPricePerUnit: "5900.00",
    totalInvested: "88500.00",
    updatedAt: new Date('2024-10-25')
  },
  {
    id: "demo-pos-4",
    communityId: "demo-comm-2",
    type: "silver",
    carat: null,
    quantity: "100.000",
    avgPricePerUnit: "88.00",
    totalInvested: "8800.00",
    updatedAt: new Date('2024-10-15')
  }
];

export const demoCommunityOrders: CommunityOrder[] = [
  {
    id: "demo-order-1",
    communityId: "demo-comm-1",
    proposedBy: "demo-user-1",
    orderType: "buy",
    metalType: "gold",
    carat: "22K",
    quantity: "5.000",
    pricePerUnit: "6050.00",
    totalAmount: "30250.00",
    status: "voting",
    votesFor: 2,
    votesAgainst: 0,
    deadline: new Date('2024-11-10'),
    executedAt: null,
    createdAt: new Date('2024-11-05')
  },
  {
    id: "demo-order-2",
    communityId: "demo-comm-1",
    proposedBy: "demo-user-4",
    orderType: "buy",
    metalType: "gold",
    carat: "24K",
    quantity: "10.000",
    pricePerUnit: "6350.00",
    totalAmount: "63500.00",
    status: "executed",
    votesFor: 3,
    votesAgainst: 0,
    deadline: new Date('2024-10-22'),
    executedAt: new Date('2024-10-20'),
    createdAt: new Date('2024-10-18')
  },
  {
    id: "demo-order-3",
    communityId: "demo-comm-2",
    proposedBy: "demo-user-1",
    orderType: "sell",
    metalType: "silver",
    carat: null,
    quantity: "20.000",
    pricePerUnit: "92.00",
    totalAmount: "1840.00",
    status: "proposed",
    votesFor: 0,
    votesAgainst: 0,
    deadline: new Date('2024-11-12'),
    executedAt: null,
    createdAt: new Date('2024-11-06')
  }
];

export const demoVoteRecords: VoteRecord[] = [
  {
    id: "demo-vote-1",
    orderId: "demo-order-1",
    userId: "demo-user-1",
    vote: "for",
    votedAt: new Date('2024-11-05')
  },
  {
    id: "demo-vote-2",
    orderId: "demo-order-1",
    userId: "demo-user-4",
    vote: "for",
    votedAt: new Date('2024-11-06')
  },
  {
    id: "demo-vote-3",
    orderId: "demo-order-2",
    userId: "demo-user-1",
    vote: "for",
    votedAt: new Date('2024-10-18')
  },
  {
    id: "demo-vote-4",
    orderId: "demo-order-2",
    userId: "demo-user-2",
    vote: "for",
    votedAt: new Date('2024-10-18')
  },
  {
    id: "demo-vote-5",
    orderId: "demo-order-2",
    userId: "demo-user-4",
    vote: "for",
    votedAt: new Date('2024-10-19')
  }
];

export const demoCommunityContributions: CommunityContribution[] = [
  // Family Gold Savings contributions
  {
    id: "demo-contrib-1",
    communityId: "demo-comm-1",
    userId: "demo-user-1",
    orderId: null,
    amount: "50000",
    type: "deposit",
    createdAt: new Date('2024-09-05')
  },
  {
    id: "demo-contrib-2",
    communityId: "demo-comm-1",
    userId: "demo-user-2",
    orderId: null,
    amount: "30000",
    type: "deposit",
    createdAt: new Date('2024-09-06')
  },
  {
    id: "demo-contrib-3",
    communityId: "demo-comm-1",
    userId: "demo-user-3",
    orderId: null,
    amount: "40000",
    type: "deposit",
    createdAt: new Date('2024-09-07')
  },
  {
    id: "demo-contrib-4",
    communityId: "demo-comm-1",
    userId: "demo-user-4",
    orderId: null,
    amount: "55000",
    type: "deposit",
    createdAt: new Date('2024-09-06')
  },
  // Friends Investment Club contributions
  {
    id: "demo-contrib-5",
    communityId: "demo-comm-2",
    userId: "demo-user-1",
    orderId: null,
    amount: "35000",
    type: "deposit",
    createdAt: new Date('2024-10-05')
  },
  {
    id: "demo-contrib-6",
    communityId: "demo-comm-2",
    userId: "demo-user-5",
    orderId: null,
    amount: "30000",
    type: "deposit",
    createdAt: new Date('2024-10-06')
  },
  {
    id: "demo-contrib-7",
    communityId: "demo-comm-2",
    userId: "demo-user-6",
    orderId: null,
    amount: "25000",
    type: "deposit",
    createdAt: new Date('2024-10-07')
  }
];
