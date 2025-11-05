import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AddSplitBillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Participant {
  id: string;
  name: string;
  phoneNumber: string;
  share: number;
}

export default function SplitBillModal({ isOpen, onClose }: AddSplitBillModalProps) {
  const { toast } = useToast();
  const [totalAmount, setTotalAmount] = useState("");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([
    { id: "1", name: "You", phoneNumber: "", share: 0 },
  ]);

  const createBillMutation = useMutation({
    mutationFn: async (data: any) => {
      const billRes = await apiRequest("POST", "/api/split-bills", {
        description: data.description,
        totalAmount: data.totalAmount,
        createdBy: "You",
        settled: false,
      });
      const bill = await billRes.json();
      
      // Create participants
      for (const participant of data.participants) {
        await apiRequest("POST", `/api/split-bills/${bill.id}/participants`, {
          name: participant.name,
          phoneNumber: participant.phoneNumber,
          share: participant.share.toString(),
          settled: false,
        });
      }
      
      return bill;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/split-bills"] });
      toast({
        title: "Bill created",
        description: "Split bill has been created successfully.",
      });
      resetForm();
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create split bill. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addParticipant = () => {
    const newId = (participants.length + 1).toString();
    setParticipants([...participants, { id: newId, name: "", phoneNumber: "", share: 0 }]);
  };

  const removeParticipant = (id: string) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((p) => p.id !== id));
    }
  };

  const updateParticipant = (id: string, field: keyof Participant, value: string | number) => {
    setParticipants(participants.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const splitEqually = () => {
    if (totalAmount && participants.length > 0) {
      const equalShare = parseFloat(totalAmount) / participants.length;
      setParticipants(participants.map((p) => ({ ...p, share: equalShare })));
    }
  };

  const resetForm = () => {
    setTotalAmount("");
    setDescription("");
    setParticipants([{ id: "1", name: "You", phoneNumber: "", share: 0 }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid total amount.",
        variant: "destructive",
      });
      return;
    }

    if (participants.some((p) => !p.name || !p.phoneNumber)) {
      toast({
        title: "Missing information",
        description: "Please fill in name and phone number for all participants.",
        variant: "destructive",
      });
      return;
    }

    const totalShares = participants.reduce((sum, p) => sum + (p.share || 0), 0);
    if (Math.abs(totalShares - parseFloat(totalAmount)) > 0.01) {
      toast({
        title: "Invalid shares",
        description: "Total of all shares must equal the bill amount.",
        variant: "destructive",
      });
      return;
    }

    createBillMutation.mutate({
      totalAmount,
      description,
      participants,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            data-testid="modal-backdrop"
          />

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 max-w-md mx-auto max-h-[90vh] overflow-y-auto"
            data-testid="modal-split-bill"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Split Bill</h2>
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
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Total Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-foreground">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-4 text-2xl font-bold rounded-2xl bg-card text-foreground border border-border focus:outline-none focus:border-primary"
                      data-testid="input-total"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Dinner at restaurant"
                    className="w-full px-4 py-3 rounded-2xl bg-card text-foreground border border-border focus:outline-none focus:border-primary"
                    data-testid="input-description"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-muted-foreground">
                      Participants ({participants.length})
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={splitEqually}
                        className="text-xs font-medium text-primary hover-elevate active-elevate-2 px-3 py-1 rounded-full bg-primary/10"
                        data-testid="button-split-equally"
                      >
                        Split Equally
                      </button>
                      <button
                        type="button"
                        onClick={addParticipant}
                        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover-elevate active-elevate-2"
                        data-testid="button-add-participant"
                      >
                        <Plus className="w-4 h-4 text-primary-foreground" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {participants.map((participant, index) => (
                      <div key={participant.id} className="bg-card rounded-2xl p-4 border border-border">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 space-y-3">
                            <input
                              type="text"
                              value={participant.name}
                              onChange={(e) =>
                                updateParticipant(participant.id, "name", e.target.value)
                              }
                              placeholder="Name"
                              className="w-full px-3 py-2 rounded-xl bg-background text-foreground border border-border focus:outline-none focus:border-primary"
                              data-testid={`input-participant-name-${index}`}
                              required
                            />
                            <input
                              type="tel"
                              value={participant.phoneNumber}
                              onChange={(e) =>
                                updateParticipant(participant.id, "phoneNumber", e.target.value)
                              }
                              placeholder="Phone number"
                              className="w-full px-3 py-2 rounded-xl bg-background text-foreground border border-border focus:outline-none focus:border-primary"
                              data-testid={`input-participant-phone-${index}`}
                              required
                            />
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                                ₹
                              </span>
                              <input
                                type="number"
                                value={participant.share || ""}
                                onChange={(e) =>
                                  updateParticipant(participant.id, "share", parseFloat(e.target.value) || 0)
                                }
                                placeholder="Share amount"
                                className="w-full pl-8 pr-3 py-2 rounded-xl bg-background text-foreground border border-border focus:outline-none focus:border-primary"
                                data-testid={`input-participant-share-${index}`}
                                required
                              />
                            </div>
                          </div>
                          {participants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeParticipant(participant.id)}
                              className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center hover-elevate active-elevate-2 mt-1"
                              data-testid={`button-remove-participant-${index}`}
                            >
                              <Minus className="w-4 h-4 text-red-500" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      onClose();
                    }}
                    className="flex-1"
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createBillMutation.isPending}
                    className="flex-1"
                    data-testid="button-create"
                  >
                    {createBillMutation.isPending ? "Creating..." : "Create Bill"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
