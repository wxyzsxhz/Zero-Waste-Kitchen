import { motion } from "framer-motion";
import { ArrowRight, Package, History, Shield, Sparkles, Mail, MapPin, Clock, Heart, Leaf, Users, ChefHat, ShoppingCart, UtensilsCrossed, Sprout, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import heroImage from "@/assets/watercolor-plate.png";
import logo from "@/assets/logo.png";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Package,
    title: "Smart Tracking",
    description: "Keep all your ingredients organized in one place with quantities and expiry dates.",
    detail: "Never wonder what's in your pantry again"
  },
  {
    icon: ChefHat,
    title: "Recipe Discovery",
    description: "Discover creative recipes based on ingredients you already have at home.",
    detail: "Turn what you have into something delicious"
  },
  {
    icon: History,
    title: "Usage Insights",
    description: "See how you've used ingredients over time and never run out unexpectedly.",
    detail: "Smart predictions for your shopping list"
  },
  {
    icon: Shield,
    title: "Zero Waste",
    description: "Get alerts before ingredients expire so nothing goes to waste.",
    detail: "Save money and help the planet"
  }
];

const benefits = [
  {
    icon: Leaf,
    stat: "30%",
    label: "Less Food Waste",
    description: "Average reduction in household food waste"
  },
  {
    icon: Clock,
    stat: "2 hrs",
    label: "Time Saved Weekly",
    description: "No more duplicate shopping or forgotten ingredients"
  },
  {
    icon: Heart,
    stat: "100+",
    label: "Recipe Ideas",
    description: "AI-powered suggestions from your pantry"
  }
];

export default function Landing() {
  const [activeFeature, setActiveFeature] = useState(0);
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleStartOrganizing = () => {
    if (user) {
      navigate("/dashboard"); // logged in
    } else {
      navigate("/signin"); // not logged in
    }
  };

  const handleLogout = () => {
    // Clear user context and localStorage
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div className="min-h-screen">
      {/* Decorative organic shapes background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none hidden lg:block">
        <div className="absolute top-20 right-10 w-96 h-96 bg-sage/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-honey/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-olive/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              alt="Zero-Waste Kitchen Logo"
              className="h-10 w-10 rounded-lg object-contain"
              src={logo}
            />
            <span className="font-serif text-xl font-semibold text-foreground">
              Zero-Waste Kitchen
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button variant="ghost" asChild>
                <Link to="/signin">Sign In</Link>
              </Button>
            )}

            {/* Get Started always visible */}
            <Button variant="hero" asChild>
              <Link to="/signup">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Enhanced with floating ingredients animation */}
      <section className="pt-28 pb-20 px-4 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left relative z-10"
            >
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Your Kitchen,
                <br />
                <span className="text-primary relative">
                  Perfectly Organized
                </span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                The simplest way to track your pantry ingredients, discover
                recipes from what you have, reduce waste, and bring harmony to
                your kitchen.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button variant="hero" size="xl" onClick={handleStartOrganizing}>
                  Start Organizing
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button variant="warm" size="xl" asChild>
                  <a href="#features">Explore Features</a>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-sage to-olive border-2 border-background"
                      />
                    ))}
                  </div>
                  <span>2,000+ users</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="h-4 w-4 text-honey fill-honey" />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br to-secondary/30">
                <img
                  src={heroImage}
                  alt="Watercolor illustration of fresh ingredients on a plate"
                  className="w-full h-auto object-contain max-w-xl mx-auto"
                />
              </div>

              {/* Floating cards with stagger animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-elevated border border-border mb-10"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-sage/50 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-olive" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">12 ingredients</p>
                    <p className="text-xs text-muted-foreground">tracked this week</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Stats - New Section */}
      <section className="py-16 px-4 bg-sage/5 border-y border-sage/10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sage to-olive mb-4">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <div className="font-serif text-4xl font-bold text-primary mb-2">
                  {benefit.stat}
                </div>
                <div className="font-semibold text-foreground mb-1">
                  {benefit.label}
                </div>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Interactive with hover states */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Transform Your Kitchen
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              From tracking every ingredient to generating creative recipes,
              Zero-Waste Kitchen helps you cook smarter and waste less.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setActiveFeature(index)}
                className="group bg-card rounded-xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 border border-border hover:border-sage/50 cursor-pointer relative overflow-hidden"
              >
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-sage/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-sage/20 to-olive/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-olive group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {feature.description}
                  </p>
                  <p className="text-xs text-olive font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {feature.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Helps - Daily Life Benefits */}
      <section className="py-20 px-4 bg-gradient-to-b from-card/30 to-transparent">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
              Your Daily Kitchen Companion
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12">
              Zero-Waste Kitchen isn't just an app—it's your partner in creating
              a more sustainable, organized, and joyful cooking experience.
            </p>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-4 items-start bg-card rounded-xl p-6 shadow-soft"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-honey/20 flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-olive" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold mb-2">
                    Shop Smarter, Not Harder
                  </h3>
                  <p className="text-muted-foreground">
                    Know exactly what you have before you shop. No more buying
                    duplicates or forgetting that jar of tahini in the back of your
                    pantry. Save time and money with intelligent shopping lists.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex gap-4 items-start bg-card rounded-xl p-6 shadow-soft"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center">
                  <UtensilsCrossed className="h-6 w-6 text-olive" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold mb-2">
                    Cook With Confidence
                  </h3>
                  <p className="text-muted-foreground">
                    Get inspired with recipe suggestions based on what's
                    in your kitchen right now. Turn random ingredients into
                    delicious meals without the stress of meal planning.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex gap-4 items-start bg-card rounded-xl p-6 shadow-soft"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-olive/20 flex items-center justify-center">
                  <Sprout className="h-6 w-6 text-olive" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold mb-2">
                    Make a Real Impact
                  </h3>
                  <p className="text-muted-foreground">
                    Join the fight against food waste. Get timely alerts before
                    ingredients expire, track your waste reduction over time, and
                    feel good knowing you're helping the planet with every meal.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-olive/10 rounded-full px-4 py-2 mb-6">
                <Users className="h-4 w-4 text-olive" />
                <span className="text-sm font-medium text-olive">Our Story</span>
              </div>

              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                Born from a Simple Kitchen Frustration
              </h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Zero-Waste Kitchen started in 2024 when our founder, tired of
                  throwing away expired ingredients and buying duplicates, realized
                  there had to be a better way to manage a home kitchen.
                </p>
                <p>
                  We're a small team of food lovers, sustainability advocates, and
                  tech enthusiasts who believe that reducing food waste shouldn't
                  require spreadsheets or guesswork. Our mission is simple: make
                  kitchen organization so effortless that wasting food becomes a
                  thing of the past.
                </p>
                <p className="font-medium text-foreground">
                  Every ingredient saved is a small victory for your wallet and our
                  planet. We're here to help you achieve thousands of them.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-8">
                <div>
                  <div className="font-serif text-3xl font-bold text-primary mb-1">
                    2K+
                  </div>
                  <div className="text-sm text-muted-foreground">Happy Users</div>
                </div>
                <div>
                  <div className="font-serif text-3xl font-bold text-primary mb-1">
                    50K+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Ingredients Tracked
                  </div>
                </div>
                <div>
                  <div className="font-serif text-3xl font-bold text-primary mb-1">
                    10K+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Recipes Generated
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-sage/20 to-olive/20 rounded-2xl p-8 border border-sage/30">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sage flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Sustainability First
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        We're committed to helping reduce household food waste and
                        promoting mindful consumption.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-olive flex items-center justify-center">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Made with Love
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Every feature is crafted with care, tested in real kitchens,
                        and refined based on your feedback.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-honey flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Smart Features
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Intelligent recipe suggestions and expiry predictions
                        help you make the most of every ingredient.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative element */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-honey/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-sage/20 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get in Touch
            </h2>
            <p className="text-muted-foreground text-lg">
              Have questions? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.a
              href="mailto:hello@zerowastekitchen.com"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group bg-card rounded-xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 border border-border hover:border-sage/50 text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-sage/20 mb-4 group-hover:scale-110 transition-transform">
                <Mail className="h-6 w-6 text-olive" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Email Us</h3>
              <p className="text-sm text-muted-foreground">
                zerowastekitchen@gmail.com
              </p>
            </motion.a>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl p-6 shadow-soft border border-border text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-honey/20 mb-4">
                <MapPin className="h-6 w-6 text-olive" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Location</h3>
              <p className="text-sm text-muted-foreground">
                Yangon, Myanmar
                <br />
                Built for kitchens worldwide
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-6 shadow-soft border border-border text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-olive/20 mb-4">
                <Clock className="h-6 w-6 text-olive" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Support Hours</h3>
              <p className="text-sm text-muted-foreground">
                Monday - Friday
                <br />
                10:00 AM - 4:00 PM UTC+06:30
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-sage/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-olive to-olive-light rounded-2xl p-8 md:p-12 text-center shadow-elevated overflow-hidden"
          >
            {/* Decorative pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Ready to Transform Your Kitchen?
              </h2>
              <p className="text-primary-foreground/90 mb-8 max-w-lg mx-auto text-lg">
                Join thousands of home cooks who've simplified their kitchen
                management and reduced food waste with Zero-Waste Kitchen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="xl" asChild>
                  <Link to="/signup">
                    Start Free Today
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-olive"
                  asChild
                >
                  <a href="#features">Learn More</a>
                </Button>
              </div>
              <p className="text-xs text-primary-foreground/70 mt-6">
                No credit card required · Free forever
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 px-4 bg-card/60 border-t border-border">
        <div className="container mx-auto max-w-5xl text-center">

          {/* Brand */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-2 mb-2">
              <img
                alt="Zero-Waste Kitchen Logo"
                className="h-9 w-9 rounded-lg object-contain"
                src={logo}
              />
              <span className="font-serif text-lg font-semibold text-foreground">
                Zero-Waste Kitchen
              </span>
            </div>

            <p className="text-sm text-muted-foreground max-w-md">
              Your cozy kitchen companion for using what you have, reducing waste,
              and cooking with care.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6 mb-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>

          {/* Social Icons */}
          <div className="flex justify-center gap-4 mb-5">
            <a
              href="www.x.com"
              className="w-9 h-9 rounded-full bg-sage/20 flex items-center justify-center hover:bg-sage/30 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4 text-olive" />
            </a>

            <a
              href="www.instagram.com"
              className="w-9 h-9 rounded-full bg-sage/20 flex items-center justify-center hover:bg-sage/30 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4 text-olive" />
            </a>
          </div>


          {/* Bottom */}
          <div className="border-t border-border pt-4 flex flex-col items-center gap-2 text-xs text-muted-foreground">
            <p>
              © 2026 Zero-Waste Kitchen. Made with{" "}
              <Heart className="inline h-3 w-3 text-terracotta fill-terracotta" />{" "}
              for home cooks.
            </p>
            <div className="flex items-center gap-1">
              <Leaf className="h-3 w-3 text-sage" />
              <span>Reducing food waste, one meal at a time</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
