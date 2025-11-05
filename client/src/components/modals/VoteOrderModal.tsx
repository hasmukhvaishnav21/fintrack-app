import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ThumbsUp, ThumbsDown, Clock, Users, Info } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { CommunityOrder, VoteRecord } from '@shared/schema';

interface VoteOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: CommunityOrder;
}

export default function VoteOrderModal({ isOpen, onClose, order }: VoteOrderModalProps) {
  const [voteType, setVoteType] = useState<'for' | 'against' | null>(null);
  const { toast } = useToast();

  // Fetch existing votes for this order
  const { data: votes = [] } = useQuery<VoteRecord[]>({
    queryKey: ['/api/communities/orders', order.id, 'votes'],
    enabled: isOpen && !!order.id,
  });

  const voteMutation = useMutation({
    mutationFn: async (data: { vote: 'for' | 'against' }) => {
      return apiRequest('POST', `/api/communities/orders/${order.id}/vote`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/communities'] });
      toast({
        title: 'Vote Submitted',
        description: 'Your vote has been recorded successfully.',
      });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit vote',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voteType) return;
    voteMutation.mutate({ vote: voteType });
  };

  const handleClose = () => {
    setVoteType(null);
    onClose();
  };

  const totalAmount = parseFloat(order.totalAmount || '0');
  const quantity = parseFloat(order.quantity || '0');
  const pricePerUnit = parseFloat(order.pricePerUnit || '0');
  
  const votesForCount = order.votesFor || 0;
  const votesAgainstCount = order.votesAgainst || 0;
  const totalVotes = votesForCount + votesAgainstCount;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 z-[100]"
            data-testid="modal-backdrop"
          />

          {/* Full-Screen Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 max-w-md w-full mx-auto flex flex-col bg-background z-[110]"
            data-testid="modal-vote-order"
          >
            {/* Header */}
            <div className="flex-shrink-0 px-4 pt-12 pb-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Vote on Order</h2>
                <button
                  onClick={handleClose}
                  className="w-9 h-9 rounded-full bg-card flex items-center justify-center hover-elevate active-elevate-2"
                  data-testid="button-close"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {/* Order Details */}
                <div className="p-4 rounded-2xl bg-card border border-border">
                  <h3 className="text-base font-semibold text-foreground mb-3 capitalize">
                    {order.orderType} {order.metalType} {order.carat ? `(${order.carat})` : ''}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="text-foreground font-medium">{quantity.toFixed(3)}g</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price per gram</span>
                      <span className="text-foreground font-medium">₹{pricePerUnit.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-border">
                      <span className="text-muted-foreground font-medium">Total Amount</span>
                      <span className="text-foreground font-semibold">₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Current Votes */}
                <div className="p-4 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <h4 className="text-sm font-semibold text-foreground">Current Votes</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-foreground">In Favor</span>
                      </div>
                      <span className="text-sm font-semibold text-green-500">{votesForCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ThumbsDown className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-foreground">Against</span>
                      </div>
                      <span className="text-sm font-semibold text-red-500">{votesAgainstCount}</span>
                    </div>
                  </div>
                  {totalVotes > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all"
                          style={{ width: `${(votesForCount / totalVotes) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Deadline (if exists) */}
                {order.deadline && (
                  <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Voting Deadline</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.deadline).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vote Selection */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">
                    Cast Your Vote
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setVoteType('for')}
                      className={`p-4 rounded-2xl text-center transition-all ${
                        voteType === 'for'
                          ? 'bg-green-500/10 border-2 border-green-500'
                          : 'bg-card border border-border hover-elevate'
                      }`}
                      data-testid="button-vote-for"
                    >
                      <ThumbsUp
                        className={`w-8 h-8 mx-auto mb-2 ${
                          voteType === 'for' ? 'text-green-500' : 'text-muted-foreground'
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          voteType === 'for' ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        In Favor
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVoteType('against')}
                      className={`p-4 rounded-2xl text-center transition-all ${
                        voteType === 'against'
                          ? 'bg-red-500/10 border-2 border-red-500'
                          : 'bg-card border border-border hover-elevate'
                      }`}
                      data-testid="button-vote-against"
                    >
                      <ThumbsDown
                        className={`w-8 h-8 mx-auto mb-2 ${
                          voteType === 'against' ? 'text-red-500' : 'text-muted-foreground'
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          voteType === 'against' ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        Against
                      </span>
                    </button>
                  </div>
                </div>

                {/* Info Box */}
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        Your vote will be recorded and counted towards the final decision. You cannot change your vote once submitted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="flex-shrink-0 p-4 border-t border-border">
                <button
                  type="submit"
                  disabled={!voteType || voteMutation.isPending}
                  className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold hover-elevate active-elevate-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-submit"
                >
                  {voteMutation.isPending ? 'Submitting...' : 'Submit Vote'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
