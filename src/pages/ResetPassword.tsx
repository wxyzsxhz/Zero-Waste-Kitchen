import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/lib/api";
import logo from "@/assets/logo.png";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [isReset, setIsReset] = useState(false);

  useEffect(() => {
    // Check if token exists
    if (!token) {
      setIsValidToken(false);
      toast.error("Invalid reset link");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/auth/forgot-password/reset", {
        token: token,
        new_password: newPassword
      });

      setIsReset(true);
      toast.success("Password reset successfully!");

    } catch (error: any) {
      console.error("Reset password error:", error);
      const errorMessage = error.response?.data?.detail || "Failed to reset password";
      toast.error(errorMessage);
      
      if (errorMessage.includes("expired") || errorMessage.includes("Invalid")) {
        setIsValidToken(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen gradient-hero flex flex-col">
        <header className="p-4">
          <Link to="/signin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to sign in</span>
          </Link>
        </header>
        
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <div className="flex items-center justify-center gap-3 mb-8">
              <img alt="Zero-Waste Kitchen logo" className="h-12 w-12 rounded-xl object-cover" src={logo} />
              <span className="font-serif text-2xl font-semibold text-foreground">Zero-Waste Kitchen</span>
            </div>

            <Card className="shadow-elevated border-border/50">
              <CardContent className="pt-8 pb-8">
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
                    Invalid Reset Link
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    This password reset link is invalid or has expired.
                  </p>
                  
                  <Button variant="hero" className="w-full h-11" onClick={() => navigate("/forgot-password")}>
                    Request New Reset Link
                  </Button>
                  
                  <p className="text-center text-sm text-muted-foreground mt-6">
                    <Link to="/signin" className="text-primary hover:text-primary/80 font-medium transition-colors">
                      ← Back to sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isReset) {
    return (
      <div className="min-h-screen gradient-hero flex flex-col">
        <header className="p-4">
          <Link to="/signin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to sign in</span>
          </Link>
        </header>
        
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <div className="flex items-center justify-center gap-3 mb-8">
              <img alt="Zero-Waste Kitchen logo" className="h-12 w-12 rounded-xl object-cover" src={logo} />
              <span className="font-serif text-2xl font-semibold text-foreground">Zero-Waste Kitchen</span>
            </div>

            <Card className="shadow-elevated border-border/50">
              <CardContent className="pt-8 pb-8">
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
                    Password Reset Successfully!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Your password has been updated. You can now sign in with your new password.
                  </p>
                  
                  <Button variant="hero" className="w-full h-11" onClick={() => navigate("/signin")}>
                    Go to Sign In
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <header className="p-4">
        <Link to="/signin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
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
            <CardHeader className="text-center pb-4">
              <div className="mx-auto h-14 w-14 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Lock className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="font-serif text-2xl">Reset your password</CardTitle>
              <CardDescription>
                Enter your new password below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-11 pr-10"
                      placeholder="Enter new password"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 pr-10"
                      placeholder="Confirm new password"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" variant="hero" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}