import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, TrendingUp, TrendingDown, Plus, Pencil, Trash2, MoreVertical } from "lucide-react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Investment } from "@shared/schema";
import AddInvestmentModal from "@/components/modals/AddInvestmentModal";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Investments() {
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"gold" | "silver">("gold");
  const [showAddInvestment, setShowAddInvestment] = useState(false);
  const [editInvestment, setEditInvestment] = useState<Investment | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Investment | null>(null);
  const { toast } = useToast();

  const { data: investments = [], isLoading } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
  });

  // Current prices (in real app, these would come from an API)
  const current22KPrice = 5850; // per gram
  const current24KPrice = 6350; // per gram
  const currentSilverPrice = 92; // per gram

  const goldInvestments = investments.filter((i) => i.type === "gold");
  const silverInvestments = investments.filter((i) => i.type === "silver");
  
  // Separate 22K and 24K gold
  const gold22KInvestments = goldInvestments.filter((i) => i.carat === "22K");
  const gold24KInvestments = goldInvestments.filter((i) => i.carat === "24K");

  // Calculate 22K gold metrics
  const total22KQuantity = gold22KInvestments.reduce((sum, i) => sum + parseFloat(i.quantity), 0);
  const total22KCost = gold22KInvestments.reduce((sum, i) => sum + parseFloat(i.totalAmount), 0);
  const current22KValue = total22KQuantity * current22KPrice;
  const gold22KPL = current22KValue - total22KCost;
  const gold22KPLPercent = total22KCost > 0 ? (gold22KPL / total22KCost) * 100 : 0;

  // Calculate 24K gold metrics
  const total24KQuantity = gold24KInvestments.reduce((sum, i) => sum + parseFloat(i.quantity), 0);
  const total24KCost = gold24KInvestments.reduce((sum, i) => sum + parseFloat(i.totalAmount), 0);
  const current24KValue = total24KQuantity * current24KPrice;
  const gold24KPL = current24KValue - total24KCost;
  const gold24KPLPercent = total24KCost > 0 ? (gold24KPL / total24KCost) * 100 : 0;

  // Combined gold metrics
  const totalGoldQuantity = total22KQuantity + total24KQuantity;
  const totalGoldCost = total22KCost + total24KCost;
  const currentGoldValue = current22KValue + current24KValue;
  const goldPL = gold22KPL + gold24KPL;
  const goldPLPercent = totalGoldCost > 0 ? (goldPL / totalGoldCost) * 100 : 0;

  const totalSilverQuantity = silverInvestments.reduce((sum, i) => sum + parseFloat(i.quantity), 0);
  const totalSilverCost = silverInvestments.reduce((sum, i) => sum + parseFloat(i.totalAmount), 0);
  const currentSilverValue = totalSilverQuantity * currentSilverPrice;
  const silverPL = currentSilverValue - totalSilverCost;
  const silverPLPercent = totalSilverCost > 0 ? (silverPL / totalSilverCost) * 100 : 0;

  const activeInvestments = activeTab === "gold" ? goldInvestments : silverInvestments;
  const totalQuantity = activeTab === "gold" ? totalGoldQuantity : totalSilverQuantity;
  const totalCost = activeTab === "gold" ? totalGoldCost : totalSilverCost;
  const currentValue = activeTab === "gold" ? currentGoldValue : currentSilverValue;
  const profitLoss = activeTab === "gold" ? goldPL : silverPL;
  const profitLossPercent = activeTab === "gold" ? goldPLPercent : silverPLPercent;
  
  // Helper function to get current price for an investment
  const getCurrentPrice = (investment: Investment) => {
    if (investment.type === "silver") return currentSilverPrice;
    if (investment.carat === "22K") return current22KPrice;
    if (investment.carat === "24K") return current24KPrice;
    return 0;
  };

  const deleteInvestmentMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/investments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/investments"] });
      toast({
        title: "Investment deleted",
        description: "The investment has been removed successfully.",
      });
      setDeleteConfirm(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete investment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (investment: Investment) => {
    setEditInvestment(investment);
    setShowAddInvestment(true);
  };

  const handleDelete = (investment: Investment) => {
    setDeleteConfirm(investment);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteInvestmentMutation.mutate(deleteConfirm.id);
    }
  };

  const handleModalClose = () => {
    setShowAddInvestment(false);
    setEditInvestment(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-500 via-yellow-600 to-amber-600 text-white px-6 pb-6 pt-12 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setLocation("/")}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover-elevate active-elevate-2"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Investments</h1>
          <button
            onClick={() => setShowAddInvestment(true)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover-elevate active-elevate-2"
            data-testid="button-add-investment"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Total Summary */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
          <p className="text-xs opacity-80 mb-1">Total Portfolio Value</p>
          <p className="text-3xl font-bold mb-3">
            ₹{(currentGoldValue + currentSilverValue).toLocaleString("en-IN")}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs opacity-80">Gold</p>
              <p className="text-sm font-bold">{totalGoldQuantity.toFixed(1)}g</p>
            </div>
            <div className="flex-1">
              <p className="text-xs opacity-80">Silver</p>
              <p className="text-sm font-bold">{totalSilverQuantity.toFixed(1)}g</p>
            </div>
            <div className="flex-1 text-right">
              <p className="text-xs opacity-80">Total P/L</p>
              <p className={`text-sm font-bold ${goldPL + silverPL >= 0 ? "text-green-300" : "text-red-300"}`}>
                {goldPL + silverPL >= 0 ? "+" : ""}₹{(goldPL + silverPL).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tab Selector */}
        <div className="flex gap-2 mb-6 p-1 bg-muted rounded-2xl">
          <button
            onClick={() => setActiveTab("gold")}
            className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all ${
              activeTab === "gold"
                ? "bg-yellow-500 text-white"
                : "text-muted-foreground"
            }`}
            data-testid="tab-gold"
          >
            Gold
          </button>
          <button
            onClick={() => setActiveTab("silver")}
            className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all ${
              activeTab === "silver"
                ? "bg-gray-500 text-white"
                : "text-muted-foreground"
            }`}
            data-testid="tab-silver"
          >
            Silver
          </button>
        </div>

        {/* Holdings Breakdown */}
        {activeTab === "gold" ? (
          <div className="space-y-3 mb-6">
            {/* 22K Gold Card */}
            {total22KQuantity > 0 && (
              <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800" data-testid="card-22k-holdings">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                      22K
                    </span>
                    <span className="text-xs text-muted-foreground">91.6% Purity</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Current Price</p>
                    <p className="text-sm font-bold text-foreground">₹{current22KPrice.toLocaleString("en-IN")}/g</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Holdings</p>
                    <p className="text-lg font-bold text-foreground">{total22KQuantity.toFixed(2)}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Value</p>
                    <p className="text-lg font-bold text-foreground">₹{current22KValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">P/L</p>
                    <p className={`text-sm font-bold ${gold22KPL >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {gold22KPL >= 0 ? "+" : ""}₹{gold22KPL.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      <span className="text-xs ml-1">({gold22KPLPercent.toFixed(1)}%)</span>
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* 24K Gold Card */}
            {total24KQuantity > 0 && (
              <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 border-amber-200 dark:border-amber-800" data-testid="card-24k-holdings">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                      24K
                    </span>
                    <span className="text-xs text-muted-foreground">99.9% Purity</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Current Price</p>
                    <p className="text-sm font-bold text-foreground">₹{current24KPrice.toLocaleString("en-IN")}/g</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Holdings</p>
                    <p className="text-lg font-bold text-foreground">{total24KQuantity.toFixed(2)}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Value</p>
                    <p className="text-lg font-bold text-foreground">₹{current24KValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">P/L</p>
                    <p className={`text-sm font-bold ${gold24KPL >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {gold24KPL >= 0 ? "+" : ""}₹{gold24KPL.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      <span className="text-xs ml-1">({gold24KPLPercent.toFixed(1)}%)</span>
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Total Gold Summary */}
            <Card className="p-4 bg-gradient-to-br from-card to-muted/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Gold</p>
                  <p className="text-xl font-bold text-foreground">{totalGoldQuantity.toFixed(2)}g</p>
                  <p className="text-xs text-muted-foreground">₹{currentGoldValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Total P/L</p>
                  <div className={`flex items-center gap-1 justify-end ${goldPL >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {goldPL >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <p className="text-sm font-bold">
                      {goldPL >= 0 ? "+" : ""}₹{goldPL.toLocaleString("en-IN", { maximumFractionDigits: 0 })} ({goldPLPercent.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="p-5 mb-6 bg-gradient-to-br from-card to-muted/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                <p className="text-3xl font-bold text-foreground">₹{currentSilverPrice.toLocaleString("en-IN")}</p>
                <p className="text-xs text-muted-foreground">per gram</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Your Holdings</p>
                <p className="text-2xl font-bold text-foreground">{totalSilverQuantity.toFixed(2)}g</p>
                <p className="text-xs text-muted-foreground">₹{currentSilverValue.toLocaleString("en-IN")}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Invested</p>
                <p className="text-sm font-semibold text-foreground">₹{totalSilverCost.toLocaleString("en-IN")}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Profit/Loss</p>
                <div className={`flex items-center gap-1 ${silverPL >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {silverPL >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <p className="text-sm font-bold">
                    {silverPL >= 0 ? "+" : ""}₹{silverPL.toLocaleString("en-IN")} ({silverPLPercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Investment History */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-foreground mb-4">Purchase History</h2>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading investments...</p>
          </div>
        ) : activeInvestments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No {activeTab} investments yet
            </p>
            <Button
              onClick={() => setShowAddInvestment(true)}
              className="mt-4"
              data-testid="button-add-first-investment"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Investment
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeInvestments.map((investment) => {
              const investmentCurrentPrice = getCurrentPrice(investment);
              const currentInvestmentValue = parseFloat(investment.quantity) * investmentCurrentPrice;
              const investmentPL = currentInvestmentValue - parseFloat(investment.totalAmount);
              const investmentPLPercent = (investmentPL / parseFloat(investment.totalAmount)) * 100;

              return (
                <motion.div
                  key={investment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-foreground">
                            {parseFloat(investment.quantity).toFixed(2)}g @ ₹
                            {parseFloat(investment.pricePerUnit).toLocaleString("en-IN")}/g
                          </p>
                          {investment.type === "gold" && investment.carat && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                              {investment.carat}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(investment.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">
                            ₹{parseFloat(investment.totalAmount).toLocaleString("en-IN")}
                          </p>
                          <p className="text-xs text-muted-foreground">Invested</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              aria-label="Investment options"
                              data-testid={`button-menu-${investment.id}`}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(investment)}
                              data-testid={`button-edit-${investment.id}`}
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(investment)}
                              className="text-destructive"
                              data-testid={`button-delete-${investment.id}`}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Current Value</p>
                        <p className="text-sm font-semibold text-foreground">
                          ₹{currentInvestmentValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">P/L</p>
                        <p className={`text-sm font-bold ${investmentPL >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {investmentPL >= 0 ? "+" : ""}₹{investmentPL.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          <span className="text-xs ml-1">({investmentPLPercent.toFixed(1)}%)</span>
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Investment Modal */}
      <AddInvestmentModal
        isOpen={showAddInvestment}
        onClose={handleModalClose}
        editInvestment={editInvestment}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="fixed inset-0 bg-black/50 z-50"
              data-testid="modal-backdrop-delete"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-3xl z-50 w-full max-w-sm mx-4 p-6"
              data-testid="modal-delete-confirm"
            >
              <h3 className="text-lg font-bold text-foreground mb-2">Delete Investment?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Are you sure you want to delete this investment? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeleteConfirm(null)}
                  data-testid="button-cancel-delete"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={confirmDelete}
                  data-testid="button-confirm-delete"
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
