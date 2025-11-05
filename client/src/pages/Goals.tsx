import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Target, Plus, Search, Filter, X, SlidersHorizontal, Calendar } from "lucide-react";
import { useLocation, Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Goal } from "@shared/schema";
import { useState, useMemo } from "react";
import AddGoalModal from "@/components/modals/AddGoalModal";

const iconOptions = [
  { value: "bike", label: "Bike", icon: "🏍️" },
  { value: "car", label: "Car", icon: "🚗" },
  { value: "home", label: "Home", icon: "🏠" },
  { value: "plane", label: "Vacation", icon: "✈️" },
  { value: "education", label: "Education", icon: "🎓" },
  { value: "wedding", label: "Wedding", icon: "💍" },
];

type SortOption = "currentAmount" | "name" | "progress" | "targetDate";
type ProgressRange = "all" | "0-25" | "25-50" | "50-75" | "75-100";

export default function Goals() {
  const [_, setLocation] = useLocation();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [progressRange, setProgressRange] = useState<ProgressRange>("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("currentAmount");
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  const { data: goals = [], isLoading } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });

  // Memoized filtered and sorted goals
  const displayedGoals = useMemo(() => {
    let filtered = [...goals];

    // Text search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(goal => 
        goal.name.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(goal => 
        selectedCategories.includes(goal.icon)
      );
    }

    // Progress range filter
    if (progressRange !== "all") {
      filtered = filtered.filter(goal => {
        const progress = (parseFloat(goal.currentAmount) / parseFloat(goal.targetAmount)) * 100;
        switch (progressRange) {
          case "0-25": return progress < 25;
          case "25-50": return progress >= 25 && progress < 50;
          case "50-75": return progress >= 50 && progress < 75;
          case "75-100": return progress >= 75;
          default: return true;
        }
      });
    }

    // Amount range filter
    if (minAmount) {
      const min = parseFloat(minAmount);
      filtered = filtered.filter(goal => parseFloat(goal.targetAmount) >= min);
    }
    if (maxAmount) {
      const max = parseFloat(maxAmount);
      filtered = filtered.filter(goal => parseFloat(goal.targetAmount) <= max);
    }

    // Date range filter
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(goal => {
        if (!goal.targetDate) return false;
        return new Date(goal.targetDate) >= start;
      });
    }
    if (endDate) {
      const end = new Date(endDate);
      filtered = filtered.filter(goal => {
        if (!goal.targetDate) return false;
        return new Date(goal.targetDate) <= end;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "progress": {
          const progressA = (parseFloat(a.currentAmount) / parseFloat(a.targetAmount)) * 100;
          const progressB = (parseFloat(b.currentAmount) / parseFloat(b.targetAmount)) * 100;
          return progressB - progressA;
        }
        case "targetDate": {
          if (!a.targetDate && !b.targetDate) return 0;
          if (!a.targetDate) return 1;
          if (!b.targetDate) return -1;
          return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
        }
        case "currentAmount":
        default:
          return parseFloat(b.currentAmount) - parseFloat(a.currentAmount);
      }
    });

    // Only apply top-10 limit when no filters are active
    const hasActiveFilters = searchQuery.trim() || selectedCategories.length > 0 || 
      progressRange !== "all" || minAmount || maxAmount || startDate || endDate;
    if (!hasActiveFilters) {
      filtered = filtered.slice(0, 10);
    }

    return filtered;
  }, [goals, searchQuery, selectedCategories, progressRange, minAmount, maxAmount, startDate, endDate, sortBy]);

  const hasActiveFilters = searchQuery.trim() || selectedCategories.length > 0 || 
    progressRange !== "all" || minAmount || maxAmount || startDate || endDate;
  const activeFilterCount = 
    (searchQuery.trim() ? 1 : 0) + 
    selectedCategories.length + 
    (progressRange !== "all" ? 1 : 0) +
    (minAmount ? 1 : 0) +
    (maxAmount ? 1 : 0) +
    (startDate ? 1 : 0) +
    (endDate ? 1 : 0);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setProgressRange("all");
    setMinAmount("");
    setMaxAmount("");
    setStartDate("");
    setEndDate("");
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
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
          <h1 className="text-xl font-bold">All Savings Goals</h1>
          <button
            onClick={() => setShowAddGoal(true)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover-elevate active-elevate-2"
            data-testid="button-add-goal"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Summary */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
          <p className="text-xs opacity-80 mb-1">Total Saved</p>
          <p className="text-3xl font-bold mb-3">
            ₹{goals.reduce((sum, goal) => sum + parseFloat(goal.currentAmount), 0).toLocaleString("en-IN")}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs opacity-80">Active Goals</p>
              <p className="text-sm font-bold">{goals.length}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs opacity-80">Total Target</p>
              <p className="text-sm font-bold">
                ₹{goals.reduce((sum, goal) => sum + parseFloat(goal.targetAmount), 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Filter Bar */}
        {goals.length > 0 && (
          <div className="mb-6 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search goals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
                data-testid="input-search-goals"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  data-testid="button-clear-search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Button and Sort */}
            <div className="flex items-center gap-3">
              <Sheet open={showFilterSheet} onOpenChange={setShowFilterSheet}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex-1 relative"
                    data-testid="button-filter"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge 
                        className="ml-2 min-w-5 h-5 flex items-center justify-center p-1"
                        data-testid="badge-filter-count"
                      >
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filter Goals</SheetTitle>
                  </SheetHeader>
                  
                  <div className="space-y-6 mt-6">
                    {/* Category Filter */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-foreground">Category</h3>
                      <div className="flex flex-wrap gap-2">
                        {iconOptions.map((option) => (
                          <Button
                            key={option.value}
                            variant={selectedCategories.includes(option.value) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleCategory(option.value)}
                            className="flex items-center gap-2"
                            data-testid={`chip-category-${option.value}`}
                          >
                            <span>{option.icon}</span>
                            <span>{option.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Progress Range Filter */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-foreground">Progress</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={progressRange === "all" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setProgressRange("all")}
                          data-testid="chip-progress-all"
                        >
                          All
                        </Button>
                        <Button
                          variant={progressRange === "0-25" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setProgressRange("0-25")}
                          data-testid="chip-progress-0-25"
                        >
                          0-25%
                        </Button>
                        <Button
                          variant={progressRange === "25-50" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setProgressRange("25-50")}
                          data-testid="chip-progress-25-50"
                        >
                          25-50%
                        </Button>
                        <Button
                          variant={progressRange === "50-75" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setProgressRange("50-75")}
                          data-testid="chip-progress-50-75"
                        >
                          50-75%
                        </Button>
                        <Button
                          variant={progressRange === "75-100" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setProgressRange("75-100")}
                          data-testid="chip-progress-75-100"
                        >
                          75-100%
                        </Button>
                      </div>
                    </div>

                    {/* Amount Range Filter */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-foreground">Target Amount Range</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="min-amount" className="text-xs text-muted-foreground mb-1">Min Amount</Label>
                          <Input
                            id="min-amount"
                            type="number"
                            placeholder="₹0"
                            value={minAmount}
                            onChange={(e) => setMinAmount(e.target.value)}
                            data-testid="input-min-amount"
                          />
                        </div>
                        <div>
                          <Label htmlFor="max-amount" className="text-xs text-muted-foreground mb-1">Max Amount</Label>
                          <Input
                            id="max-amount"
                            type="number"
                            placeholder="₹∞"
                            value={maxAmount}
                            onChange={(e) => setMaxAmount(e.target.value)}
                            data-testid="input-max-amount"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Date Range Filter */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-foreground">Target Date Range</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="start-date" className="text-xs text-muted-foreground mb-1">From Date</Label>
                          <div className="relative">
                            <Input
                              id="start-date"
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              data-testid="input-start-date"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="end-date" className="text-xs text-muted-foreground mb-1">To Date</Label>
                          <div className="relative">
                            <Input
                              id="end-date"
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              data-testid="input-end-date"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                      <Button 
                        variant="outline" 
                        onClick={handleClearFilters}
                        className="w-full"
                        data-testid="button-clear-all-filters"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[140px]" data-testid="select-sort">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="currentAmount">Highest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                  <SelectItem value="targetDate">Target Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filter Badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-muted-foreground">Active:</span>
                {searchQuery.trim() && (
                  <Badge 
                    variant="secondary" 
                    className="flex items-center gap-1"
                    data-testid="badge-active-search"
                  >
                    "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedCategories.map((cat) => {
                  const option = iconOptions.find(o => o.value === cat);
                  return (
                    <Badge 
                      key={cat} 
                      variant="secondary"
                      className="flex items-center gap-1"
                      data-testid={`badge-active-category-${cat}`}
                    >
                      {option?.icon} {option?.label}
                      <button
                        onClick={() => toggleCategory(cat)}
                        className="ml-1 hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  );
                })}
                {progressRange !== "all" && (
                  <Badge 
                    variant="secondary"
                    className="flex items-center gap-1"
                    data-testid="badge-active-progress"
                  >
                    {progressRange}%
                    <button
                      onClick={() => setProgressRange("all")}
                      className="ml-1 hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {minAmount && (
                  <Badge 
                    variant="secondary"
                    className="flex items-center gap-1"
                    data-testid="badge-active-min-amount"
                  >
                    Min: ₹{parseFloat(minAmount).toLocaleString("en-IN")}
                    <button
                      onClick={() => setMinAmount("")}
                      className="ml-1 hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {maxAmount && (
                  <Badge 
                    variant="secondary"
                    className="flex items-center gap-1"
                    data-testid="badge-active-max-amount"
                  >
                    Max: ₹{parseFloat(maxAmount).toLocaleString("en-IN")}
                    <button
                      onClick={() => setMaxAmount("")}
                      className="ml-1 hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {startDate && (
                  <Badge 
                    variant="secondary"
                    className="flex items-center gap-1"
                    data-testid="badge-active-start-date"
                  >
                    From: {new Date(startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    <button
                      onClick={() => setStartDate("")}
                      className="ml-1 hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {endDate && (
                  <Badge 
                    variant="secondary"
                    className="flex items-center gap-1"
                    data-testid="badge-active-end-date"
                  >
                    To: {new Date(endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    <button
                      onClick={() => setEndDate("")}
                      className="ml-1 hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        {/* Goals List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading goals...</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-primary" />
            </div>
            <p className="text-muted-foreground mb-4">No savings goals yet</p>
            <Button
              onClick={() => setShowAddGoal(true)}
              data-testid="button-add-first-goal"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Goal
            </Button>
          </div>
        ) : displayedGoals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-primary" />
            </div>
            <p className="text-foreground font-semibold mb-2">No goals found</p>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search, category, progress, amount, or date filters
            </p>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              data-testid="button-clear-filters-empty"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedGoals.map((goal, index) => {
              const progress = (parseFloat(goal.currentAmount) / parseFloat(goal.targetAmount)) * 100;
              const goalIcon = iconOptions.find((opt) => opt.value === goal.icon);
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/goals/${goal.id}`}>
                    <Card className="p-4 hover-elevate active-elevate-2 cursor-pointer" data-testid={`card-goal-${goal.id}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
                          {goalIcon?.icon || "🎯"}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{goal.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>₹{parseFloat(goal.currentAmount).toLocaleString("en-IN")}</span>
                            <span>/</span>
                            <span>₹{parseFloat(goal.targetAmount).toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <p className="text-sm font-bold text-primary">{progress.toFixed(0)}%</p>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all duration-300 rounded-full"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      
                      {/* Target Date */}
                      {goal.targetDate && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Target: {new Date(goal.targetDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Results Count */}
        {goals.length > 0 && displayedGoals.length > 0 && (
          <p className="text-xs text-center text-muted-foreground mt-4" data-testid="text-results-count">
            Showing {displayedGoals.length} of {goals.length} goal{goals.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Add Goal Modal */}
      <AddGoalModal isOpen={showAddGoal} onClose={() => setShowAddGoal(false)} />
    </div>
  );
}
