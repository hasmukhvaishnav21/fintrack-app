import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Users,
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Vote,
  Settings,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Community, CommunityWallet, CommunityPosition, CommunityMember, CommunityOrder } from '@shared/schema';
import CreateOrderModal from '@/components/modals/CreateOrderModal';
import VoteOrderModal from '@/components/modals/VoteOrderModal';
import WithdrawShareModal from '@/components/modals/WithdrawShareModal';

export default function CommunityDashboard() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'holdings' | 'members' | 'activity'>('holdings');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CommunityOrder | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Fetch community data
  const { data: community, isLoading: loadingCommunity } = useQuery<Community>({
    queryKey: ['/api/communities', id],
  });

  const { data: wallet } = useQuery<CommunityWallet>({
    queryKey: ['/api/communities', id, 'wallet'],
    enabled: !!id,
  });

  const { data: positions = [] } = useQuery<CommunityPosition[]>({
    queryKey: ['/api/communities', id, 'positions'],
    enabled: !!id,
  });

  const { data: members = [] } = useQuery<CommunityMember[]>({
    queryKey: ['/api/communities', id, 'members'],
    enabled: !!id,
  });

  const { data: orders = [] } = useQuery<CommunityOrder[]>({
    queryKey: ['/api/communities', id, 'orders'],
    enabled: !!id,
  });

  if (loadingCommunity) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="flex-shrink-0 px-4 pt-12 pb-4">
          <div className="h-8 bg-card animate-pulse rounded-xl w-48"></div>
        </div>
        <div className="flex-1 px-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-card animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background px-6">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">Community Not Found</h2>
        <p className="text-sm text-muted-foreground mb-6">This community doesn't exist or you don't have access.</p>
        <button
          onClick={() => setLocation('/communities')}
          className="px-6 py-2.5 rounded-xl bg-primary text-white font-medium hover-elevate active-elevate-2"
          data-testid="button-back"
        >
          Back to Communities
        </button>
      </div>
    );
  }

  const totalBalance = parseFloat(wallet?.balance || '0');
  const totalPositionValue = positions.reduce((sum, pos) => sum + parseFloat(pos.totalInvested || '0'), 0);
  const totalValue = totalBalance + totalPositionValue;
  
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const approvedOrders = orders.filter(o => o.status === 'approved');

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-12 pb-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setLocation('/communities')}
            className="w-9 h-9 rounded-full bg-card flex items-center justify-center hover-elevate active-elevate-2"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground truncate">{community.name}</h1>
            <p className="text-xs text-muted-foreground">{members.length} members</p>
          </div>
          <button
            className="w-9 h-9 rounded-full bg-card flex items-center justify-center hover-elevate active-elevate-2"
            data-testid="button-settings"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2">
          {[
            { id: 'holdings' as const, label: 'Holdings', icon: Wallet },
            { id: 'members' as const, label: 'Members', icon: Users },
            { id: 'activity' as const, label: 'Activity', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-card text-muted-foreground hover-elevate'
                }`}
                data-testid={`tab-${tab.id}`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {activeTab === 'holdings' && (
          <HoldingsTab
            wallet={wallet}
            positions={positions}
            totalValue={totalValue}
            onWithdraw={() => setShowWithdrawModal(true)}
          />
        )}
        {activeTab === 'members' && <MembersTab members={members} />}
        {activeTab === 'activity' && (
          <ActivityTab
            orders={orders}
            onOrderClick={(order) => setSelectedOrder(order)}
          />
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setShowOrderModal(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg hover-elevate active-elevate-2"
          data-testid="button-create-order"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>

      <CreateOrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        communityId={id!}
      />
      
      {selectedOrder && (
        <VoteOrderModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
        />
      )}
      
      <WithdrawShareModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        communityId={id!}
        communityName={community.name}
      />
    </div>
  );
}

// Holdings Tab
interface HoldingsTabProps {
  wallet?: CommunityWallet;
  positions: CommunityPosition[];
  totalValue: number;
  onWithdraw: () => void;
}

function HoldingsTab({ wallet, positions, totalValue, onWithdraw }: HoldingsTabProps) {
  const balance = parseFloat(wallet?.balance || '0');

  return (
    <div className="space-y-4">
      {/* Total Value Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-primary to-blue-600"
      >
        <p className="text-sm text-white/80 mb-1">Total Community Value</p>
        <p className="text-3xl font-bold text-white mb-4">₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/80">₹{balance.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/80">
              ₹{(totalValue - balance).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Withdraw My Share Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={onWithdraw}
        className="w-full p-4 rounded-2xl bg-destructive/10 border-2 border-destructive/30 hover-elevate active-elevate-2 flex items-center justify-between"
        data-testid="button-withdraw-share"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-destructive" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-destructive">Withdraw My Share</h3>
            <p className="text-xs text-destructive/70">Exit community & get your funds</p>
          </div>
        </div>
        <ArrowLeft className="w-5 h-5 text-destructive rotate-180" />
      </motion.button>

      {/* Positions */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Positions</h3>
        {positions.length === 0 ? (
          <div className="p-6 rounded-2xl bg-card text-center">
            <p className="text-sm text-muted-foreground">No positions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {positions.map((position) => (
              <PositionCard key={position.id} position={position} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PositionCard({ position }: { position: CommunityPosition }) {
  const totalInvested = parseFloat(position.totalInvested || '0');
  const quantity = parseFloat(position.quantity || '0');
  const avgPrice = parseFloat(position.avgPricePerUnit || '0');

  return (
    <div className="p-4 rounded-2xl bg-card border border-border">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-base font-semibold text-foreground capitalize">
            {position.type} {position.carat ? `(${position.carat})` : ''}
          </h4>
          <p className="text-xs text-muted-foreground">
            {quantity.toFixed(3)} grams
          </p>
        </div>
        <div className="text-right">
          <p className="text-base font-semibold text-foreground">
            ₹{totalInvested.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-muted-foreground">
            Avg: ₹{avgPrice.toLocaleString('en-IN')}/g
          </p>
        </div>
      </div>
    </div>
  );
}

// Members Tab
function MembersTab({ members }: { members: CommunityMember[] }) {
  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div
          key={member.id}
          className="p-4 rounded-2xl bg-card border border-border"
          data-testid={`member-${member.id}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">User {member.userId}</p>
              <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(member.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Activity Tab
interface ActivityTabProps {
  orders: CommunityOrder[];
  onOrderClick: (order: CommunityOrder) => void;
}

function ActivityTab({ orders, onOrderClick }: ActivityTabProps) {
  if (orders.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-card text-center">
        <Vote className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onClick={() => onOrderClick(order)} />
      ))}
    </div>
  );
}

interface OrderCardProps {
  order: CommunityOrder;
  onClick: () => void;
}

function OrderCard({ order, onClick }: OrderCardProps) {
  const statusConfig = {
    proposed: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    voting: { icon: Vote, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    approved: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    executed: { icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-600/10' },
  };

  const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.proposed;
  const Icon = config.icon;
  const totalAmount = parseFloat(order.totalAmount || '0');
  const quantity = parseFloat(order.quantity || '0');

  return (
    <div
      onClick={onClick}
      className="p-4 rounded-2xl bg-card border border-border hover-elevate active-elevate-2 cursor-pointer"
      data-testid={`order-${order.id}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="text-sm font-semibold text-foreground capitalize">
              {order.orderType} {order.metalType} {order.carat ? `(${order.carat})` : ''}
            </h4>
            <p className="text-sm font-semibold text-foreground">₹{totalAmount.toLocaleString('en-IN')}</p>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {quantity.toFixed(3)}g @ ₹{parseFloat(order.pricePerUnit).toLocaleString('en-IN')}/g • {new Date(order.createdAt).toLocaleDateString('en-IN')}
          </p>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color} font-medium capitalize`}>
              {order.status}
            </span>
            <span className="text-xs text-muted-foreground">
              👍 {order.votesFor} • 👎 {order.votesAgainst}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
