import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityId: string;
}

export default function CreateOrderModal({ isOpen, onClose, communityId }: CreateOrderModalProps) {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [metalType, setMetalType] = useState<'gold' | 'silver'>('gold');
  const [carat, setCarat] = useState<'22K' | '24K'>('22K');
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const { toast } = useToast();

  const createOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', `/api/communities/${communityId}/orders`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/communities', communityId, 'orders'] });
      toast({
        title: 'Order Proposed',
        description: 'Your order has been submitted for voting.',
      });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create order',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const quantityNum = parseFloat(quantity);
    const priceNum = parseFloat(pricePerUnit);

    createOrderMutation.mutate({
      orderType,
      metalType,
      carat: metalType === 'gold' ? carat : undefined,
      quantity: quantityNum,
      pricePerUnit: priceNum,
    });
  };

  const handleClose = () => {
    setOrderType('buy');
    setMetalType('gold');
    setCarat('22K');
    setQuantity('');
    setPricePerUnit('');
    onClose();
  };

  const totalAmount = parseFloat(quantity || '0') * parseFloat(pricePerUnit || '0');

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
            data-testid="modal-create-order"
          >
            {/* Header */}
            <div className="flex-shrink-0 px-4 pt-12 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                    orderType === 'buy' ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'
                  } flex items-center justify-center`}>
                    {orderType === 'buy' ? (
                      <TrendingDown className="w-5 h-5 text-white" />
                    ) : (
                      <TrendingUp className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Propose Order</h2>
                </div>
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
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto px-4 space-y-4">
                {/* Order Type */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Order Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'buy' as const, label: 'Buy', icon: TrendingDown, color: 'green' },
                      { id: 'sell' as const, label: 'Sell', icon: TrendingUp, color: 'red' },
                    ].map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setOrderType(type.id)}
                          className={`p-4 rounded-2xl text-center transition-all ${
                            orderType === type.id
                              ? `bg-${type.color}-500/10 border-2 border-${type.color}-500`
                              : 'bg-card border border-border hover-elevate'
                          }`}
                          data-testid={`button-${type.id}`}
                        >
                          <Icon className={`w-6 h-6 mx-auto mb-2 ${
                            orderType === type.id ? `text-${type.color}-500` : 'text-muted-foreground'
                          }`} />
                          <span className={`text-sm font-medium ${
                            orderType === type.id ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {type.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Metal Type */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Metal Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'gold' as const, label: 'Gold', emoji: '🥇' },
                      { id: 'silver' as const, label: 'Silver', emoji: '🥈' },
                    ].map((metal) => (
                      <button
                        key={metal.id}
                        type="button"
                        onClick={() => setMetalType(metal.id)}
                        className={`p-4 rounded-2xl text-center transition-all ${
                          metalType === metal.id
                            ? 'bg-primary/10 border-2 border-primary'
                            : 'bg-card border border-border hover-elevate'
                        }`}
                        data-testid={`button-${metal.id}`}
                      >
                        <span className="text-2xl mb-2 block">{metal.emoji}</span>
                        <span className={`text-sm font-medium ${
                          metalType === metal.id ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {metal.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Carat (Gold only) */}
                {metalType === 'gold' && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Carat
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['22K', '24K'].map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setCarat(k as '22K' | '24K')}
                          className={`p-3 rounded-2xl text-center transition-all ${
                            carat === k
                              ? 'bg-primary/10 border-2 border-primary'
                              : 'bg-card border border-border hover-elevate'
                          }`}
                          data-testid={`button-${k}`}
                        >
                          <span className={`text-sm font-medium ${
                            carat === k ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {k}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Quantity (grams)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0.000"
                    className="w-full px-4 py-3 rounded-2xl bg-card text-foreground border border-border focus:outline-none focus:border-primary text-lg font-semibold"
                    data-testid="input-quantity"
                    required
                  />
                </div>

                {/* Price Per Unit */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Price Per Gram (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-2xl bg-card text-foreground border border-border focus:outline-none focus:border-primary text-lg font-semibold"
                    data-testid="input-price"
                    required
                  />
                </div>

                {/* Total Amount Display */}
                {totalAmount > 0 && (
                  <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-foreground">
                      ₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}

                {/* Info Box */}
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-foreground mb-1 font-medium">
                        Voting Required
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Your proposal will be submitted to community members for voting. It needs approval before execution.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="flex-shrink-0 p-4 border-t border-border">
                <button
                  type="submit"
                  disabled={!quantity || !pricePerUnit || createOrderMutation.isPending}
                  className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold hover-elevate active-elevate-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-submit"
                >
                  {createOrderMutation.isPending ? 'Proposing...' : 'Propose Order'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
