import { useState, useEffect } from "react";
import { Bell, Check, X, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { shareApi } from "@/lib/api"; // Import the real API

interface ShareRequest {
  id: string;
  from_username: string;
  from_email: string;
  time_ago: string;
  status: string;
  permission: string;
}

interface NotificationsPopoverProps {
  isCollapsed: boolean;
}

export function NotificationsPopover({ isCollapsed }: NotificationsPopoverProps) {
  const [requests, setRequests] = useState<ShareRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch requests when popover opens
  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen]);

  // Set up polling every 30 seconds if popover is open
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const fetchRequests = async () => {
    try {
      console.log("Fetching share requests...");
      setLoading(true);
      const data = await shareApi.getReceivedRequests();
      setRequests(data || []);
      console.log("Received requests:", data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      console.log("Accepting request:", requestId);
      await shareApi.acceptRequest(requestId);
      toast.success("Share request accepted");
      // Remove from list
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (error: any) {
      console.error("Accept error:", error);
      toast.error(error.response?.data?.detail || "Failed to accept request");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      console.log("Declining request:", requestId);
      await shareApi.rejectRequest(requestId);
      toast.info("Share request declined");
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (error: any) {
      console.error("Decline error:", error);
      toast.error(error.response?.data?.detail || "Failed to decline request");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "relative flex items-center gap-3 px-3 py-2.5 w-full rounded-lg transition-all duration-200",
            "hover:bg-sidebar-accent text-sidebar-foreground",
            !isCollapsed && "justify-start"
          )}
        >
          <div className="relative">
            <Bell className="h-5 w-5 flex-shrink-0" />
            {requests.length > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {requests.length}
              </Badge>
            )}
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-medium"
              >
                Notifications
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start" side="right">
        <div className="p-4 border-b border-border">
          <h3 className="font-serif font-semibold text-foreground">Share Requests</h3>
          <p className="text-sm text-muted-foreground">
            {requests.length > 0
              ? `You have ${requests.length} pending request${requests.length > 1 ? "s" : ""}`
              : "No pending requests"}
          </p>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading requests...</p>
            </div>
          ) : requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request.id}
                className="p-4 border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {request.from_username}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {request.from_email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {request.time_ago}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="hero"
                    className="flex-1"
                    onClick={() => handleAccept(request.id)}
                    disabled={processingId === request.id}
                  >
                    {processingId === request.id ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                    ) : (
                      <Check className="h-4 w-4 mr-1" />
                    )}
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDecline(request.id)}
                    disabled={processingId === request.id}
                  >
                    {processingId === request.id ? (
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-1" />
                    ) : (
                      <X className="h-4 w-4 mr-1" />
                    )}
                    Decline
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No pending requests</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}