import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Users,
  ChefHat,
  Flame,
  Check,
  Timer,
  Sparkles,
  UtensilsCrossed,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock recipe data
const mockRecipe = {
  id: "1",
  title: "Creamy Chicken Pasta with Fresh Basil",
  image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=500&fit=crop",
  description:
    "A delicious and creamy pasta dish made with tender chicken breast, fresh basil, and parmesan cheese. Perfect for a quick weeknight dinner.",
  cookingTime: 35,
  prepTime: 15,
  servings: 4,
  difficulty: "Medium",
  calories: 520,
  cuisine: "Italian",
  ingredients: [
    { name: "Pasta", amount: "400g", checked: false },
    { name: "Chicken Breast", amount: "2 large", checked: false },
    { name: "Olive Oil", amount: "3 tbsp", checked: false },
    { name: "Garlic", amount: "4 cloves, minced", checked: false },
    { name: "Tomatoes", amount: "4 medium, diced", checked: false },
    { name: "Fresh Basil", amount: "1 bunch", checked: false },
    { name: "Parmesan", amount: "100g, grated", checked: false },
    { name: "Black Pepper", amount: "to taste", checked: false },
    { name: "Salt", amount: "to taste", checked: false },
    { name: "Heavy Cream", amount: "200ml", checked: false },
  ],
  instructions: [
    "Bring a large pot of salted water to boil. Cook pasta according to package directions until al dente. Reserve 1 cup of pasta water before draining.",
    "While pasta cooks, season chicken breasts with salt and pepper. Heat 2 tablespoons of olive oil in a large skillet over medium-high heat.",
    "Cook chicken for 6-7 minutes per side until golden and cooked through. Remove from skillet and let rest for 5 minutes before slicing.",
    "In the same skillet, add remaining olive oil and sauté garlic for 30 seconds until fragrant. Add diced tomatoes and cook for 3-4 minutes.",
    "Reduce heat to medium-low and add heavy cream. Stir to combine and let simmer for 2 minutes.",
    "Add the cooked pasta to the skillet along with half the reserved pasta water. Toss to coat, adding more pasta water if needed.",
    "Add sliced chicken, most of the parmesan, and torn basil leaves. Toss gently to combine.",
    "Serve immediately, topped with remaining parmesan, fresh basil, and a crack of black pepper.",
  ],
};

const quickInfoItems = [
  { icon: Timer, label: "Prep Time", value: `${mockRecipe.prepTime} min`, color: "from-accent/30 to-accent/10 border-accent/20" },
  { icon: Clock, label: "Cook Time", value: `${mockRecipe.cookingTime} min`, color: "from-primary/20 to-primary/5 border-primary/20" },
  { icon: Users, label: "Servings", value: String(mockRecipe.servings), color: "from-honey/30 to-honey/10 border-honey/30" },
  { icon: Flame, label: "Calories", value: String(mockRecipe.calories), color: "from-terracotta/30 to-terracotta/10 border-terracotta/30" },
];

export default function RecipeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirmCooking = () => {
    setIsConfirmed(true);
    // UI-only: In real app, this would reduce pantry ingredient quantities
  };

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const progress = Math.round((completedSteps.size / mockRecipe.instructions.length) * 100);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="gap-2 text-muted-foreground hover:text-foreground group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to recipes
        </Button>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden mb-8 shadow-elevated group"
      >
        <img
          src={mockRecipe.image}
          alt={mockRecipe.title}
          className="w-full h-72 md:h-[28rem] object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
        
        {/* Floating badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <div className="flex gap-2">
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="px-4 py-1.5 bg-card/90 backdrop-blur-md text-foreground text-sm font-medium rounded-full shadow-card border border-border/50"
            >
              🇮🇹 {mockRecipe.cuisine}
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="px-4 py-1.5 bg-card/90 backdrop-blur-md text-foreground text-sm font-medium rounded-full shadow-card border border-border/50"
            >
              <ChefHat className="h-4 w-4 inline mr-1" />
              {mockRecipe.difficulty}
            </motion.span>
          </div>
        </div>

        {/* Title section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg leading-tight">
              {mockRecipe.title}
            </h1>
            <p className="text-white/85 text-base md:text-lg max-w-2xl line-clamp-2 leading-relaxed">
              {mockRecipe.description}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
      >
        {quickInfoItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className={cn(
              "relative overflow-hidden rounded-2xl border border-border shadow-soft p-5",
              "bg-gradient-to-br",
              item.color
            )}
          >
            <div className="flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-xl bg-card/80 flex items-center justify-center mb-3 shadow-soft">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xl font-bold text-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Ingredients */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden sticky top-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-secondary/50 to-accent/10 px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-card flex items-center justify-center shadow-soft">
                  <ListChecks className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-foreground">Ingredients</h2>
                  <p className="text-sm text-muted-foreground">
                    {mockRecipe.ingredients.length} items needed
                  </p>
                </div>
              </div>
            </div>

            {/* Ingredient List */}
            <div className="p-5 space-y-2">
              {mockRecipe.ingredients.map((ingredient, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * index }}
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-xl transition-all duration-300",
                    isConfirmed
                      ? "bg-gradient-to-r from-primary/15 to-accent/10 border border-primary/25"
                      : "bg-gradient-to-r from-secondary/40 to-secondary/20 border border-border/50 hover:border-primary/20 hover:shadow-soft"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium transition-all",
                      isConfirmed
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    )}
                  >
                    {ingredient.name}
                  </span>
                  <span className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-lg transition-all",
                    isConfirmed 
                      ? "bg-primary/10 text-primary" 
                      : "bg-card text-muted-foreground shadow-soft"
                  )}>
                    {ingredient.amount}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Confirm Button */}
            <div className="p-5 pt-0">
              <Button
                variant={isConfirmed ? "secondary" : "hero"}
                size="lg"
                className="w-full h-12 rounded-xl"
                onClick={handleConfirmCooking}
                disabled={isConfirmed}
              >
                {isConfirmed ? (
                  <>
                    <Check className="h-5 w-5" />
                    Ingredients Confirmed
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Confirm & Start Cooking
                  </>
                )}
              </Button>
              {isConfirmed && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Pantry quantities have been reduced
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-3"
        >
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/30 px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-card flex items-center justify-center shadow-soft">
                  <UtensilsCrossed className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-foreground">Instructions</h2>
                  <p className="text-sm text-muted-foreground">Follow step by step</p>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="p-6 space-y-4">
              {mockRecipe.instructions.map((instruction, index) => {
                const isCompleted = completedSteps.has(index);
                return (
                  <motion.div
                    key={index}
                    whileTap={{ scale: 0.99 }}
                    className={cn(
                      "flex gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border-2",
                      isCompleted
                        ? "bg-primary/5 border-primary/20"
                        : "hover:bg-secondary/30 border-transparent hover:border-primary/10"
                    )}
                    onClick={() => toggleStep(index)}
                  >
                    <motion.div
                      animate={isCompleted ? { scale: [1, 1.2, 1] } : {}}
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all font-bold text-sm",
                        isCompleted
                          ? "bg-primary text-primary-foreground shadow-soft"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        index + 1
                      )}
                    </motion.div>
                    <p
                      className={cn(
                        "text-sm leading-relaxed pt-2 transition-all",
                        isCompleted
                          ? "text-muted-foreground"
                          : "text-foreground"
                      )}
                    >
                      {instruction}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10"
      >
        <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20 rounded-2xl border border-primary/20 p-6 md:p-8 shadow-card">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary shadow-elevated flex items-center justify-center">
                <ChefHat className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <p className="font-serif text-xl font-semibold text-foreground">Ready for more?</p>
                <p className="text-muted-foreground">
                  Generate another delicious recipe from your pantry
                </p>
              </div>
            </div>
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => navigate("/generate-recipe")}
              className="h-14 px-8 rounded-xl shadow-elevated"
            >
              <Sparkles className="h-5 w-5" />
              Generate Another Recipe
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
