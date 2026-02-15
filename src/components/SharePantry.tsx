import { useState } from "react";
import { shareApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SharePantry() {
  const [username, setUsername] = useState("");
  const [permission, setPermission] = useState("view");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendRequest = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await shareApi.sendRequest(username, permission);
      toast({
        title: "Success",
        description: `Share request sent to ${username}`,
      });
      setUsername(""); // Clear input after success
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to send request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="Enter username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="permission">Permission Level</Label>
        <Select value={permission} onValueChange={setPermission}>
          <SelectTrigger id="permission">
            <SelectValue placeholder="Select permission" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="view">View Only</SelectItem>
            <SelectItem value="edit">Can Edit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={handleSendRequest} 
        disabled={loading}
        className="w-full"
      >
        {loading ? "Sending..." : "Send Share Request"}
      </Button>
    </div>
  );
}