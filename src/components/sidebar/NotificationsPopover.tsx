import { useState } from "react";
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

interface ShareRequest {
  id: string;
  fromEmail: string;
  fromName: string;
  createdAt: string;
}

interface NotificationsPopoverProps {
  isCollapsed: boolean;
}

// Mock data for demo
const mockRequests: ShareRequest[] = [
  { id: "1", fromEmail: "john@example.com", fromName: "John Smith", createdAt: "2 hours ago" },
  { id: "2", fromEmail: "sarah@example.com", fromName: "Sarah Johnson", createdAt: "1 day ago" },
];

export function NotificationsPopover({ isCollapsed }: NotificationsPopoverProps) {
  const [requests, setRequests] = useState<ShareRequest[]>(mockRequests);
  const [isOpen, setIsOpen] = useState(false);

  const handleAccept = (id: string) => {
    const request = requests.find((r) => r.id === id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
    toast.success(`Accepted share request from ${request?.fromName}`);
  };

  const handleReject = (id: string) => {
    const request = requests.find((r) => r.id === id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
    toast.info(`Declined share request from ${request?.fromName}`);
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
          {requests.length > 0 ? (
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
                      {request.fromName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {request.fromEmail}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {request.createdAt}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="hero"
                    className="flex-1"
                    onClick={() => handleAccept(request.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleReject(request.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
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
