import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingDown, Wallet, Percent, AlertTriangle, CheckCircle } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface WithdrawShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityId: string;
  communityName: string;
}

interface ShareInfo {
  totalContributed: string;
  sharePercentage: number;
  withdrawalAmount: string;
  communityTotalValue: string;
}

export default function WithdrawShareModal({ isOpen, onClose, communityId, communityName }: WithdrawShareModalProps) {
  const { toast } = useToast();

  // Fetch member's share calculation
  const { data: shareInfo, isLoading } = useQuery<ShareInfo>({
    queryKey: ['/api/communities', communityId, 'my-share'],
    enabled: isOpen && !!communityId,
  });

  const withdrawMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/communities/${communityId}/withdraw`, {});
      const data = await response.json();
      return data;
    },
    onSuccess: (data: any) => {
      try {
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['/api/communities'] });
        queryClient.invalidateQueries({ queryKey: ['/api/communities', communityId] });
        
        // Show success toast
        const amount = data?.withdrawalAmount || '0';
        toast({
          title: 'Withdrawal Successful',
          description: `₹${parseFloat(amount).toLocaleString('en-IN')} withdrawn successfully.`,
        });
        
        // Close modal after a short delay to allow toast to show
        setTimeout(() => {
          onClose();
        }, 100);
      } catch (error) {
        console.error('Error in withdrawal success handler:', error);
        // Still close the modal even if there's an error
        onClose();
      }
    },
    onError: (error: any) => {
      console.error('Withdrawal error:', error);
      toast({
        title: 'Withdrawal Failed',
        description: error.message || 'Failed to process withdrawal',
        variant: 'destructive',
      });
    },
  });

  const handleWithdraw = () => {
    withdrawMutation.mutate();
  };

  const totalContributed = shareInfo ? parseFloat(shareInfo.totalContributed) : 0;
  const withdrawalAmount = shareInfo ? parseFloat(shareInfo.withdrawalAmount) : 0;
  const sharePercentage = shareInfo?.sharePercentage || 0;
  const communityTotalValue = shareInfo ? parseFloat(shareInfo.communityTotalValue) : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
            data-testid="modal-withdraw-share"
          >
            {/* Header */}
            <div className="flex-shrink-0 px-4 pt-12 pb-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Withdraw My Share</h2>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-card flex items-center justify-center hover-elevate active-elevate-2"
                  data-testid="button-close"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                From {communityName}
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {/* Warning Card */}
                  <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold text-destructive mb-1">
                          Permanent Action
                        </h3>
                        <p className="text-xs text-destructive/80">
                          Withdrawing will exit you from the community. This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Share Details */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                    <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      Your Share Details
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Your Share</span>
                        </div>
                        <span className="text-base font-semibold text-primary">
                          {sharePercentage.toFixed(2)}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-t border-border">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Total Contributed</span>
                        </div>
                        <span className="text-base font-semibold text-foreground">
                          ₹{totalContributed.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-t border-border">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Community Total</span>
                        </div>
                        <span className="text-base font-medium text-muted-foreground">
                          ₹{communityTotalValue.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Withdrawal Amount Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        You will receive
                      </p>
                      <div className="text-3xl font-bold text-primary mb-1">
                        ₹{withdrawalAmount.toLocaleString('en-IN')}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Based on your {sharePercentage.toFixed(2)}% share
                      </p>
                    </div>
                  </div>

                  {/* Info Card */}
                  <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      What happens next?
                    </h4>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Your share will be withdrawn from community wallet and positions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>You will be marked as exited from this community</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Amount will be credited to your personal account</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Other members will continue with their shares</span>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex-shrink-0 p-4 border-t border-border space-y-3">
              <Button
                onClick={handleWithdraw}
                disabled={withdrawMutation.isPending || isLoading || withdrawalAmount <= 0}
                className="w-full"
                data-testid="button-confirm-withdraw"
              >
                {withdrawMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>Confirm Withdrawal</>
                )}
              </Button>
              
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full"
                data-testid="button-cancel"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
