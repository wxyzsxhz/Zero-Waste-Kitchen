import { useState, useEffect } from "react";
import { shareApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

interface ShareRequest {
  id: string;
  from_username: string;
  from_email: string;
  time_ago: string;
  status: string;
  permission: string;
}

export function ShareRequests() {
  const [requests, setRequests] = useState<ShareRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
    
    // Set up polling every 30 seconds to check for new requests
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    try {
      console.log("Fetching share requests...");
      const data = await shareApi.getReceivedRequests();
      // Ensure we're setting the actual data from API, no hardcoded fallbacks
      setRequests(data || []);
      console.log("Received requests:", data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      // Set empty array on error - no hardcoded values
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
      toast({
        title: "Success",
        description: "Share request accepted",
      });
      // Remove from list
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (error: any) {
      console.error("Accept error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to accept request",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      console.log("Declining request:", requestId);
      await shareApi.rejectRequest(requestId);
      toast({
        title: "Request Declined",
        description: "Share request has been declined",
      });
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (error: any) {
      console.error("Decline error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to decline request",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-4 text-muted-foreground"
      >
        Loading requests...
      </motion.div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No pending requests
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-border p-4"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">Share Requests</h2>
        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          You have {requests.length} pending {requests.length === 1 ? 'request' : 'requests'}
        </span>
      </div>
      
      <div className="space-y-3">
        <AnimatePresence>
          {requests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-foreground">{request.from_username}</div>
                  <div className="text-sm text-muted-foreground">{request.from_email}</div>
                  <div className="text-xs text-muted-foreground mt-1">{request.time_ago}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAccept(request.id)}
                    disabled={processingId === request.id}
                    size="sm"
                    variant="outline"
                    className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleDecline(request.id)}
                    disabled={processingId === request.id}
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}