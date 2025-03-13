import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Twitter, Wallet, ArrowRight, CheckCircle2 } from "lucide-react";
import AppHeader from "@/components/AppHeader";

const KOLConnectWallet = () => {
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAuth, twitterConnected, twitterHandle } = useAuth();

  useEffect(() => {
    if (!twitterConnected) {
      toast({
        title: "Twitter authentication required",
        description: "Please connect your Twitter account first",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask not installed",
        description: "Please install MetaMask to use this application",
        variant: "destructive",
      });
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
  }, [toast, navigate, twitterConnected]);

  const handleConnect = async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask not installed",
        description: "Please install MetaMask to use this application",
        variant: "destructive",
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setConnectedAccount(accounts[0]);
        toast({
          title: "Wallet connected",
          description: "Your wallet has been connected successfully.",
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error connecting to MetaMask:", error);
        toast({
          title: "Connection error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.error("Error connecting to MetaMask:", error);
        toast({
          title: "Connection error",
          description: "An unknown error occurred",
          variant: "destructive",
        });
      }
    }
  };

  const handleContinue = () => {
    if (!connectedAccount) {
      toast({
        title: "Connect wallet first",
        description: "Please connect your wallet to continue",
        variant: "destructive",
      });
      return;
    }

    setAuth(true);
    localStorage.setItem("authenticated", "true");
    navigate("/kol-dashboard");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppHeader title="KOL Onboarding" />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-ai-orange">
              Complete Your KOL Registration
            </h1>
            <p className="mt-2 text-gray-600">
              Connect your wallet to receive payments for your promotions
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-xs mt-1 text-green-600 font-medium">
                  Twitter
                </span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-gray-200">
                <div
                  className="h-full bg-green-500"
                  style={{ width: "100%" }}
                ></div>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full ${
                    connectedAccount ? "bg-green-100" : "bg-gray-100"
                  } flex items-center justify-center`}
                >
                  {connectedAccount ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Wallet className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <span
                  className={`text-xs mt-1 ${
                    connectedAccount ? "text-green-600" : "text-gray-500"
                  } font-medium`}
                >
                  Wallet
                </span>
              </div>
            </div>

            <div className="bg-green-50 p-3 rounded-lg flex items-center">
              <Twitter className="h-5 w-5 text-[#1DA1F2] mr-2" />
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  Twitter Account Connected
                </p>
                <p className="text-xs text-gray-500">
                  {twitterHandle || "@twitteruser123"}
                </p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>

            {!connectedAccount ? (
              <Button
                className="w-full bg-ai-orange hover:bg-ai-darkOrange flex items-center justify-center gap-2"
                onClick={handleConnect}
              >
                <Wallet className="h-5 w-5" />
                Connect Wallet
              </Button>
            ) : (
              <div className="bg-gray-50 p-3 rounded-lg flex items-center">
                <Wallet className="h-5 w-5 text-ai-orange mr-2" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">Wallet Connected</p>
                  <p className="text-xs font-mono text-gray-500">
                    {connectedAccount.substring(0, 6)}...
                    {connectedAccount.substring(connectedAccount.length - 4)}
                  </p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            )}

            <Button
              className="w-full bg-ai-orange hover:bg-ai-darkOrange mt-4 flex items-center justify-center gap-2"
              onClick={handleContinue}
              disabled={!connectedAccount}
            >
              Continue to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KOLConnectWallet;
