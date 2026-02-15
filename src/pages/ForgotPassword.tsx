import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/lib/api";
import logo from "@/assets/logo.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/auth/forgot-password/request", { email });
      
      // Show success message
      setIsSubmitted(true);
      toast.success("Reset instructions sent to your email");
      
    } catch (error: any) {
      console.error("Forgot password error:", error);
      // Still show success for security (don't reveal if email exists)
      setIsSubmitted(true);
      toast.success("If your email is registered, you will receive reset instructions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <header className="p-4">
        <Link 
          to="/signin" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to sign in</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <img alt="Zero-Waste Kitchen logo" className="h-12 w-12 rounded-xl object-cover" src={logo} />
            <span className="font-serif text-2xl font-semibold text-foreground">Zero-Waste Kitchen</span>
          </div>

          <Card className="shadow-elevated border-border/50">
            {!isSubmitted ? (
              <>
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto h-14 w-14 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <Mail className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="font-serif text-2xl">Forgot password?</CardTitle>
                  <CardDescription>
                    No worries, we'll send you reset instructions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="hello@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <Button type="submit" variant="hero" className="w-full h-11" disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </form>

                  <p className="text-center text-sm text-muted-foreground mt-6">
                    Remember your password?{" "}
                    <Link to="/signin" className="text-primary hover:text-primary/80 font-medium transition-colors">
                      Sign in
                    </Link>
                  </p>
                </CardContent>
              </>
            ) : (
              <CardContent className="pt-8 pb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
                    Check your email
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    We've sent a password reset link to
                    <br />
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                  
                  <div className="space-y-3">
                    <Button variant="hero" className="w-full h-11" asChild>
                      <a href={`mailto:${email}`}>Open Email App</a>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => {
                        setIsSubmitted(false);
                        setEmail("");
                      }}
                      disabled={isLoading}
                    >
                      Didn't receive it? Try again
                    </Button>
                  </div>

                  <p className="text-center text-sm text-muted-foreground mt-6">
                    <Link to="/signin" className="text-primary hover:text-primary/80 font-medium transition-colors">
                      ← Back to sign in
                    </Link>
                  </p>
                </motion.div>
              </CardContent>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}