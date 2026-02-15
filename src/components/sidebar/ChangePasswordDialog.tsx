import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useUser } from "@/contexts/UserContext";

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordDialog({ isOpen, onClose }: ChangePasswordDialogProps) {
  const { user } = useUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    toast.error("Please fill in all fields");
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error("New passwords do not match");
    return;
  }

  if (newPassword.length < 8) {
    toast.error("Password must be at least 8 characters");
    return;
  }

  setIsLoading(true);

  try {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (!userData?.username) {
      toast.error("User not found");
      return;
    }

    // Create Basic Auth header
    const authHeader = btoa(`${userData.username}:${currentPassword}`);

    // Make API call with Basic Auth
    const response = await api.post(
      "/change-password",
      { current_password: currentPassword, new_password: newPassword },
      { headers: { Authorization: `Basic ${authHeader}` } }
    );

    toast.success(response.data.message || "Password changed successfully");

    // Reset form and close
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();

  } catch (error: any) {
    console.error("Password change error:", error);

    const errorMessage =
      error.response?.data?.detail ||
      error.message ||
      "Failed to change password";
    toast.error(errorMessage);

  } finally {
    setIsLoading(false);
  }
};

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form when closing
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new one.
            {user?.email && (
              <span className="block mt-1 text-xs text-muted-foreground">
                Logged in as: {user.email}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pl-10 pr-10"
                placeholder="Enter current password"
                disabled={isLoading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={isLoading}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 pr-10"
                placeholder="Enter new password"
                disabled={isLoading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isLoading}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum 8 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10"
                placeholder="Confirm new password"
                disabled={isLoading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            variant="hero"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

