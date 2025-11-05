import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, Award, Sparkles, Medal, Coins } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Investment } from "@shared/schema";

interface AddInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editInvestment?: Investment | null;
}

const investmentTypes = [
  { id: 'gold', label: 'Gold', price: 62500, unit: 'gram', color: '#D4AF37', IconComponent: Medal },
  { id: 'silver', label: 'Silver', price: 74800, unit: 'kg', color: '#C0C0C0', IconComponent: Coins },
];

const goldCaratOptions = [
  { id: '22K', label: '22 Carat', price: 5850, purity: '91.6%', IconComponent: Award },
  { id: '24K', label: '24 Carat', price: 6350, purity: '99.9%', IconComponent: Sparkles },
];

export default function AddInvestmentModal({ isOpen, onClose, editInvestment }: AddInvestmentModalProps) {
  const [type, setType] = useState('gold');
  const [carat, setCarat] = useState('22K');
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();
  
  const isEditMode = !!editInvestment;

  useEffect(() => {
    if (editInvestment) {
      setType(editInvestment.type);
      setCarat(editInvestment.carat || '22K');
      setQuantity(editInvestment.quantity);
      setDate(new Date(editInvestment.date).toISOString().split('T')[0]);
    } else {
      setType('gold');
      setCarat('22K');
      setQuantity('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editInvestment]);

  const selectedType = investmentTypes.find(t => t.id === type);
  const selectedCarat = goldCaratOptions.find(c => c.id === carat);
  
  // Determine if user changed type or carat from original
  const typeOrCaratChanged = isEditMode && editInvestment && (
    editInvestment.type !== type || 
    (type === 'gold' && editInvestment.carat !== carat)
  );
  
  // Use current market price if adding new or if type/carat changed
  // Otherwise preserve historical price
  const currentMarketPrice = type === 'gold' ? (selectedCarat?.price || 0) : (selectedType?.price || 0);
  const currentPrice = isEditMode && editInvestment && !typeOrCaratChanged
    ? parseFloat(editInvestment.pricePerUnit)
    : currentMarketPrice;
  const calculatedAmount = quantity ? (parseFloat(quantity) * currentPrice).toFixed(0) : '';

  const addInvestmentMutation = useMutation({
    mutationFn: (data: any) => {
      if (isEditMode && editInvestment) {
        return apiRequest("PATCH", `/api/investments/${editInvestment.id}`, data);
      }
      return apiRequest("POST", "/api/investments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/investments"] });
      toast({
        title: isEditMode ? "Investment updated" : "Investment added",
        description: `Your ${type} investment has been ${isEditMode ? 'updated' : 'recorded'} successfully.`,
      });
      onClose();
      setAmount('');
      setQuantity('');
      setCarat('22K');
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? 'update' : 'add'} investment. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Preserve original price only if type/carat unchanged
    // Otherwise use current market price
    const pricePerUnit = isEditMode && editInvestment && !typeOrCaratChanged
      ? editInvestment.pricePerUnit 
      : currentPrice.toString();
    
    const totalAmount = (parseFloat(quantity) * parseFloat(pricePerUnit)).toFixed(0);
    
    addInvestmentMutation.mutate({
      type,
      carat: type === 'gold' ? carat : null,
      quantity: quantity,
      pricePerUnit: pricePerUnit,
      totalAmount: totalAmount,
      date: new Date(date).toISOString(),
    });
  };

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
            className="fixed inset-0 bg-black/50 z-50"
            data-testid="modal-backdrop"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 max-w-md mx-auto"
            data-testid="modal-add-investment"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{isEditMode ? 'Edit Investment' : 'Add Investment'}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover-elevate active-elevate-2"
                  data-testid="button-close"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Investment Type */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Investment Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {investmentTypes.map((inv) => {
                      const TypeIcon = inv.IconComponent;
                      return (
                        <button
                          key={inv.id}
                          type="button"
                          onClick={() => setType(inv.id)}
                          className={`p-4 rounded-2xl text-center transition-all ${
                            type === inv.id
                              ? 'bg-primary text-primary-foreground shadow-md'
                              : 'bg-card text-foreground hover-elevate active-elevate-2'
                          }`}
                          data-testid={`type-${inv.id}`}
                        >
                          <div className="flex justify-center mb-2">
                            <TypeIcon className="w-8 h-8" />
                          </div>
                          <div className="font-semibold">{inv.label}</div>
                          <div className="text-xs opacity-80">₹{inv.price.toLocaleString()}/{inv.unit}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Gold Carat Selection - Only show when gold is selected */}
                {type === 'gold' && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Gold Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {goldCaratOptions.map((caratOption) => {
                        const Icon = caratOption.IconComponent;
                        return (
                          <button
                            key={caratOption.id}
                            type="button"
                            onClick={() => setCarat(caratOption.id)}
                            className={`p-4 rounded-2xl transition-all ${
                              carat === caratOption.id
                                ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-md'
                                : 'bg-card text-foreground border border-border hover-elevate active-elevate-2'
                            }`}
                            data-testid={`carat-${caratOption.id}`}
                          >
                            <div className="flex justify-center mb-2">
                              <Icon className="w-8 h-8" />
                            </div>
                            <div className="font-semibold">{caratOption.label}</div>
                            <div className="text-xs opacity-80 mt-1">Purity: {caratOption.purity}</div>
                            <div className="text-xs font-medium mt-1">₹{caratOption.price.toLocaleString()}/g</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Quantity ({selectedType?.unit}s)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-4 text-xl font-bold rounded-2xl bg-card text-foreground border border-border focus:outline-none focus:border-primary"
                    data-testid="input-quantity"
                    required
                  />
                </div>

                {/* Calculated Amount */}
                {calculatedAmount && (
                  <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Total Investment</p>
                    <p className="text-2xl font-bold text-foreground">₹{parseFloat(calculatedAmount).toLocaleString('en-IN')}</p>
                  </div>
                )}

                {/* Date */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Purchase Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-card text-foreground border border-border focus:outline-none focus:border-primary"
                    data-testid="input-date"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg hover-elevate active-elevate-2"
                  data-testid="button-submit"
                >
                  {isEditMode ? 'Update Investment' : 'Add Investment'}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
