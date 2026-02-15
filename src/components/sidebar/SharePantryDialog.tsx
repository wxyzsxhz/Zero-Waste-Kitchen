import { useState } from "react";
import { Search, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { shareApi } from "@/lib/api";

interface SharePantryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SharePantryDialog({ isOpen, onClose, onSuccess }: SharePantryDialogProps) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendRequest = async () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    // Username validation (alphanumeric and underscores, 3-20 chars)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      toast.error("Username must be 3-20 characters and can only contain letters, numbers, and underscores");
      return;
    }

    setIsLoading(true);
    try {
      await shareApi.sendRequest(username);
      toast.success(`Share request sent to ${username}`);
      setUsername("");
      onClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Share request error:", error);
      const errorMessage = error.response?.data?.detail || "Failed to send request";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Share Your Pantry</DialogTitle>
          <DialogDescription>
            Enter the username of the person you want to share your pantry with.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10"
              type="text"
            />
          </div>

          <Button
            onClick={handleSendRequest}
            disabled={isLoading}
            className="w-full"
            variant="hero"
          >
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? "Sending..." : "Send Request"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}