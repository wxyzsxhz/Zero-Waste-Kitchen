import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, Package, LayoutGrid, List, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IngredientCard, Ingredient } from "@/components/ingredients/IngredientCard";
import { IngredientModal } from "@/components/ingredients/IngredientModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useEffect } from "react";

// Extended Ingredient type for shared pantry
interface ExtendedIngredient extends Ingredient {
  isShared?: boolean;
  sharedBy?: string;
}

// Mock shared ingredients from other users
const sharedIngredients: ExtendedIngredient[] = [
  { id: "s1", name: "Salmon", quantity: 2, unit: "lb", category: "Meat", isShared: true, sharedBy: "John Smith" },
  { id: "s2", name: "Avocados", quantity: 4, unit: "pcs", category: "Vegetables", isShared: true, sharedBy: "John Smith" },
  { id: "s3", name: "Greek Yogurt", quantity: 500, unit: "g", category: "Dairy", isShared: true, sharedBy: "Sarah Johnson" },
  { id: "s4", name: "Honey", quantity: 250, unit: "ml", category: "Other", isShared: true, sharedBy: "Sarah Johnson" },
];

const categories = ["All", "Vegetables", "Fruits", "Dairy", "Meat", "Grains", "Spices", "Other"];

export default function Dashboard() {
  const [ingredients, setIngredients] = useState<ExtendedIngredient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSharedPantry, setShowSharedPantry] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  // ✅ Fetch ingredients from backend
  const fetchIngredients = async () => {
    try {
      const res = await api.get("/ingredients");
      setIngredients(res.data);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  // ✅ Run on mount
  useEffect(() => {
    fetchIngredients();
  }, []);

  const displayIngredients = useMemo(() => {
    if (showSharedPantry) {
      return sharedIngredients;
    }
    return ingredients;
  }, [ingredients, showSharedPantry]);

  const filteredIngredients = useMemo(() => {
    return displayIngredients.filter((ingredient) => {
      const matchesSearch = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || ingredient.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [displayIngredients, searchQuery, selectedCategory]);

  const handleSave = async (data: Omit<Ingredient, "id"> | Ingredient) => {
  try {
    if ("id" in data) {
      await api.put(`/ingredients/${data.id}`, data);
    } else {
      await api.post("/ingredients", data);
    }

    fetchIngredients();
    setEditingIngredient(null);
  } catch (error) {
    console.error("Error saving ingredient:", error);
  }
};

  const handleEdit = (ingredient: Ingredient) => {
    // Only allow editing personal ingredients
    const extendedIngredient = ingredient as ExtendedIngredient;
    if (extendedIngredient.isShared) return;
    setEditingIngredient(ingredient);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
  try {
    await api.delete(`/ingredients/${id}`);
    fetchIngredients();
  } catch (error) {
    console.error("Error deleting ingredient:", error);
  }
};

  const handleOpenModal = () => {
    setEditingIngredient(null);
    setIsModalOpen(true);
  };

  const stats = useMemo(() => {
    const total = ingredients.length;
    const lowStock = ingredients.filter((i) => i.quantity <= 2).length;
    const expiringSoon = ingredients.filter((i) => {
      if (!i.expiryDate) return false;
      return new Date(i.expiryDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    }).length;
    return { total, lowStock, expiringSoon };
  }, [ingredients]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2"
        >
          My Ingredients
        </motion.h1>
        <p className="text-muted-foreground">
          Manage your pantry and keep track of what you have.
        </p>
      </div>

      {/* Stats Pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3 mb-6"
      >
        {/* Total Pill */}
        <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-1.5 border border-border shadow-soft">
          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</span>
          <span className="text-sm font-bold text-foreground">{stats.total}</span>
        </div>

        {/* Low Stock Pill */}
        <div className="flex items-center gap-2 bg-honey/5 backdrop-blur-sm rounded-full px-4 py-1.5 border border-honey/60 shadow-soft">
          <div className="h-1.5 w-1.5 rounded-full bg-honey animate-pulse" />
          <span className="text-xs font-medium text-honey uppercase tracking-wider">Low Stock</span>
          <span className="text-sm font-bold text-honey">{stats.lowStock}</span>
        </div>

        {/* Expiring Pill */}
        <div className="flex items-center gap-2 bg-destructive/5 backdrop-blur-sm rounded-full px-4 py-1.5 border border-destructive/20 shadow-soft">
          <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
          <span className="text-xs font-medium text-destructive uppercase tracking-wider">Expiring</span>
          <span className="text-sm font-bold text-destructive">{stats.expiringSoon}</span>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-4 mb-6"
      >
        {/* Top Row: Search + Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bottom Row: Shared Pantry Toggle (left) + Layout/Add buttons (right) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Shared Pantry Toggle */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card">
            <Users className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="shared-toggle" className="text-sm font-medium cursor-pointer">
              Shared Pantry
            </Label>
            <Switch
              id="shared-toggle"
              checked={showSharedPantry}
              onCheckedChange={setShowSharedPantry}
            />
          </div>

          {/* Right side: Layout switch + Add button */}
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-border overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="rounded-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {!showSharedPantry && (
              <Button variant="hero" onClick={handleOpenModal}>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Ingredient</span>
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Ingredients Grid/List */}
      <div
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-3"
        )}
      >
        <AnimatePresence mode="popLayout">
          {filteredIngredients.length > 0 ? (
            filteredIngredients.map((ingredient, index) => (
              <IngredientCard
                key={ingredient.id}
                ingredient={ingredient}
                onEdit={handleEdit}
                onDelete={handleDelete}
                index={index}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16"
            >
              <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                No ingredients found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory !== "All"
                  ? "Try adjusting your filters"
                  : "Start adding ingredients to your pantry"}
              </p>
              <Button variant="hero" onClick={handleOpenModal}>
                <Plus className="h-4 w-4" />
                Add Your First Ingredient
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <IngredientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIngredient(null);
        }}
        onSave={handleSave}
        ingredient={editingIngredient}
      />
    </div>
  );
}