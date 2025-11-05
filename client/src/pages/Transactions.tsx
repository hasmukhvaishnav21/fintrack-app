import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Filter,
  ArrowDownCircle,
  ArrowUpCircle,
  Edit2,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import EditTransactionModal from "@/components/modals/EditTransactionModal";

type FilterType = "all" | "income" | "expense";

export default function Transactions() {
  const [location, setLocation] = useLocation();
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle URL query parameters for filter and category
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filterParam = params.get("filter");
    const categoryParam = params.get("category");
    
    if (filterParam === "income" || filterParam === "expense") {
      setFilter(filterParam);
    }
    
    if (categoryParam) {
      setSearchQuery(categoryParam);
    }
  }, [location]);

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Transaction deleted",
        description: "The transaction has been removed successfully.",
      });
      setActiveMenu(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredTransactions = transactions
    .filter((tx) => {
      if (filter === "income") return tx.type === "income";
      if (filter === "expense") return tx.type === "expense";
      return true;
    })
    .filter(
      (tx) =>
        tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.description && tx.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setLocation("/")}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover-elevate active-elevate-2"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Transactions</h1>
          <div className="w-10" />
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 text-white placeholder:text-white/60 border border-white/20 focus:outline-none focus:border-white/40"
            data-testid="input-search"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <p className="text-xs opacity-80 mb-1">Total Income</p>
            <p className="text-lg font-bold">₹{totalIncome.toLocaleString("en-IN")}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <p className="text-xs opacity-80 mb-1">Total Expense</p>
            <p className="text-lg font-bold">₹{totalExpense.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-muted rounded-2xl">
          {(["all", "income", "expense"] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                filter === filterType
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
              data-testid={`filter-${filterType}`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <Card className="p-4 relative">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === "income" ? "bg-green-500/10" : "bg-red-500/10"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <ArrowDownCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{transaction.category}</p>
                      {transaction.description && (
                        <p className="text-xs text-muted-foreground">{transaction.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p
                        className={`font-bold text-lg ${
                          transaction.type === "income" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}₹
                        {parseFloat(transaction.amount).toLocaleString("en-IN")}
                      </p>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenu(activeMenu === transaction.id ? null : transaction.id)
                          }
                          className="p-2 hover-elevate active-elevate-2 rounded-full"
                          data-testid={`button-menu-${transaction.id}`}
                        >
                          <MoreVertical className="w-5 h-5 text-muted-foreground" />
                        </button>
                        <AnimatePresence>
                          {activeMenu === transaction.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-10"
                            >
                              <button
                                onClick={() => {
                                  setEditingTransaction(transaction);
                                  setActiveMenu(null);
                                }}
                                className="w-full px-4 py-3 text-left text-sm flex items-center gap-2 hover-elevate active-elevate-2"
                                data-testid={`button-edit-${transaction.id}`}
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(transaction.id)}
                                className="w-full px-4 py-3 text-left text-sm flex items-center gap-2 text-red-500 hover-elevate active-elevate-2"
                                data-testid={`button-delete-${transaction.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
        />
      )}
    </div>
  );
}
