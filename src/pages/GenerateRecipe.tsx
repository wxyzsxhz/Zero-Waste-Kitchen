import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChefHat, Sparkles, Leaf, Check, Utensils, Globe, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Mock ingredients from pantry
const availableIngredients = [
  { id: "1", name: "Tomatoes", category: "Vegetables" },
  { id: "2", name: "Olive Oil", category: "Other" },
  { id: "3", name: "Chicken Breast", category: "Meat" },
  { id: "4", name: "Basil", category: "Vegetables" },
  { id: "5", name: "Parmesan", category: "Dairy" },
  { id: "6", name: "Pasta", category: "Grains" },
  { id: "7", name: "Garlic", category: "Vegetables" },
  { id: "8", name: "Black Pepper", category: "Spices" },
];

const cuisines = [
  "Any Cuisine",
  "Italian",
  "Mexican",
  "Asian",
  "Mediterranean",
  "American",
  "Indian",
  "French",
];

const mealTypes = ["Any Meal", "Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
const dietaryOptions = ["Vegetarian", "Vegan", "Gluten-Free", "Low-Carb", "Dairy-Free"];

const categoryColors: Record<string, string> = {
  "Vegetables": "from-green-500/20 to-green-600/10 border-green-500/30",
  "Fruits": "from-orange-500/20 to-orange-600/10 border-orange-500/30",
  "Dairy": "from-amber-500/20 to-amber-600/10 border-amber-500/30",
  "Meat": "from-rose-500/20 to-rose-600/10 border-rose-500/30",
  "Grains": "from-yellow-600/20 to-yellow-700/10 border-yellow-600/30",
  "Spices": "from-red-500/20 to-red-600/10 border-red-500/30",
  "Other": "from-primary/20 to-primary/10 border-primary/30",
};

export default function GenerateRecipe() {
  const navigate = useNavigate();
  const [selectedCuisine, setSelectedCuisine] = useState("Any Cuisine");
  const [selectedMealType, setSelectedMealType] = useState("Any Meal");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDietaryToggle = (option: string) => {
    setSelectedDietary((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Mock generation - redirect to recipe detail after delay
    setTimeout(() => {
      setIsGenerating(false);
      navigate("/recipe/1");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-10 text-center"
      >
        <motion.div 
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-primary/25 to-accent/25 mb-5 shadow-elevated border border-primary/10"
        >
          <ChefHat className="h-10 w-10 text-primary" />
        </motion.div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3 leading-tight">
          Recipe <span className="text-primary">Generator</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
          Transform your pantry ingredients into delicious, waste-free meals
        </p>
      </motion.div>

      {/* Pantry Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border shadow-card overflow-hidden mb-8"
      >
        <div className="bg-gradient-to-r from-secondary/50 to-accent/10 px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-card flex items-center justify-center shadow-soft">
              <Utensils className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-foreground">Your Pantry</h2>
              <p className="text-sm text-muted-foreground">
                {availableIngredients.length} ingredients ready to use
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {availableIngredients.map((ingredient, index) => (
              <motion.div
                key={ingredient.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
                className={cn(
                  "relative px-4 py-3 rounded-xl text-sm font-medium text-foreground",
                  "bg-gradient-to-br border shadow-soft",
                  "hover:shadow-card hover:scale-[1.02] transition-all duration-200",
                  categoryColors[ingredient.category] || categoryColors["Other"]
                )}
              >
                <span className="relative z-10">{ingredient.name}</span>
                <div className="absolute inset-0 rounded-xl bg-card/40 backdrop-blur-[1px]" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content - Preferences */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Cuisine & Meal Type */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-secondary/30 to-transparent">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <h3 className="font-serif text-lg font-semibold text-foreground">Preferences</h3>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Cuisine Style</Label>
                <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cuisines.map((cuisine) => (
                      <SelectItem key={cuisine} value={cuisine}>
                        {cuisine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Meal Type</Label>
                <Select value={selectedMealType} onValueChange={setSelectedMealType}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mealTypes.map((meal) => (
                      <SelectItem key={meal} value={meal}>
                        {meal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dietary Filters */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-accent/20 to-transparent">
              <div className="flex items-center gap-3">
                <Leaf className="h-5 w-5 text-accent-foreground" />
                <h3 className="font-serif text-lg font-semibold text-foreground">Dietary Options</h3>
              </div>
            </div>
            <div className="p-6 space-y-2">
              {dietaryOptions.map((option) => {
                const isSelected = selectedDietary.includes(option);
                return (
                  <motion.div
                    key={option}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200",
                      isSelected
                        ? "bg-accent/20 border border-accent/30"
                        : "hover:bg-secondary/50 border border-transparent"
                    )}
                    onClick={() => handleDietaryToggle(option)}
                  >
                    <div className={cn(
                      "h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all",
                      isSelected 
                        ? "bg-primary border-primary" 
                        : "border-muted-foreground/30"
                    )}>
                      {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <Label className="cursor-pointer text-sm font-medium text-foreground">
                      {option}
                    </Label>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Generate Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 relative overflow-hidden rounded-3xl border border-primary/20 shadow-elevated"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/10 to-honey/15" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--accent)/0.15),_transparent_60%)]" />
        <div className="relative p-8 text-center">
          <motion.div 
            animate={isGenerating ? { rotate: 360 } : { y: [0, -6, 0] }}
            transition={isGenerating 
              ? { duration: 2, repeat: Infinity, ease: "linear" }
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }
            className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary shadow-elevated mb-4"
          >
            <UtensilsCrossed className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          <p className="text-foreground font-serif text-lg font-semibold mb-1">
            Ready to cook with {availableIngredients.length} ingredients
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            We'll craft the perfect recipe from your pantry
          </p>
          <Button
            variant="hero"
            size="lg"
            className="w-full max-w-md h-14 text-base rounded-xl shadow-elevated"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
                Creating Magic...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Recipe
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
