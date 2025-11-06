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
    description: "Our family collective gold investment group for long-term wealth building",
    adminId: "demo-user-1",
    approvalMode: "simple_majority",
    memberCount: 5,
    createdAt: new Date('2024-08-15')
  },
  {
    id: "demo-comm-2",
    name: "College Buddies Investment",
    description: "Monthly SIP in gold with college friends - saving for future",
    adminId: "demo-user-1",
    approvalMode: "weighted",
    memberCount: 6,
    createdAt: new Date('2024-09-01')
  },
  {
    id: "demo-comm-3",
    name: "Office Colleagues Pool",
    description: "Quarterly gold purchase pool with office team",
    adminId: "demo-user-8",
    approvalMode: "admin_only",
    memberCount: 4,
    createdAt: new Date('2024-10-01')
  },
  {
    id: "demo-comm-4",
    name: "Neighbor Gold Club",
    description: "Building society residents gold investment group",
    adminId: "demo-user-10",
    approvalMode: "simple_majority",
    memberCount: 8,
    createdAt: new Date('2024-07-20')
  },
  {
    id: "demo-comm-5",
    name: "Wedding Savings Group",
    description: "Friends pooling money for gold jewelry purchases",
    adminId: "demo-user-1",
    approvalMode: "weighted",
    memberCount: 3,
    createdAt: new Date('2024-10-15')
  }
];

export const demoCommunityMembers: CommunityMember[] = [
  // Family Gold Savings members (5 members)
  {
    id: "demo-mem-1",
    communityId: "demo-comm-1",
    userId: "demo-user-1",
    role: "admin",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-08-15')
  },
  {
    id: "demo-mem-2",
    communityId: "demo-comm-1",
    userId: "demo-user-2",
    role: "treasurer",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-08-15')
  },
  {
    id: "demo-mem-3",
    communityId: "demo-comm-1",
    userId: "demo-user-3",
    role: "member",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-08-16')
  },
  {
    id: "demo-mem-4",
    communityId: "demo-comm-1",
    userId: "demo-user-4",
    role: "member",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-08-16')
  },
  {
    id: "demo-mem-5",
    communityId: "demo-comm-1",
    userId: "demo-user-5",
    role: "member",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-08-20')
  },
  
  // College Buddies Investment members (6 members)
  {
    id: "demo-mem-6",
    communityId: "demo-comm-2",
    userId: "demo-user-1",
    role: "admin",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-09-01')
  },
  {
    id: "demo-mem-7",
    communityId: "demo-comm-2",
    userId: "demo-user-6",
    role: "member",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-09-01')
  },
  {
    id: "demo-mem-8",
    communityId: "demo-comm-2",
    userId: "demo-user-7",
    role: "treasurer",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-09-02')
  },
  {
    id: "demo-mem-9",
    communityId: "demo-comm-2",
    userId: "demo-user-8",
    role: "member",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-09-02')
  },
  {
    id: "demo-mem-10",
    communityId: "demo-comm-2",
    userId: "demo-user-9",
    role: "member",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-09-03')
  },
  {
    id: "demo-mem-11",
    communityId: "demo-comm-2",
    userId: "demo-user-10",
    role: "member",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-09-05')
  },
  
  // Office Colleagues Pool members (4 members)
  {
    id: "demo-mem-12",
    communityId: "demo-comm-3",
    userId: "demo-user-8",
    role: "admin",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-10-01')
  },
  {
    id: "demo-mem-13",
    communityId: "demo-comm-3",
    userId: "demo-user-11",
    role: "treasurer",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-10-01')
  },
  {
    id: "demo-mem-14",
    communityId: "demo-comm-3",
    userId: "demo-user-12",
    role: "member",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-10-02')
  },
  {
    id: "demo-mem-15",
    communityId: "demo-comm-3",
    userId: "demo-user-13",
    role: "member",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-10-03')
  },
  
  // Neighbor Gold Club members (8 members)
  {
    id: "demo-mem-16",
    communityId: "demo-comm-4",
    userId: "demo-user-10",
    role: "admin",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-07-20')
  },
  {
    id: "demo-mem-17",
    communityId: "demo-comm-4",
    userId: "demo-user-14",
    role: "treasurer",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-07-20')
  },
  {
    id: "demo-mem-18",
    communityId: "demo-comm-4",
    userId: "demo-user-15",
    role: "member",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-07-21')
  },
  {
    id: "demo-mem-19",
    communityId: "demo-comm-4",
    userId: "demo-user-16",
    role: "member",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-07-22')
  },
  {
    id: "demo-mem-20",
    communityId: "demo-comm-4",
    userId: "demo-user-17",
    role: "member",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-07-23')
  },
  {
    id: "demo-mem-21",
    communityId: "demo-comm-4",
    userId: "demo-user-18",
    role: "member",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-07-25')
  },
  {
    id: "demo-mem-22",
    communityId: "demo-comm-4",
    userId: "demo-user-19",
    role: "member",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-07-28')
  },
  {
    id: "demo-mem-23",
    communityId: "demo-comm-4",
    userId: "demo-user-20",
    role: "member",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-08-01')
  },
  
  // Wedding Savings Group members (3 members)
  {
    id: "demo-mem-24",
    communityId: "demo-comm-5",
    userId: "demo-user-1",
    role: "admin",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-10-15')
  },
  {
    id: "demo-mem-25",
    communityId: "demo-comm-5",
    userId: "demo-user-21",
    role: "treasurer",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-10-15')
  },
  {
    id: "demo-mem-26",
    communityId: "demo-comm-5",
    userId: "demo-user-22",
    role: "member",
    status: "active",
    exitedAt: null,
    joinedAt: new Date('2024-10-16')
  }
];

export const demoCommunityWallets: CommunityWallet[] = [
  {
    id: "demo-wallet-1",
    communityId: "demo-comm-1",
    balance: "45000",
    updatedAt: new Date('2024-11-01')
  },
  {
    id: "demo-wallet-2",
    communityId: "demo-comm-2",
    balance: "120000",
    updatedAt: new Date('2024-11-01')
  },
  {
    id: "demo-wallet-3",
    communityId: "demo-comm-3",
    balance: "75000",
    updatedAt: new Date('2024-11-01')
  },
  {
    id: "demo-wallet-4",
    communityId: "demo-comm-4",
    balance: "280000",
    updatedAt: new Date('2024-11-01')
  },
  {
    id: "demo-wallet-5",
    communityId: "demo-comm-5",
    balance: "15000",
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
    quantity: "42.500",
    avgPricePerUnit: "5820.00",
    totalInvested: "247350.00",
    updatedAt: new Date('2024-10-28')
  },
  {
    id: "demo-pos-2",
    communityId: "demo-comm-1",
    type: "gold",
    carat: "24K",
    quantity: "18.000",
    avgPricePerUnit: "6320.00",
    totalInvested: "113760.00",
    updatedAt: new Date('2024-10-25')
  },
  {
    id: "demo-pos-3",
    communityId: "demo-comm-1",
    type: "silver",
    carat: null,
    quantity: "125.000",
    avgPricePerUnit: "86.50",
    totalInvested: "10812.50",
    updatedAt: new Date('2024-10-20')
  },
  
  // College Buddies Investment positions
  {
    id: "demo-pos-4",
    communityId: "demo-comm-2",
    type: "gold",
    carat: "22K",
    quantity: "28.000",
    avgPricePerUnit: "5880.00",
    totalInvested: "164640.00",
    updatedAt: new Date('2024-10-30')
  },
  {
    id: "demo-pos-5",
    communityId: "demo-comm-2",
    type: "silver",
    carat: null,
    quantity: "200.000",
    avgPricePerUnit: "87.50",
    totalInvested: "17500.00",
    updatedAt: new Date('2024-10-22')
  },
  
  // Office Colleagues Pool positions
  {
    id: "demo-pos-6",
    communityId: "demo-comm-3",
    type: "gold",
    carat: "24K",
    quantity: "25.000",
    avgPricePerUnit: "6380.00",
    totalInvested: "159500.00",
    updatedAt: new Date('2024-10-28')
  },
  {
    id: "demo-pos-7",
    communityId: "demo-comm-3",
    type: "gold",
    carat: "22K",
    quantity: "12.500",
    avgPricePerUnit: "5920.00",
    totalInvested: "74000.00",
    updatedAt: new Date('2024-10-15')
  },
  
  // Neighbor Gold Club positions
  {
    id: "demo-pos-8",
    communityId: "demo-comm-4",
    type: "gold",
    carat: "22K",
    quantity: "85.000",
    avgPricePerUnit: "5750.00",
    totalInvested: "488750.00",
    updatedAt: new Date('2024-10-30')
  },
  {
    id: "demo-pos-9",
    communityId: "demo-comm-4",
    type: "gold",
    carat: "24K",
    quantity: "35.000",
    avgPricePerUnit: "6280.00",
    totalInvested: "219800.00",
    updatedAt: new Date('2024-10-18')
  },
  {
    id: "demo-pos-10",
    communityId: "demo-comm-4",
    type: "silver",
    carat: null,
    quantity: "500.000",
    avgPricePerUnit: "85.00",
    totalInvested: "42500.00",
    updatedAt: new Date('2024-09-25')
  },
  
  // Wedding Savings Group positions
  {
    id: "demo-pos-11",
    communityId: "demo-comm-5",
    type: "gold",
    carat: "22K",
    quantity: "15.000",
    avgPricePerUnit: "5950.00",
    totalInvested: "89250.00",
    updatedAt: new Date('2024-10-28')
  }
];

export const demoCommunityOrders: CommunityOrder[] = [
  // Family Gold Savings orders
  {
    id: "demo-order-1",
    communityId: "demo-comm-1",
    proposedBy: "demo-user-1",
    orderType: "buy",
    metalType: "gold",
    carat: "22K",
    quantity: "8.000",
    pricePerUnit: "6050.00",
    totalAmount: "48400.00",
    status: "voting",
    votesFor: 3,
    votesAgainst: 1,
    deadline: new Date('2024-11-10'),
    executedAt: null,
    createdAt: new Date('2024-11-05')
  },
  {
    id: "demo-order-2",
    communityId: "demo-comm-1",
    proposedBy: "demo-user-2",
    orderType: "buy",
    metalType: "gold",
    carat: "24K",
    quantity: "10.000",
    pricePerUnit: "6350.00",
    totalAmount: "63500.00",
    status: "executed",
    votesFor: 4,
    votesAgainst: 0,
    deadline: new Date('2024-10-22'),
    executedAt: new Date('2024-10-20'),
    createdAt: new Date('2024-10-18')
  },
  {
    id: "demo-order-3",
    communityId: "demo-comm-1",
    proposedBy: "demo-user-3",
    orderType: "buy",
    metalType: "silver",
    carat: null,
    quantity: "75.000",
    pricePerUnit: "88.00",
    totalAmount: "6600.00",
    status: "executed",
    votesFor: 4,
    votesAgainst: 1,
    deadline: new Date('2024-09-25'),
    executedAt: new Date('2024-09-22'),
    createdAt: new Date('2024-09-20')
  },
  {
    id: "demo-order-4",
    communityId: "demo-comm-1",
    proposedBy: "demo-user-4",
    orderType: "sell",
    metalType: "gold",
    carat: "22K",
    quantity: "5.000",
    pricePerUnit: "6100.00",
    totalAmount: "30500.00",
    status: "rejected",
    votesFor: 1,
    votesAgainst: 3,
    deadline: new Date('2024-10-08'),
    executedAt: null,
    createdAt: new Date('2024-10-05')
  },
  
  // College Buddies Investment orders
  {
    id: "demo-order-5",
    communityId: "demo-comm-2",
    proposedBy: "demo-user-1",
    orderType: "buy",
    metalType: "gold",
    carat: "22K",
    quantity: "10.000",
    pricePerUnit: "5950.00",
    totalAmount: "59500.00",
    status: "proposed",
    votesFor: 0,
    votesAgainst: 0,
    deadline: new Date('2024-11-12'),
    executedAt: null,
    createdAt: new Date('2024-11-06')
  },
  {
    id: "demo-order-6",
    communityId: "demo-comm-2",
    proposedBy: "demo-user-7",
    orderType: "buy",
    metalType: "silver",
    carat: null,
    quantity: "100.000",
    pricePerUnit: "89.00",
    totalAmount: "8900.00",
    status: "executed",
    votesFor: 5,
    votesAgainst: 0,
    deadline: new Date('2024-10-25'),
    executedAt: new Date('2024-10-22'),
    createdAt: new Date('2024-10-20')
  },
  {
    id: "demo-order-7",
    communityId: "demo-comm-2",
    proposedBy: "demo-user-6",
    orderType: "sell",
    metalType: "gold",
    carat: "22K",
    quantity: "3.000",
    pricePerUnit: "6000.00",
    totalAmount: "18000.00",
    status: "voting",
    votesFor: 2,
    votesAgainst: 1,
    deadline: new Date('2024-11-09'),
    executedAt: null,
    createdAt: new Date('2024-11-04')
  },
  
  // Office Colleagues Pool orders
  {
    id: "demo-order-8",
    communityId: "demo-comm-3",
    proposedBy: "demo-user-8",
    orderType: "buy",
    metalType: "gold",
    carat: "24K",
    quantity: "15.000",
    pricePerUnit: "6400.00",
    totalAmount: "96000.00",
    status: "executed",
    votesFor: 3,
    votesAgainst: 0,
    deadline: new Date('2024-10-30'),
    executedAt: new Date('2024-10-28'),
    createdAt: new Date('2024-10-25')
  },
  {
    id: "demo-order-9",
    communityId: "demo-comm-3",
    proposedBy: "demo-user-11",
    orderType: "buy",
    metalType: "gold",
    carat: "22K",
    quantity: "12.500",
    pricePerUnit: "5920.00",
    totalAmount: "74000.00",
    status: "executed",
    votesFor: 4,
    votesAgainst: 0,
    deadline: new Date('2024-10-18'),
    executedAt: new Date('2024-10-15'),
    createdAt: new Date('2024-10-12')
  },
  
  // Neighbor Gold Club orders
  {
    id: "demo-order-10",
    communityId: "demo-comm-4",
    proposedBy: "demo-user-10",
    orderType: "buy",
    metalType: "gold",
    carat: "22K",
    quantity: "20.000",
    pricePerUnit: "5980.00",
    totalAmount: "119600.00",
    status: "voting",
    votesFor: 5,
    votesAgainst: 2,
    deadline: new Date('2024-11-11'),
    executedAt: null,
    createdAt: new Date('2024-11-06')
  },
  {
    id: "demo-order-11",
    communityId: "demo-comm-4",
    proposedBy: "demo-user-14",
    orderType: "buy",
    metalType: "silver",
    carat: null,
    quantity: "250.000",
    pricePerUnit: "86.00",
    totalAmount: "21500.00",
    status: "executed",
    votesFor: 7,
    votesAgainst: 0,
    deadline: new Date('2024-09-28'),
    executedAt: new Date('2024-09-25'),
    createdAt: new Date('2024-09-22')
  },
  {
    id: "demo-order-12",
    communityId: "demo-comm-4",
    proposedBy: "demo-user-17",
    orderType: "sell",
    metalType: "silver",
    carat: null,
    quantity: "50.000",
    pricePerUnit: "92.00",
    totalAmount: "4600.00",
    status: "rejected",
    votesFor: 2,
    votesAgainst: 5,
    deadline: new Date('2024-10-12'),
    executedAt: null,
    createdAt: new Date('2024-10-08')
  },
  
  // Wedding Savings Group orders
  {
    id: "demo-order-13",
    communityId: "demo-comm-5",
    proposedBy: "demo-user-1",
    orderType: "buy",
    metalType: "gold",
    carat: "22K",
    quantity: "15.000",
    pricePerUnit: "5950.00",
    totalAmount: "89250.00",
    status: "executed",
    votesFor: 3,
    votesAgainst: 0,
    deadline: new Date('2024-10-30'),
    executedAt: new Date('2024-10-28'),
    createdAt: new Date('2024-10-25')
  },
  {
    id: "demo-order-14",
    communityId: "demo-comm-5",
    proposedBy: "demo-user-21",
    orderType: "buy",
    metalType: "gold",
    carat: "22K",
    quantity: "5.000",
    pricePerUnit: "6020.00",
    totalAmount: "30100.00",
    status: "proposed",
    votesFor: 0,
    votesAgainst: 0,
    deadline: new Date('2024-11-13'),
    executedAt: null,
    createdAt: new Date('2024-11-06')
  }
];

export const demoVoteRecords: VoteRecord[] = [
  // Order 1 votes (Family - voting)
  { id: "demo-vote-1", orderId: "demo-order-1", userId: "demo-user-1", vote: "for", votedAt: new Date('2024-11-05') },
  { id: "demo-vote-2", orderId: "demo-order-1", userId: "demo-user-2", vote: "for", votedAt: new Date('2024-11-06') },
  { id: "demo-vote-3", orderId: "demo-order-1", userId: "demo-user-4", vote: "for", votedAt: new Date('2024-11-06') },
  { id: "demo-vote-4", orderId: "demo-order-1", userId: "demo-user-3", vote: "against", votedAt: new Date('2024-11-07') },
  
  // Order 2 votes (Family - executed)
  { id: "demo-vote-5", orderId: "demo-order-2", userId: "demo-user-1", vote: "for", votedAt: new Date('2024-10-18') },
  { id: "demo-vote-6", orderId: "demo-order-2", userId: "demo-user-2", vote: "for", votedAt: new Date('2024-10-18') },
  { id: "demo-vote-7", orderId: "demo-order-2", userId: "demo-user-3", vote: "for", votedAt: new Date('2024-10-19') },
  { id: "demo-vote-8", orderId: "demo-order-2", userId: "demo-user-4", vote: "for", votedAt: new Date('2024-10-19') },
  
  // Order 3 votes (Family - executed)
  { id: "demo-vote-9", orderId: "demo-order-3", userId: "demo-user-1", vote: "for", votedAt: new Date('2024-09-20') },
  { id: "demo-vote-10", orderId: "demo-order-3", userId: "demo-user-2", vote: "for", votedAt: new Date('2024-09-20') },
  { id: "demo-vote-11", orderId: "demo-order-3", userId: "demo-user-4", vote: "for", votedAt: new Date('2024-09-21') },
  { id: "demo-vote-12", orderId: "demo-order-3", userId: "demo-user-5", vote: "for", votedAt: new Date('2024-09-21') },
  { id: "demo-vote-13", orderId: "demo-order-3", userId: "demo-user-3", vote: "against", votedAt: new Date('2024-09-21') },
  
  // Order 4 votes (Family - rejected)
  { id: "demo-vote-14", orderId: "demo-order-4", userId: "demo-user-4", vote: "for", votedAt: new Date('2024-10-05') },
  { id: "demo-vote-15", orderId: "demo-order-4", userId: "demo-user-1", vote: "against", votedAt: new Date('2024-10-05') },
  { id: "demo-vote-16", orderId: "demo-order-4", userId: "demo-user-2", vote: "against", votedAt: new Date('2024-10-06') },
  { id: "demo-vote-17", orderId: "demo-order-4", userId: "demo-user-3", vote: "against", votedAt: new Date('2024-10-06') },
  
  // Order 6 votes (College - executed)
  { id: "demo-vote-18", orderId: "demo-order-6", userId: "demo-user-1", vote: "for", votedAt: new Date('2024-10-20') },
  { id: "demo-vote-19", orderId: "demo-order-6", userId: "demo-user-6", vote: "for", votedAt: new Date('2024-10-20') },
  { id: "demo-vote-20", orderId: "demo-order-6", userId: "demo-user-7", vote: "for", votedAt: new Date('2024-10-21') },
  { id: "demo-vote-21", orderId: "demo-order-6", userId: "demo-user-8", vote: "for", votedAt: new Date('2024-10-21') },
  { id: "demo-vote-22", orderId: "demo-order-6", userId: "demo-user-9", vote: "for", votedAt: new Date('2024-10-21') },
  
  // Order 7 votes (College - voting)
  { id: "demo-vote-23", orderId: "demo-order-7", userId: "demo-user-1", vote: "for", votedAt: new Date('2024-11-04') },
  { id: "demo-vote-24", orderId: "demo-order-7", userId: "demo-user-7", vote: "for", votedAt: new Date('2024-11-05') },
  { id: "demo-vote-25", orderId: "demo-order-7", userId: "demo-user-6", vote: "against", votedAt: new Date('2024-11-05') },
  
  // Order 8 votes (Office - executed)
  { id: "demo-vote-26", orderId: "demo-order-8", userId: "demo-user-8", vote: "for", votedAt: new Date('2024-10-25') },
  { id: "demo-vote-27", orderId: "demo-order-8", userId: "demo-user-11", vote: "for", votedAt: new Date('2024-10-26') },
  { id: "demo-vote-28", orderId: "demo-order-8", userId: "demo-user-12", vote: "for", votedAt: new Date('2024-10-27') },
  
  // Order 9 votes (Office - executed)
  { id: "demo-vote-29", orderId: "demo-order-9", userId: "demo-user-8", vote: "for", votedAt: new Date('2024-10-12') },
  { id: "demo-vote-30", orderId: "demo-order-9", userId: "demo-user-11", vote: "for", votedAt: new Date('2024-10-12') },
  { id: "demo-vote-31", orderId: "demo-order-9", userId: "demo-user-12", vote: "for", votedAt: new Date('2024-10-13') },
  { id: "demo-vote-32", orderId: "demo-order-9", userId: "demo-user-13", vote: "for", votedAt: new Date('2024-10-13') },
  
  // Order 10 votes (Neighbor - voting)
  { id: "demo-vote-33", orderId: "demo-order-10", userId: "demo-user-10", vote: "for", votedAt: new Date('2024-11-06') },
  { id: "demo-vote-34", orderId: "demo-order-10", userId: "demo-user-14", vote: "for", votedAt: new Date('2024-11-06') },
  { id: "demo-vote-35", orderId: "demo-order-10", userId: "demo-user-15", vote: "for", votedAt: new Date('2024-11-07') },
  { id: "demo-vote-36", orderId: "demo-order-10", userId: "demo-user-16", vote: "for", votedAt: new Date('2024-11-07') },
  { id: "demo-vote-37", orderId: "demo-order-10", userId: "demo-user-17", vote: "for", votedAt: new Date('2024-11-07') },
  { id: "demo-vote-38", orderId: "demo-order-10", userId: "demo-user-18", vote: "against", votedAt: new Date('2024-11-08') },
  { id: "demo-vote-39", orderId: "demo-order-10", userId: "demo-user-19", vote: "against", votedAt: new Date('2024-11-08') },
  
  // Order 11 votes (Neighbor - executed)
  { id: "demo-vote-40", orderId: "demo-order-11", userId: "demo-user-10", vote: "for", votedAt: new Date('2024-09-22') },
  { id: "demo-vote-41", orderId: "demo-order-11", userId: "demo-user-14", vote: "for", votedAt: new Date('2024-09-22') },
  { id: "demo-vote-42", orderId: "demo-order-11", userId: "demo-user-15", vote: "for", votedAt: new Date('2024-09-23') },
  { id: "demo-vote-43", orderId: "demo-order-11", userId: "demo-user-16", vote: "for", votedAt: new Date('2024-09-23') },
  { id: "demo-vote-44", orderId: "demo-order-11", userId: "demo-user-17", vote: "for", votedAt: new Date('2024-09-23') },
  { id: "demo-vote-45", orderId: "demo-order-11", userId: "demo-user-18", vote: "for", votedAt: new Date('2024-09-24') },
  { id: "demo-vote-46", orderId: "demo-order-11", userId: "demo-user-19", vote: "for", votedAt: new Date('2024-09-24') },
  
  // Order 12 votes (Neighbor - rejected)
  { id: "demo-vote-47", orderId: "demo-order-12", userId: "demo-user-17", vote: "for", votedAt: new Date('2024-10-08') },
  { id: "demo-vote-48", orderId: "demo-order-12", userId: "demo-user-18", vote: "for", votedAt: new Date('2024-10-08') },
  { id: "demo-vote-49", orderId: "demo-order-12", userId: "demo-user-10", vote: "against", votedAt: new Date('2024-10-09') },
  { id: "demo-vote-50", orderId: "demo-order-12", userId: "demo-user-14", vote: "against", votedAt: new Date('2024-10-09') },
  { id: "demo-vote-51", orderId: "demo-order-12", userId: "demo-user-15", vote: "against", votedAt: new Date('2024-10-09') },
  { id: "demo-vote-52", orderId: "demo-order-12", userId: "demo-user-16", vote: "against", votedAt: new Date('2024-10-10') },
  { id: "demo-vote-53", orderId: "demo-order-12", userId: "demo-user-19", vote: "against", votedAt: new Date('2024-10-10') },
  
  // Order 13 votes (Wedding - executed)
  { id: "demo-vote-54", orderId: "demo-order-13", userId: "demo-user-1", vote: "for", votedAt: new Date('2024-10-25') },
  { id: "demo-vote-55", orderId: "demo-order-13", userId: "demo-user-21", vote: "for", votedAt: new Date('2024-10-25') },
  { id: "demo-vote-56", orderId: "demo-order-13", userId: "demo-user-22", vote: "for", votedAt: new Date('2024-10-26') }
];

export const demoCommunityContributions: CommunityContribution[] = [
  // Family Gold Savings contributions
  { id: "demo-contrib-1", communityId: "demo-comm-1", userId: "demo-user-1", orderId: null, amount: "100000", type: "deposit", createdAt: new Date('2024-08-16') },
  { id: "demo-contrib-2", communityId: "demo-comm-1", userId: "demo-user-2", orderId: null, amount: "80000", type: "deposit", createdAt: new Date('2024-08-16') },
  { id: "demo-contrib-3", communityId: "demo-comm-1", userId: "demo-user-3", orderId: null, amount: "75000", type: "deposit", createdAt: new Date('2024-08-17') },
  { id: "demo-contrib-4", communityId: "demo-comm-1", userId: "demo-user-4", orderId: null, amount: "90000", type: "deposit", createdAt: new Date('2024-08-17') },
  { id: "demo-contrib-5", communityId: "demo-comm-1", userId: "demo-user-5", orderId: null, amount: "60000", type: "deposit", createdAt: new Date('2024-08-21') },
  { id: "demo-contrib-6", communityId: "demo-comm-1", userId: "demo-user-1", orderId: null, amount: "25000", type: "deposit", createdAt: new Date('2024-10-05') },
  { id: "demo-contrib-7", communityId: "demo-comm-1", userId: "demo-user-3", orderId: null, amount: "15000", type: "deposit", createdAt: new Date('2024-10-12') },
  
  // College Buddies Investment contributions
  { id: "demo-contrib-8", communityId: "demo-comm-2", userId: "demo-user-1", orderId: null, amount: "50000", type: "deposit", createdAt: new Date('2024-09-02') },
  { id: "demo-contrib-9", communityId: "demo-comm-2", userId: "demo-user-6", orderId: null, amount: "40000", type: "deposit", createdAt: new Date('2024-09-02') },
  { id: "demo-contrib-10", communityId: "demo-comm-2", userId: "demo-user-7", orderId: null, amount: "45000", type: "deposit", createdAt: new Date('2024-09-03') },
  { id: "demo-contrib-11", communityId: "demo-comm-2", userId: "demo-user-8", orderId: null, amount: "35000", type: "deposit", createdAt: new Date('2024-09-03') },
  { id: "demo-contrib-12", communityId: "demo-comm-2", userId: "demo-user-9", orderId: null, amount: "30000", type: "deposit", createdAt: new Date('2024-09-04') },
  { id: "demo-contrib-13", communityId: "demo-comm-2", userId: "demo-user-10", orderId: null, amount: "42000", type: "deposit", createdAt: new Date('2024-09-06') },
  { id: "demo-contrib-14", communityId: "demo-comm-2", userId: "demo-user-1", orderId: null, amount: "20000", type: "deposit", createdAt: new Date('2024-10-15') },
  
  // Office Colleagues Pool contributions
  { id: "demo-contrib-15", communityId: "demo-comm-3", userId: "demo-user-8", orderId: null, amount: "75000", type: "deposit", createdAt: new Date('2024-10-02') },
  { id: "demo-contrib-16", communityId: "demo-comm-3", userId: "demo-user-11", orderId: null, amount: "65000", type: "deposit", createdAt: new Date('2024-10-02') },
  { id: "demo-contrib-17", communityId: "demo-comm-3", userId: "demo-user-12", orderId: null, amount: "55000", type: "deposit", createdAt: new Date('2024-10-03') },
  { id: "demo-contrib-18", communityId: "demo-comm-3", userId: "demo-user-13", orderId: null, amount: "60000", type: "deposit", createdAt: new Date('2024-10-04') },
  { id: "demo-contrib-19", communityId: "demo-comm-3", userId: "demo-user-8", orderId: null, amount: "25000", type: "deposit", createdAt: new Date('2024-10-20') },
  
  // Neighbor Gold Club contributions
  { id: "demo-contrib-20", communityId: "demo-comm-4", userId: "demo-user-10", orderId: null, amount: "120000", type: "deposit", createdAt: new Date('2024-07-21') },
  { id: "demo-contrib-21", communityId: "demo-comm-4", userId: "demo-user-14", orderId: null, amount: "100000", type: "deposit", createdAt: new Date('2024-07-21') },
  { id: "demo-contrib-22", communityId: "demo-comm-4", userId: "demo-user-15", orderId: null, amount: "85000", type: "deposit", createdAt: new Date('2024-07-22') },
  { id: "demo-contrib-23", communityId: "demo-comm-4", userId: "demo-user-16", orderId: null, amount: "90000", type: "deposit", createdAt: new Date('2024-07-23') },
  { id: "demo-contrib-24", communityId: "demo-comm-4", userId: "demo-user-17", orderId: null, amount: "75000", type: "deposit", createdAt: new Date('2024-07-24') },
  { id: "demo-contrib-25", communityId: "demo-comm-4", userId: "demo-user-18", orderId: null, amount: "95000", type: "deposit", createdAt: new Date('2024-07-26') },
  { id: "demo-contrib-26", communityId: "demo-comm-4", userId: "demo-user-19", orderId: null, amount: "80000", type: "deposit", createdAt: new Date('2024-07-29') },
  { id: "demo-contrib-27", communityId: "demo-comm-4", userId: "demo-user-20", orderId: null, amount: "70000", type: "deposit", createdAt: new Date('2024-08-02') },
  { id: "demo-contrib-28", communityId: "demo-comm-4", userId: "demo-user-10", orderId: null, amount: "50000", type: "deposit", createdAt: new Date('2024-09-15') },
  { id: "demo-contrib-29", communityId: "demo-comm-4", userId: "demo-user-15", orderId: null, amount: "40000", type: "deposit", createdAt: new Date('2024-10-05') },
  
  // Wedding Savings Group contributions
  { id: "demo-contrib-30", communityId: "demo-comm-5", userId: "demo-user-1", orderId: null, amount: "35000", type: "deposit", createdAt: new Date('2024-10-16') },
  { id: "demo-contrib-31", communityId: "demo-comm-5", userId: "demo-user-21", orderId: null, amount: "38000", type: "deposit", createdAt: new Date('2024-10-16') },
  { id: "demo-contrib-32", communityId: "demo-comm-5", userId: "demo-user-22", orderId: null, amount: "31000", type: "deposit", createdAt: new Date('2024-10-17') }
];
