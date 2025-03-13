import * as React from "react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { KOL } from "@/lib/types";

interface KOLApplicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KOLApplicationForm = ({
  open,
  onOpenChange,
}: KOLApplicationFormProps) => {
  const [isConnectingTwitter, setIsConnectingTwitter] = useState(false);
  const [twitterHandleInput, setTwitterHandleInput] = useState("");
  const [showTwitterInput, setShowTwitterInput] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const { setTwitterConnected, setTwitterHandle } = useAuth();

  const registerKol = async () => {
    const formattedHandle = twitterHandleInput.startsWith("@")
      ? twitterHandleInput.slice(1)
      : twitterHandleInput;

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/create-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_TEST_API_KEY,
          source: import.meta.env.VITE_SOURCE,
        },
        body: JSON.stringify({
          user_type: "kol",
          wallet_addr: connectedAccount,
          author_handle: formattedHandle,
        }),
      }
    );
    await response.json();
  };

  // connect and set account
  useEffect(() => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask not installed",
        description: "Please install MetaMask to use this application",
        variant: "destructive",
      });
      return;
    }

    const checkConnection = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setConnectedAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    };

    checkConnection();
  }, [toast]);

  const handleConnectTwitter = () => {
    if (showTwitterInput) {
      if (!twitterHandleInput.trim()) {
        toast({
          title: "Twitter handle required",
          description: "Please enter your Twitter handle to continue.",
          variant: "destructive",
        });
        return;
      }

      // Validate Twitter handle format
      if (!twitterHandleInput.match(/^@?[a-zA-Z0-9_]{1,15}$/)) {
        toast({
          title: "Invalid Twitter handle",
          description:
            "Please enter a valid Twitter handle (letters, numbers, and underscores only).",
          variant: "destructive",
        });
        return;
      }

      // Format handle to ensure it has @ prefix
      const formattedHandle = twitterHandleInput.startsWith("@")
        ? twitterHandleInput
        : `@${twitterHandleInput}`;

      setIsConnectingTwitter(true);

      // Simulate Twitter OAuth verification
      setTimeout(() => {
        toast({
          title: "Twitter account connected",
          description: `Your Twitter account ${formattedHandle} has been successfully connected.`,
        });

        // Store Twitter handle in auth context
        setTwitterConnected(true);
        setTwitterHandle(formattedHandle);

        setIsConnectingTwitter(false);
        onOpenChange(false);

        // After successful Twitter authentication, redirect to connect wallet page
        registerKol();
        navigate("/kol-connect-wallet");
      }, 1500);
    } else {
      // First click - show Twitter handle input
      setShowTwitterInput(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Join as KOL</DialogTitle>
          <DialogDescription>
            Connect your Twitter account to verify your identity and join our
            network of Key Opinion Leaders.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-center space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-700">
                To join as a KOL, you need to:
              </p>
              <ol className="text-sm text-left list-decimal pl-5 pt-2 space-y-1">
                <li>Authenticate with your Twitter account</li>
                <li>Connect your wallet for receiving payments</li>
              </ol>
            </div>

            {showTwitterInput && (
              <div className="space-y-3">
                <Label htmlFor="twitter-handle">Your Twitter Handle</Label>
                <Input
                  id="twitter-handle"
                  placeholder="@yourhandle"
                  value={twitterHandleInput}
                  onChange={(e) => setTwitterHandleInput(e.target.value)}
                />
              </div>
            )}

            <Button
              className="w-full bg-[#1DA1F2] hover:bg-[#1a94e1] text-white flex items-center justify-center gap-2"
              onClick={handleConnectTwitter}
              disabled={isConnectingTwitter}
            >
              <Twitter className="h-5 w-5" />
              {isConnectingTwitter
                ? "Connecting..."
                : showTwitterInput
                ? "Verify Twitter Handle"
                : "Connect with Twitter"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KOLApplicationForm;
