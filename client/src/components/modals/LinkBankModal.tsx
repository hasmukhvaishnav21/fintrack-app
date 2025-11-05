import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, Check, Landmark, CreditCard } from "lucide-react";
import { useState } from "react";

interface LinkBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const banks = [
  { id: 'hdfc', name: 'HDFC Bank', Icon: Landmark, color: '#004C8F' },
  { id: 'sbi', name: 'State Bank of India', Icon: Landmark, color: '#1F4788' },
  { id: 'icici', name: 'ICICI Bank', Icon: Landmark, color: '#F37021' },
  { id: 'axis', name: 'Axis Bank', Icon: Landmark, color: '#97144D' },
  { id: 'kotak', name: 'Kotak Mahindra', Icon: Landmark, color: '#ED232A' },
  { id: 'paytm', name: 'Paytm Payments Bank', Icon: CreditCard, color: '#00B9F5' },
];

export default function LinkBankModal({ isOpen, onClose }: LinkBankModalProps) {
  const [selectedBank, setSelectedBank] = useState('');
  const [step, setStep] = useState<'select' | 'connect'>('select');

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
    setStep('connect');
  };

  const handleConnect = () => {
    console.log('Connecting to bank:', selectedBank);
    // TODO: Implement bank connection flow
    onClose();
    setStep('select');
    setSelectedBank('');
  };

  const selectedBankData = banks.find(b => b.id === selectedBank);

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
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 max-w-md mx-auto max-h-[90vh] overflow-y-auto"
            data-testid="modal-link-bank"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Link Bank Account</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover-elevate active-elevate-2"
                  data-testid="button-close"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {step === 'select' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-4">Select your bank to connect securely</p>
                  
                  {banks.map((bank) => {
                    const BankIcon = bank.Icon;
                    return (
                      <motion.button
                        key={bank.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => handleBankSelect(bank.id)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card hover-elevate active-elevate-2"
                        data-testid={`bank-${bank.id}`}
                      >
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${bank.color}15` }}
                        >
                          <BankIcon className="w-6 h-6" style={{ color: bank.color }} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-semibold text-foreground">{bank.name}</p>
                          <p className="text-xs text-muted-foreground">Secure connection</p>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center">
                          {selectedBank === bank.id && (
                            <div className="w-3 h-3 rounded-full bg-primary" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {step === 'connect' && selectedBankData && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="text-center py-6">
                    <div 
                      className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: `${selectedBankData.color}15` }}
                    >
                      <selectedBankData.Icon className="w-10 h-10" style={{ color: selectedBankData.color }} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{selectedBankData.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      You'll be redirected to securely login to your bank account
                    </p>
                  </div>

                  <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20">
                    <div className="flex items-start gap-3 mb-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">Secure & Encrypted</p>
                        <p className="text-xs text-muted-foreground">Your credentials are never stored</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">Read-Only Access</p>
                        <p className="text-xs text-muted-foreground">We can only view your transactions</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('select')}
                      className="flex-1 py-3 rounded-2xl bg-card text-foreground font-semibold border border-border hover-elevate active-elevate-2"
                      data-testid="button-back"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleConnect}
                      className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold shadow-lg hover-elevate active-elevate-2"
                      data-testid="button-connect"
                    >
                      Connect Securely
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
